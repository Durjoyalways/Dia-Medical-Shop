"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { 
  Loader2, 
  ArrowLeft, 
  ShoppingCart, 
  PackageSearch, 
  LayoutGrid,
  Plus,
  Star
} from "lucide-react";
import Link from "next/link";

interface Medicine {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  description: string;
  variants?: string[];
}

export default function CategoryProductsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [products, setProducts] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "medicines"),
          where("category", "==", slug)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Medicine[];
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchCategoryData();
  }, [slug]);

  const formattedTitle = typeof slug === "string" ? slug.replace(/-/g, " ") : "";

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* --- HERO SECTION --- */}
      <div className="bg-white border-b border-slate-200 pt-10 pb-16 px-6 mb-12">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => router.back()} 
            className="group flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold transition-all mb-8"
          >
            <div className="p-2 bg-slate-100 rounded-full group-hover:bg-emerald-100 transition-colors">
              <ArrowLeft size={18} />
            </div>
            <span className="text-xs uppercase tracking-widest">Back to Categories</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="h-1 w-8 bg-emerald-500 rounded-full"></span>
                <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em]">Premium Collection</span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">
                {formattedTitle} <span className="text-emerald-500 italic">Store</span>
              </h1>
            </div>
            <div className="bg-slate-900 text-white px-6 py-4 rounded-3xl flex items-center gap-4 shadow-xl shadow-slate-200">
              <LayoutGrid className="text-emerald-400" size={24} />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Total Inventory</p>
                <p className="text-xl font-black leading-none">{products.length} Products</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
              <Loader2 className="animate-spin text-emerald-500" size={60} />
              <div className="absolute inset-0 m-auto w-6 h-6 bg-emerald-100 rounded-full animate-pulse"></div>
            </div>
            <p className="mt-6 text-slate-400 font-black text-xs uppercase tracking-[0.4em]">Organizing Stock...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-200 flex flex-col items-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <PackageSearch size={40} className="text-slate-300" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 uppercase">Coming Soon</h2>
            <p className="text-slate-500 mt-3 max-w-sm font-medium">
              We are currently restocking our <span className="text-emerald-600 font-bold">{formattedTitle}</span> inventory.
            </p>
            <Link href="/" className="mt-10 px-12 py-5 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg hover:shadow-emerald-200">
              Return Home
            </Link>
          </div>
        ) : (
          /* --- MEDICINE GRID --- */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((item) => (
              <div 
                key={item.id} 
                className="group relative bg-white rounded-[2.5rem] p-4 border border-slate-100 hover:border-emerald-200 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(16,185,129,0.15)]"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-[#f1f5f9] mb-6">
                  <img 
                    src={item.imageUrl} 
                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700" 
                    alt={item.name} 
                  />
                  
                  {/* Floating Price Tag */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-white">
                    <span className="text-xs font-bold text-slate-400 mr-1">৳</span>
                    <span className="text-lg font-black text-slate-900">{item.price}</span>
                  </div>

                  {/* Quick Action Button */}
                  <button className="absolute bottom-4 right-4 w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg shadow-emerald-200 hover:bg-slate-900">
                    <Plus size={24} />
                  </button>
                </div>

                {/* Content Section */}
                <div className="px-3 pb-2">
                  <div className="flex items-center gap-1 mb-2">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} size={10} className="fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-[9px] font-bold text-slate-400 ml-1">(4.8)</span>
                  </div>
                  
                  <h3 className="font-black text-slate-800 uppercase text-sm tracking-tight mb-2 group-hover:text-emerald-600 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  
                  <p className="text-slate-500 text-[11px] font-medium leading-relaxed mb-6 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex -space-x-2">
                      {item.variants?.slice(0, 2).map((v, i) => (
                        <div key={i} className="px-3 py-1 bg-slate-100 border-2 border-white rounded-full text-[9px] font-black uppercase text-slate-600">
                          {v}
                        </div>
                      ))}
                    </div>
                    
                    <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all active:scale-95">
                      <ShoppingCart size={14} />
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}