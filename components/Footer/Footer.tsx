import Link from "next/link";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-slate-300 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
              Dia <span className="text-emerald-500">Drug House</span>
            </h2>
            <p className="text-sm leading-relaxed text-slate-400">
              Your trusted neighborhood pharmacy, now online. We provide 100% genuine medicines and healthcare products with the fastest delivery service.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-emerald-500 hover:text-[#0F172A] transition-all">
                <Facebook size={18} />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-emerald-500 hover:text-[#0F172A] transition-all">
                <Instagram size={18} />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-emerald-500 hover:text-[#0F172A] transition-all">
                <Twitter size={18} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/medicines" className="hover:text-emerald-500 transition-colors">Shop Medicines</Link></li>
              <li><Link href="/about" className="hover:text-emerald-500 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-500 transition-colors">Contact Support</Link></li>
              <li><Link href="/upload-prescription" className="hover:text-emerald-500 transition-colors">Upload Prescription</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-emerald-500 shrink-0" />
                <span>Road 12, Beside Main Highway, <br />Dia City Tower, Dhaka</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-emerald-500 shrink-0" />
                <span>+880 1234 567 890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-emerald-500 shrink-0" />
                <span>support@diadrug.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Newsletter</h3>
            <p className="text-xs text-slate-400 mb-4">Subscribe to get health tips and offers.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Your Email" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button className="absolute right-2 top-2 bg-emerald-500 text-[#0F172A] p-2 rounded-lg hover:bg-emerald-600 transition-colors">
                <Send size={18} />
              </button>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-500">
          <p>© 2024 Dia Drug House. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}