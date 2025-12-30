"use client";
import Link from "next/link";
import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: fullName });

    // Firestore এ ইউজার ডাটা সেভ
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      fullName,
      email,
      phone,
      role: "user",
      createdAt: new Date()
    });

    alert("Registration Successful! Redirecting...");
    router.push("/");

  } catch (err: any) {
    // --- এই অংশটুকু আপডেট করা হয়েছে ---
    console.error("FIREBASE ERROR CODE:", err.code); 
    setError(err.message);
    alert("Error: " + err.message);
    // ---------------------------------
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-16">
      <div className="max-w-xl w-full bg-[#0f172a] rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-800 relative p-8 md:p-14">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-500 rounded-2xl rotate-45 mb-6 shadow-lg shadow-emerald-500/30">
            <span className="-rotate-45 font-black text-white text-3xl">+</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">Join <span className="text-emerald-500">Dia</span></h2>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-slate-800/40 border border-slate-700 rounded-2xl py-3.5 px-4 text-white outline-none focus:border-emerald-500" required />
            <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-800/40 border border-slate-700 rounded-2xl py-3.5 px-4 text-white outline-none focus:border-emerald-500" required />
          </div>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-800/40 border border-slate-700 rounded-2xl py-3.5 px-4 text-white outline-none focus:border-emerald-500" required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-800/40 border border-slate-700 rounded-2xl py-3.5 px-4 text-white outline-none focus:border-emerald-500" required />
          
          <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-xl transition-all">
            {loading ? <span className="loading loading-spinner"></span> : "Create My Account"}
          </button>
        </form>
        <p className="mt-8 text-center text-slate-400">Already using DIA? <Link href="/login" className="text-emerald-500 font-bold underline">Sign In</Link></p>
      </div>
    </div>
  );
}