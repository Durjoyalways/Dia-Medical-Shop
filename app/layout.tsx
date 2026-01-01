import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer"; // ১. ফুটার ইম্পোর্ট করুন
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen"> 
        {/* AuthProvider সবার বাইরে থাকবে */}
        <AuthProvider>
          
          {/* Navbar এখন AuthProvider এর ভেতরে */}
          <Navbar /> 
          
          {/* flex-grow নিশ্চিত করবে যে কন্টেন্ট কম থাকলেও ফুটার সবসময় নিচে থাকবে */}
          <main className="flex-grow">
            {children}
          </main>

          {/* ২. ফুটারটি এখানে বসিয়ে দিন */}
          <Footer />

        </AuthProvider>
      </body>
    </html>
  );
}