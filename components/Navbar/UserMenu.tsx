"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
// FileText আইকনটি এখানে অ্যাড করা হয়েছে
import { User, ShoppingBag, LogOut, ShoppingCart, FileText } from "lucide-react";

const UserMenu = () => {
  const { logout, user } = useAuth();

  return (
    <ul className="mt-3 z-[100] p-2 shadow-2xl menu menu-sm dropdown-content bg-[#0f172a] border border-slate-800 rounded-2xl w-64 space-y-1 animate-in fade-in zoom-in duration-200">
      <li className="p-3 border-b border-slate-800 mb-2">
        <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest p-0">Account info</span>
        <p className="text-xs text-emerald-400 truncate font-bold p-0">{user?.email}</p>
      </li>
      
      <li>
        <Link href="/user/profile" className="flex items-center gap-3 py-3 hover:bg-emerald-500 hover:text-[#0f172a] font-bold rounded-xl transition-all">
          <User size={16} /> My Profile
        </Link>
      </li>
      
      <li>
        <Link href="/user/cart" className="flex items-center gap-3 py-3 hover:bg-emerald-500 hover:text-[#0f172a] font-bold rounded-xl transition-all">
          <ShoppingCart size={16} /> My Cart
        </Link>
      </li>
      
      <li>
        <Link href="/user/my-orders" className="flex items-center gap-3 py-3 hover:bg-emerald-500 hover:text-[#0f172a] font-bold rounded-xl transition-all">
          <ShoppingBag size={16} /> My Orders
        </Link>
      </li>

      {/* --- নতুন Prescription লিঙ্ক এখানে যোগ করা হয়েছে --- */}
      <li>
        <Link href="/user/my-prescriptions" className="flex items-center gap-3 py-3 hover:bg-emerald-500 hover:text-[#0f172a] font-bold rounded-xl transition-all">
          <FileText size={16} /> My Prescriptions
        </Link>
      </li>
      
      <div className="h-[1px] bg-slate-800 my-1 mx-2"></div>
      
      <li>
        <button 
          onClick={() => logout()} 
          className="flex items-center gap-3 py-3 text-red-400 hover:bg-red-500/10 font-bold rounded-xl transition-all"
        >
          <LogOut size={16} /> Logout System
        </button>
      </li>
    </ul>
  );
};

export default UserMenu;