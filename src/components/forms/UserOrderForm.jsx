// components/forms/UserOrderForm.jsx
'use client'
import React, { useContext, useState, useEffect } from 'react'
import { Context } from '../context/Context'
import Link from 'next/link'
import Image from 'next/image'
import { MdDeleteOutline } from 'react-icons/md'
import axios from 'axios'
import { toast } from 'react-toastify'

const deliveryOptions = ['takeaway', 'takein']
const paymentOptions = ['bkash', 'card', 'nagad', 'rocket', 'cash']

const UserOrderForm = () => {
    const { subTotal, totalPrice, totalDiscount, addToCart, removeFromCart, decreaseQuantity, clearCart, userData, cart } = useContext(Context)

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
        } catch (error) {
            console.error(error)
            toast.error(error?.response?.data?.message || "Failed to place order")
        }
    }

    return (
        <div className={` w-full min-h-screen flex flex-col items-center p-4`}>
            {cart?.items.length === 0 ? (
                <div className='w-full flex flex-col items-center gap-7 pt-20'>
                    <p className='text-xl text-gray-500'>Your cart is empty</p>
                    <Link href={'/menu'} className='px-8 py-2 bg-black text-white rounded-full font-bold hover:opacity-80 transition-opacity'>Browse Menu</Link>
                </div>
            ) : (
                <div className='w-full flex flex-col md:flex-row items-center md:items-start justify-center gap-8 max-w-5xl mx-auto'>
                    <div className='w-full flex flex-col gap-6'>
                        <h1 className='text-3xl font-bold'>Your Items</h1>
                        <div className='flex flex-col gap-3'>
                            {cart?.items.map((item) => (
                                <div key={item.id} className='w-full grid grid-cols-5 border rounded-2xl p-2 gap-4 bg-white shadow-sm'>
                                    <div className='col-span-1 aspect-square overflow-hidden rounded-xl'>
                                        <Image src={item?.image} alt={item.title} width={100} height={100} className='w-full h-full object-cover' />
                                    </div>
                                    <div className='col-span-4 flex flex-col justify-between py-1'>
                                        <div className='flex justify-between items-start'>
                                            <p className='font-bold text-lg'>{item.title}</p>
                                            <p className='font-bold'>৳{item.salePrice}</p>
                                        </div>
                                        <div className='flex items-center justify-between mt-2'>
                                            <div className='flex items-center gap-4 bg-gray-100 rounded-full px-4 py-1'>
                                                <button className='text-xl cursor-pointer hover:text-green-600' onClick={() => decreaseQuantity(item.id)}>-</button>
                                                <p className='font-bold w-4 text-center'>{item.quantity}</p>
                                                <button className='text-xl cursor-pointer hover:text-green-600' onClick={() => addToCart(item)}>+</button>
                                            </div>
                                            <button className='text-2xl text-red-500 cursor-pointer hover:scale-110 transition-transform' onClick={() => removeFromCart(item.id)}><MdDeleteOutline /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className='text-gray-400 hover:text-red-500 underline text-sm' onClick={() => clearCart()}>Clear cart</button>
                    </div>

                    <form onSubmit={handleOrder} className='bg-black text-white w-full max-w-md flex flex-col gap-6 p-8 rounded-3xl sticky top-24'>
                        <h2 className='text-2xl font-bold border-b border-white/20 pb-4'>Checkout Details</h2>
                        
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="name" className='text-xs font-bold uppercase opacity-60'>Name</label>
                            <input type="text" name='name' id='name' required onChange={handleChange} value={formData.name} className='w-full p-3 bg-white/10 border border-white/10 rounded-xl outline-none focus:border-white transition-colors' />
                        </div>
                        
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="phone" className='text-xs font-bold uppercase opacity-60'>Phone</label>
                            <input type="text" name='phone' id='phone' onChange={handleChange} required value={formData.phone} className='w-full p-3 bg-white/10 border border-white/10 rounded-xl outline-none focus:border-white transition-colors' />
                        </div>

                        <div className='flex flex-col gap-3 border-t border-white/10 pt-6'>
                            <div className='flex justify-between opacity-60'>
                                <p>Subtotal</p>
                                <p>৳{subTotal}</p>
                            </div>
                            <div className='flex justify-between opacity-60'>
                                <p>Discount</p>
                                <p>৳{totalDiscount}</p>
                            </div>
                            <div className='flex justify-between text-2xl font-bold mt-2'>
                                <p>Total</p>
                                <p>৳{totalPrice}</p>
                            </div>
                        </div>

                        <div className='flex flex-col gap-4 mt-2'>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor="delivery_method" className='text-xs font-bold uppercase opacity-60'>Delivery Method</label>
                                <select name="delivery_method" id="delivery_method" onChange={handleChange} value={formData.delivery_method} required className='w-full p-3 bg-white/10 border border-white/10 rounded-xl outline-none focus:border-white appearance-none'>
                                    {deliveryOptions.map((p) => (
                                        <option value={p} key={p} className='text-black'>{p.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>

                            <div className='flex flex-col gap-1'>
                                <label htmlFor="payment_method" className='text-xs font-bold uppercase opacity-60'>Payment Method</label>
                                <select name="payment_method" id="payment_method" onChange={handleChange} value={formData.payment_method} required className='w-full p-3 bg-white/10 border border-white/10 rounded-xl outline-none focus:border-white appearance-none'>
                                    {paymentOptions.map((p) => (
                                        <option value={p} key={p} className='text-black'>{p.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>

                            {formData.payment_method !== 'cash' && (
                                <div className='flex flex-col gap-1 animate-in fade-in slide-in-from-top-2'>
                                    <label htmlFor="transaction_id" className='text-xs font-bold uppercase opacity-60'>Transaction ID</label>
                                    <input type="text" name='transaction_id' id='transaction_id' onChange={handleChange} value={formData.transaction_id} required className='w-full p-3 bg-white/10 border border-white/10 rounded-xl outline-none focus:border-white' placeholder="Enter Bkash/Nagad TrxID" />
                                </div>
                            )}
                        </div>

                        <button type='submit' className='w-full py-4 bg-white text-black rounded-2xl font-bold text-lg hover:bg-gray-200 transition-colors mt-4 shadow-xl'>Place Order</button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default UserOrderForm