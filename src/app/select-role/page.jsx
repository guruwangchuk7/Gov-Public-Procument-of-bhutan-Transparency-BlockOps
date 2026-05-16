'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldAlert, Building2, Users, Search, Landmark, ArrowLeft, ArrowRight, Wallet, UserPlus } from 'lucide-react';

const ROLES = [
  {
    id: 'admin',
    title: 'System Admin',
    desc: 'Approve procuring agencies, suppliers, and manage system auditors.',
    icon: ShieldAlert,
    color: 'slate',
    route: '/admin/login',
    features: ['Verify Agencies', 'Manage Auditors', 'Audit Logs']
  },
  {
    id: 'agency',
    title: 'Procuring Agency',
    desc: 'Government departments creating and awarding public tenders.',
    icon: Landmark,
    color: 'primary',
    registerRoute: '/agency/register',
    dashboardRoute: '/agency/login',
    features: ['Create Tenders', 'Evaluate Bids', 'Award Contracts']
  },
  {
    id: 'supplier',
    title: 'Supplier / Bidder',
    desc: 'Authorized businesses bidding for government procurement projects.',
    icon: Building2,
    color: 'emerald',
    registerRoute: '/supplier/register',
    dashboardRoute: '/supplier/login',
    features: ['View Tenders', 'Secure Bidding', 'Track Awards']
  },
  {
    id: 'auditor',
    title: 'System Auditor',
    desc: 'Independent entities verifying procurement integrity on-chain.',
    icon: Search,
    color: 'indigo',
    route: '/auditor/login',
    features: ['Verify Hashes', 'Timeline Audit', 'Compliance']
  },
  {
    id: 'public',
    title: 'Public Citizen',
    desc: 'Read-only access to verify blockchain proofs and awarded results.',
    icon: Users,
    color: 'amber',
    route: '/transparency',
    features: ['Public Records', 'Blockchain Verify', 'No Login']
  }
];

export default function SelectRolePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex items-center justify-between">
          <Link href="/" className="btn btn-outline">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="text-right">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Select Portal</h1>
            <p className="text-sm font-medium text-slate-500 italic">Choose your role to continue the flow</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ROLES.map((role, i) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card h-full flex flex-col justify-between hover:border-slate-900 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="space-y-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg bg-${role.color === 'primary' ? 'primary' : role.color === 'emerald' ? 'emerald-500' : role.color === 'indigo' ? 'indigo-500' : role.color === 'amber' ? 'amber-500' : 'slate-900'}`}>
                  <role.icon size={28} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900">{role.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{role.desc}</p>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {role.features.map(f => (
                    <span key={f} className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-slate-100 text-slate-400 rounded-md">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col gap-3">
                {role.registerRoute ? (
                  <>
                    <Link href={role.registerRoute} className="btn btn-primary w-full py-3 text-[10px] uppercase tracking-widest">
                      New Registration <UserPlus size={14} />
                    </Link>
                    <Link href={role.dashboardRoute} className="btn btn-outline w-full py-3 text-[10px] uppercase tracking-widest">
                      Access Dashboard <ArrowRight size={14} />
                    </Link>
                  </>
                ) : (
                  <Link href={role.route} className="btn btn-primary w-full py-3 text-[10px] uppercase tracking-widest flex items-center justify-between">
                    <span>Enter Portal</span>
                    <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="pt-12 text-center">
          <div className="inline-flex items-center gap-4 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
              <Wallet size={20} />
            </div>
            <p className="text-sm text-slate-500 font-medium text-left">
              BGPS uses <span className="text-slate-900 font-bold">Bhutan NDI</span> and <span className="text-slate-900 font-bold">Rabby Wallet</span> <br />
              for secure cryptographic identity verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
