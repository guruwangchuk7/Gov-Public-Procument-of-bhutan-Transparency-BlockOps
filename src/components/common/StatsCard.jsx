export default function StatsCard({ title, value, subtext, icon: Icon, color }) {
  return (
    <div className="card hover:border-primary transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-black text-gray-900">{value}</h3>
          {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color} text-white`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
