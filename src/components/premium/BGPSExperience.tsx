"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Award,
  BadgeCheck,
  Bell,
  Building2,
  Check,
  ClipboardCheck,
  Eye,
  FileCheck2,
  FileLock2,
  FilePlus2,
  Fingerprint,
  Gauge,
  Globe2,
  Landmark,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  WalletCards,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { activityData, agencies, auditEvents, bids, statusData, suppliers, tenders, txHashes } from "@/data/mockData";
import { shortHash, statusTone } from "@/utils/formatters";

type Role = "admin" | "agency" | "supplier" | "auditor" | "public";
type Modal = "tender" | "bid" | "winner" | "transaction" | "demo" | "drawer" | null;

const roleMeta: Record<Role, { label: string; href: string; icon: React.ElementType; purpose: string; person: string }> = {
  admin: { label: "Admin", href: "/dashboard/pmdd", icon: ShieldCheck, purpose: "Manage users, agencies, roles, and verification queues.", person: "PMDD Control" },
  agency: { label: "Agency", href: "/dashboard/agency", icon: Landmark, purpose: "Create tenders, publish records, review bids, and select winners.", person: "MoIT Agency" },
  supplier: { label: "Supplier", href: "/dashboard/bidder", icon: Building2, purpose: "Verify identity, submit bids, and track on-chain confirmation.", person: "Bhutan Tech" },
  auditor: { label: "Auditor", href: "/dashboard/auditor", icon: ClipboardCheck, purpose: "Check hashes, audit events, and procurement integrity.", person: "Audit Office" },
  public: { label: "Public", href: "/public-portal", icon: Globe2, purpose: "View awarded tenders and public blockchain proof.", person: "Citizen View" },
};

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Tenders", icon: FileLock2 },
  { label: "Bids", icon: FileCheck2 },
  { label: "Audit Trail", icon: Activity },
  { label: "Verification", icon: ShieldCheck },
  { label: "Public Portal", icon: Eye },
  { label: "Settings", icon: Gauge },
];

const demoSteps = [
  "Agency creates a tender",
  "System generates tender document hash",
  "Agency publishes tender with Rabby Wallet",
  "Supplier verifies identity with Bhutan NDI",
  "Supplier submits bid",
  "Bid hash is stored on-chain",
  "Agency selects winner",
  "Auditor verifies audit trail",
  "Public views awarded tender proof",
];

const fadeUp = {
  hidden: { opacity: 0, y: 18, scale: 0.985 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#ffffff_0,#EAF6FF_38%,#F7FCFF_72%)] text-[#111827]">
      <PublicNav />
      <section className="relative mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-10 px-5 pb-12 pt-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <SoftBlob className="-left-24 top-20 h-72 w-72 bg-[#C1E5FF]" />
        <SoftBlob className="right-0 top-40 h-80 w-80 bg-[#9CD5FF]/70" />
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }} className="relative z-10">
          <motion.div variants={fadeUp} className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-[#3E82B5] shadow-[0_16px_40px_rgba(106,176,227,0.16)] backdrop-blur-xl">
            <Sparkles className="h-4 w-4" /> Verified identity + verifiable records = trusted procurement
          </motion.div>
          <motion.h1 variants={fadeUp} className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-normal text-[#111827] md:text-7xl">
            Transparent Procurement, Verified by Identity and Blockchain
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-7 max-w-2xl text-lg leading-8 text-[#4B5563]">
            BGPS helps government agencies, suppliers, auditors, and citizens verify procurement actions through Bhutan NDI identity and tamper-proof blockchain audit trails.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-3">
            <PillLink href="/auth" icon={ArrowRight}>Launch Demo</PillLink>
            <PillLink href="/public-portal" icon={Globe2} variant="light">View Public Portal</PillLink>
            <PillLink href="/dashboard/agency?demo=1" icon={Sparkles} variant="light">Watch Judge Flow</PillLink>
          </motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, ease: "easeOut" }} className="relative z-10">
          <DashboardPreview />
        </motion.div>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <div className="grid gap-5 md:grid-cols-5">
          {[
            ["Bhutan NDI Verification", Fingerprint],
            ["Blockchain Audit Trail", Network],
            ["Tamper-Proof Document Hash", FileLock2],
            ["Public Transparency Portal", Globe2],
            ["Auditor Verification Dashboard", ClipboardCheck],
          ].map(([label, Icon], index) => (
            <MotionCard key={String(label)} delay={index * 0.04} className="p-5">
              <Icon className="mb-5 h-6 w-6 text-[#3E82B5]" />
              <p className="text-sm font-semibold text-[#111827]">{String(label)}</p>
            </MotionCard>
          ))}
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <BeforeAfter title="Before" items={["Manual records", "Hidden approvals", "Hard to audit", "Public distrust"]} tone="warning" />
          <BeforeAfter title="After" items={["Verified identity", "Immutable proof", "Transparent timeline", "Public accountability"]} tone="success" />
        </div>
      </section>
    </main>
  );
}

export function LoginPage() {
  const [selected, setSelected] = useState<Role>("agency");
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#FFFFFF_0,#EAF6FF_45%,#FFFFFF_100%)] text-[#111827]">
      <PublicNav />
      <section className="mx-auto flex min-h-[calc(100vh-88px)] max-w-6xl items-center justify-center px-5 py-10">
        <MotionCard className="w-full p-6 md:p-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF6FF] text-[#3E82B5]">
              <Fingerprint className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-semibold md:text-5xl">Choose a demo role</h1>
            <p className="mt-4 text-[#6B7280]">Sign in with Bhutan NDI, connect Rabby Wallet, and jump into the role-based procurement journey.</p>
            <div className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-3">
              <Badge icon={Fingerprint}>Bhutan NDI verified</Badge>
              <Badge icon={WalletCards}>Rabby Wallet connected</Badge>
              <Badge icon={Network}>Sepolia ready</Badge>
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-5">
            {(Object.keys(roleMeta) as Role[]).map((role) => {
              const Icon = roleMeta[role].icon;
              const active = selected === role;
              return (
                <button key={role} onClick={() => setSelected(role)} className={`group rounded-[24px] border p-5 text-left transition-all ${active ? "border-[#9CD5FF] bg-[#EAF6FF]/80 shadow-[0_20px_60px_rgba(106,176,227,0.2)]" : "border-white/70 bg-white/60 hover:-translate-y-1 hover:border-[#C1E5FF]"}`}>
                  <Icon className={`mb-5 h-7 w-7 ${active ? "text-[#3E82B5]" : "text-[#6B7280] group-hover:text-[#3E82B5]"}`} />
                  <p className="font-semibold">{roleMeta[role].label}</p>
                  <p className="mt-2 text-sm leading-6 text-[#6B7280]">{roleMeta[role].purpose}</p>
                </button>
              );
            })}
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-[24px] bg-white/70 p-4 md:flex-row">
            <p className="text-sm text-[#6B7280]">Demo mode uses mock data to showcase the procurement verification flow.</p>
            <Link href={roleMeta[selected].href} className="inline-flex items-center gap-2 rounded-2xl bg-[#6AB0E3] px-6 py-3 font-semibold text-white shadow-[0_18px_40px_rgba(106,176,227,0.35)] transition hover:-translate-y-0.5 active:scale-95">
              Continue as {roleMeta[selected].label} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </MotionCard>
      </section>
    </main>
  );
}

