import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { gsap } from 'gsap';
import './Hero.css';

const Hero = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    
    const heroRef = useRef(null);
    const headingRef = useRef(null);
    const subtitleRef = useRef(null);
    const buttonRef = useRef(null);
    const backgroundRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Clean entrance animations
            const tl = gsap.timeline();
            
            tl.fromTo(headingRef.current, 
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
            )
            .fromTo(subtitleRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
                "-=0.8"
            )
            .fromTo(buttonRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
                "-=0.5"
            );

            // Subtle background animation
            gsap.to(backgroundRef.current, {
                backgroundPosition: '50% 60%',
                ease: "none",
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                }
            });

            // Button hover effect with GSAP
            const button = buttonRef.current;
            if (button) {
                button.addEventListener('mouseenter', () => {
                    gsap.to(button, {
                        scale: 1.02,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
                
                button.addEventListener('mouseleave', () => {
                    gsap.to(button, {
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
            }

        }, heroRef);

        return () => ctx.revert();
    }, []);

    const handleGetStarted = () => {
        if (user) {
            navigate('/ai');
        } else {
            navigate('/sign-up');
        }
    };

    return (
        <section ref={heroRef} className="modern-hero">
            {/* Clean Background */}
            <div ref={backgroundRef} className="hero-background">
                <div className="background-glow"></div>
            </div>
            
            {/* Subtle Particles */}
            <div className="floating-particles">
                {[...Array(15)].map((_, i) => (
                    <div key={i} className="particle" style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`
                    }}></div>
                ))}
            </div>

            {/* Main Content */}
            <div className="hero-container">
                <div className="hero-content">
                    {/* Main Heading */}
                    <h1 ref={headingRef} className="hero-heading">
                        Elevate Your Content<br />
                        with <span className="accent-text">AI Innovation</span>
                    </h1>
                    
                    {/* Subtitle */}
                    <p ref={subtitleRef} className="hero-subtitle">
                        Transform your creative workflow with our enterprise-grade AI tools. 
                        Generate stunning content, automate workflows, and scale your vision.
                    </p>
                    
                    {/* CTA Section */}
                    <div className="cta-section">
                        <button 
                            ref={buttonRef}
                            onClick={handleGetStarted}
                            className="cta-button"
                        >
                            <span className="button-text">Start Creating</span>
                            <span className="button-arrow">→</span>
                        </button>
                        
                        {/* Trust Badge */}
                        <div className="trust-badge">
                            <div className="trust-stars">
                                <span>⭐</span>
                                <span>⭐</span>
                                <span>⭐</span>
                                <span>⭐</span>
                                <span>⭐</span>
                            </div>
                            <span>Trusted by 10,000+ creators</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="scroll-indicator">
                <div className="scroll-line"></div>
                <span>Scroll to explore</span>
            </div>
        </section>
    );
};

export default Hero;