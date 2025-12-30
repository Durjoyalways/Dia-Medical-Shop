export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-[#0f172a] rounded-3xl p-10 text-white shadow-2xl">
        <h2 className="text-3xl font-black mb-6 text-emerald-400 uppercase">Contact Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <p className="text-gray-400">📍 Address: Road-05, Dhaka, Bangladesh</p>
            <p className="text-gray-400">📞 Phone: +880 1700 000000</p>
            <p className="text-gray-400">📧 Email: info@dia-medical.com</p>
          </div>
          <form className="space-y-4">
            <input type="text" placeholder="Your Name" className="input w-full bg-slate-800 border-slate-700 focus:border-emerald-500" />
            <textarea placeholder="Message" className="textarea w-full bg-slate-800 border-slate-700 focus:border-emerald-500 h-24"></textarea>
            <button className="btn btn-emerald-600 w-full text-white border-none">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}