'use client'
import { Context } from '@/components/context/Context'
import axios from 'axios'
import Image from 'next/image'
import React, { useContext } from 'react'
import { MdDeleteOutline, MdEdit } from 'react-icons/md'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { FaPlus } from 'react-icons/fa'

const CategorListPage = () => {
  const { categories, fetchCategories } = useContext(Context)

  const handleDelete=async(id)=>{
    const confirm= window.confirm('Are you sure to delete this category?')
    if(!confirm) return
    try {
      const res= await axios.delete('/api/category',{data:{id},withCredentials:true})
      toast.success(res.data.message)
      fetchCategories()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete category")
    }
  }

  return (
    <div className='w-full max-w-4xl mx-auto p-6 flex flex-col gap-8'>
      <div className='flex flex-row items-center justify-between border-b border-gray-100 pb-6'>
        <div>
          <h1 className='text-3xl font-black text-gray-900 tracking-tight'>Categories</h1>
          <p className='text-gray-500'>Organize your products into groups.</p>
        </div>
        <Link 
          href="/dashboard/manager/new-category" 
          className='flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-lg'
        >
          <FaPlus size={14}/>
          <span>Add Category</span>
        </Link>
      </div>

      <div className='w-full flex flex-col gap-4'>
        {categories && categories.length > 0 ? (
          <div className='flex flex-col gap-2'>
            <div className='w-full grid grid-cols-6 bg-gray-50 p-4 rounded-xl font-bold text-xs uppercase text-gray-400 tracking-widest'>
              <p className='col-span-1'>Image</p>
              <p className='col-span-4'>Category Name</p>
              <p className='text-right'>Actions</p>
            </div>
            
            <div className='flex flex-col gap-2'>
              {categories.map((cat) => (
                <div key={cat.id} className='w-full grid grid-cols-6 p-4 items-center bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-all group'>
                  <div className='col-span-1'>
                    <div className='w-12 h-12 rounded-xl overflow-hidden shadow-sm'>
                      <Image src={cat?.image} alt={cat?.name} width={48} height={48} className='object-cover w-full h-full'/>
                    </div>
                  </div>
                  <h1 className='col-span-4 font-bold text-gray-800'>{cat?.name}</h1>
                  <div className='flex flex-row items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity text-xl'>
                    <button className='p-2 text-gray-400 hover:text-black transition-colors'><MdEdit/></button>
                    <button className='p-2 text-red-300 hover:text-red-600 transition-colors' onClick={()=>handleDelete(cat.id)}><MdDeleteOutline /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className='text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200'>
            <p className='text-gray-400 font-medium'>No categories found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategorListPage
