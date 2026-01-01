import Hero from "@/components/Home/Hero";
import CategoryGrid from "@/components/Home/CategoryGrid";
import FeaturedProducts from "@/components/Home/FeaturedProducts";
import WhyChooseUs from "@/components/Home/WhyChooseUs";
import PrescriptionBanner from "@/components/Home/PrescriptionBanner";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <WhyChooseUs />
      <PrescriptionBanner />
    </main>
  );
}