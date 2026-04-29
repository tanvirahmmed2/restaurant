'use client'
import axios from 'axios'
import Link from 'next/link'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa'

const LoginForm = () => {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: ''
    })
    
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const loginHandle = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await axios.post('/api/user/login', formData, { withCredentials: true })
            toast.success(response.data.message)
            
            const { role } = response.data.payload
            
            // Role-based redirection
            if (role === 'admin' || role === 'manager' || role === 'sales') {
                window.location.replace('/dashboard')
            } else {
                window.location.replace('/profile')
            }
        } catch (error) {
            console.error(error)
            toast.error(error?.response?.data?.message || "Login failed")
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
            <form onSubmit={loginHandle} className='flex flex-col gap-6 bg-white p-8 rounded-3xl shadow-xl border border-gray-100'>
                <div className='space-y-1'>
                    <h2 className='text-2xl font-black text-gray-900'>Sign In</h2>
                    <p className='text-gray-400 text-sm'>Enter your credentials to continue</p>
                </div>

                <div className='space-y-4'>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="email" className='text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1'>Email Address</label>
                        <div className='relative'>
                            <FaEnvelope className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-300' />
                            <input 
                                type="email" 
                                id='email' 
                                name='email' 
                                required 
                                value={formData.email} 
                                onChange={handleChange} 
                                placeholder="name@example.com"
                                className='w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-black focus:bg-white transition-all text-sm'
                            />
                        </div>
                    </div>

                    <div className='flex flex-col gap-1.5'>
                        <div className='flex items-center justify-between ml-1'>
                            <label htmlFor="password" senior className='text-[10px] font-black uppercase text-gray-400 tracking-widest'>Password</label>
                            <Link href="/forgot-password" senior className='text-[10px] font-black uppercase text-gray-300 hover:text-black transition-colors'>Forgot?</Link>
                        </div>
                        <div className='relative'>
                            <FaLock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-300' />
                            <input 
                                type="password" 
                                id='password' 
                                name='password' 
                                required 
                                value={formData.password} 
                                onChange={handleChange} 
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
                    {loading ? 'AUTHENTICATING...' : (
                        <>
                            CONTINUE
                            <FaArrowRight className='group-hover:translate-x-1 transition-transform' />
                        </>
                    )}
                </button>

                <p className='text-center text-sm text-gray-400'>
                    Don't have an account? <Link href='/register' className='text-gray-900 font-bold hover:underline'>Create one</Link>
                </p>
            </form>
        </motion.div>
    )
}

export default LoginForm
