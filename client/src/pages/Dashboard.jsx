import React, { useEffect, useState } from 'react'
import { Gem, Sparkles } from 'lucide-react';
import { Protect, useAuth } from '@clerk/clerk-react';
import CreationItem from '../components/CreationItem';
import axios from 'axios';
import { toast } from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const getDashboardData = async () => {
    try {
      const { data } = await axios.get('/api/user/get-user-creations', {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });
      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className='h-full overflow-y-scroll p-6 bg-slate-900 text-white'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold mb-2'>Dashboard</h1>
        <p className='text-slate-400'>Welcome back! Here's your creative workspace.</p>
      </div>

      {/* Stats Cards */}
      <div className='flex justify-start gap-6 flex-wrap mb-8'>
        {/* Total Creations Card */}
        <div className='flex justify-between items-center w-80 p-6 bg-slate-800 rounded-2xl border border-slate-700'>
          <div className='text-slate-300'>
            <p className='text-sm text-slate-400'>Total Creations</p>
            <h2 className='text-2xl font-bold'>{creations.length}</h2>
          </div>
          <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white flex justify-center items-center'>
            <Sparkles className='w-6 text-white' />
          </div>
        </div>
        
        {/* Active Plan Card */}
        <div className='flex justify-between items-center w-80 p-6 bg-slate-800 rounded-2xl border border-slate-700'>
          <div className='text-slate-300'>
            <p className='text-sm text-slate-400'>Active Plan</p>
            <h2 className='text-2xl font-bold'>
              <Protect plan='premium' fallback="Free">Premium</Protect>
            </h2>
          </div>
          <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-white flex justify-center items-center'>
            <Gem className='w-6 text-white' />
          </div>
        </div>
      </div>

      {/* Recent Creations Section */}
      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-3 border-purple-500 border-t-transparent'></div>
        </div>
      ) : (
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-bold'>Recent Creations</h2>
            <p className='text-sm text-slate-400'>{creations.length} items</p>
          </div>
          
          {creations.length === 0 ? (
            <div className='text-center py-12 bg-slate-800 rounded-2xl border border-slate-700'>
              <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center'>
                <Sparkles className='w-8 h-8 text-slate-500' />
              </div>
              <h3 className='text-lg font-semibold text-slate-300 mb-2'>No creations yet</h3>
              <p className='text-slate-500'>
                Start creating amazing content with our AI tools!
              </p>
            </div>
          ) : (
            <div className='space-y-3'>
              {creations.map((item) => (
                <CreationItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;