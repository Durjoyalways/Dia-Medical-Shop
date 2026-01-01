"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ medicines: 0, orders: 0, users: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const meds = await getDocs(collection(db, "medicines"));
        const orders = await getDocs(collection(db, "orders"));
        const users = await getDocs(collection(db, "users"));
        setStats({
          medicines: meds.size,
          orders: orders.size,
          users: users.size
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6 lg:p-12 max-w-7xl mx-auto">
      <h1 className="text-4xl font-black text-slate-800 mb-10 uppercase tracking-tighter">
        Admin <span className="text-emerald-500">Overview</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Total Medicines", value: stats.medicines, color: "bg-blue-500" },
          { label: "Total Orders", value: stats.orders, color: "bg-emerald-500" },
          { label: "Registered Users", value: stats.users, color: "bg-purple-500" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 ${item.color} opacity-10 rounded-bl-full transition-all group-hover:scale-110`}></div>
            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">{item.label}</p>
            <h2 className="text-5xl font-black text-slate-800 mt-4 tracking-tighter">
              {stats.medicines === 0 && stats.orders === 0 && stats.users === 0 ? (
                <span className="loading loading-spinner loading-md text-slate-200"></span>
              ) : (
                item.value
              )}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}