import DeleteProduct from '@/components/buttons/DeleteProduct'
import UpdateProduct from '@/components/buttons/UpdateProduct'
import { BASE_URL } from '@/lib/database/secret'
import Link from 'next/link'
import React from 'react'
import { FaPlus } from 'react-icons/fa'

const Products = async () => {
  let products = [];
  try {
    const res = await fetch(`${BASE_URL}/api/product`, {
      method: 'GET',
      cache: 'no-store'
    })
    const data = await res.json()
    products = data.payload || []
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }

  return (
    <div className='w-full max-w-6xl mx-auto p-6 flex flex-col gap-8'>
      <div className='flex flex-row items-center justify-between border-b border-gray-100 pb-6'>
        <div>
          <h1 className='text-3xl font-black text-gray-900 tracking-tight'>Products</h1>
          <p className='text-gray-500'>Manage your menu items and availability.</p>
        </div>
        <Link 
          href="/dashboard/manager/new-product" 
          className='flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-lg'
        >
          <FaPlus size={14}/>
          <span>Add Product</span>
        </Link>
      </div>
      
      <div className='w-full flex flex-col gap-4'>
        <div className='w-full grid grid-cols-5 bg-gray-50 p-4 rounded-xl font-bold text-xs uppercase text-gray-400 tracking-widest'>
          <p className='col-span-2'>Product</p>
          <p>Price</p>
          <p>Status</p>
          <p className='text-right'>Actions</p>
        </div>
        
        <div className='flex flex-col gap-2'>
          {
            products.map((product) => (
              <div key={product.id} className='w-full grid grid-cols-5 p-4 items-center bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-all group'>
                <div className='col-span-2 flex items-center gap-4'>
                  {product.image && (
                    <img src={product.image} alt={product.title} className='w-12 h-12 rounded-xl object-cover shadow-sm' />
                  )}
                  <div>
                    <Link href={`/menu/${product.slug}`} className='font-bold text-gray-800 hover:text-indigo-600 transition-colors'>{product.title}</Link>
                    <p className='text-xs text-gray-400'>{product.category_name}</p>
                  </div>
                </div>
                <p className='font-bold text-gray-900'>${Number(product.price).toFixed(2)}</p>
                <div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    product.is_available ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {product.is_available ? 'In Stock' : "Out of Stock"}
                  </span>
                </div>
                <div className='flex flex-row items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <UpdateProduct slug={product.slug} />
                  <DeleteProduct id={product.id} />
                </div>
              </div>
            ))
          }
          {products.length === 0 && (
            <div className='text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200'>
              <p className='text-gray-400 font-medium'>No products found. Start by adding one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products
