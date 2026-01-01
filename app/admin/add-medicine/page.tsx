"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Plus, X, UploadCloud, Save, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";

// Cloudinary Config
const CLOUD_NAME = "dzmdvq3hs"; 
const UPLOAD_PRESET = "dia_medical_preset"; 

export default function AddMedicine() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Medicine",
    imageUrl: "",
    description: "",
  });

  const [variants, setVariants] = useState<string[]>([]);
  const [variantInput, setVariantInput] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: data,
      });
      const fileData = await res.json();
      if (fileData.secure_url) {
        setFormData((prev) => ({ ...prev, imageUrl: fileData.secure_url }));
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const addVariant = () => {
    if (variantInput.trim() !== "" && !variants.includes(variantInput)) {
      setVariants([...variants, variantInput]);
      setVariantInput("");
    }
  };

  const removeVariant = (val: string) => {
    setVariants(variants.filter((v) => v !== val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) return alert("Please upload an image first!");
    setLoading(true);

    try {
      await addDoc(collection(db, "medicines"), {
        name: formData.name,
        category: formData.category,
        imageUrl: formData.imageUrl,
        description: formData.description,
        price: Number(formData.price),
        variants: variants,
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      setTimeout(() => router.push("/medicines"), 2000);
    } catch (error) {
      console.error("Firestore Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-12 min-h-screen">
      <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-slate-100 p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-slate-200/50">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Product Name</label>
            <input required type="text" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Category</label>
            <select className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(e) => setFormData({...formData, category: e.target.value})}>
              <option value="Medicine">Medicine</option>
              <option value="Diaper">Diaper</option>
              <option value="HealthCare">Health Care</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Product Image</label>
          <div className="flex items-center gap-6 p-6 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
            {formData.imageUrl ? (
              <img src={formData.imageUrl} className="w-24 h-24 object-cover rounded-2xl border" alt="Preview" />
            ) : (
              <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center text-slate-300 border border-slate-100">
                <ImageIcon size={32} />
              </div>
            )}
            
            <div className="flex-1">
              <input type="file" id="imageInput" hidden onChange={handleImageUpload} accept="image/*" />
              <label htmlFor="imageInput" className="inline-flex items-center gap-2 bg-white text-slate-800 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest cursor-pointer shadow-sm hover:bg-emerald-500 hover:text-white transition-all border border-slate-100">
                <UploadCloud size={16} />
                {uploading ? "Uploading..." : "Select File"}
              </label>
            </div>
          </div>
        </div>

        <div className="p-8 bg-emerald-50/50 rounded-[2.5rem] border border-emerald-100/50">
          <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-4">
            {formData.category === "Medicine" ? "Add Strength (e.g. 500mg)" : "Add Sizes (e.g. S, M, XL)"}
          </label>
          <div className="flex gap-4">
            <input 
              type="text" 
              value={variantInput} 
              className="flex-1 px-6 py-4 rounded-2xl bg-white border-none font-black shadow-sm outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(e) => setVariantInput(e.target.value)} 
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addVariant())}
              placeholder="e.g. 500mg"
            />
            <button type="button" onClick={addVariant} className="bg-emerald-500 text-white px-6 rounded-2xl hover:bg-slate-900 transition-colors">
              <Plus size={24} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {variants.map((v) => (
              <span key={v} className="bg-white border border-emerald-200 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-2">
                {v} <X size={14} className="cursor-pointer" onClick={() => removeVariant(v)} />
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Price (৳)</label>
            <input required type="number" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(e) => setFormData({...formData, price: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Description</label>
            <input required type="text" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>
        </div>

        <button disabled={loading || uploading || success} type="submit" className={`w-full py-6 rounded-3xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl ${success ? "bg-emerald-500 text-white" : "bg-slate-900 text-white hover:bg-emerald-500 active:scale-95"}`}>
          {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : success ? <CheckCircle2 /> : <><Save size={20} /> <span>Save to Database</span></>}
        </button>
      </form>
    </div>
  );
}