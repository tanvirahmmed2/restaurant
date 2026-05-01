// context/Context.jsx
'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

export const Context = createContext()

export const ContextProvider = ({ children }) => {
  
  const [hydrated, setHydrated] = useState(false)
  const [cart, setCart] = useState({ items: [] })
  const [siteData, setSiteData] = useState(null)
  const [userData, setUserData] = useState(null)
  const [categories, setCategories] = useState([])

  const [manageSidebar, setManageSidebar] = useState(false)
  const [cartBar, setCartBar]= useState(false)
  const [updateUserBox,setUpdateUserBox]= useState(false)

  const [siteLoading, setSiteLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/user', { withCredentials: true })
        setUserData(response.data.payload)
      } catch (error) {
        setUserData(null)
      }
    }
    fetchUserData()
  }, [])


  useEffect(() => {
    const fetchWebsiteData = async () => {
      setSiteLoading(true)
      try {
        const response = await axios.get('/api/website', { withCredentials: true })
        setSiteData(response.data.payload)
      } catch (error) {
        setSiteData(null)
      } finally {
        setSiteLoading(false)
      }
    }
    fetchWebsiteData()
  }, [])

  
  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/category', { withCredentials: true })
      setCategories(res.data.payload)
    } catch (error) {
      setCategories([])
    }
  }

  const fetchCart = () => {
    if (typeof window === 'undefined') return
    const storedCart = localStorage.getItem('cart')

    if (!storedCart || storedCart === 'undefined') {
      setCart({ items: [] })
      setHydrated(true)
      return
    }

    try {
      const parsed = JSON.parse(storedCart)
      if (parsed && Array.isArray(parsed.items)) {
        setCart(parsed)
      } else {
        setCart({ items: [] })
      }
    } catch (err) {
      localStorage.removeItem('cart')
      setCart({ items: [] })
    }
    setHydrated(true)
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && hydrated) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart, hydrated])

  const addToCart = (product, qty = 1) => {
    if (!product?.id) return;

    const variantKeys = product.selectedVariants 
      ? Object.values(product.selectedVariants).map(v => v.id).sort().join('-')
      : '';
    
    const cartItemId = variantKeys ? `${product.id}-${variantKeys}` : `${product.id}`;

    const existingInCart = cart.items.find(item => item.cartItemId === cartItemId);

    if (existingInCart) {
      setCart((prev) => ({
        ...prev,
        items: prev.items.map(item => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + qty;
            return { 
              ...item, 
              quantity: newQty,
              salePrice: (item.price - item.discount) * newQty 
            };
          }
          return item;
        })
      }));
      toast(`Updated quantity: ${existingInCart.quantity + qty}`);
    } else {
      const price = parseFloat(product?.price) || 0;
      const discount = parseFloat(product?.discount) || 0;

      setCart((prev) => ({
        ...prev,
        items: [
          ...prev.items,
          {
            cartItemId: cartItemId,
            id: product.id,
            title: product.title,
            quantity: qty,
            price: price,
            discount: discount,
            image: product.image,
            salePrice: (price - discount) * qty,
            selectedVariants: product.selectedVariants || null,
            variants: product.variants || null
          }
        ]
      }));
      toast.success("Added to cart");
    }
  };

  const updateCartItemVariant = (oldCartItemId, newSelectedVariants, newPrice) => {
    setCart((prev) => {
      const existingItem = prev.items.find(item => item.cartItemId === oldCartItemId);
      if (!existingItem) return prev;

      const variantKeys = newSelectedVariants 
        ? Object.values(newSelectedVariants).map(v => v.id).sort().join('-')
        : '';
      
      const newCartItemId = variantKeys ? `${existingItem.id}-${variantKeys}` : `${existingItem.id}`;

      const targetItem = prev.items.find(item => item.cartItemId === newCartItemId);

      let newItems = [];
      if (targetItem && targetItem.cartItemId !== oldCartItemId) {
        newItems = prev.items.map(item => {
          if (item.cartItemId === newCartItemId) {
            const newQty = item.quantity + existingItem.quantity;
            return {
              ...item,
              quantity: newQty,
              salePrice: (item.price - item.discount) * newQty
            };
          }
          return item;
        }).filter(item => item.cartItemId !== oldCartItemId);
      } else {
        newItems = prev.items.map(item => {
          if (item.cartItemId === oldCartItemId) {
            return {
              ...item,
              cartItemId: newCartItemId,
              selectedVariants: newSelectedVariants,
              price: newPrice,
              salePrice: (newPrice - item.discount) * item.quantity
            };
          }
          return item;
        });
      }

      return { ...prev, items: newItems };
    });
    toast.success("Variant updated");
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => ({ 
      ...prev, 
      items: prev.items.filter(item => item.cartItemId !== cartItemId) 
    }))
    toast.error("Removed from cart");
  }

  const decreaseQuantity = (cartItemId) => {
    setCart((prev) => {
      const existing = prev.items.find(item => item.cartItemId === cartItemId);
      if (!existing) return prev;

      if (existing.quantity > 1) {
        return {
          ...prev,
          items: prev.items.map(item => {
            if (item.cartItemId === cartItemId) {
              const newQty = item.quantity - 1;
              return { 
                ...item, 
                quantity: newQty,
                salePrice: (item.price - item.discount) * newQty 
              };
            }
            return item;
          })
        };
      }
      return { ...prev, items: prev.items.filter(item => item.cartItemId !== cartItemId) };
    });
  };

  const clearCart = () => {
    setCart({ items: [] });
    if (typeof window !== 'undefined') localStorage.removeItem('cart');
    toast.success("Cart cleared");
  };

  useEffect(() => {
    fetchCategories()
    fetchCart()
  }, [])

  const [subTotal, setSubTotal] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalDiscount, setTotalDiscount] = useState(0)
      
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

  const contextValue = {
    manageSidebar, setManageSidebar, cartBar, setCartBar, updateUserBox, setUpdateUserBox,
    cart, siteData, userData, subTotal, totalPrice, totalDiscount,
    categories,
    fetchCategories, addToCart, removeFromCart, decreaseQuantity, clearCart, fetchCart, updateCartItemVariant
  }

  // Site Access Guard Logic
  const isTenantActive = siteData && siteData.tenant_status === 'active'
  const isWebsiteActive = siteData && siteData.status === 'active'
  const isAdminOrManager = userData && (userData.role === 'admin' || userData.role === 'manager')

  if (siteLoading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999]">
        <div className="w-10 h-10 border-4 border-pink-100 border-t-pink-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!siteData) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex flex-col items-center justify-center p-6 text-center z-[9999]">
        <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">No Website Data Found</h1>
        <p className="text-slate-500 max-w-md font-medium">We couldn't retrieve the configuration for this domain. Please contact support if you believe this is an error.</p>
      </div>
    )
  }

  // Priority 1: Tenant Check (Account Level)
  if (!isTenantActive && !isAdminOrManager) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center p-6 text-center z-[9999]">
        <div className="w-24 h-24 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-rose-500/10 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight uppercase">Account Suspended</h1>
        <p className="text-slate-500 max-w-lg text-lg font-medium">
          This business account has been suspended by the platform administrator. Access to all services is currently restricted.
        </p>
        <div className="mt-12 p-6 bg-rose-50 rounded-2xl border border-rose-100 flex flex-col items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-rose-400">Account Status</span>
            <span className="px-6 py-2 bg-rose-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-200">
                {siteData.tenant_status}
            </span>
        </div>
      </div>
    )
  }

  // Priority 2: Website Check (Development/Maintenance Mode)
  if (!isWebsiteActive && !isAdminOrManager) {
    const isMaintenance = siteData.status === 'maintenance'
    const isSuspended = siteData.status === 'suspended'

    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center p-6 text-center z-[9999]">
        <div className="w-24 h-24 bg-pink-100 text-pink-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-pink-500/10">
          {isMaintenance ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          ) : isSuspended ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
          )}
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight uppercase">
          {isMaintenance ? 'Under Maintenance' : isSuspended ? 'Service Unavailable' : 'Site Under Development'}
        </h1>
        <p className="text-slate-500 max-w-lg text-lg font-medium">
          {isMaintenance 
            ? "We're currently performing some scheduled maintenance. We'll be back online shortly!" 
            : isSuspended
            ? "This website has been temporarily disabled. Please check back later."
            : `The website "${siteData.name}" is currently in development mode.`}
        </p>
        <div className="mt-12 p-6 bg-pink-50 rounded-2xl border border-pink-100 flex flex-col items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-pink-400">Current Mode</span>
            <span className="px-6 py-2 bg-pink-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-pink-200">
                {siteData.status}
            </span>
        </div>
      </div>
    )
  }

  return (
    <Context.Provider value={contextValue}>
      {children}
    </Context.Provider>
  )
}


