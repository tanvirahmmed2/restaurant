import CartBar from "@/components/bar/CartBar";
import Footer from "@/components/bar/Footer";
import Navbar from "@/components/bar/Navbar";

export default function MainLayout({ children }) {
  return (
    <div className="w-full min-h-screen relative pt-16 text-black bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-50 via-white to-gray-50 flex flex-col selection:bg-black selection:text-white">
      <Navbar /> 
      <main className="flex-grow w-full flex flex-col">
        {children}
      </main>
      <CartBar/>
      <Footer/>
    </div>
  )
}