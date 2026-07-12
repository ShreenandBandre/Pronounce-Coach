export default function Loader({ label }) {
  return (
    <div className="max-w-xl mx-auto text-center mt-16">
      <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto" />
      <p className="text-slate-500 text-sm mt-4">{label}</p>
    </div>
  );
}
