// import { assets } from '../assets/assets'
// import { useNavigate } from 'react-router-dom'
// import { ArrowRight } from 'lucide-react'
// import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
// import { useEffect } from 'react'
// import gsap from 'gsap'

// const Navbar = () => {
//     const navigate = useNavigate()
//     const { user } = useUser()
//     const { openSignIn } = useClerk()
//     useEffect(() => {
//     gsap.from('.navbar', {
//         opacity: 0,
//         y: -50,
//         duration: 1,
//         ease: "power3.out"
//     });
// }, []);

//     return (
//         <div className='fixed z-5 w-full backdrop-blur-2xl flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32'>
//             <img src={assets.logo} alt="logo" className='w-32 sm:w-44 cursor-pointer' onClick={() => navigate('/')} />
//             {
//                 user ? <UserButton /> :
//                     (
//                         // ADD the onClick handler to this button
//                         <button 
//                             onClick={() => openSignIn()} 
//                             className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5'>
//                             Get started <ArrowRight className='w-4 h-4' />
//                         </button>
//                     )
//             }
//         </div>
//     )
// }

// export default Navbar;
// Navbar.jsx
import React, { useEffect, useRef, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import gsap from 'gsap';
import { ultimateAnimations } from '../utils/ultimate-animations';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navRef = useRef(null);
  const ctaRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const removeMagnetic = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 200);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced && navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (ctaRef.current && !isTouch) {
      removeMagnetic.current = ultimateAnimations.createMagneticField(ctaRef.current, 0.4, 140);
    }
    return () => {
      if (typeof removeMagnetic.current === 'function') removeMagnetic.current();
    };
  }, []);

  const handleCTA = () => {
    user ? navigate('/ai') : openSignIn();
  };

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 z-50 w-full backdrop-blur-xl bg-white/30 border-b border-white/10 flex items-center justify-between py-3 px-6 sm:px-20 transition-all duration-300"
      aria-label="Main navigation"
    >
      <img
        src={assets.logo}
        alt="Logo"
        className="cursor-pointer w-32 sm:w-44"
        onClick={() => navigate('/')}
      />

      <div>
        {loading ? (
          <div className="h-10 w-36 bg-gray-300 rounded-full animate-pulse" aria-hidden="true" />
        ) : user ? (
          <UserButton />
        ) : (
          <button
            ref={ctaRef}
            onClick={handleCTA}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ' ? handleCTA() : null)}
            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-full font-medium hover:scale-105 active:scale-95 transition-transform duration-200 focus-visible:ring-2 ring-offset-2 ring-primary/50"
          >
            <span>Get started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