export function DashboardExperience({ role }: { role: Role }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState<Modal>(null);
  const [toast, setToast] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const selectedTender = tenders[0];
  const filteredTenders = tenders.filter((tender) => {
    const matchesQuery = `${tender.title} ${tender.agency} ${tender.category}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "All" || tender.status === filter || tender.category === filter;
    return matchesQuery && matchesFilter;
  });

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function primaryAction() {
    if (role === "supplier") setModal("bid");
    else if (role === "auditor") notify("Hash verified - no tampering detected");
    else if (role === "public") notify("Public proof available");
    else setModal("tender");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#FFFFFF_0,#EAF6FF_42%,#F8FCFF_100%)] text-[#111827]">
      <div className="flex min-h-screen">
        <Sidebar role={role} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <section className="min-w-0 flex-1">
          <Topbar role={role} onMenu={() => setSidebarOpen(true)} onDemo={() => setModal("demo")} />
          <div className="mx-auto max-w-[1500px] px-4 py-6 md:px-7">
            <AnimatePresence mode="wait">
              <motion.div key={role} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease: "easeOut" }} className="space-y-6">
                <HeroStrip role={role} onPrimary={primaryAction} onDemo={() => setModal("demo")} />
                {role === "admin" && <AdminDashboard notify={notify} />}
                {role === "agency" && <AgencyDashboard query={query} setQuery={setQuery} filter={filter} setFilter={setFilter} tenders={filteredTenders} openModal={setModal} notify={notify} />}
                {role === "supplier" && <SupplierDashboard query={query} setQuery={setQuery} tenders={filteredTenders} openModal={setModal} notify={notify} />}
                {role === "auditor" && <AuditorDashboard notify={notify} />}
                {role === "public" && <PublicPortal embedded notify={notify} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </div>
      <AnimatePresence>
        {modal === "tender" && <CreateTenderModal onClose={() => setModal(null)} onToast={notify} />}
        {modal === "bid" && <SubmitBidModal onClose={() => setModal(null)} onToast={notify} />}
        {modal === "winner" && <WinnerModal onClose={() => setModal(null)} onToast={notify} />}
        {modal === "transaction" && <TransactionModal title="Publish Tender" onClose={() => setModal(null)} onToast={notify} />}
        {modal === "demo" && <JudgeDemo onClose={() => setModal(null)} />}
        {modal === "drawer" && <TenderDrawer tender={selectedTender} role={role} onClose={() => setModal(null)} onBid={() => setModal("bid")} />}
      </AnimatePresence>
      <Toast message={toast} />
    </main>
  );
}

export function PublicPortal({ embedded = false, notify }: { embedded?: boolean; notify?: (message: string) => void }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const records = tenders.filter((tender) => (status === "All" || tender.status === status) && `${tender.title} ${tender.agency} ${tender.winner}`.toLowerCase().includes(query.toLowerCase()));
  const content = (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-7">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <MotionCard className="p-7">
          <Badge icon={Globe2}>Citizen transparency portal</Badge>
          <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-5xl">Public procurement proof, without exposing confidential bids.</h1>
          <p className="mt-4 text-[#6B7280]">This public record proves that the tender was published, bids were submitted, and the award decision was recorded with tamper-proof verification.</p>
        </MotionCard>
        <MotionCard className="p-7">
          <Timeline compact />
        </MotionCard>
      </div>
      <div className="flex flex-col gap-3 rounded-[28px] border border-white/70 bg-white/70 p-4 shadow-[0_20px_60px_rgba(106,176,227,0.14)] backdrop-blur-2xl md:flex-row">
        <SearchBox value={query} onChange={setQuery} placeholder="Search by tender, agency, winner, or tx hash" />
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-2xl border border-[#D8ECFA] bg-white/80 px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#9CD5FF]">
          {["All", "Awarded", "Published", "Evaluating", "Closing Soon"].map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {records.map((tender, index) => (
          <MotionCard key={tender.id} delay={index * 0.04} className="p-5">
            <div className="mb-5 flex items-start justify-between gap-3">
              <span className="rounded-full bg-[#EAF6FF] px-3 py-1 text-xs font-bold text-[#3E82B5]">{tender.id}</span>
              <StatusBadge status={tender.status} />
            </div>
            <h3 className="min-h-14 text-lg font-semibold">{tender.title}</h3>
            <p className="mt-2 text-sm text-[#6B7280]">{tender.agency}</p>
            <div className="mt-5 space-y-3 border-t border-[#EAF6FF] pt-5 text-sm">
              <InfoRow label="Budget" value={tender.budget} />
              <InfoRow label="Awarded supplier" value={tender.status === "Awarded" ? tender.winner : "Decision pending"} />
              <InfoRow label="Public tx hash" value={shortHash(tender.tx)} />
            </div>
            <div className="mt-5 flex gap-2">
              <Link href={`/tenders/${tender.id}`} className="flex-1 rounded-2xl bg-[#EAF6FF] px-4 py-3 text-center text-sm font-semibold text-[#3E82B5] transition hover:bg-[#C1E5FF]">View detail</Link>
              <button onClick={() => notify?.("Hash verified - no tampering detected")} className="rounded-2xl bg-[#6AB0E3] px-4 py-3 text-sm font-semibold text-white transition active:scale-95">Verify proof</button>
            </div>
            <p className="mt-4 text-xs text-[#6B7280]">Confidential bid documents and internal evaluation notes are hidden from public view.</p>
          </MotionCard>
        ))}
      </div>
    </div>
  );
  if (embedded) return content;
  return <main className="min-h-screen bg-[radial-gradient(circle_at_top,#FFFFFF_0,#EAF6FF_48%,#FFFFFF_100%)] text-[#111827]"><PublicNav />{content}</main>;
}

export function TenderDetailPage({ id }: { id: string }) {
  const [role, setRole] = useState<Role>("agency");
  const [toast, setToast] = useState("");
  const tender = tenders.find((item) => item.id === id) ?? tenders[0];
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#FFFFFF_0,#EAF6FF_48%,#FFFFFF_100%)] text-[#111827]">
      <PublicNav />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[#3E82B5]">{tender.id}</p>
            <h1 className="mt-2 text-4xl font-semibold">{tender.title}</h1>
          </div>
          <select value={role} onChange={(event) => setRole(event.target.value as Role)} className="rounded-2xl border border-[#D8ECFA] bg-white/80 px-4 py-3 text-sm font-semibold">
            {(Object.keys(roleMeta) as Role[]).map((item) => <option key={item} value={item}>{roleMeta[item].label} view</option>)}
          </select>
        </div>
        <MotionCard className="p-6">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-5 flex flex-wrap gap-2">
                <StatusBadge status={tender.status} />
                <Badge icon={Fingerprint}>Identity verified with Bhutan NDI</Badge>
                <Badge icon={Network}>Record anchored on Ethereum Sepolia</Badge>
              </div>
              <p className="text-[#6B7280]">{tender.description}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <InfoTile label="Agency" value={tender.agency} icon={Landmark} />
                <InfoTile label="Category" value={tender.category} icon={FileLock2} />
                <InfoTile label="Budget" value={tender.budget} icon={Gauge} />
                <InfoTile label="Deadline" value={tender.deadline} icon={Activity} />
                <InfoTile label="Document hash" value={tender.hash} icon={FileCheck2} />
                <InfoTile label="Blockchain tx" value={tender.tx} icon={Network} />
              </div>
            </div>
            <Timeline />
          </div>
        </MotionCard>
        <div className="mt-6 grid gap-5 lg:grid-cols-5">
          {["Overview", "Documents", "Bids", "Audit Trail", "Blockchain Proof"].map((tab) => (
            <MotionCard key={tab} className="p-5">
              <p className="font-semibold">{tab}</p>
              <p className="mt-2 text-sm text-[#6B7280]">{tab === "Bids" && role === "public" ? "Confidential bid details hidden." : "Verified record available."}</p>
            </MotionCard>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {role === "supplier" && <ActionButton onClick={() => setToast("Bid submitted and anchored on-chain")}>Submit bid</ActionButton>}
          {role === "agency" && <ActionButton onClick={() => setToast("Winner selection recorded")}>Publish or select winner</ActionButton>}
          {role === "public" && <ActionButton onClick={() => setToast("Hash verified - no tampering detected")}>Verify public proof</ActionButton>}
        </div>
      </div>
      <Toast message={toast} />
    </main>
  );
}

function AdminDashboard({ notify }: { notify: (message: string) => void }) {
  return (
    <>
      <KpiGrid items={[["Total Tenders", "168", FileLock2], ["Verified Suppliers", "842", BadgeCheck], ["Active Agencies", "54", Landmark], ["Blockchain Events", "4,218", Network], ["Pending Verifications", "23", AlertTriangle]]} />
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <ChartCard title="Procurement activity over time" />
        <PieCard />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <MotionCard className="p-5">
          <SectionTitle title="User verification table" subtitle="Approve or reject mock verification requests." />
          <div className="mt-5 space-y-3">
            {[...agencies.slice(0, 3), ...suppliers.slice(0, 2)].map((name, index) => (
              <div key={name} className="flex flex-col gap-3 rounded-2xl border border-[#EAF6FF] bg-white/70 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold">{name}</p>
                  <p className="text-sm text-[#6B7280]">{index < 3 ? "Agency onboarding request" : "Supplier verification queue"} • NDI proof received</p>
                </div>
                <div className="flex gap-2">
                  <SmallButton onClick={() => notify("Verification approved")}>Approve</SmallButton>
                  <SmallButton tone="light" onClick={() => notify("Verification rejected")}>Reject</SmallButton>
                </div>
              </div>
            ))}
          </div>
        </MotionCard>
        <SystemHealth />
      </div>
    </>
  );
}

function AgencyDashboard({ query, setQuery, filter, setFilter, tenders: list, openModal, notify }: { query: string; setQuery: (value: string) => void; filter: string; setFilter: (value: string) => void; tenders: typeof tenders; openModal: (modal: Modal) => void; notify: (message: string) => void }) {
  return (
    <>
      <KpiGrid items={[["Active Tenders", "14", FileLock2], ["Submitted Bids", "48", FileCheck2], ["Pending Approvals", "7", AlertTriangle], ["Awarded Contracts", "BTN 41M", Award]]} />
      <Pipeline />
      <div className="grid gap-5 xl:grid-cols-[1fr_0.95fr]">
        <MotionCard className="p-5">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <SectionTitle title="Tender list" subtitle="Publish tenders and anchor records on-chain." />
            <ActionButton onClick={() => openModal("tender")}><FilePlus2 className="h-4 w-4" /> Create tender</ActionButton>
          </div>
          <Filters query={query} setQuery={setQuery} filter={filter} setFilter={setFilter} options={["All", "Published", "Closing Soon", "Evaluating", "Awarded", "Draft"]} />
          <div className="mt-5 space-y-3">
            {list.map((tender) => <TenderRow key={tender.id} tender={tender} onDetail={() => openModal("drawer")} onAction={() => openModal("transaction")} />)}
          </div>
        </MotionCard>
        <MotionCard className="p-5">
          <SectionTitle title="Bid review" subtitle="Compare supplier identity, hash proof, and evaluation score." />
          <div className="mt-5 space-y-3">
            {bids.map((bid) => (
              <div key={bid.hash} className="rounded-2xl border border-[#EAF6FF] bg-white/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{bid.supplier}</p>
                    <p className="text-sm text-[#6B7280]">{bid.amount} • {bid.hash}</p>
                  </div>
                  <StatusBadge status={bid.status} />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Badge icon={BadgeCheck}>Supplier verified</Badge>
                  <button onClick={() => { openModal("winner"); notify("Justification hash generated"); }} className="rounded-xl bg-[#6AB0E3] px-3 py-2 text-xs font-semibold text-white">Select winner</button>
                </div>
              </div>
            ))}
          </div>
        </MotionCard>
      </div>
    </>
  );
}

function SupplierDashboard({ query, setQuery, tenders: list, openModal, notify }: { query: string; setQuery: (value: string) => void; tenders: typeof tenders; openModal: (modal: Modal) => void; notify: (message: string) => void }) {
  return (
    <>
      <KpiGrid items={[["Open Tenders", "21", Search], ["My Submitted Bids", "5", FileCheck2], ["On-chain Confirmed", "4", Network], ["Results Pending", "2", Activity]]} />
      <MotionCard className="p-5">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <SectionTitle title="Open tender grid" subtitle="Identity verified with Bhutan NDI. Bid hashes are stored on Sepolia." />
          <SearchBox value={query} onChange={setQuery} placeholder="Search tender opportunities" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.slice(0, 6).map((tender, index) => (
            <MotionCard key={tender.id} delay={index * 0.04} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <Badge icon={FileLock2}>{tender.category}</Badge>
                <StatusBadge status={tender.status} />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{tender.title}</h3>
              <p className="mt-2 text-sm text-[#6B7280]">{tender.agency}</p>
              <div className="mt-5 space-y-2 text-sm">
                <InfoRow label="Budget" value={tender.budget} />
                <InfoRow label="Closes in" value={tender.closesIn} />
                <InfoRow label="Document hash" value={tender.hash} />
              </div>
              {tender.status === "Closing Soon" && <p className="mt-4 rounded-2xl bg-[#FFF7ED] px-3 py-2 text-xs font-semibold text-[#B45309]">Closing soon - submit before official server time.</p>}
              <div className="mt-5 flex gap-2">
                <button onClick={() => openModal("drawer")} className="flex-1 rounded-2xl bg-[#EAF6FF] px-4 py-3 text-sm font-semibold text-[#3E82B5]">View details</button>
                <button onClick={() => { openModal("bid"); notify("Proposal upload ready"); }} className="rounded-2xl bg-[#6AB0E3] px-4 py-3 text-sm font-semibold text-white">Submit bid</button>
              </div>
            </MotionCard>
          ))}
        </div>
      </MotionCard>
      <MotionCard className="p-5">
        <SectionTitle title="Bid tracker" subtitle="Submitted -> Hash Generated -> Wallet Confirmed -> On-chain Confirmed -> Under Review -> Result" />
        <div className="mt-5 grid gap-3 md:grid-cols-6">
          {["Submitted", "Hash Generated", "Wallet Confirmed", "On-chain Confirmed", "Under Review", "Result"].map((step, index) => <ProgressStep key={step} step={step} active={index < 5} />)}
        </div>
      </MotionCard>
    </>
  );
}

function AuditorDashboard({ notify }: { notify: (message: string) => void }) {
  const [result, setResult] = useState<"pending" | "match" | "mismatch">("pending");
  return (
    <>
      <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <MotionCard className="p-5">
          <SearchBox value="" onChange={() => undefined} placeholder="Search by Tender ID, Supplier, Tx Hash, or Document Hash" />
        </MotionCard>
        <KpiGrid compact items={[["Verified Records", "1,248", ShieldCheck], ["Mismatch Alerts", "2", AlertTriangle], ["Tenders Audited", "86", ClipboardCheck], ["Blockchain Events", "4,218", Network]]} />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <MotionCard className="p-5">
          <SectionTitle title="Main audit timeline" subtitle="Every action shows actor, time, hash, tx, and verification status." />
          <div className="mt-5 space-y-4">
            {auditEvents.map((event, index) => <AuditEvent key={event.action} event={event} index={index} />)}
          </div>
        </MotionCard>
        <div className="space-y-5">
          <MotionCard className="p-5">
            <SectionTitle title="Hash verifier" subtitle="If both hashes match, the document has not been altered after submission." />
            <div className="mt-5 grid gap-3">
              <input defaultValue="0x8f31c9a2...A92c" className="rounded-2xl border border-[#D8ECFA] bg-white/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#9CD5FF]" />
              <input defaultValue="0x8f31c9a2...A92c" className="rounded-2xl border border-[#D8ECFA] bg-white/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#9CD5FF]" />
              <div className="flex gap-2">
                <ActionButton onClick={() => { setResult("match"); notify("Hash verified - no tampering detected"); }}>Verify match</ActionButton>
                <SmallButton tone="light" onClick={() => setResult("mismatch")}>Demo mismatch</SmallButton>
              </div>
              <VerifierResult result={result} />
            </div>
          </MotionCard>
          <MotionCard className="border-[#FECACA] p-5">
            <SectionTitle title="Suspicious activity" subtitle="Mock alerts for judge demo." />
            {["Late document change detected", "Approval missing transaction proof", "Hash mismatch alert"].map((alert) => <p key={alert} className="mt-3 rounded-2xl bg-[#FEF2F2] px-4 py-3 text-sm font-semibold text-[#B91C1C]">{alert}</p>)}
          </MotionCard>
        </div>
      </div>
    </>
  );
}

function DashboardPreview() {
  return (
    <div className="rounded-[32px] border border-white/70 bg-white/60 p-4 shadow-[0_30px_90px_rgba(106,176,227,0.22)] backdrop-blur-2xl md:p-5">
      <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[28px] bg-[#EAF6FF]/80 p-5">
          <div className="flex items-center justify-between">
            <Badge icon={ShieldCheck}>Vendor Verified</Badge>
            <span className="text-xs font-semibold text-[#6B7280]">98%</span>
          </div>
          <div className="mt-8 flex justify-center">
            <div className="relative flex h-32 w-32 items-center justify-center rounded-[28px] bg-white shadow-[0_20px_50px_rgba(106,176,227,0.25)]">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} className="absolute h-24 w-24 rounded-[24px] border border-[#9CD5FF]" />
              <LockKeyhole className="h-12 w-12 text-[#6AB0E3]" />
            </div>
          </div>
          <p className="mt-7 text-sm font-semibold">Procurement Trust Score: 98%</p>
          <div className="mt-3 h-2 rounded-full bg-white"><motion.div initial={{ width: 0 }} animate={{ width: "98%" }} transition={{ duration: 1 }} className="h-2 rounded-full bg-[#6AB0E3]" /></div>
        </div>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            {["Tender Published", "Bid Hash Stored", "Approval Recorded", "Audit Verified"].map((item, index) => (
              <motion.div key={item} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + index * 0.08 }} className="rounded-[24px] bg-white/80 p-4 shadow-[0_14px_40px_rgba(106,176,227,0.12)]">
                <Check className="mb-3 h-5 w-5 text-[#22C55E]" />
                <p className="text-sm font-semibold">{item}</p>
              </motion.div>
            ))}
          </div>
          <div className="rounded-[24px] bg-white/80 p-5">
            <Timeline compact />
          </div>
        </div>
      </div>
    </div>
  );
}

function PublicNav() {
  return (
    <nav className="sticky top-0 z-40 border-b border-white/70 bg-white/70 px-5 py-4 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF6FF] text-[#3E82B5]"><ShieldCheck className="h-6 w-6" /></div>
          <div>
            <p className="text-lg font-semibold">BGPS</p>
            <p className="text-xs font-semibold text-[#6B7280]">Kingdom of Bhutan</p>
          </div>
        </Link>
        <div className="hidden items-center gap-6 text-sm font-semibold text-[#6B7280] md:flex">
          <Link href="/public-portal">Public Portal</Link>
          <Link href="/auth">Role Login</Link>
          <Link href="/dashboard/agency">Dashboard</Link>
        </div>
        <Link href="/auth" className="rounded-2xl bg-[#6AB0E3] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(106,176,227,0.28)]">Launch Demo</Link>
      </div>
    </nav>
  );
}

function Sidebar({ role, open, onClose }: { role: Role; open: boolean; onClose: () => void }) {
  const content = (
    <aside className="flex h-full w-72 flex-col border-r border-white/70 bg-white/64 p-4 shadow-[20px_0_80px_rgba(106,176,227,0.12)] backdrop-blur-2xl">
      <div className="mb-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF6FF] text-[#3E82B5]"><ShieldCheck className="h-6 w-6" /></div>
          <div><p className="font-semibold">BGPS</p><p className="text-xs text-[#6B7280]">{roleMeta[role].label} workspace</p></div>
        </Link>
        <button className="lg:hidden" onClick={onClose}><X className="h-5 w-5" /></button>
      </div>
      <nav className="space-y-1">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button key={item.label} className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${index === 0 ? "bg-[#EAF6FF] text-[#3E82B5] shadow-[0_14px_34px_rgba(106,176,227,0.16)]" : "text-[#6B7280] hover:bg-white hover:text-[#3E82B5]"}`}>
              <Icon className="h-5 w-5" /> {item.label}
            </button>
          );
        })}
      </nav>
      <div className="mt-auto rounded-[24px] bg-[#EAF6FF]/80 p-4">
        <p className="text-sm font-semibold">On-chain ready</p>
        <p className="mt-1 text-xs leading-5 text-[#6B7280]">NDI verified, Rabby connected, Sepolia configured.</p>
      </div>
    </aside>
  );
  return (
    <>
      <div className="hidden lg:block">{content}</div>
      <AnimatePresence>{open && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#111827]/20 backdrop-blur-sm lg:hidden" onClick={onClose}><motion.div initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} onClick={(event) => event.stopPropagation()} className="h-full">{content}</motion.div></motion.div>}</AnimatePresence>
    </>
  );
}

