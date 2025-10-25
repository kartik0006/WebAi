
// import React, { useEffect, useRef } from 'react';
// import { Protect, useClerk, useUser } from '@clerk/clerk-react';
// import { Eraser, FileText, Hash, House, Image, Scissors, SquarePen, Users, LogOut, Globe } from 'lucide-react';
// import { NavLink, useLocation } from 'react-router-dom';
// import { gsap } from 'gsap';
// import './Sidebar.css';

// const navItems = [
//   { to: '/', label: 'Home Page', Icon: Globe },
//   { to: '/ai', label: 'Dashboard', Icon: House },
//   { to: '/ai/write-article', label: 'Write Article', Icon: SquarePen },
//   { to: '/ai/blog-titles', label: 'Blog Titles', Icon: Hash },
//   { to: '/ai/generate-images', label: 'Generate Images', Icon: Image },
//   { to: '/ai/remove-background', label: 'Remove Background', Icon: Eraser },
//   { to: '/ai/remove-object', label: 'Remove Object', Icon: Scissors },
//   { to: '/ai/review-resume', label: 'Review Resume', Icon: FileText },
//   { to: '/ai/community', label: 'Community', Icon: Users },
// ];

// const Sidebar = ({ sidebar = true, setSidebar = () => {} }) => {
//   const { user } = useUser();
//   const { signOut, openUserProfile } = useClerk();
//   const location = useLocation();

//   const sidebarRef = useRef(null);
//   const userSectionRef = useRef(null);
//   const navItemsRef = useRef([]);
//   const footerRef = useRef(null);

//   // Use a fallback "guest" user for local testing
//   const safeUser = user || {
//     fullName: "Guest User",
//     imageUrl: "https://ui-avatars.com/api/?name=Guest&background=3C81F6&color=fff",
//   };

//   useEffect(() => {
//     if (!sidebarRef.current) return;

//     navItemsRef.current.forEach(item => gsap.killTweensOf(item));

//     const ctx = gsap.context(() => {
//       const tl = gsap.timeline();

//       tl.fromTo(userSectionRef.current,
//         { opacity: 0, y: -30, scale: 0.8 },
//         { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
//       );

//       tl.fromTo(navItemsRef.current,
//         { opacity: 0, x: -50 },
//         { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
//         "-=0.3"
//       );

//       tl.fromTo(footerRef.current,
//         { opacity: 0, y: 30 },
//         { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
//         "-=0.2"
//       );

//       const activeItem = navItemsRef.current.find(item =>
//         item?.getAttribute('data-active') === 'true'
//       );

//       if (activeItem) {
//         gsap.killTweensOf(activeItem);
//         gsap.to(activeItem, {
//           y: -2,
//           boxShadow: "0 10px 25px -3px rgba(59, 130, 246, 0.2)",
//           duration: 0.3,
//           repeat: -1,
//           yoyo: true,
//           ease: "sine.inOut"
//         });
//       }
//     }, sidebarRef);

//     return () => ctx.revert();
//   }, [location.pathname]);

//   const addToNavRefs = el => {
//     if (el && !navItemsRef.current.includes(el)) navItemsRef.current.push(el);
//   };

//   const handleNavClick = () => {
//     if (window.innerWidth < 768) setSidebar(false);
//     gsap.to(navItemsRef.current, {
//       scale: 0.98,
//       duration: 0.1,
//       yoyo: true,
//       repeat: 1,
//       ease: "power2.inOut"
//     });
//   };

//   const handleUserProfileClick = () => {
//     gsap.to(userSectionRef.current, {
//       scale: 0.95,
//       duration: 0.1,
//       yoyo: true,
//       repeat: 1,
//       ease: "power2.inOut",
//       onComplete: () => openUserProfile?.()
//     });
//   };

//   const handleSignOut = () => {
//     gsap.to('.sign-out-btn', {
//       rotation: 180,
//       duration: 0.5,
//       ease: "back.out(1.7)",
//       onComplete: () => signOut?.()
//     });
//   };

//   return (
//     <div
//       ref={sidebarRef}
//       className={`advanced-sidebar ${sidebar ? 'sidebar-open' : 'sidebar-closed'}`}
//       role="navigation"
//       aria-label="Main navigation"
//     >
//       <div className='sidebar-content'>
//         {/* User Section */}
//         <div
//           ref={userSectionRef}
//           className='user-section'
//           onClick={handleUserProfileClick}
//           role="button"
//           tabIndex={0}
//           aria-label="Open user profile"
//         >
//           <img
//             src={safeUser.imageUrl}
//             alt={`${safeUser.fullName}'s avatar`}
//             className='user-avatar'
//           />
//           <h1 className='user-name'>{safeUser.fullName}</h1>
//           <div className='user-status'>
//             <div className='status-dot'></div>
//             <span>Online</span>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className='navigation-menu'>
//           {navItems.map(({ to, label, Icon }) => {
//             const isActive = location.pathname === to || location.pathname.startsWith(to);
//             return (
//               <NavLink
//                 key={to}
//                 to={to}
//                 className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
//                 ref={addToNavRefs}
//                 data-active={isActive}
//                 onClick={handleNavClick}
//               >
//                 <div className='nav-icon-wrapper'>
//                   <Icon className='nav-icon' />
//                   <div className='nav-glow'></div>
//                 </div>
//                 <span className='nav-label'>{label}</span>
//                 <div className='nav-underline'></div>
//                 {isActive && <div className='active-indicator' aria-hidden="true"></div>}
//               </NavLink>
//             );
//           })}
//         </nav>
//       </div>

