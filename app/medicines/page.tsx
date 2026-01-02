"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart, Eye, Search, Filter } from "lucide-react";

interface Medicine {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl?: string;
  description?: string;
}

// মূল কন্টেন্টকে একটি আলাদা ফাংশনে রাখা হয়েছে Suspense ব্যবহারের জন্য
function MedicinesContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL থেকে ক্যাটাগরি প্যারামিটার নেয়া (যেমন: /medicines?cat=syrup)
  const categoryFromUrl = searchParams.get("cat");

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    "All", 
    "medicine", 
    "syrup", 
    "baby-mother-care", 
    "diabetic-care",
    "personal-care", 
    "otc-medicine", 
    "family-planning", 
    "medical-devices",
    "injections" // আপনার ক্যাটাগরি গ্রিডে ইনজেকশন আছে তাই এখানেও যোগ করা হয়েছে
  ];

  // URL প্যারামিটার পরিবর্তন হলে selectedCategory স্টেট আপডেট হবে
  useEffect(() => {
    if (categoryFromUrl && categories.includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
    } else {
      setSelectedCategory("All");
    }
  }, [categoryFromUrl]);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "medicines"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const meds = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Medicine[];
      setMedicines(meds);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredMedicines = medicines.filter(med => {
    const categoryMatch = 
      selectedCategory === "All" || 
      med.category.toLowerCase() === selectedCategory.toLowerCase();
    
    const searchMatch = med.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return categoryMatch && searchMatch;
  });

  const handleAddToCart = (medicine: Medicine) => {
    if (user?.email === "admin@gmail.com") {
      router.push("/admin/orders");
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = cart.findIndex((item: any) => item.id === medicine.id);
    
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({ 
        id: medicine.id,
        name: medicine.name,
        price: medicine.price,
        imageUrl: medicine.imageUrl,
        category: medicine.category,
        quantity: 1 
      });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    router.push("/user/cart"); 
  };

  return (
    <div className="p-6 lg:p-12 max-w-7xl mx-auto min-h-screen bg-slate-50/50">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter">
            THE <span className="text-emerald-500 italic">VAULT.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] flex items-center gap-2">
            <span className="w-8 h-[2px] bg-emerald-500 inline-block"></span> 
            Premium Pharmacy Selection
          </p>
        </div>
        
        {/* Search & Filter UI */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white border-none rounded-2xl outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-emerald-500 w-full sm:w-64 font-bold shadow-sm transition-all"
            />
          </div>
          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-12 pr-10 py-4 bg-white border-none rounded-2xl outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-emerald-500 font-bold shadow-sm appearance-none cursor-pointer uppercase text-xs tracking-widest"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat.replace(/-/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40">
           <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-14">
          {filteredMedicines.map(medicine => (
            <div key={medicine.id} className="group flex flex-col h-full">
              <div className="relative aspect-[4/5] w-full bg-white rounded-[2rem] overflow-hidden shadow-sm transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 border border-slate-50">
                <img
                  src={medicine.imageUrl || "https://via.placeholder.com/600x750?text=Premium+Medicine"}
                  alt={medicine.name}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                />
                
                <div className="absolute top-6 left-6">
                  <span className="backdrop-blur-xl bg-white/70 text-slate-800 text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-sm border border-white/50">
                    {medicine.category.replace(/-/g, ' ')}
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="absolute bottom-6 right-6 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                  <Link href={`/medicines/${medicine.id}`} className="flex items-center gap-2 bg-white text-slate-900 px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-emerald-500 hover:text-white transition-colors">
                    <Eye size={14} /> View Details
                  </Link>
                </div>
              </div>

              <div className="pt-6 px-2 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-emerald-500 transition-colors duration-300">
                    {medicine.name}
                  </h3>
                  <span className="text-xl font-black text-slate-900 tracking-tighter">৳{medicine.price}</span>
                </div>
                
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6 leading-relaxed line-clamp-2">
                  {medicine.description || "Limited Edition Clinical Grade"}
                </p>
                
                <button 
                  onClick={() => handleAddToCart(medicine)}
                  className="w-full mt-auto flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:bg-emerald-500 transition-all active:scale-95"
                >
                  <ShoppingCart size={16} /> 
                  {user?.email === "admin@gmail.com" ? "View Orders" : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredMedicines.length === 0 && (
        <div className="text-center py-32 bg-white rounded-[4rem] border border-dashed border-slate-200">
          <p className="text-slate-300 font-black uppercase tracking-[0.3em] text-sm">No items found in this category</p>
        </div>
      )}
    </div>
  );
}

// Next.js এ useSearchParams ব্যবহার করলে Suspense দিয়ে র‍্যাপ করা বাধ্যতামূলক
export default function MedicinesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center uppercase font-black tracking-widest text-slate-400">Loading Pharmacy...</div>}>
      <MedicinesContent />
    </Suspense>
  );
}