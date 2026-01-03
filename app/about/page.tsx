"use client";
import React from "react";
import { 
  ShieldCheck, Truck, Award, Clock, CheckCircle,
  Stethoscope, Heart, ArrowRight, Globe, Plus
} from "lucide-react";
import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      
      {/* --- 1. HERO SECTION --- */}
      <section className="relative py-28 lg:py-48 bg-[#0f172a] flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-20%] w-[700px] h-[700px] bg-blue-600/20 rounded-full blur-[140px] animate-pulse delay-700"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center animate-in fade-in zoom-in duration-1000">
          <div className="inline-flex items-center gap-2 py-2 px-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] mb-10">
            <Plus size={14} className="animate-spin-slow" /> Established 2016
          </div>
          <h1 className="text-6xl lg:text-9xl font-black text-white mb-8 tracking-tighter leading-[0.85] [text-shadow:_0_10px_30px_rgb(0_0_0_/_50%)]">
            DIA <span className="text-emerald-500 italic">Medical</span>
          </h1>
          <p className="max-w-3xl mx-auto text-slate-400 text-lg lg:text-2xl leading-relaxed font-medium">
            A decade of precision, care, and unwavering commitment to your health. 
            Welcome to Bangladesh's most trusted digital pharmacy.
          </p>
        </div>
      </section>

      {/* --- 2. STATS SECTION (TypeScript Error Fixed) --- */}
      <section className="py-12 -mt-24 container mx-auto px-6 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Successful Deliveries", value: "100k+", IconComponent: Truck, delay: "delay-100" },
            { label: "Original Medicine", value: "100%", IconComponent: ShieldCheck, delay: "delay-200" },
            { label: "Expert Pharmacists", value: "24/7", IconComponent: Stethoscope, delay: "delay-300" },
            { label: "Govt. Approved", value: "Verified", IconComponent: Award, delay: "delay-400" },
          ].map((stat, i) => (
            <div 
              key={i} 
              className={`bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-50 flex flex-col items-center group hover:-translate-y-4 transition-all duration-500 animate-in fade-in slide-in-from-bottom-20 ${stat.delay} fill-mode-both`}
            >
              <div className="bg-slate-900 text-white p-5 rounded-2xl mb-6 group-hover:bg-emerald-500 group-hover:rotate-[360deg] transition-all duration-700 shadow-xl">
                <stat.IconComponent size={28} />
              </div>
              <h4 className="text-3xl font-black text-slate-800 tracking-tighter">{stat.value}</h4>
              <p className="text-slate-400 text-[10px] font-black uppercase mt-2 tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- 3. CORE STORY SECTION --- */}
      <section className="py-32 container mx-auto px-6 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="relative group animate-in fade-in slide-in-from-left-20 duration-1000">
            <div className="rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-[16px] border-white relative z-10 transition-all duration-700 hover:scale-[1.03]">
              <img 
                src="https://images.pexels.com/photos/5910956/pexels-photo-5910956.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Pharmacist Excellence" 
                className="w-full h-[650px] object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -right-5 bg-emerald-500 p-10 rounded-[3.5rem] shadow-2xl text-white z-20 hidden lg:block animate-bounce-slow">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Government Authorized</p>
              <h5 className="font-black text-2xl tracking-tighter">License: 12345678-DIA</h5>
            </div>
          </div>

          <div className="space-y-12 animate-in fade-in slide-in-from-right-20 duration-1000">
            <div className="space-y-4">
              <h2 className="text-5xl lg:text-7xl font-black text-slate-900 leading-none uppercase tracking-tighter">
                Authenticity <br /> Is Our <span className="text-emerald-500">DNA.</span>
              </h2>
              <div className="h-2 w-24 bg-emerald-500 rounded-full"></div>
            </div>
            <p className="text-slate-500 text-xl leading-relaxed font-medium">
              Since our inception, DIA Medical Shop has bridge the gap between patients and genuine healthcare. 
              We don't just sell medicine; we deliver hope and health with a team of over 20+ certified professionals.
            </p>
            
            <div className="grid gap-6">
              {[
                { title: "Direct Lab Sourcing", desc: "No middle-man. No fake products. 100% Direct.", IconComp: ShieldCheck },
                { title: "Express Logistics", desc: "Our own bike fleet ensures delivery within 2 hours.", IconComp: Truck },
              ].map((item, i) => (
                <div key={i} className="flex gap-8 p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group cursor-default">
                  <div className="w-16 h-16 shrink-0 rounded-2xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                    <item.IconComp size={28} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 uppercase text-md tracking-wider mb-2">{item.title}</h4>
                    <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. CTA SECTION --- */}
      <section className="py-24 container mx-auto px-6 mb-20 animate-in fade-in zoom-in duration-1000">
        <div className="bg-[#0f172a] rounded-[5rem] p-16 lg:p-32 text-center relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(16,185,129,0.3)]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full -mr-40 -mt-40 blur-[100px] animate-pulse"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-6xl lg:text-8xl font-black text-white mb-12 tracking-tighter leading-tight">
              Ready for <br /> <span className="text-emerald-500 italic">Better Care?</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-8">
              <Link href="/medicines" className="group relative bg-emerald-500 text-[#0f172a] px-16 py-8 rounded-[2.5rem] font-black uppercase tracking-widest hover:scale-110 transition-all shadow-2xl flex items-center gap-4">
                Explore Shop <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform" />
              </Link>
              <Link href="/contact" className="px-16 py-8 rounded-[2.5rem] border-2 border-white/20 text-white font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Animations */}
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}