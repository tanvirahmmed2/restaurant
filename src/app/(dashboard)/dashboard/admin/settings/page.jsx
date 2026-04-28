'use client'
import { Context } from '@/components/context/Context'
import WebsiteDetails from '@/components/forms/WebsiteDetails'
import axios from 'axios'
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'

const Setting = () => {
  const { siteData, staffData } = useContext(Context)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const changePassword = async (e) => {
    e.preventDefault()
    if (!password) return toast.warning("Enter a new password")
    setLoading(true)
    try {
      const res = await axios.patch('/api/staff', { password }, { withCredentials: true })
      toast.success(res.data.message)
      setPassword('')
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to change password")
    } finally {
      setLoading(false)
    }
  }

  const deleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action is permanent.")) return;
    try {
      const res = await axios.delete('/api/staff/login', { withCredentials: true })
      toast.success(res.data.message)
      window.location.replace('/login')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete account')
    }
  }

  return (
    <div className='w-full max-w-5xl mx-auto p-6 flex flex-col gap-10'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-black text-gray-900 tracking-tight'>Settings</h1>
        <p className='text-gray-500'>Manage your business profile and account security.</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
        <div className='lg:col-span-2 flex flex-col gap-8'>
          {/* Business Information Section */}
          <section className='bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden'>
             <WebsiteDetails />
          </section>
        </div>

        <div className='flex flex-col gap-8'>
          {/* Account Security Section */}
          <section className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6'>
            <h2 className='text-xl font-bold text-gray-800'>Security</h2>
            
            <form onSubmit={changePassword} className='flex flex-col gap-4'>
              <div className='flex flex-col gap-1'>
                <label htmlFor="password" className='text-xs font-bold uppercase text-gray-400'>New Password</label>
                <input 
                  type="password" 
                  required 
                  value={password} 
                  id='password' 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••"
                  className='w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black transition-all' 
                />
              </div>
              <button 
                type='submit' 
                disabled={loading}
                className='w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg active:scale-95 disabled:opacity-50'
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>

            <div className='border-t border-gray-100 pt-6 mt-2'>
              <h3 className='text-sm font-bold text-red-600 mb-4'>Danger Zone</h3>
              <p className='text-xs text-gray-500 mb-4'>Deleting your account will remove your access to this restaurant. This cannot be undone.</p>
              <button 
                onClick={deleteAccount} 
                className='w-full py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all active:scale-95'
              >
                Delete Account
              </button>
            </div>
          </section>

          {/* Profile Quick Info */}
          <section className='bg-indigo-600 p-8 rounded-3xl shadow-xl text-white flex flex-col gap-4'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold'>
                {staffData?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className='font-bold'>{staffData?.name}</p>
                <p className='text-xs opacity-70 uppercase tracking-widest font-medium'>{staffData?.role}</p>
              </div>
            </div>
            <div className='text-xs opacity-80 space-y-1 mt-2'>
              <p>Email: {staffData?.email}</p>
              <p>Phone: {staffData?.phone}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Setting