//       {/* Footer */}
//       <div ref={footerRef} className='sidebar-footer'>
//         <div className='user-profile-mini' onClick={handleUserProfileClick}>
//           <img
//             src={safeUser.imageUrl}
//             alt={`${safeUser.fullName}'s avatar`}
//             className='user-avatar-mini'
//           />
//           <div className='user-info-mini'>
//             <h2 className='user-name-mini'>{safeUser.fullName}</h2>
//             <p className='user-plan'>
//               <Protect plan='premium' fallback="Free Plan">Premium Plan</Protect>
//             </p>
//           </div>
//         </div>
//         <button onClick={handleSignOut} className='sign-out-btn'>
//           <LogOut className='sign-out-icon' />
//           <span className='sign-out-tooltip'>Sign Out</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
import React, { useEffect, useRef } from 'react';
import { useClerk, useUser, Protect } from '@clerk/clerk-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Eraser, FileText, Hash, House, Image,
  Scissors, SquarePen, Users, LogOut, Globe
} from 'lucide-react';
import { gsap } from 'gsap';
import './Sidebar.css';

const navItems = [
  { to: '/', label: 'Home Page', Icon: Globe },
  { to: '/ai', label: 'Dashboard', Icon: House },
  { to: '/ai/write-article', label: 'Write Article', Icon: SquarePen },
  { to: '/ai/blog-titles', label: 'Blog Titles', Icon: Hash },
  { to: '/ai/generate-images', label: 'Generate Images', Icon: Image },
  { to: '/ai/remove-background', label: 'Remove Background', Icon: Eraser },
  { to: '/ai/remove-object', label: 'Remove Object', Icon: Scissors },
  { to: '/ai/review-resume', label: 'Review Resume', Icon: FileText },
  { to: '/ai/community', label: 'Community', Icon: Users },
];

const Sidebar = ({ sidebar = true, setSidebar = () => {} }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const location = useLocation();

  const sidebarRef = useRef(null);
  const userSectionRef = useRef(null);
  const navItemsRef = useRef([]);
  const footerRef = useRef(null);

  const safeUser = user || {
    fullName: "Guest User",
    imageUrl: "https://ui-avatars.com/api/?name=Guest&background=3C81F6&color=fff",
  };

  // GSAP mount animation
  useEffect(() => {
    if (!sidebarRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sidebarRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );

      const tl = gsap.timeline({ delay: 0.1 });
      tl.fromTo(
        userSectionRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.5)" }
      ).fromTo(
        navItemsRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, stagger: 0.08, duration: 0.4, ease: "power2.out" },
        "-=0.2"
      ).fromTo(
        footerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        "-=0.2"
      );
    }, sidebarRef);

    return () => ctx.revert();
  }, [location.pathname]);

  const addToNavRefs = (el) => {
    if (el && !navItemsRef.current.includes(el)) navItemsRef.current.push(el);
  };

  const handleNavClick = () => {
    if (window.innerWidth < 768) setSidebar(false);
  };

  const handleUserProfileClick = () => openUserProfile?.();

  const handleSignOut = () => {
    gsap.to('.sign-out-btn', {
      rotation: 180,
      duration: 0.5,
      ease: "back.out(1.7)",
      onComplete: () => signOut?.()
    });
  };

  return (
    <aside
      ref={sidebarRef}
      className={`advanced-sidebar ${sidebar ? 'sidebar-open' : 'sidebar-closed'}`}
    >
      <div className="sidebar-content">
        {/* === User Section === */}
        <div ref={userSectionRef} className="user-section" onClick={handleUserProfileClick}>
          <img src={safeUser.imageUrl} alt="user" className="user-avatar" />
          <h1 className="user-name">{safeUser.fullName}</h1>
          <div className="user-status">
            <div className="status-dot"></div>
            <span>Online</span>
          </div>
        </div>

        {/* === Navigation === */}
        <nav className="navigation-menu">
          {navItems.map(({ to, label, Icon }) => {
            const isActive =
              location.pathname === to ||
              (to !== '/ai' && location.pathname.startsWith(to + '/'));

            return (
              <NavLink
                key={to}
                to={to}
                className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
                data-active={isActive}
                ref={addToNavRefs}
                onClick={handleNavClick}
              >
                <div className="nav-icon-wrapper">
                  <Icon className="nav-icon" />
                  <div className="nav-glow"></div>
                </div>
                <span className="nav-label">{label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* === Footer === */}
      <div ref={footerRef} className="sidebar-footer">
        <div className="user-profile-mini" onClick={handleUserProfileClick}>
          <img
            src={safeUser.imageUrl}
            alt="avatar"
            className="user-avatar-mini"
          />
          <div className="user-info-mini">
            <h2 className="user-name-mini">{safeUser.fullName}</h2>
            <p className="user-plan">
              <Protect plan="premium" fallback="Free Plan">Premium Plan</Protect>
            </p>
          </div>
        </div>

        <button onClick={handleSignOut} className="sign-out-btn">
          <LogOut className="sign-out-icon" />
          <span className="sign-out-tooltip">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