function Topbar({ role, onMenu, onDemo }: { role: Role; onMenu: () => void; onDemo: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/64 px-4 py-4 backdrop-blur-2xl md:px-7">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={onMenu} className="rounded-2xl bg-white p-3 lg:hidden"><Menu className="h-5 w-5" /></button>
          <div>
            <p className="text-xs font-semibold text-[#6B7280]">Home / Dashboard / {roleMeta[role].label}</p>
            <p className="font-semibold">{roleMeta[role].person}</p>
          </div>
        </div>
        <div className="hidden min-w-[260px] max-w-sm flex-1 md:block"><SearchBox value="" onChange={() => undefined} placeholder="Search tenders, tx hashes, suppliers" /></div>
        <div className="flex items-center gap-2">
          <Badge icon={Fingerprint} className="hidden xl:flex">NDI Verified</Badge>
          <Badge icon={WalletCards} className="hidden xl:flex">Rabby Connected</Badge>
          <Badge icon={Network} className="hidden xl:flex">Sepolia</Badge>
          <button onClick={onDemo} className="rounded-2xl bg-[#6AB0E3] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(106,176,227,0.28)]">Judge Demo</button>
          <Bell className="h-5 w-5 text-[#6B7280]" />
        </div>
      </div>
    </header>
  );
}

