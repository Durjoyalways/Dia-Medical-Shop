"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore"; 
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus, CreditCard, Wallet, Truck, MapPin, Phone, User } from "lucide-react";

export default function CartPage() {
  const { user } = useAuth(); // আপনার AuthContext এ যদি isAdmin থাকে তবে সেটিও এখানে ইম্পোর্ট করবেন
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // অ্যাডমিন চেক করার জন্য স্টেট
  
  const [paymentMethod, setPaymentMethod] = useState("");
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    address: ""
  });

  const paymentOptions = [
    { id: "cod", name: "Cash on Delivery", icon: <Truck size={20} /> },
    { id: "bkash", name: "bKash", icon: <Wallet size={20} /> },
    { id: "nagad", name: "Nagad", icon: <Wallet size={20} /> },
    { id: "card", name: "Card Payment", icon: <CreditCard size={20} /> },
  ];

  // --- অ্যাডমিন প্রোটেকশন লজিক ---
  useEffect(() => {
    setIsClient(true);
    
    const checkAdminAndCart = async () => {
      if (user) {
        // ফায়ারবেস থেকে ইউজারের রোল চেক করা হচ্ছে
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().role === "admin") {
          setIsAdmin(true);
          router.replace("/admin/all-orders"); // অ্যাডমিন হলে কার্ট থেকে বের করে দেওয়া হবে
          return;
        }
      }
      
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(savedCart);
    };

    checkAdminAndCart();
  }, [user, router]);

  // যদি অ্যাডমিন হয় বা ক্লায়েন্ট সাইড রেডি না হয় তবে কিছু দেখাবে না
  if (!isClient || isAdmin) return null;

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
    
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      return alert("Please fill up your shipping details!");
    }
    if (!paymentMethod) return alert("Please select a payment method!");
    
    setLoading(true);
    const tranId = `TXN-${Date.now()}`; 

    try {
      const baseOrderData = {
        userId: user.uid,
        userEmail: user.email,
        userName: shippingInfo.name,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        items: cartItems,
        totalAmount: total,
        status: "Pending",
        createdAt: serverTimestamp(),
      };

      if (paymentMethod === "cod") {
        const orderRef = doc(db, "orders", tranId); 
        await setDoc(orderRef, {
          ...baseOrderData,
          id: tranId,
          paymentMethod: "Cash on Delivery",
          paymentStatus: "Unpaid",
        });

        localStorage.removeItem("cart");
        alert("Order Placed Successfully!");
        router.push("/user/my-orders");

      } else {
        const orderRef = doc(db, "orders", tranId); 
        await setDoc(orderRef, {
          ...baseOrderData,
          id: tranId,
          tranId: tranId,
          paymentMethod: paymentMethod.toUpperCase(),
          paymentStatus: "Pending",
        });

        const res = await fetch("/api/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            totalAmount: total,
            tranId: tranId,
            cus_name: shippingInfo.name,
            cus_email: user.email,
            cus_phone: shippingInfo.phone,
            address: shippingInfo.address
          }),
        });

        const paymentData = await res.json();
        if (paymentData.url) {
          localStorage.removeItem("cart");
          window.location.replace(paymentData.url); 
        } else {
          throw new Error("Payment initialization failed");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = (idx: number) => {
    const newCart = cartItems.filter((_, i) => i !== idx);
    updateCart(newCart);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-12">
      <div className="max-w-6xl mx-auto">
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
            {/* Left Side: Items & Form */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <ShoppingBag size={14} /> Items in Cart
                </h2>
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0">
                        {item.imageUrl ? <img src={item.imageUrl} alt="" className="w-full h-full object-cover rounded-2xl" /> : <ShoppingBag size={24} />}
                      </div>
                      <div>
                        <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">{item.name}</h3>
                        <p className="text-emerald-600 font-black">৳ {item.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                      <button onClick={() => decrementQuantity(idx)} className="p-1 hover:text-emerald-500"><Minus size={18} /></button>
                      <span className="font-black w-8 text-center">{item.quantity || 1}</span>
                      <button onClick={() => incrementQuantity(idx)} className="p-1 hover:text-emerald-500"><Plus size={18} /></button>
                    </div>
                    <button onClick={() => removeFromCart(idx)} className="text-red-400 hover:text-red-600 p-2 transition-colors"><Trash2 size={20} /></button>
                  </div>
                ))}
              </div>

              {/* Shipping Form */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={14} className="text-emerald-500" /> Shipping Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase ml-2 text-slate-400">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input 
                        type="text" 
                        placeholder="John Doe"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-emerald-500 font-bold text-sm"
                        value={shippingInfo.name}
                        onChange={(e) => setShippingInfo({...shippingInfo, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase ml-2 text-slate-400">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input 
                        type="text" 
                        placeholder="017XXXXXXXX"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-emerald-500 font-bold text-sm"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase ml-2 text-slate-400">Full Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-slate-300" size={16} />
                    <textarea 
                      placeholder="House, Road, Area, City..."
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-emerald-500 font-bold text-sm h-24"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Payment & Summary */}
            <div className="space-y-6">
              <div className="bg-[#0f172a] p-8 rounded-[2.5rem] text-white shadow-2xl sticky top-24">
                <h2 className="text-xl font-black mb-6 uppercase text-emerald-400 italic">Checkout Summary</h2>
                <div className="mb-8 space-y-4">
                  <p className="text-[10px] font-black uppercase text-slate-400 text-center tracking-widest">Select Payment Method</p>
                  <div className="grid grid-cols-2 gap-3">
                    {paymentOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setPaymentMethod(option.id)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                          paymentMethod === option.id ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/10" : "border-slate-800 text-slate-500 hover:border-slate-700"
                        }`}
                      >
                        {option.icon}
                        <span className="text-[9px] font-black uppercase tracking-tighter">{option.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between text-2xl font-black border-t border-white/10 pt-4 mb-8">
                  <span className="uppercase text-sm self-center text-slate-400">Total</span>
                  <span className="text-emerald-400 tracking-tighter">৳ {total}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-emerald-500 text-[#0f172a] py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-emerald-500/20"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="animate-spin h-5 w-5 border-2 border-[#0f172a] border-t-transparent rounded-full"></span> Processing...
                    </div>
                  ) : "Place Order Now"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
              <ShoppingBag size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Your cart is empty</h2>
            <p className="text-slate-400 font-medium mb-8">Looks like you haven't added anything yet.</p>
            <Link href="/medicines" className="inline-block bg-emerald-500 text-[#0f172a] px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#0f172a] hover:text-white transition-all">
              Go Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}