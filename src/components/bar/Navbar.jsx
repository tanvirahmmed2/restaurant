'use client'
import Link from 'next/link'
import React, { useContext, useState, useEffect } from 'react'
import Profile from '../buttons/Profile'
import Sidebar from './Sidebar'
import { FaBars, FaShoppingCart } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import Logout from '../buttons/Logout'
import { Context } from '../context/Context'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const { siteData, cartBar, setCartBar, userData, cart } = useContext(Context)
  const [isSidebar, setIsSidebar] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Flash Sale', href: '/flashsale' },
    { name: 'Reservation', href: '/reservation' },
  ]

  const getDashboardLink = () => {
    if (!userData || userData.role === 'user') return null
    return '/dashboard'
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'py-3 bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5' : 'py-5 bg-transparent'
    }`}>
      <div className='max-w-7xl mx-auto px-6 flex flex-row items-center justify-between'>
        {/* Logo */}
        <Link 
          href={'/'} 
          onClick={() => setCartBar(false)} 
          className='text-2xl font-black tracking-tighter text-gray-900 flex items-center gap-2'
        >
          <span className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-xs">GK</span>
          {siteData?.business_name || siteData?.title || 'Grand Kitchen'}
        </Link>

        {/* Desktop Navigation */}
        <div className='hidden md:flex flex-row items-center gap-8'>
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              onClick={() => setCartBar(false)}
              className='text-sm font-bold text-gray-600 hover:text-black transition-colors relative group'
            >
              {link.name}
              <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full' />
            </Link>
          ))}

          {/* Role-based Dashboard Access */}
          {(userData && userData.role !== 'user') && (
            <Link 
              href={getDashboardLink()} 
              className='text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors'
            >
              Dashboard
            </Link>
          )}

          {/* Cart Trigger */}
          <button 
            onClick={() => setCartBar(!cartBar)} 
            className='relative p-2 text-gray-700 hover:text-black transition-colors cursor-pointer'
          >
            <FaShoppingCart size={20} />
            {cart?.items?.length > 0 && (
              <span className='absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce'>
                {cart.items.length}
              </span>
            )}
          </button>

          {/* Auth Buttons */}
          <div className='flex items-center gap-4 ml-4 border-l border-gray-200 pl-8'>
            {userData ? (
              <div className='flex items-center gap-3'>
                <Profile />
                <Logout />
              </div>
            ) : (
              <Link 
                href={'/login'} 
                onClick={() => setCartBar(false)} 
                className='px-6 py-2.5 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-black/10'
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
        
        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsSidebar(!isSidebar)} 
          className='p-2 text-gray-900 block md:hidden cursor-pointer'
        >
          {isSidebar ? <RxCross2 size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Component (Assuming it exists and needs redesign too) */}
      <Sidebar {...{ isSidebar, setIsSidebar }} />
    </nav>
  )
}

export default Navbar
