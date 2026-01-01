"use client";
import Link from "next/link";
import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestore থেকে Role চেক করা
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
// LoginPage এর handleLogin ফাংশনের ভেতর এই অংশটুকু ঠিক করুন
if (userDoc.exists()) {
  const role = userDoc.data().role;
  if (role === "admin") {
    // আপনার ফোল্ডার স্ট্রাকচার অনুযায়ী সঠিক পাথ
    router.push("/admin/admin-dashboard"); 
  } else {
    router.push("/medicines");
  }
} else {
  // যদি Firestore-এ ডাটা না থাকে তবুও ইমেইল দিয়ে চেক করতে পারেন (Back-up লজিক)
  if (user.email === "admin@gmail.com") {
    router.push("/admin/admin-dashboard");
  } else {
    router.push("/medicines");
  }
}
    } catch (err: any) {
      setError(err.message.includes("auth/user-not-found") ? "User not found" : "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full bg-[#0f172a] rounded-[2rem] shadow-2xl overflow-hidden border border-slate-800 relative">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="p-8 md:p-12 relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500 rounded-xl rotate-45 mb-4 shadow-lg shadow-emerald-500/20">
              <span className="-rotate-45 font-black text-white text-2xl">+</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">Welcome <span className="text-emerald-500">Back</span></h2>
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs py-3 px-4 rounded-xl mb-6 text-center">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest ml-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-800/40 border border-slate-700 rounded-2xl py-3.5 px-4 text-white outline-none focus:border-emerald-500 transition-all" required placeholder="admin@dia.com" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest ml-1">Password</label>
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-800/40 border border-slate-700 rounded-2xl py-3.5 px-4 text-white outline-none focus:border-emerald-500 transition-all" required placeholder="••••••••" />
            </div>
            <button disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl shadow-xl transition-all flex justify-center items-center">
              {loading ? <span className="loading loading-spinner loading-sm"></span> : "Log in"}
            </button>
          </form>
          <p className="mt-8 text-center text-slate-400 text-sm">Don't have an account? <Link href="/register" className="text-emerald-500 font-bold underline">Register</Link></p>
        </div>
      </div>
    </div>
  );
}