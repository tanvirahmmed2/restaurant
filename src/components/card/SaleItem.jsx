'use client'
import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Context } from '../context/Context'

const SaleItem = ({item}) => {
    const { addToCart } = useContext(Context)

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

    const currentPrice = item.discount ? Number(item.price) - Number(item.discount) : Number(item.price)

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            onClick={handleAddToCart} 
            className='w-full flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-black transition-all cursor-pointer group'
        >
            <div className='relative w-full aspect-[4/3] overflow-hidden bg-gray-50'>
                <Image 
                    src={item.image} 
                    alt={item.title} 
                    width={200} 
                    height={150} 
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' 
                />
                {item.discount > 0 && (
                    <div className='absolute top-2 left-2 bg-black text-white text-[8px] font-semibold uppercase px-2 py-0.5 rounded'>
                        -৳{item.discount}
                    </div>
                )}
            </div>
            <div className='p-2.5 flex flex-col gap-0.5'>
                <p className='text-[8px] font-semibold text-gray-400 uppercase tracking-widest'>{item.category_name}</p>
                <h4 className='text-[11px] font-semibold text-gray-800 line-clamp-1 group-hover:text-black transition-colors'>{item.title}</h4>
                <div className='flex items-center justify-between mt-1'>
                    <div className='flex items-baseline gap-1.5'>
                        <p className='text-xs font-semibold text-gray-900'>৳{currentPrice.toLocaleString()}</p>
                        {item.discount > 0 && (
                            <p className='line-through text-[9px] text-gray-300 font-medium'>৳{item.price}</p>
                        )}
                    </div>
                    {item.variants && item.variants.length > 0 && (
                        <div className='w-1.5 h-1.5 rounded-full bg-emerald-400' title="Has Variants" />
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default SaleItem
