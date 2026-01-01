"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { ShoppingCart, ArrowLeft, ShieldCheck, Check, Info } from "lucide-react"; 
import Link from "next/link";

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter(); // কার্ট পেজে পাঠানোর জন্য
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const docRef = doc(db, "medicines", id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProduct({ id: docSnap.id, ...data });
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  // --- Add to Cart Function ---
const addToCart = () => {
    if (!product) return;

    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    
    // চেক করা হচ্ছে একই ID এবং একই Variant আগে থেকে আছে কি না
    const existingItemIndex = savedCart.findIndex(
      (item: any) => item.id === product.id && item.variant === selectedVariant
    );

    if (existingItemIndex > -1) {
      // থাকলে শুধু Quantity বাড়বে
      savedCart[existingItemIndex].quantity += 1;
    } else {
      // না থাকলে নতুন অবজেক্ট যোগ হবে
      savedCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        variant: selectedVariant, 
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(savedCart));
    
    // সঠিক পাথটি এখানে দেওয়া হয়েছে:
    router.push("/user/cart"); 
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  );

  if (!product) return <div className="p-20 text-center text-red-500 font-black">Item not found!</div>;

  const variantLabel = product.category === "Diaper" ? "Select Size" : "Select Strength/Dosage";

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-12 min-h-screen bg-white">
      <Link href="/medicines" className="flex items-center gap-2 text-slate-400 hover:text-emerald-500 mb-10 font-black uppercase text-xs tracking-widest transition-all">
        <ArrowLeft size={16} /> Back to Store
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Product Image Section */}
        <div className="relative group">
          <div className="aspect-square rounded-[3rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-inner">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-700" 
            />
          </div>
          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute top-6 right-6 bg-red-500 text-white text-[10px] font-black px-4 py-2 rounded-2xl animate-pulse">
              Low Stock: Only {product.stock} left
            </span>
          )}
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col justify-center space-y-8">
          <div>
            <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-[0.2em]">
              {product.category}
            </span>
            <h1 className="text-5xl font-black text-slate-800 mt-4 uppercase tracking-tighter leading-none">
              {product.name}
            </h1>
            <p className="text-slate-400 font-medium mt-4 leading-relaxed line-clamp-3">
              {product.description}
            </p>
          </div>

          {product.variants && product.variants.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{variantLabel}</p>
                {product.category === "Diaper" && <button className="text-[10px] font-black text-emerald-500 underline uppercase">Size Guide</button>}
              </div>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((v: string) => (
                  <button
                    key={v}
                    onClick={() => setSelectedVariant(v)}
                    className={`min-w-[70px] h-[70px] rounded-2xl font-black text-sm transition-all flex flex-col items-center justify-center border-2 
                      ${selectedVariant === v 
                        ? "border-emerald-500 bg-emerald-50 text-emerald-600 shadow-lg shadow-emerald-500/10" 
                        : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
                      }`}
                  >
                    <span className="uppercase">{v}</span>
                    {selectedVariant === v && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1"></div>}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-end gap-2 py-6 border-y border-slate-50">
            <span className="text-5xl font-black text-slate-900 tracking-tighter">৳{product.price}</span>
            <span className="text-slate-400 font-black uppercase text-[10px] mb-2">Including VAT</span>
          </div>

          <div className="flex gap-4">
            {/* --- onClick যুক্ত করা হয়েছে এখানে --- */}
            <button 
              onClick={addToCart}
              disabled={product.stock === 0}
              className={`flex-1 py-6 rounded-[2rem] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl 
                ${product.stock === 0 
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                  : "bg-emerald-500 text-[#0f172a] hover:bg-slate-900 hover:text-white shadow-emerald-500/20 active:scale-95"
                }`}
            >
              <ShoppingCart size={20} />
              {product.stock === 0 ? "Out of Stock" : `Add ${selectedVariant} to Cart`}
            </button>
          </div>

          <div className="flex items-center gap-6 pt-4">
             <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase">
                <ShieldCheck size={16} className="text-emerald-500" /> Authentic Product
             </div>
             <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase">
                <Info size={16} className="text-blue-500" /> Easy Returns
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}