'use client'
import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaUsers, FaChair, FaCommentAlt, FaArrowRight } from 'react-icons/fa'

const Reservation = () => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    member: '',
    table: '',
    message: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post('/api/reservation', formData, { withCredentials: true })
      toast.success(response.data.message || 'Reservation submitted successfully!')
      setFormData({
        name: '',
        email: '',
        date: '',
        member: '',
        table: '',
        message: ''
      })
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to submit reservation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full min-h-screen bg-gray-50/50 pt-28 pb-20 px-6'>
      <div className='max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>

        {/* Text Section */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.8 }}
          className='space-y-8'
        >
          <div className='space-y-4'>
            <div className='inline-block px-4 py-1.5 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full'>
              Reservations
            </div>
            <h1 className='text-6xl md:text-7xl font-black text-gray-900 tracking-tight leading-none'>
              Reserve Your <span className='text-indigo-600'>Table</span>
            </h1>
          </div>
          <p className='text-gray-500 text-lg md:text-xl leading-relaxed max-w-lg'>
            Whether it&apos;s a romantic dinner, a corporate lunch, or a family celebration, 
            we ensure every detail is perfect for your visit.
          </p>
          <div className='flex items-center gap-6 pt-4'>
            <div className='flex -space-x-3'>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className='w-12 h-12 rounded-full border-4 border-white bg-gray-200 overflow-hidden'>
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                </div>
              ))}
            </div>
            <p className='text-sm font-bold text-gray-400 uppercase tracking-widest'>
              Join 500+ happy guests this week
            </p>
          </div>
        </motion.div>
        
        {/* Form Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.2 }}
          className='bg-white p-10 rounded-[40px] shadow-2xl shadow-black/5 border border-gray-100'
        >
          <div className='mb-8 text-center'>
            <h2 className='text-2xl font-black text-gray-900'>Booking Details</h2>
            <p className='text-gray-400 text-sm'>Please fill in the information below</p>
          </div>
          
          <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='flex flex-col gap-1.5'>
                <label htmlFor="name" className='text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1'>Your Name</label>
                <input type="text" id='name' name='name' required onChange={handleChange} value={formData.name} className='w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-black transition-all text-sm' placeholder="John Doe" />
              </div>
              
              <div className='flex flex-col gap-1.5'>
                <label htmlFor="email" className='text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1'>Email Address</label>
                <input type="email" id='email' name='email' required onChange={handleChange} value={formData.email} className='w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-black transition-all text-sm' placeholder="john@example.com" />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='flex flex-col gap-1.5'>
                <label htmlFor="date" className='text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1'>Date</label>
                <div className='relative'>
                  <FaCalendarAlt className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-300' />
                  <input type="date" id='date' name='date' required onChange={handleChange} value={formData.date} className='w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-black transition-all text-sm' />
                </div>
              </div>

              <div className='flex flex-col gap-1.5'>
                <label htmlFor="member" className='text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1'>Guests</label>
                <div className='relative'>
                  <FaUsers className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-300' />
                  <input type="number" id='member' name='member' min="1" required onChange={handleChange} value={formData.member} className='w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-black transition-all text-sm' placeholder="0" />
                </div>
              </div>

              <div className='flex flex-col gap-1.5'>
                <label htmlFor="table" className='text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1'>Table Preference</label>
                <div className='relative'>
                  <FaChair className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-300' />
                  <input type="number" id='table' name='table' required onChange={handleChange} value={formData.table} className='w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-black transition-all text-sm' placeholder="0" />
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-1.5'>
              <label htmlFor="message" className='text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1'>Special Requests (Optional)</label>
              <div className='relative'>
                <FaCommentAlt className='absolute left-4 top-5 text-gray-300' />
                <textarea name="message" id="message" rows="3" onChange={handleChange} value={formData.message} className='w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-black transition-all text-sm resize-none' placeholder="Any allergies or special occasions?" />
              </div>
            </div>

            <button 
              type='submit' 
              disabled={loading}
              className='group w-full py-5 bg-black text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-[0.98] disabled:opacity-50 mt-2'
            >
              {loading ? 'SUBMITTING...' : (
                <>
                  CONFIRM RESERVATION
                  <FaArrowRight className='group-hover:translate-x-1 transition-transform' />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default Reservation