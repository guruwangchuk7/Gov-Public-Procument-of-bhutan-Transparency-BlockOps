'use client';
import { useState, useEffect } from 'react';
import { UserCheck, Search, Filter } from 'lucide-react';
import AgencyApprovalTable from '@/components/admin/AgencyApprovalTable'; // Reusing the same table structure for now
import { ethers } from 'ethers';
import BGPS_ABI from '@/lib/blockchain/abis/BGPSProcurement.json';

export default function SupplierApprovalsPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await fetch('/api/admin/supplier-registrations');
      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      console.error('Failed to fetch suppliers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (supplier) => {
    try {
      if (!window.ethereum) throw new Error('Wallet not found');
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        BGPS_ABI,
        signer
      );

      const proofHash = ethers.utils.id(`${supplier.company_name}-${supplier.license_number}`);
      
      console.log('Sending blockchain transaction...');
      const tx = await contract.authorizeSupplier(supplier.wallet_address, proofHash);
      await tx.wait();

      const res = await fetch('/api/admin/approve-supplier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierId: supplier.id,
          adminId: 'admin-uuid',
          txHash: tx.hash
        })
      });

      if (res.ok) {
        fetchSuppliers();
        alert('Supplier approved and authorized on-chain!');
      }
    } catch (err) {
      alert(`Approval failed: ${err.message}`);
    }
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.license_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Supplier Registrations</h1>
          <p className="text-gray-500">Review and authorize contractors for the procurement network.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search suppliers..."
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
        ) : filteredSuppliers.length > 0 ? (
          <AgencyApprovalTable 
            agencies={filteredSuppliers.map(s => ({ ...s, agency_name: s.company_name, registration_number: s.license_number }))} 
            onApprove={handleApprove}
            onReject={() => {}} // TODO: Add rejection
          />
        ) : (
          <div className="p-20 text-center">
            <UserCheck size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium">No pending suppliers found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
