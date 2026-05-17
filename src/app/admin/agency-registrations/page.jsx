'use client';
import { useState, useEffect } from 'react';
import { Building2, Search, Filter } from 'lucide-react';
import AgencyApprovalTable from '@/components/admin/AgencyApprovalTable';
import { ethers } from 'ethers';
import BGPS_ABI from '@/lib/blockchain/abis/BGPSProcurement.json';

export default function AgencyApprovalsPage() {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      const res = await fetch('/api/admin/agency-registrations');
      const data = await res.json();
      setAgencies(data);
    } catch (err) {
      console.error('Failed to fetch agencies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (agency) => {
    try {
      // 1. Authorize on Blockchain
      if (!window.ethereum) throw new Error('Wallet not found');

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Verify Connected Admin Wallet Address (Case-Insensitive)
      const connectedWallet = await signer.getAddress();
      const expectedAdminWallet = "0xaC577ADaC20fDF2EFB428Dd6274CE84024Fd3a39";
      if (connectedWallet.toLowerCase() !== expectedAdminWallet.toLowerCase()) {
        throw new Error("Please connect the Admin wallet to authorize agency on-chain.");
      }

      const contractAddress = process.env.NEXT_PUBLIC_BGPS_CONTRACT_ADDRESS;
      if (!contractAddress || !/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
        throw new Error("Missing or invalid NEXT_PUBLIC_BGPS_CONTRACT_ADDRESS in .env.local");
      }
      const contract = new ethers.Contract(
        contractAddress,
        BGPS_ABI.abi || BGPS_ABI,
        signer
      );

      // Create a proof hash (in real case, hash of documents)
      const proofHash = ethers.utils.id(`${agency.agency_name}-${agency.registration_number}`);

      console.log('Sending blockchain transaction...');
      const tx = await contract.authorizeAgency(agency.wallet_address, proofHash);
      console.log('Transaction sent:', tx.hash);

      // 2. Wait for confirmation
      await tx.wait();
      console.log('Transaction confirmed!');

      // 3. Update Database
      const res = await fetch('/api/admin/approve-agency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agencyId: agency.id,
          adminId: 'admin-uuid', // In real case, from session
          txHash: tx.hash
        })
      });

      if (res.ok) {
        fetchAgencies();
        alert('Agency approved and authorized on-chain!');
      }
    } catch (err) {
      console.error('Approval failed:', err);
      alert(`Approval failed: ${err.message}`);
    }
  };

  const handleReject = async (agency) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      const res = await fetch('/api/admin/reject-agency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agencyId: agency.id,
          adminId: 'admin-uuid',
          reason
        })
      });

      if (res.ok) fetchAgencies();
    } catch (err) {
      console.error('Rejection failed:', err);
    }
  };

  const filteredAgencies = agencies.filter(a =>
    a.agency_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.registration_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Agency Registrations</h1>
          <p className="text-gray-500">Review and authorize procuring agencies for the system.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search agencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all w-64"
            />
          </div>
          <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-primary transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="card !p-0 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-gray-400">Loading registrations...</div>
        ) : filteredAgencies.length > 0 ? (
          <AgencyApprovalTable
            agencies={filteredAgencies}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ) : (
          <div className="p-20 text-center">
            <Building2 size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium">No pending registrations found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
