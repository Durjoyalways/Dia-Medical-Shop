"use client";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, role } = useAuth();

  if (!user) return <div className="p-20 text-center">Please log in to view profile.</div>;

  return (
    <div className="p-6 lg:p-12 max-w-4xl mx-auto">
      <div className="bg-[#0f172a] text-white rounded-[3rem] p-10 md:p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col items-center md:items-start md:flex-row gap-8">
          <div className="w-32 h-32 rounded-full ring-4 ring-emerald-500/30 p-1">
            <img 
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=10b981&color=fff`} 
              className="w-full h-full rounded-full object-cover"
              alt="Profile"
            />
          </div>
          
          <div className="text-center md:text-left">
            <span className="bg-emerald-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              {role || "Customer"}
            </span>
            <h1 className="text-4xl font-black mt-4">{user.displayName || "User Name"}</h1>
            <p className="text-slate-400 mt-2">{user.email}</p>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Member Since</p>
                <p className="font-bold text-sm">{user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "N/A"}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Account Status</p>
                <p className="font-bold text-sm text-emerald-400">Verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}