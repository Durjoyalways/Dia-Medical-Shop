"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import NavLinks from "./NavLinks";

const Navbar: React.FC = () => {
  const { user, logout, loading, role } = useAuth();

  return (
    <div className="drawer z-[1000]">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content flex flex-col">
        {/* --- MAIN NAVBAR --- */}
        <nav className="bg-[#0f172a] text-white sticky top-0 z-50 shadow-2xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="flex items-center h-20 gap-4 lg:gap-8">
              
              {/* --- 1. LEFT: LOGO --- */}
              <div className="flex items-center shrink-0">
                <label htmlFor="my-drawer" className="btn btn-ghost lg:hidden text-emerald-500 mr-2 p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </label>

                <Link href="/" className="flex items-center group">
                  <div className="bg-emerald-500 w-9 h-9 rounded-lg flex items-center justify-center rotate-45 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                    <span className="-rotate-45 font-black text-white text-xl">+</span>
                  </div>
                  <span className="ml-3 text-2xl font-black tracking-[0.15em] text-white hidden sm:block">
                    DIA
                  </span>
                </Link>
              </div>

              {/* --- 2. CENTER: SEARCH BOX --- */}
              <div className="flex-1 flex justify-center">
                <div className="relative w-full max-w-lg group">
                  <input
                    type="text"
                    placeholder="Search medicines..."
                    className="w-full bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:bg-slate-800 rounded-xl py-2.5 pl-5 pr-12 text-sm outline-none text-white transition-all backdrop-blur-sm"
                  />
                  <div className="absolute right-4 top-2.5 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* --- 3. RIGHT: AUTH SECTION --- */}
              <div className="flex items-center gap-4 lg:gap-8 shrink-0">
                <ul className="hidden lg:flex items-center gap-8">
                  <NavLinks />
                </ul>

                <div className="h-8 w-[1px] bg-slate-700 hidden lg:block"></div>

                {loading ? (
                  <span className="loading loading-spinner loading-sm text-emerald-500"></span>
                ) : user ? (
                  <div className="flex items-center gap-3">
                    <div className="hidden md:flex flex-col items-end leading-none">
                       <span className="text-xs font-bold text-white">{user.displayName || "User"}</span>
                       <span className="text-[10px] text-emerald-500 font-medium tracking-tight uppercase">
                         {role === "admin" ? "Admin Access" : "Customer"}
                       </span>
                    </div>
                    
                    <div className="dropdown dropdown-end">
                      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar ring-2 ring-emerald-500/50 ring-offset-2 ring-offset-[#0f172a] hover:scale-105 transition-all">
                        <div className="w-10 rounded-full bg-slate-800">
                          <img 
                            alt="Profile" 
                            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=10b981&color=fff&bold=true`} 
                          />
                        </div>
                      </div>
                      
                      {/* --- Dropdown Menu --- */}
                      <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-2xl menu menu-sm dropdown-content bg-[#0f172a] border border-slate-800 rounded-2xl w-56 space-y-1">
                        <li className="p-2 border-b border-slate-800 mb-2">
                          <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Account info</span>
                          <p className="text-xs text-emerald-400 truncate">{user.email}</p>
                        </li>

                        <li><Link href="/profile" className="hover:bg-slate-800 rounded-xl py-2.5">👤 My Profile</Link></li>
                        
                        {/* অ্যাডমিন কন্ডিশন */}
                        {role === "admin" ? (
                          <>
                            <div className="h-[1px] bg-slate-800 my-1"></div>
                            <li className="menu-title text-[10px] text-emerald-500 font-black uppercase px-4 py-2">Management</li>
                            <li><Link href="/admin-dashboard" className="hover:bg-emerald-500/10 text-emerald-400 font-bold rounded-xl py-2.5">📊 Dashboard</Link></li>
                            <li><Link href="/add-medicine" className="hover:bg-emerald-500/10 text-emerald-400 font-bold rounded-xl py-2.5">💊 Add Medicine</Link></li>
                            <li><Link href="/all-orders" className="hover:bg-emerald-500/10 text-emerald-400 font-bold rounded-xl py-2.5">📦 All Orders</Link></li>
                          </>
                        ) : (
                          <>
                            <li><Link href="/cart" className="hover:bg-slate-800 rounded-xl py-2.5">🛒 My Cart</Link></li>
                            <li><Link href="/my-orders" className="hover:bg-slate-800 rounded-xl py-2.5">🛍 My Orders</Link></li>
                          </>
                        )}
                        
                        <div className="h-[1px] bg-slate-800 my-1"></div>
                        <li>
                          <button 
                            onClick={() => logout()} 
                            className="text-red-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl py-2.5 font-black mt-1 w-full text-left"
                          >
                            Sign Out System
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <Link 
                    href="/login" 
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-2.5 rounded-xl font-black text-sm transition-all shadow-lg shadow-emerald-600/20 active:scale-95 uppercase tracking-wider"
                  >
                    Login
                  </Link>
                )}
              </div>

            </div>
          </div>
        </nav>
      </div> 

      {/* --- MOBILE SIDEBAR --- */}
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <div className="p-8 w-80 min-h-full bg-[#0f172a] text-gray-200 border-r border-slate-800">
          {user && (
             <div className="mb-8 p-5 bg-slate-800/50 rounded-[2rem] border border-slate-700">
                <div className="flex items-center gap-4">
                   <img className="w-12 h-12 rounded-full ring-2 ring-emerald-500 p-0.5" src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}`} alt="User Profile" />
                   <div className="overflow-hidden">
                      <p className="font-black text-white truncate">{user.displayName || "User"}</p>
                      <p className="text-[10px] text-emerald-500 font-bold uppercase">{role || "Customer"}</p>
                   </div>
                </div>
             </div>
          )}
          <ul className="space-y-2 flex flex-col list-none">
            <NavLinks />
            
            {user && role === "admin" && (
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                <p className="text-[10px] font-black text-slate-500 uppercase ml-4 mb-2 tracking-widest">Admin Menu</p>
                <li><Link href="/admin-dashboard" className="block p-4 hover:bg-emerald-500 rounded-2xl font-bold transition-all">📊 Dashboard</Link></li>
                <li><Link href="/add-medicine" className="block p-4 hover:bg-emerald-500 rounded-2xl font-bold transition-all">💊 Add Medicine</Link></li>
              </div>
            )}

            {!user && (
              <li className="list-none pt-6 border-t border-slate-800 mt-4">
                <Link href="/login" className="bg-emerald-500 text-white text-center py-4 rounded-2xl font-black block shadow-lg">Login ➜</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;