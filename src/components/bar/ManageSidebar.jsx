'use client'
import Link from 'next/link'
import React, { useContext } from 'react'
import { usePathname } from 'next/navigation'

import { AiOutlineUnorderedList } from "react-icons/ai";
import { IoHomeOutline, IoSettingsOutline } from "react-icons/io5";
import { PiFinnTheHumanLight } from "react-icons/pi";
import { FaHistory, FaRegEdit } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { MdManageAccounts, MdOutlineLocalOffer, MdSell } from "react-icons/md";
import { SiGoogleanalytics } from "react-icons/si";
import { FaRegMessage } from "react-icons/fa6";
import { RiGlobalLine } from "react-icons/ri";

import { toast } from 'react-toastify';
import axios from 'axios';
import { Context } from '../context/Context';

const ManageSidebar = () => {
  const pathname = usePathname()
  const { manageSidebar, setManageSidebar, staffData } = useContext(Context)

  const handleLogout = async () => {
    try {
      const res = await axios.get('/api/user/logout', { withCredentials: true })
      toast.success(res.data.message)
      window.location.replace('/login')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to logout')
    }
  }

  const linkStyle = (path) =>
    `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 
     ${pathname === path 
       ? 'bg-black text-white shadow-md' 
       : 'text-gray-700 hover:bg-gray-100 hover:text-black'}`

  const role = staffData?.role || ''

  return (
    <aside className={`w-70 fixed top-14 ${!manageSidebar? '-translate-x-full':'translate-x-0'} transform duration-500 ease-in-out overflow-y-scroll pb-24 h-screen z-50 bg-white border-r shadow-sm flex flex-col justify-between p-4`}>

      <div className="flex flex-col gap-6">

        <h2 className="text-xl font-semibold text-gray-800 px-2">Dashboard</h2>

        <div className="flex flex-col gap-1">
          <Link href="/dashboard" className={linkStyle('/dashboard')}>
            <IoHomeOutline /> Home
          </Link>

          {(role === 'admin' || role === 'sales') && (
            <>
              <Link href="/dashboard/sales/sale" className={linkStyle('/dashboard/sales/sale')}>
                <MdSell /> Sale
              </Link>
              <Link href="/dashboard/sales/pending" className={linkStyle('/dashboard/sales/pending')}>
                <AiOutlineUnorderedList /> Pending
              </Link>
              <Link href="/dashboard/sales/delivery" className={linkStyle('/dashboard/sales/delivery')}>
                <MdOutlineLocalOffer /> Confirmed
              </Link>
              <Link href="/dashboard/sales/orders" className={linkStyle('/dashboard/sales/orders')}>
                <FaHistory /> Delivered
              </Link>
            </>
          )}

          <Link href="/dashboard/manager/history" className={linkStyle('/dashboard/manager/history')}>
            <FaHistory /> History
          </Link>
        </div>

        {(role === 'admin' || role === 'manager') && (
          <div>
            <p className="text-xs text-gray-400 px-2 mb-2 uppercase">Products</p>
            <div className="flex flex-col gap-1">
              <Link href="/dashboard/manager/products" className={linkStyle('/dashboard/manager/products')}>
                <FaRegEdit /> Products
              </Link>
              <Link href="/dashboard/manager/categories" className={linkStyle('/dashboard/manager/categories')}>
                <FaRegEdit /> Categories
              </Link>
            </div>
          </div>
        )}
        
        {(role === 'admin' || role === 'manager') && (
          <div>
            <p className="text-xs text-gray-400 px-2 mb-2 uppercase">Expenses</p>
            <div className="flex flex-col gap-1">
              <Link href="/dashboard/manager/expenses" className={linkStyle('/dashboard/manager/expenses')}>
                <FaRegEdit /> Expenses
              </Link>
            </div>
          </div>
        )}

        <div>
          <p className="text-xs text-gray-400 px-2 mb-2 uppercase">Management</p>
          <div className="flex flex-col gap-1">
            {role === 'admin' && (
              <>
                <Link href="/dashboard/admin/people" className={linkStyle('/dashboard/admin/people')}>
                  <MdManageAccounts /> People
                </Link>
                <Link href="/dashboard/admin/analytics" className={linkStyle('/dashboard/admin/analytics')}>
                  <SiGoogleanalytics /> Analytics
                </Link>
              </>
            )}

            {(role === 'admin' || role === 'manager') && (
              <>
                <Link href="/dashboard/manager/reservation" className={linkStyle('/dashboard/manager/reservation')}>
                  <FaRegMessage /> Reservation
                </Link>
                <Link href="/dashboard/manager/support" className={linkStyle('/dashboard/manager/support')}>
                  <FaRegMessage /> Support
                </Link>
              </>
            )}
          </div>
        </div>

      </div>

      <div className="flex flex-col gap-2 border-t pt-4">
        <Link href="/" className={linkStyle('/')}>
          <RiGlobalLine /> Website
        </Link>

        {role === 'admin' && (
          <Link href="/dashboard/admin/settings" className={linkStyle('/dashboard/admin/settings')}>
            <IoSettingsOutline /> Settings
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 transition"
        >
          <CiLogout /> Logout
        </button>
      </div>

    </aside>
  )
}

export default ManageSidebar