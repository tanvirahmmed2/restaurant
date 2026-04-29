'use client'
import axios from 'axios'
import Link from 'next/link'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { FaUser, FaPhone, FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa'

const RegisterForm = () => {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: ''
    })
    
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await axios.post('/api/user', formData, { withCredentials: true })
            toast.success(res.data.message)
            window.location.replace('/login')
        } catch (error) {
            toast.error(error?.response?.data?.message || "Registration failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }} 
            className='flex-1 w-full max-w-md'
        >
            <form onSubmit={handleSubmit} className='flex flex-col gap-6 bg-white p-8 rounded-3xl shadow-xl border border-gray-100'>
                <div className='space-y-1'>
                    <h2 className='text-2xl font-black text-gray-900'>Create Account</h2>
                    <p className='text-gray-400 text-sm'>Join us for a premium dining experience</p>
                </div>

                <div className='grid grid-cols-1 gap-4'>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="name" className='text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1'>Full Name</label>
                        <div className='relative'>
                            <FaUser className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-300' />
                            <input 
                                type="text" 
                                name='name' 
                                id='name' 
                                required 
                                onChange={handleChange} 
                                value={formData.name} 
                                placeholder="John Doe"
                                className='w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-black focus:bg-white transition-all text-sm'
                            />
                        </div>
                    </div>

                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="phone" className='text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1'>Phone Number</label>
                        <div className='relative'>
                            <FaPhone className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-300' />
                            <input 
                                type="text" 
                                name='phone' 
                                id='phone' 
                                onChange={handleChange} 
                                value={formData.phone} 
                                required 
                                placeholder="+1 (555) 000-0000"
                                className='w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-black focus:bg-white transition-all text-sm'
                            />
                        </div>
                    </div>

                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="email" className='text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1'>Email Address</label>
                        <div className='relative'>
                            <FaEnvelope className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-300' />
                            <input 
                                type="email" 
                                name='email' 
                                id='email' 
                                onChange={handleChange} 
                                required 
                                value={formData.email} 
                                placeholder="name@example.com"
                                className='w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-black focus:bg-white transition-all text-sm'
                            />
                        </div>
                    </div>

                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="password" senior className='text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1'>Secure Password</label>
                        <div className='relative'>
                            <FaLock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-300' />
                            <input 
                                type="password" 
                                name='password' 
                                onChange={handleChange} 
                                id='password' 
                                value={formData.password} 
                                required 
                                placeholder="••••••••"
                                className='w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-black focus:bg-white transition-all text-sm'
                            />
                        </div>
                    </div>
                </div>

                <button 
                    type='submit' 
                    disabled={loading}
                    className='group w-full py-4 bg-black text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-[0.98] shadow-xl shadow-black/10 disabled:opacity-50'
                >
                    {loading ? 'CREATING ACCOUNT...' : (
                        <>
                            GET STARTED
                            <FaArrowRight className='group-hover:translate-x-1 transition-transform' />
                        </>
                    )}
                </button>

                <p className='text-center text-sm text-gray-400'>
                    Already registered? <Link href='/login' className='text-gray-900 font-bold hover:underline'>Sign In</Link>
                </p>
            </form>
        </motion.div>
    )
}

export default RegisterForm
