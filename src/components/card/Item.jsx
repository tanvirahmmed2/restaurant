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

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      whileInView={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.5 }} 
      className='w-full flex flex-col bg-white rounded-3xl overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100'
    >
      {/* Image Container */}
      <div className='relative w-full aspect-square overflow-hidden'>
        <Image 
          src={item.image} 
          alt={item.title} 
          width={500} 
          height={500} 
          className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110' 
        />
        {hasDiscount && (
          <div className='absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg'>
            Save ${item.discount}
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className='p-5 flex flex-col gap-3'>
        <div className='flex flex-col gap-1'>
          <p className='text-[10px] font-black uppercase text-gray-400 tracking-widest'>{item.category_name}</p>
          <Link href={`/menu/${item.slug}`} className='text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1'>
            {item.title}
          </Link>
        </div>

        <div className='flex items-center justify-between mt-1'>
          <div className='flex flex-col'>
            {hasDiscount && (
              <p className='text-xs line-through text-gray-300 font-bold'>${Number(item.price).toFixed(2)}</p>
            )}
            <p className='text-xl font-black text-gray-900'>${currentPrice.toFixed(2)}</p>
          </div>
          
          <button 
            onClick={() => addToCart(item)} 
            className='p-3 bg-black text-white rounded-2xl hover:bg-indigo-600 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-black/5 active:scale-90 cursor-pointer'
          >
            <BiCartDownload size={22} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default Item
