'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { MdTrendingUp, MdShoppingCart, MdPeople, MdInventory, MdPendingActions } from 'react-icons/md'

const AdminOverview = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await axios.get('/api/admin/overview', { withCredentials: true })
        setStats(res.data.payload)
      } catch (error) {
        console.error("Failed to fetch admin overview", error)
      } finally {
        setLoading(false)
      }
    }
    fetchOverview()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Business Overview</h1>
        <p className="text-gray-500 text-sm">Key metrics and performance of your restaurant.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Revenue Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl relative z-10">
            <MdTrendingUp />
          </div>
          <div className="relative z-10">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Total Revenue</p>
            <h2 className="text-3xl font-black text-gray-900 mt-1">${stats?.totalRevenue?.toFixed(2)}</h2>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl relative z-10">
            <MdShoppingCart />
          </div>
          <div className="relative z-10">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Total Orders</p>
            <h2 className="text-3xl font-black text-gray-900 mt-1">{stats?.totalOrders}</h2>
          </div>
        </div>

        {/* Pending Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-2xl relative z-10">
            <MdPendingActions />
          </div>
          <div className="relative z-10">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Pending Orders</p>
            <h2 className="text-3xl font-black text-gray-900 mt-1">{stats?.pendingOrders}</h2>
          </div>
        </div>

        {/* Customers Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-2xl relative z-10">
            <MdPeople />
          </div>
          <div className="relative z-10">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Total Customers</p>
            <h2 className="text-3xl font-black text-gray-900 mt-1">{stats?.totalCustomers}</h2>
          </div>
        </div>

        {/* Products Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl relative z-10">
            <MdInventory />
          </div>
          <div className="relative z-10">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Total Products</p>
            <h2 className="text-3xl font-black text-gray-900 mt-1">{stats?.totalProducts}</h2>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AdminOverview
