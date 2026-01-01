"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus, CreditCard, Wallet, Truck } from "lucide-react";

export default function CartPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // পেমেন্ট মেথড স্টেট
  const [paymentMethod, setPaymentMethod] = useState("");

  const paymentOptions = [
    { id: "cod", name: "Cash on Delivery", icon: <Truck size={20} /> },
    { id: "bkash", name: "bKash", icon: <Wallet size={20} /> },
    { id: "nagad", name: "Nagad", icon: <Wallet size={20} /> },
    { id: "card", name: "Card Payment", icon: <CreditCard size={20} /> },
  ];

  useEffect(() => {
    setIsClient(true);
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(savedCart);
  }, []);

  const updateCart = (newCart: any[]) => {
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const incrementQuantity = (idx: number) => {
    const newCart = [...cartItems];
    newCart[idx].quantity = (newCart[idx].quantity || 1) + 1;
    updateCart(newCart);
  };

  const decrementQuantity = (idx: number) => {
    const newCart = [...cartItems];
    if (newCart[idx].quantity > 1) {
      newCart[idx].quantity -= 1;
      updateCart(newCart);
    }
  };

  const total = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);

  const handleCheckout = async () => {
    if (!user) return router.push("/login");
    if (cartItems.length === 0) return alert("Your cart is empty!");
    if (!paymentMethod) return alert("Please select a payment method before placing order!");
    
    setLoading(true);
    try {
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        userEmail: user.email,
        items: cartItems,
        totalAmount: total,
        paymentMethod: paymentMethod, // ডাটাবেসে পেমেন্ট মেথড সেভ হবে
        status: "Pending",
        createdAt: serverTimestamp(),
      });

      localStorage.removeItem("cart");
      alert("Order Placed Successfully!");
      router.push("/user/my-orders");
    } catch (error) {
      console.error("Order Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = (idx: number) => {
    const newCart = cartItems.filter((_, i) => i !== idx);
    updateCart(newCart);
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
            Your <span className="text-emerald-500">Cart</span>
          </h1>
          <Link href="/medicines" className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 font-bold text-sm transition-colors">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Item List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0 overflow-hidden">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag size={24} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">{item.name}</h3>
                      <p className="text-emerald-600 font-black">৳ {item.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                    <button onClick={() => decrementQuantity(idx)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <Minus size={18} />
                    </button>
                    <span className="font-black text-slate-800 min-w-[20px] text-center">{item.quantity || 1}</span>
                    <button onClick={() => incrementQuantity(idx)} className="text-slate-400 hover:text-emerald-500 transition-colors">
                      <Plus size={18} />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
                    <p className="font-black text-slate-800 sm:hidden">Subtotal: ৳ {item.price * (item.quantity || 1)}</p>
                    <button onClick={() => removeFromCart(idx)} className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary + Payment Selection */}
            <div className="space-y-6">
              <div className="bg-[#0f172a] p-8 rounded-[2.5rem] text-white shadow-2xl sticky top-24">
                <h2 className="text-xl font-black mb-6 uppercase tracking-widest text-emerald-400">Order Details</h2>
                
                {/* Payment Methods */}
                <div className="mb-8">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 text-center">Select Payment Method</p>
                  <div className="grid grid-cols-2 gap-3">
                    {paymentOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setPaymentMethod(option.id)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                          paymentMethod === option.id 
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" 
                          : "border-slate-800 hover:border-slate-700 text-slate-500"
                        }`}
                      >
                        {option.icon}
                        <span className="text-[9px] font-black uppercase tracking-tighter">{option.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-slate-400 font-medium uppercase text-[10px] tracking-widest">
                    <span>Subtotal</span>
                    <span>৳ {total}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 font-medium uppercase text-[10px] tracking-widest">
                    <span>Delivery Fee</span>
                    <span className="text-emerald-500 uppercase">Free</span>
                  </div>
                  <div className="h-[1px] bg-white/10 my-4"></div>
                  <div className="flex justify-between text-2xl font-black">
                    <span>Total</span>
                    <span className="text-emerald-400">৳ {total}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={loading || cartItems.length === 0}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-[#0f172a] py-5 rounded-2xl font-black uppercase tracking-[0.1em] transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-emerald-500/20"
                >
                  {loading ? "Processing..." : "Place Order Now"}
                </button>
                
                <p className="text-[10px] text-center text-slate-500 mt-6 font-bold uppercase tracking-[0.2em]">
                  Safe & Secure Delivery • Dia Drug House
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <ShoppingBag size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
            <p className="text-slate-400 mb-8 font-medium">Looks like you haven't added anything yet.</p>
            <Link href="/medicines" className="inline-block bg-[#0f172a] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-500 transition-colors">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}