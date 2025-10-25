import React, { useEffect, useState, useRef } from 'react';
import { Scissors, Upload, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { gsap } from 'gsap'; // Import GSAP
import './RemoveObject.css'; // We'll create this CSS file

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  // --- State ---
  const [imageFile, setImageFile] = useState(null);
  const [fileName, setFileName] = useState('No file selected');
  const [object, setObject] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(''); // This will hold the output image URL
  const { getToken } = useAuth();

  // --- GSAP Refs (same as WriteArticle) ---
  const formRef = useRef(null);
  const outputRef = useRef(null);
  const placeholderRef = useRef(null);
  const contentRef = useRef(null); // This will wrap the output <img>
  const ctx = useRef(null); // GSAP Context for cleanup

  // --- GSAP Animation: On-load entrance (same as WriteArticle) ---
  useEffect(() => {
    ctx.current = gsap.context(() => {
      gsap.fromTo([formRef.current, outputRef.current],
        { 
          opacity: 0, 
          y: 50, 
          scale: 0.98 
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.2, // Animate one after the other
          ease: 'power3.out'
        }
      );
    });
    return () => ctx.current.revert();
  }, []);

  // --- GSAP Animation: Content Loading (same as WriteArticle) ---
  useEffect(() => {
    // This hook fades the placeholder out and the content (image) in
    if (loading) {
      gsap.to(placeholderRef.current, { 
        opacity: 0, 
        duration: 0.3, 
        ease: 'power2.inOut' 
      });
    } else if (content) {
      // Content is now a URL, so we fade in the container
      gsap.set(contentRef.current, { opacity: 0, y: 20 }); 
      gsap.to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: 0.1,
        ease: 'power3.out'
      });
    } else {
      // Fade placeholder back in if no content/not loading
      gsap.to(placeholderRef.current, { 
        opacity: 1, 
        duration: 0.3, 
        ease: 'power2.inOut' 
      });
    }
  }, [loading, content]);

  // --- File Change Handler ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload JPG, PNG, or WEBP.');
        return;
      }
      setImageFile(file);
      setFileName(file.name);
      toast.success('Image loaded!');
    }
  };

  // --- Form Submit Handler (Modified for FormData) ---
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      return toast.error('Please upload an image file.');
    }
    
    if (!object.trim()) {
        return toast.error('Please describe the object to remove.');
    }

    if (object.trim().split(' ').length > 1) {
      return toast.error('Please enter only one object name.');
    }

    // GSAP Button Press
    gsap.to(e.target, { 
      scale: 0.97, 
      duration: 0.15, 
      yoyo: true, 
      repeat: 1, 
      ease: 'power2.inOut' 
    });

    // Use FormData for file uploads
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('object', object.trim());

    try {
      setLoading(true);
      setContent(''); // Clear previous image
      const { data } = await axios.post(
        '/api/ai/remove-image-object',
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
            'Content-Type': 'multipart/form-data', // Required for files
          },
        }
      );

      if (data.success) {
        setContent(data.content); // `data.content` should be the new image URL
      } else {
        toast.error(data.message || "Failed to remove object.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    // Main container: Responsive grid
    <div className='min-h-screen p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-300'>
      
      {/* --- Left Column: Configuration --- */}
      <form 
        ref={formRef} 
        onSubmit={onSubmitHandler} 
        className='w-full p-6 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700 h-fit'
        style={{ opacity: 0 }} // Initial state for GSAP
      >
        <div className='flex items-center gap-3'>
          <Scissors className='w-6 text-blue-400' />
          <h1 className='text-xl font-bold text-slate-100'>Object Removal</h1>
        </div>

        {/* --- File Upload Input (from ReviewResume) --- */}
        <p className='mt-6 text-sm font-semibold text-slate-400'>Upload Image</p>
        <label 
          htmlFor="image-upload" 
          className='w-full p-3 px-4 mt-2 flex items-center justify-between outline-none text-sm text-slate-100 placeholder:text-slate-500 rounded-lg bg-slate-700/50 border border-slate-600 cursor-pointer hover:border-blue-500 transition-all'
        >
          <span className='truncate max-w-[200px] sm:max-w-xs text-slate-400 italic'>{fileName}</span>
          <span className='flex-shrink-0 text-xs font-medium text-blue-400 border border-blue-400 rounded-md px-3 py-1 hover:bg-blue-400 hover:text-slate-900 transition-all'>
            <Upload className='w-4 h-4 inline-block mr-1' />
            Browse...
          </span>
        </label>
        <input 
          id="image-upload"
          type="file" 
          className="hidden"
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
        />

        {/* --- Object Name Input --- */}
        <p className='mt-5 text-sm font-semibold text-slate-400'>Object to Remove</p>
        <input
          onChange={(e) => setObject(e.target.value)}
          value={object}
          type='text'
          className='w-full p-3 px-4 mt-2 outline-none text-sm text-slate-100 placeholder:text-slate-500 rounded-lg bg-slate-700/50 border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all'
          placeholder='e.g., watch, spoon (one object only)'
          required
        />

        <div className="h-px bg-slate-700 my-6" />

        {/* --- Submit Button --- */}
        <button
          disabled={loading}
          className='w-full flex justify-center items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-3 text-sm font-semibold rounded-lg cursor-pointer shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 hover:scale-[1.02] transition-all duration-300 ease-in-out disabled:opacity-50 disabled:hover:scale-100'
        >
          {loading ? (
            <>
              <span className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
              Removing...
            </>
          ) : (
            <>
              <Scissors className='w-5' />
              Remove Object
            </>
          )}
        </button>
      </form>

      {/* --- Right Column: Processed Image --- */}
      <div 
        ref={outputRef}
        className='remove-object-output w-full p-6 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700 flex flex-col min-h-[500px] lg:min-h-0 lg:max-h-[calc(100vh-4rem)] overflow-y-auto'
        style={{ opacity: 0 }} // Initial state for GSAP
      >
        <div className='flex items-center gap-3 pb-4 border-b border-slate-700'>
          <ImageIcon className='w-5 h-5 text-blue-400' />
          <h1 className='text-xl font-bold text-slate-100'>Processed Image</h1>
        </div>

        {/* Placeholder - controlled by GSAP */}
        <div 
          ref={placeholderRef} 
          className='flex-1 flex justify-center items-center'
        >
          <div className='text-sm flex flex-col items-center gap-5 text-slate-600'>
            <ImageIcon className='w-12 h-12' />
            <p className='text-slate-500'>Upload an image and click "Remove Object" to get started</p>
          </div>
        </div>
        
        {/* Content Area (Image) - controlled by GSAP */}
        <div 
          ref={contentRef} 
          className='mt-3 opacity-0' // Initial state
        >
          {/* We only render the img tag if content (the URL) exists */}
          {content && (
            <img 
              src={content} 
              alt="Processed" 
              className="w-full h-auto object-contain rounded-lg" 
            />
          )}
        </div>

      </div>
    </div>
  );
};

export default RemoveObject;