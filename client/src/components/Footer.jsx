import React, { useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ultimateAnimations } from '../utils/ultimate-animations';
import './Footer.css';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Footer = () => {
    const footerRef = useRef(null);
    const sectionsRef = useRef([]);
    const logoRef = useRef(null);
    const newsletterRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate logo
            gsap.fromTo(logoRef.current,
                { opacity: 0, scale: 0.5, rotationY: 180 },
                { 
                    opacity: 1, 
                    scale: 1, 
                    rotationY: 0, 
                    duration: 1,
                    ease: "back.out(1.7)"
                }
            );

            // Stagger animation for footer sections
            gsap.fromTo(sectionsRef.current,
                {
                    opacity: 0,
                    y: 50
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Newsletter form animation
            gsap.fromTo(newsletterRef.current,
                {
                    opacity: 0,
                    x: -100
                },
                {
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    delay: 0.5,
                    scrollTrigger: {
                        trigger: newsletterRef.current,
                        start: "top 85%"
                    }
                }
            );

            // Continuous subtle animation for footer
            gsap.to(footerRef.current, {
                y: -10,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

        }, footerRef);

        return () => ctx.revert();
    }, []);

    const addToSectionsRefs = (el) => {
        if (el && !sectionsRef.current.includes(el)) {
            sectionsRef.current.push(el);
        }
    };

    return (
        <footer ref={footerRef} className="ultimate-footer">
            {/* Animated Background */}
            <div className="footer-background"></div>
            
            <div className="footer-container">
                <div className="footer-content">
                    {/* Logo and Description */}
                    <div ref={addToSectionsRefs} className="footer-brand">
                        <img ref={logoRef} className="footer-logo" src={assets.logo} alt="QuickAI Logo"/>
                        <p className="footer-description">
                            Experience the power of AI with QuickAi. Transform your content creation 
                            with our suite of premium AI tools. Write articles, generate images, 
                            and enhance your workflow.
                        </p>
                    </div>

                    {/* Links and Newsletter */}
                    <div className="footer-sections">
                        {/* Company Links */}
                        <div ref={addToSectionsRefs} className="footer-section">
                            <h3 className="section-title">Company</h3>
                            <ul className="footer-links">
                                <li><a href="#" className="footer-link">Home</a></li>
                                <li><a href="#" className="footer-link">About us</a></li>
                                <li><a href="#" className="footer-link">Contact us</a></li>
                                <li><a href="#" className="footer-link">Privacy policy</a></li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div ref={newsletterRef} className="footer-section newsletter-section">
                            <h3 className="section-title">Subscribe to our newsletter</h3>
                            <p className="newsletter-description">
                                The latest news, articles, and resources, sent to your inbox weekly.
                            </p>
                            <div className="newsletter-form">
                                <input 
                                    type="email" 
                                    placeholder="Enter your email"
                                    className="newsletter-input"
                                />
                                <button className="newsletter-button">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="footer-bottom">
                    <p className="copyright">
                        Copyright 2025 © QuickAI. All Right Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;