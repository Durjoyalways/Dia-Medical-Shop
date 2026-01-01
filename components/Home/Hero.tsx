"use client";
import Link from "next/link";
import { MoveRight, ShieldCheck, Clock } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#0F172A]">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full -mr-40 -mt-40 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full -ml-20 -mb-20"></div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10 py-20">
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
             <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
              24/7 Express Home Delivery
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1] tracking-tighter uppercase">
            Your Health <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
              Our Priority.
            </span>
          </h1>

          <p className="text-slate-400 text-lg max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed">
            Order authentic medicines and healthcare essentials to your doorstep in <span className="text-white font-bold underline decoration-emerald-500/50">60 minutes.</span> Trusted by thousands.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
            <Link href="/medicines" className="group flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-[#0F172A] px-10 py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 hover:-translate-y-1">
              Order Now <MoveRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link href="/upload-prescription" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-10 py-5 rounded-2xl font-black uppercase tracking-widest transition-all">
              Prescription
            </Link>
          </div>

          <div className="flex justify-center lg:justify-start gap-8 pt-6">
            <div className="flex items-center gap-2 text-slate-500">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest">100% Genuine</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
                <Clock className="w-5 h-5 text-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Fast Delivery</span>
            </div>
          </div>
        </div>

        {/* New Gorgeous Image Container */}
        <div className="relative hidden lg:block">
         <div className="relative hidden lg:block">
  <div className="relative z-10 rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl group">
    <img 
      src="/images/hero-medicine.png" // আপনার পাবলিক ফোল্ডারের পাথ
      alt="Medical Support" 
      className="w-full h-[600px] object-cover transition-all duration-700 group-hover:scale-105"
    />
    {/* Elegant Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/60 via-transparent to-transparent"></div>
  </div>
  
  {/* Decorative Glows */}
  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl"></div>
  <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
</div>
          
          {/* Decorative Elements */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </section>
  );
}