'use client'
import Link from 'next/link'
import React, { useContext, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { 
  MdDashboard, 
  MdSell, 
  MdPendingActions, 
  MdCheckCircle, 
  MdHistory, 
  MdInventory, 
  MdCategory, 
  MdPayments, 
  MdPeople, 
  MdAnalytics, 
  MdEvent, 
  MdSupportAgent, 
  MdSettings, 
  MdExitToApp,
  MdPublic
} from 'react-icons/md'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Context } from '../context/Context'

const ManageSidebar = () => {
  const pathname = usePathname()
  const { manageSidebar, setManageSidebar, userData } = useContext(Context)
  const role = userData?.role || ''

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
    `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-bold text-sm
     ${pathname === path 
       ? 'bg-black text-white shadow-xl shadow-black/20' 
       : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`

  // Define menu items for each role
  const menuItems = useMemo(() => {
    const items = {
      common: [
        { name: 'Home', href: '/dashboard', icon: <MdDashboard /> },
        { name: 'History', href: '/dashboard/manager/history', icon: <MdHistory /> },
      ],
      sales: [
        { name: 'POS Sale', href: '/dashboard/sales/sale', icon: <MdSell /> },
        { name: 'Pending Orders', href: '/dashboard/sales/pending', icon: <MdPendingActions /> },
        { name: 'Confirmed Orders', href: '/dashboard/sales/delivery', icon: <MdCheckCircle /> },
        { name: 'Delivered Orders', href: '/dashboard/sales/orders', icon: <MdHistory /> },
      ],
      manager: [
        { name: 'Products', href: '/dashboard/manager/products', icon: <MdInventory /> },
        { name: 'Categories', href: '/dashboard/manager/categories', icon: <MdCategory /> },
        { name: 'Expenses', href: '/dashboard/manager/expenses', icon: <MdPayments /> },
        { name: 'Reservations', href: '/dashboard/manager/reservation', icon: <MdEvent /> },
        { name: 'Support Tickets', href: '/dashboard/manager/support', icon: <MdSupportAgent /> },
      ],
      admin: [
        { name: 'People & Access', href: '/dashboard/admin/people', icon: <MdPeople /> },
        { name: 'Analytics', href: '/dashboard/admin/analytics', icon: <MdAnalytics /> },
        { name: 'Site Settings', href: '/dashboard/admin/settings', icon: <MdSettings /> },
      ]
    }
    return items
  }, [])

  return (
    <aside className={`fixed top-14 left-0 bottom-0 z-40 w-72 bg-white border-r border-gray-100 transition-transform duration-500 ease-in-out flex flex-col p-6 gap-8 overflow-y-auto ${
      manageSidebar ? 'translate-x-0' : '-translate-x-full'
    }`}>
      
      {/* Role Badge */}
      <div className="px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">
        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Active Session</p>
        <p className="text-sm font-bold text-black capitalize">{role} Access</p>
      </div>

      <div className="flex-1 flex flex-col gap-8">
        
        {/* Main Menu */}
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-black uppercase text-gray-300 tracking-widest px-4 mb-2">Main Menu</p>
          {menuItems.common.map((item) => (
            <Link key={item.href} href={item.href} className={linkStyle(item.href)}>
              <span className="text-xl">{item.icon}</span> {item.name}
            </Link>
          ))}
        </div>

        {/* Role Specific Section: Sales */}
        {(role === 'admin' || role === 'sales') && (
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-black uppercase text-gray-300 tracking-widest px-4 mb-2">Sales Operations</p>
            {menuItems.sales.map((item) => (
              <Link key={item.href} href={item.href} className={linkStyle(item.href)}>
                <span className="text-xl">{item.icon}</span> {item.name}
              </Link>
            ))}
          </div>
        )}

        {/* Role Specific Section: Management */}
        {(role === 'admin' || role === 'manager') && (
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-black uppercase text-gray-300 tracking-widest px-4 mb-2">Inventory & Ops</p>
            {menuItems.manager.map((item) => (
              <Link key={item.href} href={item.href} className={linkStyle(item.href)}>
                <span className="text-xl">{item.icon}</span> {item.name}
              </Link>
            ))}
          </div>
        )}

        {/* Role Specific Section: Admin */}
        {role === 'admin' && (
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-black uppercase text-gray-300 tracking-widest px-4 mb-2">Administration</p>
            {menuItems.admin.map((item) => (
              <Link key={item.href} href={item.href} className={linkStyle(item.href)}>
                <span className="text-xl">{item.icon}</span> {item.name}
              </Link>
            ))}
          </div>
        )}

      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-2 pt-6 border-t border-gray-50">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-500 font-bold text-sm hover:bg-gray-50 hover:text-black transition-all">
          <span className="text-xl"><MdPublic /></span> View Website
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 font-bold text-sm hover:bg-red-50 transition-all cursor-pointer"
        >
          <span className="text-xl"><MdExitToApp /></span> Logout Session
        </button>
      </div>

    </aside>
  )
}

export default ManageSidebar