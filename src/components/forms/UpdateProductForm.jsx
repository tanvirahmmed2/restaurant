// components/forms/UpdateProductForm.jsx
'use client'
import React, { useState } from 'react'
import { MdOutlineEventAvailable } from "react-icons/md";
import { CgUnavailable } from "react-icons/cg";
import axios from 'axios';
import { toast } from 'react-toastify';

const UpdateProductForm = ({ product }) => {
    const [formData, setFormData] = useState({
        title: product.title,
        description: product.description,
        price: product.price,
        discount: product.discount || '',
        slug: product.slug,
        id: product.id
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const updateData = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('/api/product/update', formData, { withCredentials: true })
            toast.success(response.data.message)
        } catch (error) {
            console.error(error)
            toast.error(error?.response?.data?.message || 'Failed to update product')
        }
    }

    const changeStatus = async () => {
        try {
            const response = await axios.post('/api/product/status', { id: formData.id }, { withCredentials: true })
            toast.success(response.data.message)
            // Ideally reload or update state to reflect availability
            window.location.reload();
        } catch (error) {
            console.error(error)
            toast.error(error?.response?.data?.message || 'Failed to toggle availability')
        }
    }

    return (
        <div className='w-full flex flex-col items-center gap-6 p-4'>
            <form onSubmit={updateData} className='w-full flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
                <h2 className='text-xl font-bold text-gray-800'>Edit Product Details</h2>
                
                <div className='w-full flex flex-col gap-1'>
                    <label className='text-sm font-semibold text-gray-600'>Title</label>
                    <input type="text" name='title' id='title' required value={formData.title} onChange={handleChange} className='w-full p-2 px-3 rounded-lg border border-gray-300 outline-none focus:border-black transition-colors' />
                </div>
                
                <div className='w-full flex flex-col gap-1'>
                    <label className='text-sm font-semibold text-gray-600'>Description</label>
                    <textarea name="description" id="description" value={formData.description} required onChange={handleChange} className='w-full p-2 px-3 rounded-lg border border-gray-300 outline-none focus:border-black transition-colors h-24 resize-none' />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    <div className='flex flex-col gap-1'>
                        <label className='text-sm font-semibold text-gray-600'>Price (৳)</label>
                        <input type="number" min={0} required name='price' id='price' value={formData.price} onChange={handleChange} className='w-full p-2 px-3 rounded-lg border border-gray-300 outline-none focus:border-black transition-colors' />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label className='text-sm font-semibold text-gray-600'>Discount Value</label>
                        <input type="number" name='discount' id='discount' value={formData.discount} onChange={handleChange} className='w-full p-2 px-3 rounded-lg border border-gray-300 outline-none focus:border-black transition-colors' />
                    </div>
                </div>

                <button type='submit' className='bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-lg active:scale-[0.98]'>Save Changes</button>
            </form>

            <div className='w-full flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-300'>
                <div className='flex items-center gap-3'>
                    <span className='text-sm font-medium text-gray-500'>Availability Status:</span>
                    {product.is_available ? (
                        <span className='px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200'>LIVE ON MENU</span>
                    ) : (
                        <span className='px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold border border-red-200'>HIDDEN</span>
                    )}
                </div>
                <button onClick={changeStatus} className='flex items-center gap-2 text-sm font-bold bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95'>
                    {product.is_available ? <><CgUnavailable className='text-red-500' /> Mark Unavailable</> : <><MdOutlineEventAvailable className='text-green-500' /> Mark Available</>}
                </button>
            </div>
        </div>
    )
}

export default UpdateProductForm
