'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { MdSave, MdLanguage, MdBusiness, MdShare, MdPalette, MdCardMembership, MdWarning } from 'react-icons/md'

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
        tenant_status: 'active',
        expires_at: null
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

    const daysRemaining = website.expires_at ? Math.ceil((new Date(website.expires_at) - new Date()) / (1000 * 60 * 60 * 24)) : null
    const showExpiryAlert = daysRemaining !== null && daysRemaining <= 10 && daysRemaining > 0

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
                <div className="w-8 h-8 border-2 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 animate-in fade-in duration-700">
            {showExpiryAlert && (
                <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-4 animate-bounce">
                    <div className="p-3 bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-200">
                        <MdWarning size={24} />
                    </div>
                    <div>
                        <p className="text-rose-900 font-bold tracking-tight">Subscription Expiring Soon!</p>
                        <p className="text-rose-600 text-sm font-medium">Your subscription will expire in <span className="font-black underline">{daysRemaining} days</span>. Please renew to avoid service interruption.</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Website Settings</h1>
                    <p className="text-slate-500 font-medium">Update your brand identity and contact information.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-full text-sm font-bold">
                    <MdCardMembership size={16} />
                    {website.tenant_status?.toUpperCase() || 'ACTIVE'} PLAN
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                {/* Subscription & Validity */}
                <div className="bg-white border border-pink-100 rounded-3xl overflow-hidden shadow-xl shadow-pink-900/5">
                    <div className="px-8 py-5 border-b border-pink-50 flex items-center justify-between bg-gradient-to-r from-pink-50/50 to-transparent">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-pink-500 rounded-lg text-white">
                                <MdCardMembership size={20} />
                            </div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Subscription & Validity</h2>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${website.tenant_status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                            {website.tenant_status}
                        </div>
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-2 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Status</label>
                            <p className="text-xl font-black text-slate-900 capitalize">{website.tenant_status}</p>
                            <p className="text-xs text-slate-500 font-medium italic">Your account is currently in good standing.</p>
                        </div>
                        <div className={`flex flex-col gap-2 p-6 rounded-2xl border ${showExpiryAlert ? 'bg-rose-50 border-rose-100' : 'bg-pink-50 border-pink-100'}`}>
                            <label className={`text-[10px] font-black uppercase tracking-widest ${showExpiryAlert ? 'text-rose-400' : 'text-pink-400'}`}>Expiration Date</label>
                            <p className={`text-xl font-black ${showExpiryAlert ? 'text-rose-600' : 'text-pink-600'}`}>
                                {website.expires_at ? new Date(website.expires_at).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A'}
                            </p>
                            <p className={`text-xs font-bold ${showExpiryAlert ? 'text-rose-500' : 'text-pink-500'}`}>
                                {daysRemaining !== null ? `${daysRemaining} days remaining` : 'No expiration set'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Brand & Business */}
                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xl shadow-slate-900/5">
                    <div className="px-8 py-5 border-b border-slate-50 flex items-center gap-3 bg-slate-50/50">
                        <div className="p-2 bg-slate-900 rounded-lg text-white">
                            <MdBusiness size={20} />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Business Identity</h2>
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Website Name</label>
                            <input name="name" value={website.name} onChange={handleChange} className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:border-pink-500 focus:bg-white outline-none transition-all" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Business Legal Name</label>
                            <input name="business_name" value={website.business_name} onChange={handleChange} className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:border-pink-500 focus:bg-white outline-none transition-all" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Support Email</label>
                            <input name="email" value={website.email} onChange={handleChange} className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:border-pink-500 focus:bg-white outline-none transition-all" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Phone</label>
                            <input name="phone" value={website.phone} onChange={handleChange} className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:border-pink-500 focus:bg-white outline-none transition-all" />
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xl shadow-slate-900/5">
                    <div className="px-8 py-5 border-b border-slate-50 flex items-center gap-3 bg-slate-50/50">
                        <div className="p-2 bg-slate-900 rounded-lg text-white">
                            <MdLanguage size={20} />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Location & SEO</h2>
                    </div>
                    <div className="p-8 flex flex-col gap-8">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Address</label>
                            <input name="address" value={website.address} onChange={handleChange} className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:border-pink-500 focus:bg-white outline-none transition-all" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">City</label>
                                <input name="city" value={website.city} onChange={handleChange} className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:border-pink-500 focus:bg-white outline-none transition-all" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Country</label>
                                <input name="country" value={website.country} onChange={handleChange} className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:border-pink-500 focus:bg-white outline-none transition-all" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">SEO Title Tag</label>
                            <input name="meta_title" value={website.meta_title} onChange={handleChange} className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:border-pink-500 focus:bg-white outline-none transition-all" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">SEO Meta Description</label>
                            <textarea name="meta_description" value={website.meta_description} onChange={handleChange} rows={3} className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:border-pink-500 focus:bg-white outline-none transition-all resize-none" />
                        </div>
                    </div>
                </div>

                {/* Social & Colors */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xl shadow-slate-900/5">
                        <div className="px-8 py-5 border-b border-slate-50 flex items-center gap-3 bg-slate-50/50">
                            <div className="p-2 bg-slate-900 rounded-lg text-white">
                                <MdShare size={20} />
                            </div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Social Presence</h2>
                        </div>
                        <div className="p-8 flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Facebook URL</label>
                                <input name="facebook" value={website.facebook} onChange={handleChange} className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:border-pink-500 focus:bg-white outline-none transition-all" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Instagram URL</label>
                                <input name="instagram" value={website.instagram} onChange={handleChange} className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:border-pink-500 focus:bg-white outline-none transition-all" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">YouTube URL</label>
                                <input name="youtube" value={website.youtube} onChange={handleChange} className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:border-pink-500 focus:bg-white outline-none transition-all" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xl shadow-slate-900/5 h-full">
                        <div className="px-8 py-5 border-b border-slate-50 flex items-center gap-3 bg-slate-50/50">
                            <div className="p-2 bg-slate-900 rounded-lg text-white">
                                <MdPalette size={20} />
                            </div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Theme Colors</h2>
                        </div>
                        <div className="p-8 flex flex-col gap-8 h-full justify-center">
                            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-900/5">
                                <div className="flex flex-col gap-1">
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Primary Color</p>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{website.primary_color}</p>
                                </div>
                                <input type="color" name="primary_color" value={website.primary_color} onChange={handleChange} className="w-12 h-12 rounded-xl overflow-hidden border-none cursor-pointer shadow-lg shadow-slate-900/10" />
                            </div>
                            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-900/5">
                                <div className="flex flex-col gap-1">
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Secondary Color</p>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{website.secondary_color}</p>
                                </div>
                                <input type="color" name="secondary_color" value={website.secondary_color} onChange={handleChange} className="w-12 h-12 rounded-xl overflow-hidden border-none cursor-pointer shadow-lg shadow-slate-900/10" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-8 pb-12">
                    <button 
                        type="submit" 
                        disabled={saving}
                        className="group flex items-center gap-3 px-10 py-4 bg-pink-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-pink-600 shadow-2xl shadow-pink-500/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {saving ? (
                            <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <MdSave size={20} className="group-hover:rotate-12 transition-transform" />
                        )}
                        <span>Save Changes</span>
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AdminSettings
