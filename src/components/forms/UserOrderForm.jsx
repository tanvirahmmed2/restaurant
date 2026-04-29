'use client'
import React, { useContext, useState, useEffect } from 'react'
import { Context } from '../context/Context'
import Link from 'next/link'
import Image from 'next/image'
import { MdDeleteOutline, MdArrowBack, MdPayment, MdLocalShipping, MdPerson } from 'react-icons/md'
import axios from 'axios'
import toast from 'react-hot-toast'

const deliveryOptions = [
    { id: 'takeaway', label: 'Takeaway', icon: '🛍️' },
    { id: 'takein', label: 'Dine In', icon: '🍽️' }
]
const paymentOptions = [
    { id: 'bkash', label: 'bKash', color: 'bg-[#e2136e]' },
    { id: 'nagad', label: 'Nagad', color: 'bg-[#f69220]' },
    { id: 'rocket', label: 'Rocket', color: 'bg-[#8c3494]' },
    { id: 'card', label: 'Card', color: 'bg-indigo-600' },
    { id: 'cash', label: 'Cash on Order', color: 'bg-gray-800' }
]

const UserOrderForm = () => {
    const { subTotal, totalPrice, totalDiscount, addToCart, removeFromCart, decreaseQuantity, clearCart, userData, cart } = useContext(Context)
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        delivery_method: 'takein',
        payment_method: 'bkash',
        transaction_id: '',
    })

    useEffect(() => {
        if (userData) {
            setFormData(prev => ({
                ...prev,
                name: userData.name || '',
                phone: userData.phone || ''
            }))
        }
    }, [userData])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleOrder = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const orderPayload = {
                ...formData,
                items: cart.items,
                sub_total: subTotal,
                total_discount: totalDiscount,
                total_price: totalPrice,
                status: 'pending'
            }
            const res = await axios.post('/api/order', orderPayload, { withCredentials: true })
            toast.success(res.data.message)
            clearCart()
            window.location.replace('/profile')
        } catch (error) {
            console.error(error)
            toast.error(error?.response?.data?.message || "Failed to place order")
        } finally {
            setLoading(false)
        }
    }

    if (cart?.items.length === 0) {
        return (
            <div className='w-full min-h-[60vh] flex flex-col items-center justify-center gap-8 pt-20 px-6'>
                <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-4xl'>🛒</div>
                <div className='text-center space-y-2'>
                    <h2 className='text-3xl font-black text-gray-900'>Your cart is empty</h2>
                    <p className='text-gray-400'>Add some delicious items to start your gourmet journey.</p>
                </div>
                <Link href={'/menu'} className='px-10 py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-black/10'>Browse Menu</Link>
            </div>
        )
    }

    return (
        <div className='w-full min-h-screen bg-gray-50/50 pt-28 pb-20 px-6'>
            <div className='max-w-7xl mx-auto flex flex-col gap-12'>
                
                {/* Header */}
                <div className='flex items-center gap-4'>
                    <Link href="/menu" className='p-3 bg-white rounded-2xl border border-gray-100 text-gray-400 hover:text-black hover:shadow-md transition-all'>
                        <MdArrowBack size={24} />
                    </Link>
                    <div>
                        <h1 className='text-4xl font-black text-gray-900 tracking-tight'>Checkout</h1>
                        <p className='text-gray-400 text-sm font-bold uppercase tracking-widest mt-1'>Complete your gourmet experience</p>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 items-start'>
                    
                    {/* Left: Cart Items & Forms */}
                    <div className='lg:col-span-7 flex flex-col gap-10'>
                        
                        {/* 1. Personal Information */}
                        <section className='bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6'>
                            <div className='flex items-center gap-3 border-b border-gray-50 pb-4'>
                                <div className='w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center'><MdPerson /></div>
                                <h2 className='text-xl font-bold text-gray-800'>Contact Information</h2>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div className='flex flex-col gap-1.5'>
                                    <label className='text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1'>Full Name</label>
                                    <input type="text" name='name' required onChange={handleChange} value={formData.name} className='w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-black transition-all' />
                                </div>
                                <div className='flex flex-col gap-1.5'>
                                    <label className='text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1'>Phone Number</label>
                                    <input type="text" name='phone' required onChange={handleChange} value={formData.phone} className='w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-black transition-all' />
                                </div>
                            </div>
                        </section>

                        {/* 2. Order Items */}
                        <section className='space-y-6'>
                            <div className='flex items-center justify-between'>
                                <h2 className='text-xl font-bold text-gray-800'>Review Items</h2>
                                <button onClick={() => clearCart()} className='text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors cursor-pointer'>Clear All</button>
                            </div>
                            <div className='flex flex-col gap-4'>
                                {cart?.items.map((item) => (
                                    <div key={item.id} className='bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-md transition-shadow'>
                                        <div className='w-24 h-24 rounded-2xl overflow-hidden shadow-sm flex-shrink-0'>
                                            <Image src={item?.image} alt={item.title} width={150} height={150} className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500' />
                                        </div>
                                        <div className='flex-1 flex flex-col justify-between py-1'>
                                            <div className='flex justify-between items-start'>
                                                <div>
                                                    <h3 className='font-bold text-gray-900 text-lg'>{item.title}</h3>
                                                    <p className='text-xs text-gray-400 uppercase font-black tracking-widest'>{item.category_name}</p>
                                                </div>
                                                <p className='font-black text-gray-900'>${item.salePrice || item.price}</p>
                                            </div>
                                            <div className='flex items-center justify-between mt-4'>
                                                <div className='flex items-center gap-4 bg-gray-50 rounded-full px-4 py-2 border border-gray-100'>
                                                    <button className='text-gray-400 hover:text-black font-black' onClick={() => decreaseQuantity(item.id)}>-</button>
                                                    <span className='font-black text-gray-900 w-4 text-center'>{item.quantity}</span>
                                                    <button className='text-gray-400 hover:text-black font-black' onClick={() => addToCart(item)}>+</button>
                                                </div>
                                                <button className='p-2 text-gray-300 hover:text-red-500 transition-colors' onClick={() => removeFromCart(item.id)}><MdDeleteOutline size={24} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right: Payment & Summary */}
                    <div className='lg:col-span-5 sticky top-28 space-y-8'>
                        
                        {/* 3. Delivery & Payment Methods */}
                        <section className='bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-8'>
                            <div className='space-y-6'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center'><MdLocalShipping /></div>
                                    <h2 className='text-xl font-bold text-gray-800'>Delivery Method</h2>
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                    {deliveryOptions.map((opt) => (
                                        <button 
                                            key={opt.id}
                                            type="button"
                                            onClick={() => setFormData(p => ({...p, delivery_method: opt.id}))}
                                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 cursor-pointer ${
                                                formData.delivery_method === opt.id 
                                                ? 'border-black bg-gray-50' 
                                                : 'border-gray-50 hover:border-gray-200'
                                            }`}
                                        >
                                            <span className="text-2xl">{opt.icon}</span>
                                            <span className={`text-xs font-black uppercase tracking-widest ${formData.delivery_method === opt.id ? 'text-black' : 'text-gray-400'}`}>{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className='space-y-6 border-t border-gray-50 pt-8'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center'><MdPayment /></div>
                                    <h2 className='text-xl font-bold text-gray-800'>Payment Method</h2>
                                </div>
                                <div className='grid grid-cols-3 gap-3'>
                                    {paymentOptions.map((opt) => (
                                        <button 
                                            key={opt.id}
                                            type="button"
                                            onClick={() => setFormData(p => ({...p, payment_method: opt.id}))}
                                            className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                                                formData.payment_method === opt.id 
                                                ? 'border-black bg-gray-50' 
                                                : 'border-gray-50 hover:border-gray-200'
                                            }`}
                                        >
                                            <div className={`w-full h-1 rounded-full ${opt.color} mb-1`} />
                                            <span className={`text-[10px] font-black uppercase tracking-tighter ${formData.payment_method === opt.id ? 'text-black' : 'text-gray-400'}`}>{opt.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {formData.payment_method !== 'cash' && (
                                    <div className='flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2'>
                                        <label className='text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1'>Transaction ID</label>
                                        <input 
                                            type="text" 
                                            name='transaction_id' 
                                            required 
                                            onChange={handleChange} 
                                            value={formData.transaction_id} 
                                            placeholder="Enter TrxID"
                                            className='w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-black transition-all' 
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Order Summary */}
                            <div className='space-y-4 border-t border-gray-50 pt-8'>
                                <div className='flex justify-between text-sm text-gray-500'>
                                    <span>Subtotal</span>
                                    <span className='font-bold text-gray-900'>${subTotal}</span>
                                </div>
                                <div className='flex justify-between text-sm text-emerald-600 font-bold'>
                                    <span>Discount</span>
                                    <span>-${totalDiscount}</span>
                                </div>
                                <div className='flex justify-between text-3xl font-black text-gray-900 pt-4 border-t border-dashed border-gray-100'>
                                    <span>Total</span>
                                    <span>${totalPrice}</span>
                                </div>
                            </div>

                            <button 
                                onClick={handleOrder}
                                disabled={loading}
                                className='w-full py-5 bg-black text-white rounded-3xl font-black text-lg hover:bg-gray-800 transition-all shadow-2xl shadow-black/20 active:scale-[0.98] disabled:opacity-50 mt-4'
                            >
                                {loading ? 'PLACING ORDER...' : 'PLACE ORDER'}
                            </button>
                        </section>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default UserOrderForm