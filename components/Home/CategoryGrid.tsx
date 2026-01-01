import Link from "next/link";
import { Pill, Droplets, Baby, Activity, Syringe } from "lucide-react";

export default function CategoryGrid() {
  const categories = [
    { name: "Tablet", icon: <Pill />, slug: "tablet", color: "bg-blue-500" },
    { name: "Syrup", icon: <Droplets />, slug: "syrup", color: "bg-emerald-500" },
    { name: "Injection", icon: <Syringe />, slug: "injection", color: "bg-red-500" },
    { name: "Baby Care", icon: <Baby />, slug: "baby-care", color: "bg-amber-500" },
    { name: "Devices", icon: <Activity />, slug: "devices", color: "bg-purple-500" },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-12">
          Shop by <span className="text-emerald-500">Category</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`} className="group p-8 rounded-[2.5rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col items-center">
              <div className={`w-16 h-16 ${cat.color} bg-opacity-10 text-slate-800 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform mb-4`}>
                {cat.icon}
              </div>
              <h4 className="font-bold text-slate-800 uppercase text-xs tracking-widest">{cat.name}</h4>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}