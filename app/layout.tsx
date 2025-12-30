import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar/Navbar";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* ১. AuthProvider অবশ্যই সবার বাইরে থাকবে */}
        <AuthProvider>
          
          {/* ২. Navbar এখন AuthProvider এর ভেতরে, তাই সে useAuth পাবে */}
          <Navbar /> 
          
          <main>
            {children}
          </main>

        </AuthProvider>
      </body>
    </html>
  );
}