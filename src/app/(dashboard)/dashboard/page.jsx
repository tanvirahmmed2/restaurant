'use client'

import { Context } from "@/components/context/Context"
import { useContext } from "react"
import Link from "next/link"
import { MdSell, MdInventory, MdAnalytics } from "react-icons/md"

const Manage =  () => {
  const {userData, siteData}= useContext(Context)
  
  const role = userData?.role || ''

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center p-6 gap-8">
      <div className="text-center flex flex-col gap-2">
        <p className="text-gray-500 font-medium uppercase tracking-widest text-sm">Welcome Back</p>
        <h1 className="text-5xl font-black text-gray-900">{userData?.name}</h1>
        <p className="text-xl text-gray-400">Manage <span className="text-gray-900 font-bold">{siteData?.business_name || siteData?.title || 'your restaurant'}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-4">
        {(role === 'admin' || role === 'sales') && (
          <Link href="/dashboard/sales/sale" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-4 hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <MdSell />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-gray-800 text-lg">Sales POS</h3>
              <p className="text-sm text-gray-400">Process new orders and payments.</p>
            </div>
          </Link>
        )}

        {(role === 'admin' || role === 'manager') && (
          <Link href="/dashboard/manager/products" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-4 hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-amber-600 group-hover:text-white transition-all">
              <MdInventory />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-gray-800 text-lg">Inventory</h3>
              <p className="text-sm text-gray-400">Manage products and categories.</p>
            </div>
          </Link>
        )}

        {role === 'admin' && (
          <Link href="/dashboard/admin/analytics" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-4 hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <MdAnalytics />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-gray-800 text-lg">Analytics</h3>
              <p className="text-sm text-gray-400">View performance and reports.</p>
            </div>
          </Link>
        )}
      </div>

      <div className="mt-10 flex flex-col items-center gap-2">
        <div className="px-4 py-2 bg-gray-100 rounded-full text-xs font-bold text-gray-500 uppercase tracking-widest">
          Session Active
        </div>
        <p className="text-gray-400 text-xs">Logged in as {userData?.email}</p>
      </div>
    </div>
  )
}

export default Manage
