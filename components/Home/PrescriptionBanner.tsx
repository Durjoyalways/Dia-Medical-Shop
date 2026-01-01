import Link from "next/link";
import { UploadCloud } from "lucide-react";

export default function PrescriptionBanner() {
  return (
    <section className="px-6 pb-24">
      <div className="max-w-7xl mx-auto bg-[#0F172A] rounded-[3rem] overflow-hidden relative shadow-2xl">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 opacity-10 blur-[80px] rounded-full -mr-20 -mt-20"></div>
        
        <div className="relative z-10 p-12 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight uppercase tracking-tighter">
              Quick Order with <br />
              <span className="text-emerald-500">Your Prescription</span>
            </h2>
            <p className="text-slate-400 mt-6 text-lg max-w-lg">
              Don't waste time searching! Simply upload a photo of your prescription, and we'll process your order instantly.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6 bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-sm">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce">
              <UploadCloud className="text-white w-10 h-10" />
            </div>
            <Link 
              href="/upload-prescription" 
              className="bg-emerald-500 hover:bg-emerald-600 text-[#0F172A] px-10 py-5 rounded-2xl font-black uppercase tracking-widest transition-all"
            >
              Upload Now
            </Link>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Supports: JPG, PNG, PDF</p>
          </div>
        </div>
      </div>
    </section>
  );
}