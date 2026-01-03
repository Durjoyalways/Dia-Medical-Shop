"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const AdminMenu = () => {
  const { logout } = useAuth();

  return (
    <ul className="menu menu-sm dropdown-content mt-4 z-[100] p-4 shadow-2xl bg-[#0f172a] border-2 border-emerald-500/30 rounded-[2rem] w-64 animate-in fade-in slide-in-from-top-5 duration-300">
      <li className="menu-title text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em] mb-4 px-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
        Admin Control Center
      </li>
      
      <li>
        <Link 
          href="/admin/admin-dashboard" 
          className="py-3 px-4 text-slate-200 hover:bg-emerald-500 hover:text-white transition-all rounded-xl mb-1 font-bold flex items-center gap-3 active:scale-95"
        >
          <span className="text-lg">🏠</span> Dashboard
        </Link>
      </li>
      
      <li>
        <Link 
          href="/admin/add-medicine" 
          className="py-3 px-4 text-slate-200 hover:bg-emerald-500 hover:text-white transition-all rounded-xl mb-1 font-bold flex items-center gap-3 active:scale-95"
        >
          <span className="text-lg">💊</span> Add Medicine
        </Link>
      </li>
      
      <li>
        <Link 
          href="/admin/all-orders" 
          className="py-3 px-4 text-slate-200 hover:bg-emerald-500 hover:text-white transition-all rounded-xl mb-1 font-bold flex items-center gap-3 active:scale-95"
        >
          <span className="text-lg">📦</span> View All Orders
        </Link>
      </li>

      {/* --- নতুন লিঙ্ক এখানে যোগ করা হয়েছে --- */}
    <li>
  <Link 
    href="/admin/prescriptions" // <--- এখানে 'manage-' অংশটি বাদ দিন
    className="py-3 px-4 text-slate-200 hover:bg-emerald-500 hover:text-white transition-all rounded-xl mb-1 font-bold flex items-center gap-3 active:scale-95"
  >
    <span className="text-lg">📄</span> Manage Prescriptions
  </Link>
</li>

      <div className="h-[1px] bg-slate-800 my-3 mx-2"></div>

      <li>
        <button 
          onClick={() => logout()}
          className="py-3 px-4 text-red-400 font-black hover:bg-red-500/10 transition-all rounded-xl flex items-center gap-3 active:scale-95 w-full text-left"
        >
          <span className="text-lg">🛑</span> System Logout
        </button>
      </li>
    </ul>
  );
};

export default AdminMenu;