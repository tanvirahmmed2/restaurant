'use client'
import React, { useContext } from 'react'
import { Context } from '../context/Context'
import Link from 'next/link'
import Image from 'next/image'
import { MdDeleteOutline, MdClose } from 'react-icons/md'
import { motion, AnimatePresence } from 'framer-motion'

const CartBar = () => {
    const { subTotal, totalPrice, totalDiscount, cartBar, setCartBar, addToCart, removeFromCart, decreaseQuantity, clearCart, cart } = useContext(Context)

    return (
        <AnimatePresence>
            {cartBar && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setCartBar(false)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Cart Sidebar */}
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white z-[70] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 flex items-center justify-between border-b border-gray-50">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tighter">My Selection</h2>
                                <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] mt-1">
                                    {cart?.items?.length || 0} Items Reserved
                                </p>
                            </div>
                            <button 
                                onClick={() => setCartBar(false)}
                                className="p-3 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-gray-100"
                            >
                                <MdClose size={24} />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            {cart?.items?.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center gap-8">
                                    <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-300">
                                        <MdDeleteOutline size={48} />
                                    </div>
                                    <div className='space-y-2'>
                                        <p className="text-gray-900 font-black text-xl">Your cart is empty</p>
                                        <p className="text-gray-400 text-sm font-medium">Add some treats to your basket!</p>
                                    </div>
                                    <Link 
                                        href="/menu" 
                                        onClick={() => setCartBar(false)}
                                        className="px-10 py-4 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-xl shadow-black/10"
                                    >
                                        Browse Menu
                                    </Link>
                                </div>
                            ) : (
                                cart.items.map((item) => (
                                    <div key={item.cartItemId} className="flex gap-5 p-4 bg-white rounded-[2rem] border border-gray-50 group hover:border-gray-200 hover:shadow-xl hover:shadow-black/[0.02] transition-all duration-500">
                                        <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 bg-gray-50">
                                            <Image 
                                                src={item.image} 
                                                alt={item.title} 
                                                width={100} 
                                                height={100} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div className="flex justify-between items-start gap-2">
                                                <div>
                                                    <h3 className="font-black text-gray-900 text-base leading-tight tracking-tight">{item.title}</h3>
                                                    {item.selectedVariants && (
                                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                                            {Object.values(item.selectedVariants).map(v => (
                                                                <span key={v.id} className='text-[9px] font-black text-indigo-500 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-full'>
                                                                    {v.value}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="font-black text-gray-900 text-lg tracking-tighter">৳{item.salePrice || item.price}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center gap-4 bg-gray-50 rounded-2xl px-4 py-2 border border-transparent hover:border-gray-200 transition-all">
                                                    <button 
                                                        onClick={() => decreaseQuantity(item.cartItemId)}
                                                        className="text-gray-400 hover:text-black font-black text-lg cursor-pointer transition-colors"
                                                    >-</button>
                                                    <span className="text-sm font-black w-6 text-center text-gray-900">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => addToCart(item)}
                                                        className="text-gray-400 hover:text-black font-black text-lg cursor-pointer transition-colors"
                                                    >+</button>
                                                </div>
                                                <button 
                                                    onClick={() => removeFromCart(item.cartItemId)}
                                                    className="p-2.5 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                                                >
                                                    <MdDeleteOutline size={22} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer / Summary */}
                        {cart?.items?.length > 0 && (
                            <div className="p-8 bg-white border-t border-gray-50 space-y-6 shadow-[0_-20px_60px_rgba(0,0,0,0.08)]">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-400">
                                        <span>Subtotal Cost</span>
                                        <span>৳{subTotal}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-emerald-500">
                                        <span>Your Discount</span>
                                        <span>-৳{totalDiscount}</span>
                                    </div>
                                    <div className="flex justify-between text-3xl font-black text-gray-900 pt-4 border-t border-gray-50">
                                        <span>Total</span>
                                        <span className='tracking-tighter'>৳{totalPrice}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <Link 
                                        href="/checkout" 
                                        onClick={() => setCartBar(false)}
                                        className="w-full py-5 bg-black text-white text-center rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-[0_15px_40px_rgba(0,0,0,0.2)] hover:bg-gray-800 transition-all active:scale-[0.98]"
                                    >
                                        Place Order Now
                                    </Link>
                                    <button 
                                        onClick={() => clearCart()}
                                        className="text-[10px] font-black text-gray-300 hover:text-rose-500 uppercase tracking-[0.2em] transition-colors cursor-pointer text-center"
                                    >
                                        Discard Everything
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default CartBar
