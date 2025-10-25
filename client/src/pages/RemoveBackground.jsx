import { Eraser, Sparkles, Upload, ImageIcon } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { gsap } from 'gsap';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {
  const [imageFile, setImageFile] = useState(null);
  const [fileName, setFileName] = useState('No file selected');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const { getToken } = useAuth();

  // Refs for animations
  const formRef = useRef(null);
  const outputRef = useRef(null);
  const placeholderRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo([formRef.current, outputRef.current],
        { opacity: 0, y: 50, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.2, ease: 'power3.out' }
      );
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (loading) {
      gsap.to(placeholderRef.current, { opacity: 0, duration: 0.3 });
    } else if (content) {
      gsap.set(contentRef.current, { opacity: 0, y: 20 });
      gsap.to(contentRef.current, { opacity: 1, y: 0, duration: 0.5, delay: 0.1, ease: 'power3.out' });
    } else {
      gsap.to(placeholderRef.current, { opacity: 1, duration: 0.3 });
    }
  }, [loading, content]);

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

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    if (!imageFile) {
      return toast.error('Please upload an image file.');
    }

    gsap.to(e.target, { scale: 0.97, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.inOut' });

    try {
      setLoading(true);
      setContent('');
      
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const { data } = await axios.post(
        '/api/ai/remove-image-background',
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${await getToken()}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );

      if (data.success) {
        setContent(data.content);
        toast.success('Background removed successfully!');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to remove background');
    }
    setLoading(false);
  };

  return (
    <div className='min-h-screen p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-300'>
      
      {/* Left Column - Form */}
      <form 
        ref={formRef}
        onSubmit={onSubmitHandler} 
        className='w-full p-6 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700 h-fit'
        style={{ opacity: 0 }}
      >
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-orange-400'/>
          <h1 className='text-xl font-bold text-slate-100'>Background Removal</h1>
        </div>

        {/* File Upload */}
        <p className='mt-6 text-sm font-semibold text-slate-400'>Upload Image</p>
        <label 
          htmlFor="bg-upload" 
          className='w-full p-3 px-4 mt-2 flex items-center justify-between outline-none text-sm text-slate-100 placeholder:text-slate-500 rounded-lg bg-slate-700/50 border border-slate-600 cursor-pointer hover:border-orange-500 transition-all'
        >
          <span className='truncate max-w-[200px] sm:max-w-xs text-slate-400 italic'>{fileName}</span>
          <span className='flex-shrink-0 text-xs font-medium text-orange-400 border border-orange-400 rounded-md px-3 py-1 hover:bg-orange-400 hover:text-slate-900 transition-all'>
            <Upload className='w-4 h-4 inline-block mr-1' />
            Browse...
          </span>
        </label>
        <input 
          id="bg-upload"
          type="file" 
          className="hidden"
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          required
        />
        <p className='text-xs text-slate-500 mt-2'>Supports JPG, PNG, WEBP • Max 10MB</p>

        <div className="h-px bg-slate-700 my-6" />

        {/* Submit Button */}
        <button 
          disabled={loading}
          className='w-full flex justify-center items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 text-sm font-semibold rounded-lg cursor-pointer shadow-lg shadow-orange-600/20 hover:shadow-xl hover:shadow-orange-600/30 hover:scale-[1.02] transition-all duration-300 ease-in-out disabled:opacity-50 disabled:hover:scale-100'
        >
          {loading ? (
            <>
              <span className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
              Removing...
            </>
          ) : (
            <>
              <Eraser className='w-5'/>
              Remove Background
            </>
          )}
        </button>
      </form>

      {/* Right Column - Output */}
      <div 
        ref={outputRef}
        className='remove-bg-output w-full p-6 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700 flex flex-col min-h-[500px] lg:min-h-0 lg:max-h-[calc(100vh-4rem)] overflow-y-auto'
        style={{ opacity: 0 }}
      >
        <div className='flex items-center gap-3 pb-4 border-b border-slate-700'>
          <ImageIcon className='w-5 h-5 text-orange-400'/>
          <h1 className='text-xl font-bold text-slate-100'>Processed Image</h1>
        </div>

        {/* Placeholder */}
        <div 
          ref={placeholderRef} 
          className='flex-1 flex justify-center items-center'
        >
          <div className='text-sm flex flex-col items-center gap-5 text-slate-600'>
            <Eraser className='w-12 h-12'/>
            <p className='text-slate-500 text-center'>Upload an image and click<br/>"Remove Background" to get started</p>
          </div>
        </div>
        
        {/* Processed Image */}
        <div 
          ref={contentRef} 
          className='mt-3 opacity-0 flex-1 flex items-center justify-center'
        >
          {content && (
            <img 
              src={content} 
              alt="Background removed" 
              className="w-full h-auto max-h-[500px] object-contain rounded-lg bg-slate-900/50" 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RemoveBackground;