"use client";
import React from "react";
import Link from "next/link";
import { 
  Pill, 
  Droplets, 
  HeartPulse, 
  Activity, 
  Syringe, 
  ShieldCheck, 
  Stethoscope,
  Sparkles, 
  Baby
} from "lucide-react";

export default function CategoryGrid() {
  const categories = [
    // নিশ্চিত করুন এই slug গুলো আপনার Medicines পেজের categories অ্যারো এর সাথে হুবহু মিল আছে
    { name: "Prescription", icon: <Pill size={28} />, slug: "medicine", color: "bg-blue-600" },
    { name: "Syrup & Liquid", icon: <Droplets size={28} />, slug: "syrup", color: "bg-emerald-500" },
    { name: "Baby & Mother", icon: <Baby size={28} />, slug: "baby-mother-care", color: "bg-pink-500" },
    { name: "Diabetic Care", icon: <Activity size={28} />, slug: "diabetic-care", color: "bg-orange-500" },
    { name: "OTC Medicine", icon: <HeartPulse size={28} />, slug: "otc-medicine", color: "bg-red-500" },
    { name: "Family Planning", icon: <ShieldCheck size={28} />, slug: "family-planning", color: "bg-indigo-600" },
    { name: "Equipment", icon: <Stethoscope size={28} />, slug: "medical-devices", color: "bg-purple-500" },
    { name: "Personal Care", icon: <Sparkles size={28} />, slug: "personal-care", color: "bg-rose-400" },
    { name: "Injections", icon: <Syringe size={28} />, slug: "injections", color: "bg-cyan-600" },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="mb-16">
          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
            Shop by <span className="text-emerald-500">Category</span>
          </h2>
          <div className="h-1.5 w-20 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-5">
          {categories.map((cat) => (
            <Link 
              key={cat.slug} 
              // 🔥 পরিবর্তন: /medicines পেজে যাবে সাথে cat প্যারামিটার নিয়ে
              href={`/medicines?cat=${cat.slug}`} 
              className="group p-6 rounded-[2.5rem] border border-white bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:shadow-emerald-200/50 hover:-translate-y-2 transition-all duration-500 flex flex-col items-center justify-center"
            >
              <div className={`w-14 h-14 ${cat.color} bg-opacity-10 text-slate-700 rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 group-hover:bg-opacity-100 group-hover:text-white transition-all duration-300 mb-4 shadow-inner`}>
                {cat.icon}
              </div>
              <h4 className="font-black text-slate-800 uppercase text-[10px] tracking-widest text-center leading-tight h-8 flex items-center">
                {cat.name}
              </h4>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}