'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { MdSave, MdLanguage, MdBusiness, MdShare, MdPalette } from 'react-icons/md'

const AdminSettings = () => {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [website, setWebsite] = useState({
        name: '',
        business_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        meta_title: '',
        meta_description: '',
        facebook: '',
        instagram: '',
        youtube: '',
        primary_color: '#000000',
        secondary_color: '#ffffff',
    })

    const fetchWebsite = async () => {
        try {
            const res = await axios.get('/api/website', { withCredentials: true })
            if (res.data.success) {
                setWebsite(res.data.payload)
            }
        } catch (error) {
            toast.error("Failed to load settings")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchWebsite()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setWebsite(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const res = await axios.post('/api/website', website, { withCredentials: true })
            if (res.data.success) {
                toast.success("Settings updated successfully")
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update settings")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Website Settings</h1>
                <p className="text-gray-500 text-sm">Update your brand identity and contact information.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                {/* Brand & Business */}
                <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2 bg-gray-50/50">
                        <MdBusiness className="text-gray-400" />
                        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">Business Identity</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Website Name</label>
                            <input name="name" value={website.name} onChange={handleChange} className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm font-semibold focus:border-pink-500 outline-none transition-all" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Business Legal Name</label>
                            <input name="business_name" value={website.business_name} onChange={handleChange} className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm font-semibold focus:border-pink-500 outline-none transition-all" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Support Email</label>
                            <input name="email" value={website.email} onChange={handleChange} className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm font-semibold focus:border-pink-500 outline-none transition-all" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Contact Phone</label>
                            <input name="phone" value={website.phone} onChange={handleChange} className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm font-semibold focus:border-pink-500 outline-none transition-all" />
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2 bg-gray-50/50">
                        <MdLanguage className="text-gray-400" />
                        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">Location & SEO</h2>
                    </div>
                    <div className="p-6 flex flex-col gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Full Address</label>
                            <input name="address" value={website.address} onChange={handleChange} className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm font-semibold focus:border-pink-500 outline-none transition-all" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">City</label>
                                <input name="city" value={website.city} onChange={handleChange} className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm font-semibold focus:border-pink-500 outline-none transition-all" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Country</label>
                                <input name="country" value={website.country} onChange={handleChange} className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm font-semibold focus:border-pink-500 outline-none transition-all" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">SEO Title Tag</label>
                            <input name="meta_title" value={website.meta_title} onChange={handleChange} className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm font-semibold focus:border-pink-500 outline-none transition-all" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">SEO Meta Description</label>
                            <textarea name="meta_description" value={website.meta_description} onChange={handleChange} rows={3} className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm font-semibold focus:border-pink-500 outline-none transition-all resize-none" />
                        </div>
                    </div>
                </div>

                {/* Social & Colors */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2 bg-gray-50/50">
                            <MdShare className="text-gray-400" />
                            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">Social Presence</h2>
                        </div>
                        <div className="p-6 flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Facebook URL</label>
                                <input name="facebook" value={website.facebook} onChange={handleChange} className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm font-semibold focus:border-pink-500 outline-none transition-all" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Instagram URL</label>
                                <input name="instagram" value={website.instagram} onChange={handleChange} className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm font-semibold focus:border-pink-500 outline-none transition-all" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">YouTube URL</label>
                                <input name="youtube" value={website.youtube} onChange={handleChange} className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm font-semibold focus:border-pink-500 outline-none transition-all" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2 bg-gray-50/50">
                            <MdPalette className="text-gray-400" />
                            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">Theme Colors</h2>
                        </div>
                        <div className="p-6 flex flex-col gap-6">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-xs font-semibold text-gray-800">Primary Color</p>
                                    <p className="text-[10px] text-gray-400 font-medium uppercase">{website.primary_color}</p>
                                </div>
                                <input type="color" name="primary_color" value={website.primary_color} onChange={handleChange} className="w-10 h-10 rounded-lg overflow-hidden border-none cursor-pointer" />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-xs font-semibold text-gray-800">Secondary Color</p>
                                    <p className="text-[10px] text-gray-400 font-medium uppercase">{website.secondary_color}</p>
                                </div>
                                <input type="color" name="secondary_color" value={website.secondary_color} onChange={handleChange} className="w-10 h-10 rounded-lg overflow-hidden border-none cursor-pointer" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        type="submit" 
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-3 bg-pink-500 text-white rounded-xl font-semibold text-sm hover:bg-pink-600 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {saving ? (
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <MdSave size={18} />
                        )}
                        <span>Save Changes</span>
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AdminSettings
