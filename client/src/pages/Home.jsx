import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

// Your existing imports for the landing page sections
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AiTools from '../components/AiTools';
import Testimonial from '../components/Testimonial';
import Plan from '../components/Plan';
import Footer from '../components/Footer';

const Home = () => {
    const { isLoaded, isSignedIn } = useUser();
    const navigate = useNavigate();

    // This effect handles redirecting the user safely
    useEffect(() => {
        // Only redirect if Clerk has loaded AND the user is signed in
        if (isLoaded && isSignedIn) {
            navigate('/ai');
        }
    }, [isLoaded, isSignedIn, navigate]);

    // While Clerk is checking the user's status, show a blank screen.
    // This prevents the landing page from flashing for signed-in users.
    if (isLoaded && isSignedIn) {
        return null; // Or a loading spinner
    }

    // If the user is not signed in, show the full landing page.
    return (
        <div>
            <Navbar />
            <Hero />
            <AiTools />
            <Testimonial />
            <Plan />
            <Footer />
        </div>
    );
};

export default Home;
