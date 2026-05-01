'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useContext, useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Context } from '../context/Context'

const Intro = () => {
  const { siteData } = useContext(Context)
  const [items, setItems] = useState(null)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('/api/product/discount/latest', { withCredentials: true })
        setItems(response.data.payload)
      } catch (error) {
        setItems(null)
      }
    }
    fetchItems()
  }, [])

  const item = useMemo(() => {
    if (!items || items.length === 0) return null
    return items[Math.floor(Math.random() * items.length)]
  }, [items])

  if (!item) return null

  return (
    <section className='relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-white'>
      
      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-50/50 -skew-x-12 translate-x-1/4 -z-10" />

      <div className='max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center z-10'>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className='text-center lg:text-left space-y-10'
        >
          <div className="space-y-4">
            <div className='inline-block px-4 py-1 bg-pink-500 text-white text-[10px] font-semibold uppercase tracking-[0.3em] rounded-full'>
              {siteData?.name || 'Grand Kitchen'}
            </div>
            <h1 className='text-6xl md:text-8xl font-semibold text-gray-900 leading-[0.9] tracking-tight'>
              Taste the <br />
              <span className='text-gray-300 italic'>Extraordinary</span>
            </h1>
          </div>

          <p className='text-gray-500 text-lg md:text-xl font-medium max-w-lg leading-relaxed mx-auto lg:mx-0'>
            {siteData?.meta_description || "Experience culinary excellence with our curated selection of fine dishes and seasonal flavors."}
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4'>
            <Link href='/menu' className='px-10 py-4 bg-pink-500 text-white rounded-xl font-semibold text-sm hover:bg-pink-600 transition-all shadow-xl shadow-pink-900/10 active:scale-[0.98] uppercase tracking-widest'>
              View Menu
            </Link>
            
            <Link href='/reservation' className='px-10 py-4 border border-gray-100 text-gray-900 bg-white rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all uppercase tracking-widest'>
              Reservation
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className='relative'
        >
          <div className='relative w-full aspect-square max-w-lg mx-auto'>
            <div className='absolute inset-0 bg-gray-100 rounded-[3rem] rotate-6 -z-10 scale-95' />
            <div className='absolute inset-0 bg-pink-500/5 rounded-[3rem] -rotate-3 -z-10 scale-105' />
            
            <Image 
              src={item.image} 
              alt={item.title} 
              width={600} 
              height={600} 
              className='w-full h-full object-cover rounded-[3rem] shadow-2xl grayscale-[0.2] hover:grayscale-0 transition-all duration-700'
            />
            
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-2xl border border-gray-50"
            >
              <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest mb-1">Today's Special</p>
              <p className="text-sm font-semibold text-gray-900 mb-2 line-clamp-1">{item.title}</p>
              
              {(() => {
                const hasDiscount = item.discount !== 0 && item.discount !== null;
                let variantAdjustment = 0;
                const defaultVariants = {};
                if (item.variants) {
                  item.variants.forEach(v => {
                    if (!defaultVariants[v.name] || v.is_default) {
                      defaultVariants[v.name] = v;
                    }
                  });
                  Object.values(defaultVariants).forEach(v => {
                    variantAdjustment += Number(v.price_adjustment || 0);
                  });
                }
                const baseWithVariant = Number(item.price) + variantAdjustment;
                const currentPrice = hasDiscount ? baseWithVariant - Number(item.discount) : baseWithVariant;
                
                return (
                  <div className='flex flex-col gap-0'>
                    {hasDiscount && <p className='text-[10px] line-through text-gray-400'>৳{baseWithVariant.toFixed(2)}</p>}
                    <p className="text-2xl font-semibold text-black tracking-tight">
                      ৳{currentPrice.toFixed(2)}
                    </p>
                  </div>
                );
              })()}
            </motion.div>
          </div>
        </motion.div>

      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-20">
        <p className='text-[10px] font-semibold uppercase tracking-[0.5em] vertical-text'>Scroll</p>
        <div className="w-px h-12 bg-pink-500" />
      </div>
    </section>
  )
}

export default Intro