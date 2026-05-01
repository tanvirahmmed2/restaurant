'use client'
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Context } from '../context/Context'
import { BiCartDownload } from 'react-icons/bi'
import { MdTimer } from 'react-icons/md'

const FlashSale = () => {
  const { addToCart } = useContext(Context)
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get('/api/product/discount/latest', { withCredentials: true })
        setProducts(res.data.payload || [])
      } catch (error) {
        setProducts([])
      }
    }
    fetchProduct()
  }, [])

  if (!products || products.length === 0) return null

  return (
    <section className='w-full py-24 bg-white'>
      <div className='max-w-7xl mx-auto px-6 space-y-16'>
        
        {/* Section Header */}
        <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
          <div className='space-y-4'>
            <div className='flex items-center gap-2 text-red-500 font-black uppercase tracking-[0.3em] text-[10px]'>
              <MdTimer className='animate-pulse text-lg' />
              Limited Time Offer
            </div>
            <h2 className='text-5xl font-black text-gray-900 tracking-tight'>Flash Sale!</h2>
          </div>
          <Link href={'/flashsale'} className='px-8 py-3 bg-gray-50 text-gray-900 rounded-full font-bold text-sm hover:bg-black hover:text-white transition-all shadow-sm'>
            View All Offers
          </Link>
        </div>

        <div className='flex flex-col gap-32'>
          {products.map((item, index) => {
            const hasDiscount = item.discount !== 0 && item.discount !== null
            const currentPrice = hasDiscount ? Number(item.price) - Number(item.discount) : Number(item.price)
            
            return (
              <div 
                key={item.id} 
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 lg:gap-24`}
              >
                {/* Image Section */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }} 
                  whileInView={{ opacity: 1, scale: 1 }} 
                  transition={{ duration: 0.8, type: 'spring' }} 
                  className='w-full md:w-1/2 relative'
                >
                  <div className='absolute inset-0 bg-indigo-100 rounded-full scale-110 -z-10 blur-3xl opacity-20' />
                  <Link href={`/menu/${item.slug}`} className='block relative aspect-square group'>
                    <Image 
                      src={item.image} 
                      alt={item.title} 
                      width={600} 
                      height={600} 
                      className='w-full h-full object-cover rounded-[60px] shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]' 
                    />
                    <div className='absolute -top-6 -right-6 w-24 h-24 bg-red-500 text-white rounded-full flex flex-col items-center justify-center shadow-xl rotate-12 group-hover:rotate-0 transition-transform'>
                      <span className='text-xs font-black uppercase tracking-tighter'>Save</span>
                      <span className='text-2xl font-black'>৳{item.discount}</span>
                    </div>
                  </Link>
                </motion.div>

                {/* Content Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.6, delay: 0.2 }} 
                  className='w-full md:w-1/2 space-y-6 text-center md:text-left'
                >
                  <div className='space-y-2'>
                    <span className='text-[10px] font-black uppercase text-indigo-600 tracking-widest'>{item.category_name}</span>
                    <h3 className='text-4xl font-black text-gray-900 leading-tight'>{item.title}</h3>
                  </div>
                  
                  <p className='text-gray-500 text-lg leading-relaxed max-w-md'>
                    {item.description || "Indulge in our chef's special creation, crafted with passion and the finest seasonal ingredients for an unforgettable taste."}
                  </p>

                  <div className='flex items-center justify-center md:justify-start gap-4'>
                    <div className='flex flex-col'>
                      <span className='text-sm text-gray-300 line-through font-bold'>৳{Number(item.price).toFixed(2)}</span>
                      <span className='text-4xl font-black text-gray-900'>৳{currentPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className='pt-4'>
                    <button 
                      onClick={() => addToCart(item)} 
                      className='group flex items-center justify-center md:justify-start gap-4 px-10 py-5 bg-black text-white rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-xl shadow-black/10 active:scale-95 w-full md:w-auto'
                    >
                      <BiCartDownload size={24} />
                      ADD TO CART
                    </button>
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default FlashSale
