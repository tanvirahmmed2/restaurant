// components/forms/Orderform.jsx
'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../context/Context'
import toast from 'react-hot-toast'
import axios from 'axios'
import Image from 'next/image'
import { MdDeleteOutline } from 'react-icons/md'

const paymentOptions = ['bkash', 'card', 'nagad', 'rocket', 'cash']
const deliveryOptions = ['takeaway', 'takein']

const Orderform = () => {
    const { addToCart, removeFromCart, decreaseQuantity, clearCart, cart } = useContext(Context)

    const [subTotal, setSubTotal] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalDiscount, setTotalDiscount] = useState(0)
    
    const [formData, setFormData] = useState({
        phone: '',
        payment_method: 'cash',
        delivery_method: 'takein',
        payment_status: 'paid',
        transaction_id: '',
        status: 'confirmed',
        table_no: ''
    })

    const [popUp, setPopUp] = useState(false)

    useEffect(() => {
        let tempSubTotal = 0
        let tempTotalPrice = 0

        cart?.items.forEach((item) => {
            tempSubTotal += item.price * item.quantity
            tempTotalPrice += item.salePrice
        })

        setSubTotal(tempSubTotal)
        setTotalPrice(tempTotalPrice)
        setTotalDiscount(tempSubTotal - tempTotalPrice)
    }, [cart])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalOrderData = {
            ...formData,
            phone: formData.phone.trim() || '01900000000',
            sub_total: subTotal,
            total_discount: totalDiscount,
            total_price: totalPrice,
            items: cart?.items || []
        };

        if (finalOrderData.items.length === 0) {
            return toast.error("Cart is empty");
        }

        try {
            const res = await axios.post('/api/order', finalOrderData, { withCredentials: true });
            toast.success(res.data.message);
            setPopUp(false);
            clearCart();
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Failed to place order');
        }
    };

    return (
        <form onSubmit={handleSubmit} className='w-full flex flex-col items-center gap-4 relative'>
            <div className='w-full flex flex-col gap-1'>
                <label htmlFor="phone" className='text-sm font-semibold'>Customer Phone</label>
                <input type="text" name='phone' id='phone' onChange={handleChange} value={formData.phone} className='w-full px-3 p-2 border rounded outline-none placeholder:italic focus:border-black' placeholder='Customer contact number' />
            </div>
            
            <div className='w-full grid grid-cols-9 text-xs font-bold justify-items-center gap-1 border-b pb-2'>
                <p className='col-span-1'>Img</p>
                <p className='col-span-3'>Title</p>
                <p className='col-span-1'>Qty</p>
                <p className='col-span-1'>Price</p>
                <p className='col-span-1'>Disc</p>
                <p className='col-span-1'>Total</p>
                <p className='col-span-1'></p>
            </div>

            {cart?.items.length > 0 ? (
                <div className='w-full flex flex-col items-center gap-2 '>
                    {cart.items.map((item) => (
                        <div key={item.id} className='w-full grid grid-cols-9 justify-items-center gap-1 py-2 items-center even:bg-gray-50 border-b border-gray-100'>
                            <div className='col-span-1 w-10 h-10 overflow-hidden rounded'>
                                <Image src={item.image} alt={item.title} width={50} height={50} className='w-full h-full object-cover' />
                            </div>
                            <p className='col-span-3 text-sm truncate w-full text-center'>{item.title}</p>
                            <div className='col-span-1 flex flex-row items-center justify-between w-full px-1'>
                                <button className='bg-black text-white w-5 h-5 flex items-center justify-center rounded-full text-xs cursor-pointer' type='button' onClick={() => addToCart(item)}>+</button>
                                <p className='text-sm font-bold'>{item.quantity}</p>
                                <button className='bg-gray-300 w-5 h-5 flex items-center justify-center rounded-full text-xs cursor-pointer' type='button' onClick={() => decreaseQuantity(item.id)}>-</button>
                            </div>
                            <p className='col-span-1 text-sm'>৳{item.price}</p>
                            <p className='col-span-1 text-sm'>৳{item.discount}</p>
                            <p className='col-span-1 text-sm font-bold'>৳{item.salePrice}</p>
                            <button className='col-span-1 text-xl text-red-500 cursor-pointer hover:scale-110' type='button' onClick={() => removeFromCart(item.id)}><MdDeleteOutline /></button>
                        </div>
                    ))}
                    
                    <div className='bg-black text-white p-4 rounded-xl w-full flex flex-col gap-2 mt-4'>
                        <div className='flex justify-between text-sm opacity-80'>
                            <p>SubTotal</p>
                            <p>৳{subTotal}</p>
                        </div>
                        <div className='flex justify-between text-sm opacity-80'>
                            <p>Discount</p>
                            <p>৳{totalDiscount}</p>
                        </div>
                        <div className='flex justify-between text-xl font-bold border-t pt-2 mt-2'>
                            <p>Total</p>
                            <p>৳{totalPrice}</p>
                        </div>
                        <button className='w-full mt-2 p-2 bg-white text-black rounded-lg font-bold cursor-pointer hover:bg-gray-100' type='button' onClick={() => setPopUp(true)}>Next Step</button>
                    </div>
                    <button type='button' className='text-sm text-gray-500 hover:text-red-500 underline mt-2' onClick={() => clearCart()}>Clear Cart</button>
                </div>
            ) : (
                <div className='py-10 text-gray-400 italic text-center'>Your cart is empty. Add products to start an order.</div>
            )}

            {popUp && (
                <div className='flex items-center justify-center fixed inset-0 backdrop-blur-md bg-black/40 z-[60]'>
                    <div className='w-full max-w-sm mx-4 flex flex-col p-6 gap-4 bg-white rounded-2xl shadow-2xl'>
                        <div className='flex justify-between items-center border-b pb-3'>
                            <h2 className='text-xl font-bold'>Checkout</h2>
                            <p className='text-lg font-bold text-green-600'>৳{totalPrice}</p>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label htmlFor="payment_method" className='text-sm font-semibold'>Payment Method</label>
                            <select name="payment_method" id="payment_method" onChange={handleChange} required value={formData.payment_method} className='w-full p-2 border rounded outline-none focus:border-black'>
                                {paymentOptions.map((p) => (
                                    <option value={p} key={p}>{p.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label htmlFor="delivery_method" className='text-sm font-semibold'>Order Type</label>
                            <select name="delivery_method" id="delivery_method" onChange={handleChange} required value={formData.delivery_method} className='w-full p-2 border rounded outline-none focus:border-black'>
                                {deliveryOptions.map((d) => (
                                    <option value={d} key={d}>{d.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>

                        <div className='flex flex-col gap-1'>
                            <label htmlFor="table_no" className='text-sm font-semibold'>Table Number (Optional)</label>
                            <input name="table_no" id="table_no" onChange={handleChange} value={formData.table_no} placeholder="e.g. A1, 05" className='w-full p-2 border rounded outline-none focus:border-black'/>
                        </div>

                        <div className='flex flex-row gap-3 mt-2'>
                            <button className='flex-1 p-2 border rounded-lg font-bold hover:bg-gray-50 transition-colors' type='button' onClick={() => setPopUp(false)}>Back</button>
                            <button className='flex-1 p-2 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-colors' type='submit'>Confirm Order</button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    )
}

export default Orderform
