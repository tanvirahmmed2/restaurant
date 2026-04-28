'use client'
import axios from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { FaUserPlus } from 'react-icons/fa'

const AddPeople = () => {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const addNewPeople = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await axios.post('/api/staff', formData, { withCredentials: true })
            toast.success(response.data.message)
            setFormData({
                name: '',
                email: '',
                password: '',
                role: ''
            })
            window.location.reload()
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add new access')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={addNewPeople} className='w-full bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6'>
            <div className='flex items-center gap-3 border-b border-gray-50 pb-4'>
                <FaUserPlus className='text-indigo-600' />
                <h2 className='text-xl font-bold text-gray-800'>Add New Access</h2>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='flex flex-col gap-1'>
                    <label htmlFor="name" className='text-xs font-bold uppercase text-gray-400'>Full Name</label>
                    <input type="text" id='name' name='name' required value={formData.name} onChange={handleChange} 
                        className='w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black transition-all' 
                        placeholder="John Doe" />
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor="role" className='text-xs font-bold uppercase text-gray-400'>Access Role</label>
                    <select name="role" id="role" required value={formData.role} onChange={handleChange} 
                        className='w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black transition-all appearance-none'>
                        <option value="">Select a role</option>
                        <option value="admin">Administrator</option>
                        <option value="manager">Manager</option>
                        <option value="sales">Sales Representative</option>
                    </select>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='flex flex-col gap-1'>
                    <label htmlFor="email" className='text-xs font-bold uppercase text-gray-400'>Email Address</label>
                    <input type="email" id='email' name='email' required value={formData.email} onChange={handleChange} 
                        className='w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black transition-all' 
                        placeholder="john@example.com" />
                </div>

                <div className='flex flex-col gap-1'>
                    <label htmlFor="password">
                        <span className='text-xs font-bold uppercase text-gray-400'>Initial Password</span>
                    </label>
                    <input type="text" id='password' name='password' required value={formData.password} onChange={handleChange} 
                        className='w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black transition-all' 
                        placeholder="••••••••" />
                </div>
            </div>

            <button 
                type='submit' 
                disabled={loading}
                className='mt-2 bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-lg disabled:opacity-50'
            >
                {loading ? 'Processing...' : 'Grant Access'}
            </button>
        </form>
    )
}

export default AddPeople
