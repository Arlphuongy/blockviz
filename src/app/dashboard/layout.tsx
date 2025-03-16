"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#1a1625]">
      <div className="pt-20">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-white mb-6">
            Wallet Transaction Visualizer
          </h1>
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
}