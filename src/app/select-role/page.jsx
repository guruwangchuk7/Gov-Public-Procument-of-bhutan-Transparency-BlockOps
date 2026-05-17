'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldAlert, Building2, Users, Search, Landmark, ArrowLeft, ArrowRight, Wallet, UserPlus, ChevronRight } from 'lucide-react';

const ROLES = [
  {
    id: 'admin',
    title: 'System Admin',
    desc: 'Approve procuring agencies, suppliers, and manage system auditors.',
    icon: ShieldAlert,
    route: '/admin/login',
    features: ['Agencies', 'Auditors', 'Logs']
  },
  {
    id: 'agency',
    title: 'Procuring Agency',
    desc: 'Government departments creating and awarding public tenders.',
    icon: Landmark,
    registerRoute: '/agency/register',
    dashboardRoute: '/agency/login',
    features: ['Tenders', 'Bids', 'Awards']
  },
  {
    id: 'supplier',
    title: 'Supplier / Bidder',
    desc: 'Authorized businesses bidding for government procurement projects.',
    icon: Building2,
    registerRoute: '/supplier/register',
    dashboardRoute: '/supplier/login',
    features: ['View', 'Bid', 'Track']
  },
  {
    id: 'auditor',
    title: 'System Auditor',
    desc: 'Independent entities verifying procurement integrity on-chain.',
    icon: Search,
    route: '/auditor/login',
    features: ['Hashes', 'Timeline', 'Compliance']
  },
  {
    id: 'public',
    title: 'Public Citizen',
    desc: 'Read-only access to verify blockchain proofs and awarded results.',
    icon: Users,
    route: '/transparency',
    features: ['Records', 'Verification', 'No Login']
  }
];

export default function SelectRolePage() {
  return (
    <div className="min-h-screen bg-white py-24 px-6 selection:bg-zinc-900 selection:text-white font-sans">
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <Link href="/" className="text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-2 text-sm font-medium mb-4">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <h1 className="text-5xl font-semibold text-zinc-900 tracking-tightest">Select Portal</h1>
          <p className="text-lg text-zinc-500 max-w-lg leading-relaxed">Choose your specialized workspace to interact with the BGPS ecosystem.</p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {ROLES.map((role, i) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-8 border-zinc-200 shadow-none hover:border-zinc-900 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-8">
                <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 group-hover:border-zinc-900 transition-all">
                  <role.icon size={22} />
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-zinc-900 tracking-tight">{role.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed min-h-[60px]">{role.desc}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {role.features.map(f => (
                    <span key={f} className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-12 space-y-3">
                {role.registerRoute ? (
                  <>
                    <Link href={role.registerRoute} className="btn btn-primary w-full h-11 text-xs">
                      New Registration <UserPlus size={14} />
                    </Link>
                    <Link href={role.dashboardRoute} className="btn btn-outline w-full h-11 text-xs">
                      Access Dashboard <ChevronRight size={14} />
                    </Link>
                  </>
                ) : (
                  <Link href={role.route} className="btn btn-primary w-full h-11 text-xs justify-between group/btn">
                    <span>Enter Portal</span>
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Security Footer Info */}
        <div className="pt-20 text-center">
          <div className="inline-flex items-center gap-6 p-8 bg-zinc-50 rounded-3xl border border-zinc-100">
            <div className="w-12 h-12 rounded-full bg-white border border-zinc-100 flex items-center justify-center text-zinc-400 shadow-sm">
              <Wallet size={20} />
            </div>
            <p className="text-sm text-zinc-500 font-medium text-left leading-relaxed">
              BGPS leverages <span className="text-zinc-900 font-bold">Bhutan NDI</span> for identity verification<br />and <span className="text-zinc-900 font-bold">Ethereum Sepolia</span> for immutable on-chain finality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
