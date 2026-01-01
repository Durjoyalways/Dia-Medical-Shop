import { Truck, ShieldCheck, Headphones } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      title: "Fast Delivery",
      desc: "Get your medicines delivered within 60 minutes in the city area.",
      icon: <Truck className="w-8 h-8 text-emerald-500" />,
      bg: "bg-emerald-50"
    },
    {
      title: "100% Genuine",
      desc: "All products are sourced directly from authorized manufacturers.",
      icon: <ShieldCheck className="w-8 h-8 text-blue-500" />,
      bg: "bg-blue-50"
    },
    {
      title: "24/7 Support",
      desc: "Our expert pharmacists are always available to help you.",
      icon: <Headphones className="w-8 h-8 text-purple-500" />,
      bg: "bg-purple-50"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">Why Choose <span className="text-emerald-500">Dia Medical?</span></h2>
          <p className="text-slate-500 mt-4 font-medium">Providing the best healthcare services for you and your family.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((item, idx) => (
            <div key={idx} className="p-10 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 bg-slate-50/50">
              <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mb-8`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-black text-slate-800 uppercase mb-4">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}