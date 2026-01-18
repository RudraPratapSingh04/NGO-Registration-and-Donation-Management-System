const StatCard = ({ label, value }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-3xl font-black text-slate-900">{value ?? 0}</p>
    </div>
  );
};

export default StatCard;