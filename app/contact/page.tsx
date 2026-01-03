"use client";
import React from "react";
import { 
  MapPin, Phone, Mail, Send, 
  MessageSquare, Clock, Globe, ArrowRight,
  Facebook, Instagram, Twitter
} from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-emerald-100">
      
      {/* --- PREMIUM HERO SECTION --- */}
      <section className="bg-[#0f172a] pt-32 pb-60 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="inline-block py-1 px-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            Available 24/7 for you
          </div>
          <h1 className="text-6xl lg:text-9xl font-black text-white mb-6 tracking-tighter uppercase leading-none">
            Contact <span className="text-emerald-500 italic drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]">Us</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">
            Connect with DIA Medical Shop. Whether it's a prescription query or medical advice, our experts are just a message away.
          </p>
        </div>
      </section>

      {/* --- INTERACTIVE CONTENT WRAPPER --- */}
      <div className="container mx-auto px-6 -mt-40 pb-24 relative z-20">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT: Info & Socials (Scroll Reveal) */}
          <div className="lg:col-span-5 space-y-6 animate-in fade-in slide-in-from-left-10 duration-1000 fill-mode-both">
            <div className="bg-white p-10 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-50 group hover:-translate-y-3 transition-all duration-500">
              <div className="flex items-start gap-6">
                <div className="bg-emerald-50 p-5 rounded-2xl text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                  <MapPin size={32} />
                </div>
                <div>
                  <h4 className="font-black uppercase text-[10px] tracking-[0.2em] text-slate-400 mb-2">Main Branch</h4>
                  <p className="text-2xl font-black text-slate-800 leading-tight tracking-tighter">Road-05, Dhanmondi <br /> Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-50 group hover:-translate-y-3 transition-all duration-500">
              <div className="flex items-start gap-6">
                <div className="bg-slate-900 text-white p-5 rounded-2xl group-hover:bg-emerald-500 transition-all duration-500">
                  <Phone size={32} />
                </div>
                <div>
                  <h4 className="font-black uppercase text-[10px] tracking-[0.2em] text-slate-400 mb-2">Direct Hotline</h4>
                  <p className="text-2xl font-black text-slate-800 tracking-tighter">+880 1700 000000</p>
                  <p className="text-xs font-bold text-emerald-500 mt-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span> Active Now
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-[#0f172a] p-10 rounded-[3rem] text-white flex justify-between items-center group overflow-hidden relative">
               <div className="relative z-10">
                 <h4 className="font-black uppercase text-[10px] tracking-[0.2em] text-slate-500 mb-4">Follow Our Updates</h4>
                 <div className="flex gap-4">
                    {[Facebook, Instagram, Twitter].map((Icon, i) => (
                      <button key={i} className="p-4 bg-white/5 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all transform hover:scale-110">
                        <Icon size={20} />
                      </button>
                    ))}
                 </div>
               </div>
               <Globe size={100} className="absolute -right-5 -bottom-5 text-white/5 group-hover:rotate-45 transition-transform duration-1000" />
            </div>
          </div>

          {/* RIGHT: Contact Form (Scroll Reveal) */}
          <div className="lg:col-span-7 animate-in fade-in slide-in-from-right-10 duration-1000 fill-mode-both">
            <div className="bg-white rounded-[4rem] p-10 lg:p-16 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.15)] border border-white h-full relative group">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-1 text-emerald-500 bg-emerald-500 rounded-full"></div>
                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">Write Us.</h2>
              </div>

              <form className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Name</label>
                    <input type="text" placeholder="Full Name" className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500/20 focus:bg-white rounded-2xl py-5 px-6 font-bold text-slate-800 transition-all outline-none" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email</label>
                    <input type="email" placeholder="Email Address" className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500/20 focus:bg-white rounded-2xl py-5 px-6 font-bold text-slate-800 transition-all outline-none" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Message</label>
                  <textarea placeholder="Tell us how we can help..." className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500/20 focus:bg-white rounded-3xl py-5 px-6 font-bold text-slate-800 transition-all outline-none min-h-[180px] resize-none"></textarea>
                </div>

                <button className="group w-full py-7 bg-emerald-600 text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] shadow-2xl shadow-emerald-500/30 hover:bg-slate-900 hover:scale-[1.02] transition-all flex items-center justify-center gap-4">
                  Send Inquiry <Send size={20} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* --- 4. THE LIVE MAP SECTION --- */}
        <div className="mt-20 rounded-[4rem] overflow-hidden h-[500px] shadow-2xl border-[16px] border-white relative group animate-in zoom-in duration-1000">
           {/* Real Google Map Iframe for Dhanmondi Road 5 */}
           <iframe 
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.222383842456!2d90.37893927589578!3d23.73945908922442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755bf36357d762f%3A0x6e9a44111326447c!2sDhanmondi%20Road%205!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd" 
             width="100%" 
             height="100%" 
             style={{ border: 0 }} 
             allowFullScreen 
             loading="lazy" 
             referrerPolicy="no-referrer-when-downgrade"
             className="grayscale-[0.2] contrast-[1.1] group-hover:grayscale-0 transition-all duration-1000"
           ></iframe>
           
           {/* Map Overlay Badge */}
           <div className="absolute top-8 left-8 bg-[#0f172a] text-white p-6 rounded-3xl shadow-2xl border border-white/10 hidden md:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">Our Location</p>
              <p className="font-bold text-sm">Visit our Physical Store</p>
           </div>
        </div>
      </div>
    </div>
  );
}