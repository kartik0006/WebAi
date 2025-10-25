// import React, { useState } from 'react';
// import { Outlet, useNavigate } from 'react-router-dom';
// import { Menu, X } from 'lucide-react';
// import { assets } from '../assets/assets';
// import Sidebar from '../components/Sidebar';
// import { SignIn, useUser } from '@clerk/clerk-react';

// const Layout = () => {
//   const navigate = useNavigate();
//   const [sidebar, setSidebar] = useState(false);
//   const {user} = useUser(); 

//   return user? (
//     <div className='flex flex-col items-start justify-start h-screen'>
//       <nav className='w-full px-8 h-16 flex items-center justify-between border-b border-gray-200'>
//         <img  src={assets.logo} alt="Logo" className=" cursor-pointer w-32 sm:w-44" onClick={() => navigate('/')} />
//         {sidebar ? (
//           <X onClick={() => setSidebar(false)} className='w-6 h-6 text-gray-600 sm:hidden' />
//         ) : (
//           <Menu onClick={() => setSidebar(true)} className='w-6 h-6 text-gray-600 sm:hidden' />
//         )}
//       </nav>

//       <div className='flex-1 w-full flex h-[calc(100vh-64px)]'>
//         <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
//         <div className='flex-1 bg-[#F4F7FB] overflow-auto'>
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   ) : (
//     <div className='flex items-center justify-center h-screen'>
//       <SignIn/>
//     </div>
//   )
// };

// export default Layout;
// Layout.jsx
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { assets } from '../assets/assets';
import Sidebar from '../components/Sidebar';
import { SignIn, useUser } from '@clerk/clerk-react';

/**
 * Layout
 * - Keeps layout separate, hydration-safe, consistent header style
 * - Small responsive sidebar toggle for mobile
 * - Uses same visual language (glass, subtle blur) as Hero section
 */

const Layout = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Prevent SSR mismatch
    setIsClient(true);
  }, []);

  // close sidebar on route change (optional)
  useEffect(() => {
    const unlisten = () => setSidebarOpen(false);
    return () => unlisten();
  }, []);

  if (!isClient) return null;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f172a] to-[#0b0f19]">
        <SignIn redirectUrl="/" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#071025] text-slate-100">
      <header className="w-full h-16 sticky top-0 z-50 backdrop-blur-md bg-white/6 border-b border-white/6 flex items-center justify-between px-6 md:px-12">
        <button
          aria-label="Go home"
          onClick={() => navigate('/')}
          className="flex items-center gap-3"
        >
          <img src={assets.logo} alt="logo" className="w-28 sm:w-36" />
        </button>

        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            aria-label="Toggle menu"
            onClick={() => setSidebarOpen((s) => !s)}
            className="sm:hidden p-2 rounded-md hover:bg-white/4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          {/* Desktop placeholder for user controls (handled elsewhere) */}
        </div>
      </header>
      
      <div className="flex flex-1 h-[calc(100vh-64px)] overflow-hidden">
        <aside
          className={`transform bg-[#071021] border-r border-white/6 w-72 md:w-80 p-4 transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
          }`}
          aria-hidden={!sidebarOpen && window.innerWidth < 640}
        >
          <Sidebar sidebar={sidebarOpen} setSidebar={setSidebarOpen} />
        </aside>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
