"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { Plus, X, UploadCloud, Save, CheckCircle2, Image as ImageIcon, Trash2, Search, Package, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

const CLOUD_NAME = "dzmdvq3hs"; 
const UPLOAD_PRESET = "dia_medical_preset"; 

export default function AddMedicine() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [medicines, setMedicines] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "", // ডিফল্ট খালি রাখা হয়েছে ভ্যালিডেশনের জন্য
    imageUrl: "",
    description: "",
  });

  const [variants, setVariants] = useState<string[]>([]);
  const [variantInput, setVariantInput] = useState("");

// categoryOptions অ্যারেতে এটি আপডেট করুন
const categoryOptions = [
  { label: "💊 Medicine", value: "medicine" },
  { label: "🥤 Syrup & Liquid", value: "syrup" },
  { label: "👶 Baby & Mother Care", value: "baby-mother-care" },
  { label: "✨ Personal Care", value: "personal-care" }, // নতুন যুক্ত
  { label: "🩸 Diabetic Care", value: "diabetic-care" },
  { label: "🩹 OTC Medicine", value: "otc-medicine" },
  { label: "🛡️ Family Planning", value: "family-planning" },
  { label: "🏥 Medical Devices", value: "medical-devices" },
];

  const fetchMedicines = async () => {
    setLoadingList(true);
    try {
      const q = query(collection(db, "medicines"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMedicines(data);
    } catch (error) { console.error(error); } finally { setLoadingList(false); }
  };

  useEffect(() => { fetchMedicines(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: data });
      const fileData = await res.json();
      if (fileData.secure_url) setFormData((prev) => ({ ...prev, imageUrl: fileData.secure_url }));
    } catch (err) { alert("Upload failed!"); } finally { setUploading(false); }
  };

  const addVariant = () => {
    if (variantInput.trim() !== "" && !variants.includes(variantInput)) {
      setVariants([...variants, variantInput]);
      setVariantInput("");
    }
  };

  const removeVariant = (val: string) => setVariants(variants.filter((v) => v !== val));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) return alert("Upload an image first!");
    if (!formData.category) return alert("Please select a category!");
    
    setLoading(true);
    try {
      await addDoc(collection(db, "medicines"), {
        ...formData,
        price: Number(formData.price),
        variants,
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      fetchMedicines();
      setFormData({ name: "", price: "", category: "", imageUrl: "", description: "" });
      setVariants([]);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}?`)) return;
    try {
      await deleteDoc(doc(db, "medicines", id));
      setMedicines(prev => prev.filter(m => m.id !== id));
    } catch (error) { alert("Error deleting"); }
  };

  const filteredMedicines = medicines.filter(m => 
    m.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-10 font-sans">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Section */}
        <div className="mb-10 flex items-center gap-4 px-4">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 text-white">
            <Package size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Inventory <span className="text-indigo-600">Portal</span></h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Dia Medical Management</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          
          {/* LEFT: FORM SECTION */}
          <div className="xl:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-slate-100 p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(79,70,229,0.1)] sticky top-10 overflow-hidden relative">
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 -z-0"></div>

              <div className="relative z-10 flex items-center gap-2 mb-2">
                <Sparkles className="text-amber-500" size={20} />
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">New Product Entry</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Product Name</label>
                  <input required type="text" value={formData.name} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all outline-none font-bold text-slate-700 shadow-inner"
                    placeholder="e.g. Napa Extra" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Category</label>
                  <select required value={formData.category} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 transition-all outline-none font-bold text-slate-700 shadow-inner cursor-pointer"
                    onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option value="">Select Category</option>
                    {categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image Upload Area */}
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Media Asset</label>
                <div className={`p-6 border-2 border-dashed rounded-[2rem] transition-all flex items-center gap-6 ${formData.imageUrl ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-slate-50/50'}`}>
                  {formData.imageUrl ? (
                    <img src={formData.imageUrl} className="w-24 h-24 object-cover rounded-2xl shadow-lg border-2 border-white" alt="" />
                  ) : (
                    <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm border border-slate-100">
                      <ImageIcon size={32} />
                    </div>
                  )}
                  <div className="flex-1">
                    <input type="file" id="imageInput" hidden onChange={handleImageUpload} accept="image/*" />
                    <label htmlFor="imageInput" className="bg-white text-indigo-600 border border-indigo-100 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest cursor-pointer shadow-sm hover:bg-indigo-600 hover:text-white transition-all">
                      {uploading ? "Transmitting..." : "Upload Photo"}
                    </label>
                  </div>
                </div>
              </div>

              {/* Variant Box */}
              <div className="p-8 bg-indigo-50/50 border border-indigo-100/50 rounded-[2rem]">
                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block mb-4">
                  Product Variations (Specs)
                </label>
                <div className="flex gap-3">
                  <input type="text" value={variantInput} className="flex-1 px-6 py-4 rounded-xl bg-white border-none font-bold shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    onChange={(e) => setVariantInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addVariant())} placeholder="e.g. 500mg or Large" />
                  <button type="button" onClick={addVariant} className="bg-indigo-600 text-white px-6 rounded-xl hover:bg-slate-900 transition-colors shadow-lg shadow-indigo-100">
                    <Plus size={24} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {variants.map((v) => (
                    <span key={v} className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-xs font-black uppercase flex items-center gap-2 border border-indigo-100">
                      {v} <X size={14} className="cursor-pointer" onClick={() => removeVariant(v)} />
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Price (৳)</label>
                  <input required type="number" value={formData.price} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-black text-emerald-600 text-lg outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                    onChange={(e) => setFormData({...formData, price: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Short Bio</label>
                  <input required type="text" value={formData.description} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
                    onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>
              </div>

              <button disabled={loading || uploading || success} type="submit" className={`w-full py-6 rounded-[1.8rem] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl ${success ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-indigo-600 active:scale-95 shadow-indigo-100'}`}>
                {loading ? <Loader2 className="animate-spin" /> : success ? <CheckCircle2 /> : <Save size={20} />}
                <span>{success ? "Success" : "Deploy Product"}</span>
              </button>
            </form>
          </div>

          {/* RIGHT: LIST SECTION */}
          <div className="xl:col-span-2">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 h-full flex flex-col">
              <div className="flex flex-col gap-6 mb-8">
                <h2 className="text-xl font-black text-slate-800 uppercase italic">Active Stock</h2>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" placeholder="Quick find..." className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" 
                    onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
              </div>

              <div className="space-y-4 overflow-y-auto max-h-[850px] pr-2 flex-1">
                {loadingList ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 className="animate-spin text-indigo-500" size={32} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Refreshing...</p>
                  </div>
                ) : filteredMedicines.map((med) => (
                  <div key={med.id} className="group flex items-center justify-between p-4 bg-slate-50 border border-transparent hover:border-indigo-100 rounded-[1.8rem] transition-all hover:bg-white hover:shadow-xl hover:shadow-indigo-50">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border border-slate-100 p-1 shadow-sm group-hover:scale-110 transition-transform">
                        {med.imageUrl ? <img src={med.imageUrl} className="w-full h-full object-cover rounded-xl" alt="" /> : <Package className="m-auto mt-4 text-slate-200" />}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-sm uppercase tracking-tighter group-hover:text-indigo-600 transition-colors">{med.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-600 font-black text-xs">৳{med.price}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-200/50 px-2 py-0.5 rounded"> {med.category}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(med.id, med.name)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}