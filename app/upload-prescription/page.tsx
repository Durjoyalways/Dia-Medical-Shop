// app/upload-prescription/page.tsx
"use client";
import { useState } from "react";
import { db, storage } from "@/lib/firebase";
// ✅ এখানে uploadBytesResumable এর জায়গায় uploadBytes ইমপোর্ট করা হয়েছে
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { UploadCloud, Loader2, ArrowLeft, CheckCircle } from "lucide-react";

export default function UploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
const handleUpload = async () => {
  // ১. ইউজার লগইন আছে কি না চেক
  if (!user) {
    alert("Please login first!");
    return;
  }

  // ২. এডমিন কি না চেক (আপনার এডমিন ইমেইলটি এখানে দিন)
  if (user.email === "admin@gmail.com") {
    alert("Admins are not allowed to upload prescriptions. Please use a customer account.");
    return;
  }

  if (!file) {
    alert("Please select a prescription image!");
    return;
  }

  setUploading(true);
  try {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = async () => {
      const base64Image = reader.result;

      // ৩. Firestore-এ সেভ করা
      await addDoc(collection(db, "prescriptions"), {
        userId: user.uid,
        userEmail: user.email,
        prescriptionData: base64Image, 
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setDone(true);
      setTimeout(() => router.push("/"), 3000);
    };
  } catch (error) {
    console.error("Upload Error:", error);
    alert("Failed to upload!");
  } finally {
    setUploading(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl max-w-md w-full border border-slate-100">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-slate-400 mb-6 font-bold hover:text-emerald-500 transition-colors"
        >
          <ArrowLeft size={20}/> Back
        </button>

        {done ? (
          <div className="text-center py-10">
            <CheckCircle className="mx-auto text-emerald-500 mb-4" size={60} />
            <h2 className="text-2xl font-black uppercase tracking-tighter">Success!</h2>
            <p className="text-slate-500 font-medium">We will review your prescription soon.</p>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-3xl font-black mb-8 uppercase tracking-tighter">
              Upload <span className="text-emerald-500">Prescription</span>
            </h1>
            
            <label className="block border-4 border-dashed border-slate-100 rounded-[2rem] p-12 cursor-pointer hover:border-emerald-200 transition-all mb-8 bg-slate-50/50 group">
              <UploadCloud size={48} className="mx-auto text-slate-300 mb-4 group-hover:scale-110 group-hover:text-emerald-500 transition-all" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                {file ? (
                  <span className="text-emerald-600">{file.name}</span>
                ) : (
                  "Select JPG, PNG or PDF"
                )}
              </p>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*,.pdf" 
                onChange={(e) => setFile(e.target.files?.[0] || null)} 
              />
            </label>

            <button 
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-500 disabled:bg-slate-200 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Processing...
                </>
              ) : (
                "Submit Order"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}