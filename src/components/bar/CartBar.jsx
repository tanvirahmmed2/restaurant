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
                        className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[70] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 flex items-center justify-between border-b border-gray-100">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Your Cart</h2>
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-1">
                                    {cart?.items?.length || 0} Items Selected
                                </p>
                            </div>
                            <button 
                                onClick={() => setCartBar(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                            >
                                <MdClose size={24} />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {cart?.items?.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center gap-6">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                        <MdDeleteOutline size={40} />
                                    </div>
                                    <div>
                                        <p className="text-gray-900 font-bold">Your cart is empty</p>
                                        <p className="text-gray-400 text-sm mt-1">Start adding some delicious items!</p>
                                    </div>
                                    <Link 
                                        href="/menu" 
                                        onClick={() => setCartBar(false)}
                                        className="px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all"
                                    >
                                        Browse Menu
                                    </Link>
                                </div>
                            ) : (
                                cart.items.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100 group">
                                        <div className="w-20 h-20 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                            <Image 
                                                src={item.image} 
                                                alt={item.title} 
                                                width={80} 
                                                height={80} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
                                                <p className="font-black text-gray-900 text-sm">${item.salePrice || item.price}</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm">
                                                    <button 
                                                        onClick={() => decreaseQuantity(item.id)}
                                                        className="text-gray-400 hover:text-black font-bold px-1"
                                                    >-</button>
                                                    <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => addToCart(item)}
                                                        className="text-gray-400 hover:text-black font-bold px-1"
                                                    >+</button>
                                                </div>
                                                <button 
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-2 text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                                                >
                                                    <MdDeleteOutline size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer / Summary */}
                        {cart?.items?.length > 0 && (
                            <div className="p-6 bg-white border-t border-gray-100 space-y-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Subtotal</span>
                                        <span>${subTotal}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-emerald-600 font-bold">
                                        <span>Discount</span>
                                        <span>-${totalDiscount}</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-black text-gray-900 pt-2 border-t border-dashed border-gray-100">
                                        <span>Total</span>
                                        <span>${totalPrice}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Link 
                                        href="/checkout" 
                                        onClick={() => setCartBar(false)}
                                        className="w-full py-4 bg-black text-white text-center rounded-2xl font-black shadow-xl shadow-black/10 hover:bg-gray-800 transition-all active:scale-[0.98]"
                                    >
                                        PROCEED TO CHECKOUT
                                    </Link>
                                    <button 
                                        onClick={() => clearCart()}
                                        className="text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors cursor-pointer"
                                    >
                                        Clear Cart
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