function HeroStrip({ role, onPrimary, onDemo }: { role: Role; onPrimary: () => void; onDemo: () => void }) {
  const copy = role === "agency" ? "Create, hash, publish, evaluate, and award tenders with visible proof." : role === "supplier" ? "Find tenders, submit a bid, and prove your proposal was anchored on-chain." : role === "auditor" ? "Verify database hashes against Sepolia hashes and spot mismatches fast." : role === "public" ? "Explore awarded tenders and citizen-safe proof records." : "Govern verification, onboarding, and ecosystem health.";
  const primaryCopy = role === "supplier" ? "Submit Bid" : role === "auditor" ? "Verify Hash" : role === "public" ? "Verify Public Proof" : role === "admin" ? "Review Verification" : "Create Tender";
  return (
    <MotionCard className="overflow-hidden p-6 md:p-7">
      <div className="grid gap-5 lg:grid-cols-[1fr_0.62fr]">
        <div>
          <Badge icon={Sparkles}>Premium hackathon demo</Badge>
          <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">{roleMeta[role].label} dashboard</h1>
          <p className="mt-4 max-w-2xl text-[#6B7280]">{copy}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ActionButton onClick={onPrimary}>{primaryCopy}</ActionButton>
            <SmallButton tone="light" onClick={onDemo}>Watch Judge Flow</SmallButton>
          </div>
        </div>
        <div className="rounded-[24px] bg-[#EAF6FF]/70 p-5">
          <Timeline compact />
        </div>
      </div>
    </MotionCard>
  );
}

