'use client'
import Image from 'next/image'
import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Context } from '../context/Context'
import { BiCartDownload } from "react-icons/bi";

const Item = ({ item }) => {
  const { addToCart } = useContext(Context)

  const hasDiscount = item.discount !== 0 && item.discount !== null
  const currentPrice = hasDiscount ? Number(item.price) - Number(item.discount) : Number(item.price)

  const handleAddToCart = () => {
    const defaultVariants = {}
    if (item.variants) {
      item.variants.forEach(v => {
        if (!defaultVariants[v.name] || v.is_default) {
          defaultVariants[v.name] = v
        }
      })
    }

    let finalPrice = Number(item.price)
    Object.values(defaultVariants).forEach(v => {
      finalPrice += Number(v.price_adjustment || 0)
    })

    addToCart({ ...item, price: finalPrice, selectedVariants: defaultVariants })
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }} 
      className='w-full flex flex-col bg-white rounded-[2rem] overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-700 border border-slate-50 relative'
    >
      {/* Image Container */}
      <div className='relative w-full aspect-[4/5] overflow-hidden bg-slate-100'>
        <Image 
          src={item.image} 
          alt={item.title} 
          width={500} 
          height={500} 
          className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110' 
        />
        {hasDiscount && (
          <div className='absolute top-4 left-4 z-10'>
            <div className='bg-rose-500 text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg shadow-rose-500/30'>
              -৳{item.discount} OFF
            </div>
          </div>
        )}
        
        {/* Quick Add Overlay */}
        <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-2'>
           <button 
            onClick={handleAddToCart} 
            className='p-4 bg-white text-black rounded-2xl hover:bg-black hover:text-white transition-all duration-300 shadow-2xl active:scale-90 cursor-pointer transform translate-y-4 group-hover:translate-y-0'
          >
            <BiCartDownload size={24} />
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className='p-6 flex flex-col gap-4 relative bg-white'>
        <div className='flex flex-col gap-1.5'>
          <p className='text-[9px] font-black uppercase text-indigo-500 tracking-[0.25em]'>{item.category_name}</p>
          <Link href={`/menu/${item.slug}`} className='text-lg font-black text-slate-800 hover:text-indigo-600 transition-colors line-clamp-1 tracking-tight'>
            {item.title}
          </Link>
          {item.variants && item.variants.length > 0 && (
            <div className='flex items-center gap-1.5 mt-1'>
                <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse' />
                <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>Customizable</p>
            </div>
          )}
        </div>

        <div className='flex items-center justify-between mt-2 pt-4 border-t border-slate-50'>
          <div className='flex flex-col'>
            {hasDiscount && (
              <p className='text-[10px] line-through text-slate-300 font-bold tracking-tighter'>৳{Number(item.price).toFixed(2)}</p>
            )}
            <p className='text-2xl font-black text-slate-900 tracking-tighter'>৳{currentPrice.toFixed(2)}</p>
          </div>
          
          <Link href={`/menu/${item.slug}`} className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-black transition-colors'>
            Details
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default Item
