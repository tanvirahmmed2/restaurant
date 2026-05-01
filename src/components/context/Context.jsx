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
      try {
        const response = await axios.get('/api/website', { withCredentials: true })
        setSiteData(response.data.payload)
      } catch (error) {
        setSiteData(null)
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
            selectedVariants: product.selectedVariants || null
          }
        ]
      }));
      toast.success("Added to cart");
    }
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
    fetchCategories, addToCart, removeFromCart, decreaseQuantity, clearCart, fetchCart
  }

  return (
    <Context.Provider value={contextValue}>
      {children}
    </Context.Provider>
  )
}

