'use client'
import Link from 'next/link'
import React, { useContext } from 'react'
import { Context } from '../context/Context'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'

const Footer = () => {
  const { siteData } = useContext(Context)
  
  const currentYear = new Date().getFullYear()

  return (
    <footer className='w-full bg-black text-white pt-20 pb-10 px-6'>
      <div className='max-w-7xl mx-auto space-y-16'>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
          
          {/* Brand & Info */}
          <div className='space-y-6'>
            <h1 className='text-3xl font-black tracking-tighter'>
              {siteData?.business_name || siteData?.title || "GRAND KITCHEN"}
            </h1>
            <p className='text-gray-400 text-sm leading-relaxed max-w-xs'>
              {siteData?.meta_description || "Crafting exceptional culinary experiences with passion and precision since 2010."}
            </p>
            <p className='text-gray-500 text-xs font-medium'>
              {siteData?.address || "123 Culinary Ave, Gourmet City, GC 56789"}
            </p>
          </div>

          {/* Legal & Policy */}
          <div className='space-y-6'>
            <h4 className='text-xs font-black uppercase tracking-[0.2em] text-gray-500'>Legal</h4>
            <div className='flex flex-col gap-4 text-sm font-bold'>
              <Link className='text-gray-400 hover:text-white transition-colors' href='/'>Privacy Policy</Link>
              <Link className='text-gray-400 hover:text-white transition-colors' href='/'>Terms of Service</Link>
              <Link className='text-gray-400 hover:text-white transition-colors' href='/'>Payment Security</Link>
              <Link className='text-gray-400 hover:text-white transition-colors' href='/'>Refund Policy</Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className='space-y-6'>
            <h4 className='text-xs font-black uppercase tracking-[0.2em] text-gray-500'>Quick Links</h4>
            <div className='flex flex-col gap-4 text-sm font-bold'>
              <Link className='text-gray-400 hover:text-white transition-colors' href='/menu'>Explore Menu</Link>
              <Link className='text-gray-400 hover:text-white transition-colors' href='/flashsale'>Flash Offers</Link>
              <Link className='text-gray-400 hover:text-white transition-colors' href='/reservation'>Book a Table</Link>
              <Link className='text-gray-400 hover:text-white transition-colors' href='/support'>Help & Support</Link>
            </div>
          </div>

          {/* Social & Contact */}
          <div className='space-y-6'>
            <h4 className='text-xs font-black uppercase tracking-[0.2em] text-gray-500'>Connect</h4>
            <div className='flex gap-4'>
              <a href={siteData?.facebook || '#'} className='w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer'>
                <FaFacebook size={18} />
              </a>
              <a href={siteData?.instagram || '#'} className='w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer'>
                <FaInstagram size={18} />
              </a>
              <a href={siteData?.linkedin || '#'} className='w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer'>
                <FaLinkedin size={18} />
              </a>
              <a href={siteData?.twitter || '#'} className='w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer'>
                <FaTwitter size={18} />
              </a>
            </div>
            <div className='pt-4'>
              <p className='text-[10px] text-gray-500 font-black uppercase tracking-widest'>Official Website of</p>
              <p className='text-sm font-bold'>{siteData?.business_name || "Grand Kitchen Group"}</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className='pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6'>
          <p className='text-gray-600 text-[10px] font-bold uppercase tracking-widest'>
            &copy; {currentYear} {siteData?.title || "Grand Kitchen"}. All Rights Reserved.
          </p>
          <p className='text-gray-600 text-[10px] font-bold uppercase tracking-widest'>
            Crafted with passion by <Link href='https://disibin.com/' className='text-gray-400 hover:text-white'>Disibin</Link>
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer
