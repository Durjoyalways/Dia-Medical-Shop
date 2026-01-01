"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, limit, orderBy } from "firebase/firestore";
import Link from "next/link";
import { MoveRight } from "lucide-react";
export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(collection(db, "medicines"), orderBy("createdAt", "desc"), limit(4));
        const snap = await getDocs(q);
        setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchFeatured();
  }, []);

  if (loading) return null;

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">New <span className="text-emerald-500">Arrivals</span></h2>
            <p className="text-slate-500 font-medium mt-2">Latest medicines in our store</p>
          </div>
          <Link href="/medicines" className="text-emerald-600 font-black uppercase text-xs tracking-widest hover:underline">View All</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((item) => (
            <div key={item.id} className="bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="h-48 rounded-[1.5rem] bg-slate-50 overflow-hidden mb-4 relative">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-[10px] font-black px-3 py-1.5 rounded-lg text-emerald-600 uppercase tracking-widest">{item.category}</span>
              </div>
              <h3 className="font-bold text-slate-800 px-2 truncate">{item.name}</h3>
              <div className="flex justify-between items-center mt-4 px-2 pb-2">
                <span className="text-xl font-black text-slate-900">৳{item.price}</span>
                <Link href={`/medicines/${item.id}`} className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-emerald-500 transition-colors">
                  <MoveRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}