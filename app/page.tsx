// app/page.tsx

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-5xl font-black text-slate-800 tracking-tighter mb-4">
        WELCOME TO <span className="text-emerald-500">DIA</span>
      </h1>
      <p className="text-slate-600 max-w-xl text-lg mb-8 font-medium">
        আপনার প্রয়োজনীয় সকল ঔষধ এবং স্বাস্থ্যসেবা এখন এক ক্লিকেই। 
        দ্রুত ডেলিভারি এবং অরিজিনাল পণ্যের নিশ্চয়তা।
      </p>
      <div className="flex gap-4">
        <button className="btn btn-emerald-600 bg-emerald-600 hover:bg-emerald-500 text-white border-none px-8 rounded-lg shadow-lg">
          ঔষধ দেখুন
        </button>
        <button className="btn btn-outline border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 rounded-lg">
          আমাদের সম্পর্কে
        </button>
      </div>
    </div>
  );
}