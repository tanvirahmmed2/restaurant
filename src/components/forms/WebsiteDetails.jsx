// components/forms/WebsiteDetails.jsx
'use client'
import axios from 'axios'
import React, { useState, useEffect, useContext } from 'react'
import toast from 'react-hot-toast'
import { Context } from '../context/Context'

const WebsiteDetails = () => {
    const { siteData } = useContext(Context)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        business_name: '',
        meta_title: '',
        meta_description: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        facebook: '',
        instagram: '',
        linkedin: '',
        youtube: '',
        primary_color: '#10b981',
        secondary_color: '#ffffff',
        is_public: true,
        is_store_enabled: true
    })

    useEffect(() => {
        if (siteData) {
            setFormData({
                business_name: siteData.business_name || '',
                meta_title: siteData.meta_title || '',
                meta_description: siteData.meta_description || '',
                email: siteData.email || '',
                phone: siteData.phone || '',
                address: siteData.address || '',
                city: siteData.city || '',
                country: siteData.country || '',
                facebook: siteData.facebook || '',
                instagram: siteData.instagram || '',
                linkedin: siteData.linkedin || '',
                youtube: siteData.youtube || '',
                primary_color: siteData.primary_color || '#10b981',
                secondary_color: siteData.secondary_color || '#ffffff',
                is_public: siteData.is_public ?? true,
                is_store_enabled: siteData.is_store_enabled ?? true
            })
        }
    }, [siteData])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await axios.post('/api/website', formData, { withCredentials: true })
            toast.success(response.data.message)
            // Optionally refresh context or page
        } catch (error) {
            console.error(error)
            toast.error(error?.response?.data?.message || 'Failed to update settings')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className='p-8 flex flex-col gap-8'>
            <div className='flex items-center justify-between border-b border-gray-100 pb-6'>
                <div>
                    <h2 className='text-xl font-bold text-gray-800'>Business Details</h2>
                    <p className='text-sm text-gray-500'>Update your restaurant's public information and branding.</p>
                </div>
                <button 
                    type='submit' 
                    disabled={loading}
                    className='px-6 py-2 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 transition-all active:scale-95 disabled:opacity-50'
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* General Info */}
                <div className='flex flex-col gap-4'>
                    <h3 className='text-xs font-bold uppercase text-pink-600 tracking-wider'>General Info</h3>
                    
                    <div className='flex flex-col gap-1'>
                        <label className='text-xs font-bold text-gray-400 uppercase'>Restaurant Name</label>
                        <input type="text" name='business_name' value={formData.business_name} required onChange={handleChange} className='p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-pink-500 transition-all'/>
                    </div>

                    <div className='flex flex-col gap-1'>
                        <label className='text-xs font-bold text-gray-400 uppercase'>Website Tagline</label>
                        <input type="text" name='meta_title' value={formData.meta_title} required onChange={handleChange} className='p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-pink-500 transition-all' placeholder="Best Pizza in Town"/>
                    </div>

                    <div className='flex flex-col gap-1'>
                        <label className='text-xs font-bold text-gray-400 uppercase'>Meta Description</label>
                        <textarea name="meta_description" value={formData.meta_description} required onChange={handleChange} className='p-3 bg-gray-50 border border-gray-200 rounded-xl h-28 outline-none focus:border-pink-500 transition-all resize-none' placeholder="Describe your restaurant for SEO..."></textarea>
                    </div>
                </div>

                {/* Contact Info */}
                <div className='flex flex-col gap-4'>
                    <h3 className='text-xs font-bold uppercase text-pink-600 tracking-wider'>Contact & Location</h3>
                    
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='flex flex-col gap-1'>
                            <label className='text-xs font-bold text-gray-400 uppercase'>Email</label>
                            <input type="email" name='email' value={formData.email} required onChange={handleChange} className='p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-pink-500 transition-all' />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-xs font-bold text-gray-400 uppercase'>Phone</label>
                            <input type="text" name='phone' value={formData.phone} required onChange={handleChange} className='p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-pink-500 transition-all' />
                        </div>
                    </div>

                    <div className='flex flex-col gap-1'>
                        <label className='text-xs font-bold text-gray-400 uppercase'>Street Address</label>
                        <input type="text" name='address' value={formData.address} required onChange={handleChange} className='p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-pink-500 transition-all' />
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                        <div className='flex flex-col gap-1'>
                            <label className='text-xs font-bold text-gray-400 uppercase'>City</label>
                            <input type="text" name='city' value={formData.city} onChange={handleChange} className='p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-pink-500 transition-all' />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-xs font-bold text-gray-400 uppercase'>Country</label>
                            <input type="text" name='country' value={formData.country} onChange={handleChange} className='p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-pink-500 transition-all' />
                        </div>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Social Links */}
                <div className='flex flex-col gap-4'>
                    <h3 className='text-xs font-bold uppercase text-pink-600 tracking-wider'>Social Presence</h3>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='flex flex-col gap-1'>
                            <label className='text-xs font-bold text-gray-400 uppercase'>Facebook</label>
                            <input name="facebook" value={formData.facebook} onChange={handleChange} className='p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-pink-500 transition-all' type='text'/>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-xs font-bold text-gray-400 uppercase'>Instagram</label>
                            <input name="instagram" value={formData.instagram} onChange={handleChange} className='p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-pink-500 transition-all' type='text'/>
                        </div>
                    </div>
                </div>

                {/* UI & Flags */}
                <div className='flex flex-col gap-4'>
                    <h3 className='text-xs font-bold uppercase text-pink-600 tracking-wider'>Preferences</h3>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='flex flex-col gap-1'>
                            <label className='text-xs font-bold text-gray-400 uppercase'>Primary Color</label>
                            <div className='flex items-center gap-2'>
                                <input type="color" name="primary_color" value={formData.primary_color} onChange={handleChange} className='w-10 h-10 border-0 rounded-lg cursor-pointer bg-transparent'/>
                                <input type="text" name="primary_color" value={formData.primary_color} onChange={handleChange} className='flex-1 p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs uppercase'/>
                            </div>
                        </div>
                        <div className='flex flex-col gap-4 pt-4'>
                            <label className='flex items-center gap-3 cursor-pointer group'>
                                <input type="checkbox" name="is_public" checked={formData.is_public} onChange={handleChange} className='w-5 h-5 rounded border-gray-300 text-pink-600 focus:ring-indigo-600'/>
                                <span className='text-sm font-medium text-gray-700 group-hover:text-pink-600 transition-colors'>Public Website</span>
                            </label>
                            <label className='flex items-center gap-3 cursor-pointer group'>
                                <input type="checkbox" name="is_store_enabled" checked={formData.is_store_enabled} onChange={handleChange} className='w-5 h-5 rounded border-gray-300 text-pink-600 focus:ring-indigo-600'/>
                                <span className='text-sm font-medium text-gray-700 group-hover:text-pink-600 transition-colors'>Enable Store</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default WebsiteDetails
