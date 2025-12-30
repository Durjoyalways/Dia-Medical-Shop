"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // LocalStorage থেকে কার্ট ডাটা লোড করা
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(savedCart);
  }, []);

  const total = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);

  const handleCheckout = async () => {
    if (!user) return router.push("/login");
    setLoading(true);

    try {
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        userEmail: user.email,
        items: cartItems,
        totalAmount: total,
        status: "Pending",
        createdAt: new Date(),
      });

      localStorage.removeItem("cart"); // অর্ডার সফল হলে কার্ট খালি করা
      alert("Order Placed Successfully!");
      router.push("/my-orders");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-12 max-w-5xl mx-auto">
      <h1 className="text-3xl font-black mb-10 text-slate-800 uppercase">Your <span className="text-emerald-500">Cart</span></h1>
      
      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-800">{item.name}</h3>
                  <p className="text-emerald-600 font-bold text-sm">৳ {item.price}</p>
                </div>
                <button 
                  onClick={() => {
                    const newCart = cartItems.filter((_, i) => i !== idx);
                    setCartItems(newCart);
                    localStorage.setItem("cart", JSON.stringify(newCart));
                  }}
                  className="text-red-400 hover:text-red-600 text-xs font-bold uppercase"
                >Remove</button>
              </div>
            ))}
          </div>

          <div className="bg-[#0f172a] p-8 rounded-[2.5rem] text-white h-fit shadow-2xl">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="flex justify-between mb-4 text-slate-400">
              <span>Subtotal</span>
              <span>৳ {total}</span>
            </div>
            <div className="border