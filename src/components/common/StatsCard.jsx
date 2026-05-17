export default function StatsCard({ title, value, subtext, icon: Icon }) {
  return (
    <div className="card p-6 border-zinc-200 shadow-none hover:border-zinc-400 transition-all group flex flex-col justify-between h-36">
      <div className="flex justify-between items-start">
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{title}</p>
        <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 group-hover:border-zinc-200 transition-all">
          <Icon size={16} />
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-semibold text-zinc-900 tracking-tightest">{value}</h3>
        {subtext && <p className="text-[11px] text-zinc-400 font-medium tracking-tight mt-1">{subtext}</p>}
      </div>
    </div>
  );
}
