import { useAuth, useUser } from '@clerk/clerk-react';
import React, { useEffect, useState, useRef } from 'react';
import { Heart } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { gsap } from 'gsap';
import './Community.css';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const { getToken } = useAuth();
  const cardsRef = useRef([]);

  const fetchCreations = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/user/get-published-creations', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const imageLikeToggle = async (id) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        '/api/user/toggle-like-creations',
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        fetchCreations();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Animate cards on mount (UPDATED for 3D)
  useEffect(() => {
    if (creations.length > 0) {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 50, rotationX: -30 }, // From a 3D-tilted, lower position
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
        }
      );
    }
  }, [creations]);

  // NEW: 3D Mousemove Handler
  const handleMouseMove = (e, card) => {
    if (!card) return;
    const image = card.querySelector('.creation-image');
    const overlay = card.querySelector('.creation-overlay');
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / centerY * -8; // Max 8deg rotation
    const rotateY = (x - centerX) / centerX * 8; // Max 8deg rotation

    // Animate card
    gsap.to(card, {
      duration: 0.6,
      rotationX: rotateX,
      rotationY: rotateY,
      scale: 1.03,
      boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.2)',
      ease: 'power3.out',
    });
    // Animate image
    gsap.to(image, {
      duration: 0.6,
      scale: 1.1,
      ease: 'power3.out',
    });
    // Animate overlay
    gsap.to(overlay, {
      duration: 0.6,
      opacity: 1,
      ease: 'power3.out',
    });
  };

  // NEW: Mouseleave Handler
  const handleMouseLeave = (card) => {
    if (!card) return;
    const image = card.querySelector('.creation-image');
    const overlay = card.querySelector('.creation-overlay');

    // Reset card
    gsap.to(card, {
      duration: 1,
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      ease: 'elastic.out(1, 0.5)',
    });
    // Reset image
    gsap.to(image, {
      duration: 1,
      scale: 1,
      ease: 'elastic.out(1, 0.5)',
    });
    // Reset overlay
    gsap.to(overlay, {
      duration: 1,
      opacity: 0,
      ease: 'power3.out',
    });
  };

  useEffect(() => {
    if (user) fetchCreations();
  }, [user]);

  if (loading) {
    return (
      <div className="community-loader">
        <div className="loader-spinner"></div>
        <p className="loader-text">Loading creations...</p>
      </div>
    );
  }

  return (
    <div className="community-container">
      <h1 className="community-title">Community Creations</h1>

      {creations.length === 0 ? (
        <p className="no-creations-text">No creations found yet 😅</p>
      ) : (
        <div className="creations-grid">
          {creations.map((creation, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="creation-card group"
              // ADDED Event Handlers
              onMouseMove={(e) => handleMouseMove(e, cardsRef.current[index])}
              onMouseLeave={() => handleMouseLeave(cardsRef.current[index])}
            >
              <img
                src={creation.content}
                alt="creation"
                className="creation-image"
              />
              <div className="creation-overlay">
                <p className="creation-prompt">{creation.prompt}</p>

                <div className="like-section">
                  <p>{creation.likes.length}</p>
                  <Heart
                    onClick={() => imageLikeToggle(creation.id)}
                    className={`like-icon ${
                      creation.likes.includes(user.id) ? 'liked' : 'unliked'
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Community;