function KpiGrid({ items, compact = false }: { items: [string, string, React.ElementType][]; compact?: boolean }) {
  return (
    <div className={`grid gap-4 ${compact ? "grid-cols-2" : "md:grid-cols-2 xl:grid-cols-4"}`}>
      {items.map(([label, value, Icon], index) => (
        <MotionCard key={label} delay={index * 0.04} className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div><p className="text-sm font-semibold text-[#6B7280]">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF6FF] text-[#3E82B5]"><Icon className="h-6 w-6" /></div>
          </div>
        </MotionCard>
      ))}
    </div>
  );
}

function ChartCard({ title }: { title: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  return (
    <MotionCard className="p-5">
      <SectionTitle title={title} subtitle="Smooth verification activity from demo records." />
      <div className="mt-5 h-72 min-w-0">
        {mounted ? <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={activityData}>
            <defs><linearGradient id="blueArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6AB0E3" stopOpacity={0.45} /><stop offset="100%" stopColor="#6AB0E3" stopOpacity={0.02} /></linearGradient></defs>
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Area type="monotone" dataKey="verifications" stroke="#6AB0E3" fill="url(#blueArea)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer> : <div className="h-full rounded-[24px] bg-[#EAF6FF]/70" />}
      </div>
    </MotionCard>
  );
}

function PieCard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  return (
    <MotionCard className="p-5">
      <SectionTitle title="Tender status distribution" subtitle="Published, evaluating, awarded, and draft records." />
      <div className="mt-5 h-72 min-w-0">
        {mounted ? <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <PieChart><Pie data={statusData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={96} paddingAngle={4}>{statusData.map((_, index) => <Cell key={index} fill={["#6AB0E3", "#9CD5FF", "#22C55E", "#F59E0B"][index]} />)}</Pie><Tooltip /></PieChart>
        </ResponsiveContainer> : <div className="h-full rounded-[24px] bg-[#EAF6FF]/70" />}
      </div>
    </MotionCard>
  );
}

function Pipeline() {
  return (
    <MotionCard className="p-5">
      <SectionTitle title="Tender pipeline" subtitle="Draft -> Published -> Closed -> Evaluating -> Awarded" />
      <div className="mt-5 grid gap-3 md:grid-cols-5">
        {["Draft", "Published", "Closed", "Evaluating", "Awarded"].map((step, index) => <ProgressStep key={step} step={step} active={index < 4} />)}
      </div>
    </MotionCard>
  );
}

function CreateTenderModal({ onClose, onToast }: { onClose: () => void; onToast: (message: string) => void }) {
  const [hash, setHash] = useState("");
  const [publishing, setPublishing] = useState(false);
  function generate() {
    setHash("");
    "0x8f31c9a2d934a1cb7790dE31A92c".split("").forEach((char, index) => window.setTimeout(() => setHash((value) => value + char), index * 18));
    window.setTimeout(() => onToast("Document hash generated"), 780);
  }
  if (publishing) return <TransactionModal title="Publish Tender" onClose={onClose} onToast={onToast} />;
  return (
    <ModalShell title="Create tender" onClose={onClose}>
      <div className="grid gap-3 md:grid-cols-2">
        {["Tender title", "Category", "Budget", "Deadline"].map((label) => <LabeledInput key={label} label={label} placeholder={label} />)}
      </div>
      <label className="mt-3 block text-sm font-semibold">Description<textarea className="mt-2 min-h-24 w-full rounded-2xl border border-[#D8ECFA] bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-[#9CD5FF]" defaultValue="Road resurfacing, drainage improvements, and verified procurement milestones." /></label>
      <MockUpload />
      <div className="mt-4 rounded-2xl bg-[#EAF6FF]/70 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold">Document hash</p>
          <SmallButton onClick={generate}>Generate Hash</SmallButton>
        </div>
        <p className="mt-3 font-mono text-sm text-[#3E82B5]">{hash || "Waiting for document fingerprint..."}</p>
        {hash && <Badge icon={LockKeyhole} className="mt-3">Tamper-proof fingerprint ready</Badge>}
      </div>
      <div className="mt-5 flex justify-end gap-3">
        <SmallButton tone="light" onClick={onClose}>Cancel</SmallButton>
        <ActionButton onClick={() => setPublishing(true)}>Publish Tender</ActionButton>
      </div>
    </ModalShell>
  );
}

function SubmitBidModal({ onClose, onToast }: { onClose: () => void; onToast: (message: string) => void }) {
  const [hash, setHash] = useState("");
  const [step, setStep] = useState(0);
  const steps = ["Upload proposal", "Generate bid hash", "Confirm with Rabby Wallet", "Store bid hash on Sepolia", "Bid confirmed"];
  function submit() {
    setHash("0x91bd72ff2C18a5b9...7Fa2");
    let next = 0;
    const timer = window.setInterval(() => {
      next += 1;
      setStep(next);
      if (next >= steps.length - 1) {
        window.clearInterval(timer);
        onToast("Bid submitted and anchored on-chain");
      }
    }, 650);
  }
  return (
    <ModalShell title="Submit bid" onClose={onClose}>
      <div className="grid gap-3 md:grid-cols-2">
        <LabeledInput label="Bid amount" placeholder="BTN 6.8M" />
        <LabeledInput label="Supplier" placeholder="Bhutan Tech Solutions" />
      </div>
      <label className="mt-3 block text-sm font-semibold">Proposal summary<textarea className="mt-2 min-h-24 w-full rounded-2xl border border-[#D8ECFA] bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-[#9CD5FF]" defaultValue="Verified delivery plan with warranty, training, and transparent milestones." /></label>
      <MockUpload label="Upload proposal document" />
      <div className="mt-4 rounded-2xl bg-[#EAF6FF]/70 p-4">
        <p className="font-semibold">Bid hash</p>
        <p className="mt-3 font-mono text-sm text-[#3E82B5]">{hash || "Generate and anchor your bid hash"}</p>
      </div>
      <div className="mt-5 grid gap-2">
        {steps.map((label, index) => <ProgressStep key={label} step={label} active={index <= step} />)}
      </div>
      <div className="mt-5 flex justify-end gap-3">
        <SmallButton tone="light" onClick={onClose}>Cancel</SmallButton>
        <ActionButton onClick={submit}>Submit bid</ActionButton>
      </div>
    </ModalShell>
  );
}

function WinnerModal({ onClose, onToast }: { onClose: () => void; onToast: (message: string) => void }) {
  return (
    <ModalShell title="Select winner" onClose={onClose}>
      <p className="text-[#6B7280]">Record the award decision with a justification hash and Rabby Wallet transaction simulation.</p>
      <div className="mt-5 rounded-2xl bg-[#EAF6FF]/70 p-4">
        <InfoRow label="Winner" value="DrukBuild Construction" />
        <InfoRow label="Award amount" value="BTN 17.9M" />
        <InfoRow label="Justification hash" value="0xa82f90ce...19Bb" />
      </div>
      <div className="mt-5 flex justify-end gap-3">
        <SmallButton tone="light" onClick={onClose}>Cancel</SmallButton>
        <ActionButton onClick={() => { onToast("Winner selection recorded"); onClose(); }}>Confirm award</ActionButton>
      </div>
    </ModalShell>
  );
}

function TransactionModal({ title, onClose, onToast }: { title: string; onClose: () => void; onToast: (message: string) => void }) {
  const [step, setStep] = useState(0);
  const steps = ["Preparing tender record", "Waiting for Rabby Wallet approval", "Broadcasting to Ethereum Sepolia", "Confirmed on-chain", "Tender published successfully"];
  useEffect(() => {
    const transactionSteps = ["Preparing tender record", "Waiting for Rabby Wallet approval", "Broadcasting to Ethereum Sepolia", "Confirmed on-chain", "Tender published successfully"];
    const timers = transactionSteps.map((_, index) => window.setTimeout(() => setStep(index), index * 800));
    const done = window.setTimeout(() => onToast("Transaction confirmed on Sepolia"), 3400);
    return () => [...timers, done].forEach(window.clearTimeout);
  }, [onToast]);
  return (
    <ModalShell title={title} onClose={onClose}>
      <div className="space-y-3">
        {steps.map((label, index) => <ProgressStep key={label} step={label} active={index <= step} />)}
      </div>
      <div className="mt-5 rounded-2xl bg-[#EAF6FF]/70 p-4">
        <InfoRow label="Transaction hash" value={txHashes[0]} />
        <InfoRow label="Network" value="Ethereum Sepolia" />
      </div>
      <div className="mt-5 flex justify-end"><ActionButton onClick={onClose}>Done</ActionButton></div>
    </ModalShell>
  );
}

function JudgeDemo({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  return (
    <ModalShell title="Guided Judge Demo Mode" onClose={onClose} wide>
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[24px] bg-[#EAF6FF]/70 p-5">
          <p className="text-sm font-semibold text-[#3E82B5]">Step {step + 1} of {demoSteps.length}</p>
          <h2 className="mt-3 text-3xl font-semibold">{demoSteps[step]}</h2>
          <p className="mt-4 text-[#6B7280]">This step highlights who performed the action, what hash was recorded, when it happened, and whether blockchain verification succeeded.</p>
          <div className="mt-5 rounded-2xl bg-white/80 p-4">
            <InfoRow label="Actor" value={step < 3 ? "Government agency" : step < 6 ? "Verified supplier" : step === 7 ? "Auditor" : "Public user"} />
            <InfoRow label="Hash" value={step < 5 ? "0x8f31c9a2...A92c" : "0x91bd72ff...7Fa2"} />
            <InfoRow label="Status" value="Verified on Sepolia" />
          </div>
        </div>
        <div className="max-h-[52vh] overflow-y-auto rounded-[24px] border border-[#C1E5FF] bg-white/70 p-5 shadow-[0_20px_60px_rgba(106,176,227,0.16)]">
          <div className="relative space-y-3">
            {demoSteps.map((label, index) => (
              <motion.div key={label} animate={{ scale: index === step ? 1.02 : 1, opacity: index <= step ? 1 : 0.48 }} className={`rounded-2xl border p-4 ${index === step ? "border-[#6AB0E3] bg-[#EAF6FF]" : "border-[#EAF6FF] bg-white/70"}`}>
                <div className="flex items-center gap-3"><span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${index <= step ? "bg-[#22C55E] text-white" : "bg-[#EAF6FF] text-[#6B7280]"}`}>{index < step ? <Check className="h-4 w-4" /> : index + 1}</span><p className="text-sm font-semibold">{label}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {step === demoSteps.length - 1 && <p className="mt-5 rounded-2xl bg-[#ECFDF5] px-4 py-3 font-semibold text-[#15803D]">BGPS creates trusted procurement through verified identity, tamper-proof records, and public transparency.</p>}
      <div className="mt-5 flex justify-between">
        <SmallButton tone="light" onClick={() => setStep(Math.max(0, step - 1))}>Back</SmallButton>
        <ActionButton onClick={() => step === demoSteps.length - 1 ? onClose() : setStep(step + 1)}>{step === demoSteps.length - 1 ? "Finish" : "Next"}</ActionButton>
      </div>
    </ModalShell>
  );
}

function TenderDrawer({ tender, role, onClose, onBid }: { tender: typeof tenders[number]; role: Role; onClose: () => void; onBid: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#111827]/20 backdrop-blur-sm" onClick={onClose}>
      <motion.aside initial={{ x: 480 }} animate={{ x: 0 }} exit={{ x: 480 }} transition={{ ease: "easeOut" }} onClick={(event) => event.stopPropagation()} className="ml-auto h-full w-full max-w-xl overflow-y-auto bg-white/90 p-6 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between"><h2 className="text-2xl font-semibold">{tender.title}</h2><button onClick={onClose}><X /></button></div>
        <p className="mt-3 text-[#6B7280]">{tender.description}</p>
        <div className="mt-5 grid gap-3">
          <InfoTile label="Agency" value={tender.agency} icon={Landmark} />
          <InfoTile label="Budget" value={tender.budget} icon={Gauge} />
          <InfoTile label="Requirements document hash" value={tender.hash} icon={FileLock2} />
          <InfoTile label="Blockchain proof" value={tender.tx} icon={Network} />
        </div>
        <Timeline />
        {role === "supplier" && <ActionButton onClick={onBid}>Submit bid</ActionButton>}
      </motion.aside>
    </motion.div>
  );
}

function ModalShell({ title, children, onClose, wide = false }: { title: string; children: React.ReactNode; onClose: () => void; wide?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/20 p-4 backdrop-blur-md" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} onClick={(event) => event.stopPropagation()} className={`max-h-[92vh] w-full overflow-y-auto rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_30px_90px_rgba(17,24,39,0.18)] backdrop-blur-2xl ${wide ? "max-w-5xl" : "max-w-2xl"}`}>
        <div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-semibold">{title}</h2><button onClick={onClose} className="rounded-full bg-[#EAF6FF] p-2"><X className="h-5 w-5" /></button></div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function MotionCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return <motion.div variants={fadeUp} initial="hidden" animate="show" whileHover={{ y: -4 }} transition={{ duration: 0.42, delay, ease: "easeOut" }} className={`rounded-[28px] border border-white/70 bg-white/68 shadow-[0_20px_60px_rgba(106,176,227,0.18)] backdrop-blur-[22px] ${className}`}>{children}</motion.div>;
}

function Badge({ icon: Icon, children, className = "" }: { icon: React.ElementType; children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex items-center gap-2 rounded-full border border-[#D8ECFA] bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#3E82B5] ${className}`}><Icon className="h-4 w-4" />{children}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const tone = statusTone(status);
  const styles = tone === "success" ? "bg-[#ECFDF5] text-[#15803D]" : tone === "warning" ? "bg-[#FFF7ED] text-[#B45309]" : tone === "danger" ? "bg-[#FEF2F2] text-[#B91C1C]" : "bg-[#EAF6FF] text-[#3E82B5]";
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${styles}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{status}</span>;
}

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return <div className="relative w-full"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" /><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-2xl border border-[#D8ECFA] bg-white/80 py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#9CD5FF]" /></div>;
}

function Filters({ query, setQuery, filter, setFilter, options }: { query: string; setQuery: (value: string) => void; filter: string; setFilter: (value: string) => void; options: string[] }) {
  return <div className="flex flex-col gap-3 md:flex-row"><SearchBox value={query} onChange={setQuery} placeholder="Search tenders" /><select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-2xl border border-[#D8ECFA] bg-white/80 px-4 py-3 text-sm font-semibold outline-none">{options.map((item) => <option key={item}>{item}</option>)}</select></div>;
}

function TenderRow({ tender, onDetail, onAction }: { tender: typeof tenders[number]; onDetail: () => void; onAction: () => void }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-[#EAF6FF] bg-white/70 p-4 xl:grid-cols-[1.2fr_0.8fr_0.7fr_auto] xl:items-center">
      <div><p className="font-semibold">{tender.title}</p><p className="text-sm text-[#6B7280]">{tender.category} • {tender.agency}</p></div>
      <div className="text-sm"><p className="font-semibold">{tender.budget}</p><p className="text-[#6B7280]">Deadline {tender.deadline}</p></div>
      <div><StatusBadge status={tender.status} /><p className="mt-2 text-xs text-[#6B7280]">{tender.bids} bids • {shortHash(tender.hash)}</p></div>
      <div className="flex gap-2"><SmallButton tone="light" onClick={onDetail}>Detail</SmallButton><SmallButton onClick={onAction}>Publish</SmallButton></div>
    </div>
  );
}

function AuditEvent({ event, index }: { event: typeof auditEvents[number]; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.06 }} className="rounded-2xl border border-[#EAF6FF] bg-white/70 p-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row">
        <div><p className="font-semibold">{event.action}</p><p className="text-sm text-[#6B7280]">{event.actor} • {event.role} • {event.time}</p></div>
        <StatusBadge status={event.status} />
      </div>
      <div className="mt-4 grid gap-3 text-xs md:grid-cols-3"><InfoRow label="Database hash" value={event.dbHash} /><InfoRow label="Sepolia hash" value={event.chainHash} /><InfoRow label="Tx hash" value={event.tx} /></div>
    </motion.div>
  );
}

function Timeline({ compact = false }: { compact?: boolean }) {
  const items = ["Tender Created", "Bid Submitted", "Winner Verified"];
  return <div className={compact ? "" : "mt-6 rounded-[24px] bg-[#EAF6FF]/70 p-5"}>{!compact && <SectionTitle title="Status timeline" subtitle="Every milestone has actor, hash, and verification proof." />}<div className={`${compact ? "" : "mt-5"} space-y-3`}>{items.map((item, index) => <div key={item} className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#22C55E] text-white"><Check className="h-4 w-4" /></span><div><p className="text-sm font-semibold">{item}</p><p className="text-xs text-[#6B7280]">Verified on Sepolia • {index + 9}:2{index}</p></div></div>)}</div></div>;
}

function InfoTile({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return <div className="rounded-2xl border border-[#EAF6FF] bg-white/70 p-4"><Icon className="mb-3 h-5 w-5 text-[#3E82B5]" /><p className="text-xs font-semibold text-[#6B7280]">{label}</p><p className="mt-1 break-words font-semibold">{value}</p></div>;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 border-b border-[#EAF6FF] py-2 last:border-0"><span className="text-[#6B7280]">{label}</span><span className="break-all text-right font-semibold">{value}</span></div>;
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return <div><h2 className="text-xl font-semibold">{title}</h2>{subtitle && <p className="mt-1 text-sm text-[#6B7280]">{subtitle}</p>}</div>;
}

function ProgressStep({ step, active }: { step: string; active: boolean }) {
  return <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold ${active ? "border-[#C1E5FF] bg-[#EAF6FF] text-[#3E82B5]" : "border-[#EAF6FF] bg-white/60 text-[#6B7280]"}`}><span className={`flex h-6 w-6 items-center justify-center rounded-full ${active ? "bg-[#22C55E] text-white" : "bg-[#EAF6FF]"}`}>{active ? <Check className="h-4 w-4" /> : null}</span>{step}</div>;
}

function BeforeAfter({ title, items, tone }: { title: string; items: string[]; tone: "warning" | "success" }) {
  return <MotionCard className="p-6"><h2 className="text-2xl font-semibold">{title}</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{items.map((item) => <div key={item} className={`rounded-2xl px-4 py-3 text-sm font-semibold ${tone === "success" ? "bg-[#ECFDF5] text-[#15803D]" : "bg-[#FFF7ED] text-[#B45309]"}`}>{item}</div>)}</div></MotionCard>;
}

function SystemHealth() {
  return <MotionCard className="p-5"><SectionTitle title="System health" subtitle="Demo infrastructure status" />{["Blockchain sync 100%", "Rabby transaction simulator ready", "Supabase/IPFS mock storage healthy", "Public proof API online"].map((item) => <p key={item} className="mt-4 rounded-2xl bg-[#ECFDF5] px-4 py-3 text-sm font-semibold text-[#15803D]">{item}</p>)}</MotionCard>;
}

function VerifierResult({ result }: { result: "pending" | "match" | "mismatch" }) {
  const copy = result === "match" ? ["Hash match verified", "No tampering detected"] : result === "mismatch" ? ["Hash mismatch alert", "Document may have changed after submission"] : ["Pending verification", "Compare Supabase record hash vs Ethereum Sepolia hash"];
  return <motion.div key={result} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl p-4 ${result === "match" ? "bg-[#ECFDF5] text-[#15803D]" : result === "mismatch" ? "bg-[#FEF2F2] text-[#B91C1C]" : "bg-[#EAF6FF] text-[#3E82B5]"}`}><p className="font-semibold">{copy[0]}</p><p className="text-sm">{copy[1]}</p></motion.div>;
}

function LabeledInput({ label, placeholder }: { label: string; placeholder: string }) {
  return <label className="block text-sm font-semibold">{label}<input placeholder={placeholder} className="mt-2 w-full rounded-2xl border border-[#D8ECFA] bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-[#9CD5FF]" /></label>;
}

function MockUpload({ label = "Upload document" }: { label?: string }) {
  return <div className="mt-4 rounded-2xl border border-dashed border-[#9CD5FF] bg-[#EAF6FF]/50 p-5 text-center"><FilePlus2 className="mx-auto mb-2 h-6 w-6 text-[#3E82B5]" /><p className="font-semibold">{label}</p><p className="text-sm text-[#6B7280]">Mock upload ready for demo flow</p></div>;
}

function ActionButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return <button onClick={onClick} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#6AB0E3] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(106,176,227,0.28)] transition hover:-translate-y-0.5 active:scale-95">{children}</button>;
}

function SmallButton({ children, onClick, tone = "blue" }: { children: React.ReactNode; onClick?: () => void; tone?: "blue" | "light" }) {
  return <button onClick={onClick} className={`rounded-xl px-3 py-2 text-xs font-semibold transition active:scale-95 ${tone === "blue" ? "bg-[#6AB0E3] text-white" : "bg-[#EAF6FF] text-[#3E82B5]"}`}>{children}</button>;
}

function PillLink({ href, children, icon: Icon, variant = "blue" }: { href: string; children: React.ReactNode; icon: React.ElementType; variant?: "blue" | "light" }) {
  return <Link href={href} className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold transition hover:-translate-y-0.5 active:scale-95 ${variant === "blue" ? "bg-[#6AB0E3] text-white shadow-[0_18px_40px_rgba(106,176,227,0.35)]" : "border border-white/70 bg-white/70 text-[#3E82B5]"}`}>{children}<Icon className="h-4 w-4" /></Link>;
}

function SoftBlob({ className }: { className: string }) {
  return <motion.div animate={{ y: [0, -18, 0], scale: [1, 1.04, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className={`pointer-events-none absolute rounded-full blur-3xl ${className}`} />;
}

function Toast({ message }: { message: string }) {
  return <AnimatePresence>{message && <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} className="fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-white/70 bg-white/90 px-5 py-4 font-semibold text-[#111827] shadow-[0_20px_60px_rgba(17,24,39,0.16)] backdrop-blur-2xl"><Check className="h-5 w-5 text-[#22C55E]" />{message}</motion.div>}</AnimatePresence>;
}
