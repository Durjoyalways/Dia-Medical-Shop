"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const AdminMenu = () => {
  const { logout } = useAuth(); // AuthContext থেকে লগআউট ফাংশনটি আনা হলো

  return (
    <ul className="menu menu-sm dropdown-content mt-4 z-[100] p-4 shadow-2xl bg-[#0f172a] border-2 border-emerald-500/30 rounded-[2rem] w-64">
      <li className="menu-title text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em] mb-4 px-4">
        Admin Control Center
      </li>
      
      <li>
        <Link href="/admin-dashboard" className="py-3 px-4 text-slate-200 hover:bg-emerald-500 hover:text-white transition-all rounded-xl mb-1 font-bold">
          🏠 Dashboard
        </Link>
      </li>
      
      <li>
        <Link href="/add-medicine" className="py-3 px-4 text-slate-200 hover:bg-emerald-500 hover:text-white transition-all rounded-xl mb-1 font-bold">
          💊 Add Medicine
        </Link>
      </li>
      
      <li>
        <Link href="/all-orders" className="py-3 px-4 text-slate-200 hover:bg-emerald-500 hover:text-white transition-all rounded-xl mb-1 font-bold">
          📦 View All Orders
        </Link>
      </li>

      <div className="h-[1px] bg-slate-800 my-3 mx-2"></div>

      <li>
        <button 
          onClick={logout}
          className="py-3 px-4 text-red-400 font-black hover:bg-red-500/10 transition-all rounded-xl"
        >
          🛑 System Logout
        </button>
      </li>
    </ul>
  );
};

export default AdminMenu;