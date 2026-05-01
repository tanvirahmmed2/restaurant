'use client'
import Link from 'next/link'
import React, { useContext } from 'react'
import { Context } from '../context/Context'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'

const Footer = () => {
  const { siteData } = useContext(Context)
  
  const currentYear = new Date().getFullYear()

  return (
    <footer className='w-full bg-white text-gray-900 pt-20 pb-10 px-6 border-t border-gray-100'>
      <div className='max-w-7xl mx-auto space-y-16'>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
          
          {/* Brand & Info */}
          <div className='space-y-6'>
            <h1 className='text-2xl font-semibold tracking-tight uppercase'>
              {siteData?.business_name || siteData?.name || "GRAND KITCHEN"}
            </h1>
            <p className='text-gray-500 text-sm leading-relaxed max-w-xs font-medium'>
              {siteData?.meta_description || "Crafting exceptional culinary experiences with passion and precision since 2010."}
            </p>
            <div className='flex flex-col gap-1'>
              <p className='text-gray-400 text-[10px] font-semibold uppercase tracking-widest'>Our Location</p>
              <p className='text-gray-600 text-xs font-semibold'>
                {siteData?.address || "123 Culinary Ave, Gourmet City"}
              </p>
              <p className='text-gray-600 text-xs font-semibold'>
                {siteData?.city || "GK City"}, {siteData?.country || "Earth"}
              </p>
            </div>
          </div>

          {/* Legal & Policy */}
          <div className='space-y-6'>
            <h4 className='text-[10px] font-semibold uppercase tracking-widest text-gray-400'>Legal</h4>
            <div className='flex flex-col gap-3 text-xs font-semibold'>
              <Link className='text-gray-500 hover:text-black transition-colors' href='/'>Privacy Policy</Link>
              <Link className='text-gray-500 hover:text-black transition-colors' href='/'>Terms of Service</Link>
              <Link className='text-gray-500 hover:text-black transition-colors' href='/'>Refund Policy</Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className='space-y-6'>
            <h4 className='text-[10px] font-semibold uppercase tracking-widest text-gray-400'>Quick Links</h4>
            <div className='flex flex-col gap-3 text-xs font-semibold'>
              <Link className='text-gray-500 hover:text-black transition-colors' href='/menu'>Explore Menu</Link>
              <Link className='text-gray-500 hover:text-black transition-colors' href='/flashsale'>Flash Offers</Link>
              <Link className='text-gray-500 hover:text-black transition-colors' href='/reservation'>Book a Table</Link>
              <Link className='text-gray-500 hover:text-black transition-colors' href='/support'>Help & Support</Link>
            </div>
          </div>

          {/* Social & Contact */}
          <div className='space-y-6'>
            <h4 className='text-[10px] font-semibold uppercase tracking-widest text-gray-400'>Connect</h4>
            <div className='flex gap-3'>
              {siteData?.facebook && (
                <a href={siteData.facebook} target="_blank" rel="noopener noreferrer" className='w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center hover:bg-black hover:text-white transition-all'>
                  <FaFacebook size={16} />
                </a>
              )}
              {siteData?.instagram && (
                <a href={siteData.instagram} target="_blank" rel="noopener noreferrer" className='w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center hover:bg-black hover:text-white transition-all'>
                  <FaInstagram size={16} />
                </a>
              )}
              {siteData?.linkedin && (
                <a href={siteData.linkedin} target="_blank" rel="noopener noreferrer" className='w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center hover:bg-black hover:text-white transition-all'>
                  <FaLinkedin size={16} />
                </a>
              )}
            </div>
            <div className='pt-2'>
              <p className='text-[9px] text-gray-400 font-semibold uppercase tracking-widest'>Contact Us</p>
              <p className='text-xs font-semibold text-gray-900'>{siteData?.phone || "+880 1234 567890"}</p>
              <p className='text-xs font-semibold text-gray-900'>{siteData?.email || "hello@grandkitchen.com"}</p>
            </div>
          </div>

        </div>

        <div className='pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6'>
          <p className='text-gray-400 text-[10px] font-semibold uppercase tracking-widest'>
            &copy; {currentYear} {siteData?.name || "Grand Kitchen"}. All Rights Reserved.
          </p>
          <p className='text-gray-400 text-[10px] font-semibold uppercase tracking-widest'>
            Developed with excellence by <Link href='https://disibin.com' className='text-gray-900 hover:underline'>Disibin</Link>
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer
