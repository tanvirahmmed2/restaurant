'use client'
import LastMonthExpense from '@/components/report/LastMonthExpense'
import LastMonthSales from '@/components/report/LastMonthSales'
import LastYearExpense from '@/components/report/LastYearExpense'
import LastYearSales from '@/components/report/LastYearSales'
import TotalExpense from '@/components/report/TotalExpense'
import TotalSales from '@/components/report/TotalSales'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Analytics = () => {
  const [data, setData] = useState([])
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, expensesRes] = await Promise.all([
          axios.get('/api/order/delivery', { withCredentials: true }),
          axios.get('/api/expense', { withCredentials: true })
        ]);
        setData(ordersRes.data.payload || []);
        setExpenses(expensesRes.data.payload || []);
      } catch (error) {
        console.error("Analytics fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [])

  if (loading) {
    return (
      <div className='w-full min-h-[60vh] flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black'></div>
      </div>
    );
  }

  return (
    <div className='w-full max-w-7xl mx-auto p-6 flex flex-col gap-10'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-black text-gray-900 tracking-tight'>Analytics</h1>
        <p className='text-gray-500'>Monitor your restaurant's performance and financial health.</p>
      </div>

      <div className='grid grid-cols-1 gap-12'>
        {/* Sales Overview */}
        <section className='flex flex-col gap-6'>
          <div className='flex items-center gap-3'>
            <div className='w-1 h-6 bg-emerald-500 rounded-full'></div>
            <h2 className='text-xl font-bold text-gray-800'>Sales Performance</h2>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
              <LastMonthSales data={data} />
            </div>
            <div className='bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
              <LastYearSales data={data} />
            </div>
            <div className='bg-indigo-600 p-6 rounded-3xl shadow-xl text-white'>
              <TotalSales data={data} />
            </div>
          </div>
        </section>

        {/* Expenses Overview */}
        <section className='flex flex-col gap-6'>
          <div className='flex items-center gap-3'>
            <div className='w-1 h-6 bg-rose-500 rounded-full'></div>
            <h2 className='text-xl font-bold text-gray-800'>Expense Analysis</h2>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
              <LastMonthExpense data={expenses}/>
            </div>
            <div className='bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
              <LastYearExpense data={expenses}/>
            </div>
            <div className='bg-gray-900 p-6 rounded-3xl shadow-xl text-white'>
              <TotalExpense data={expenses}/>
            </div>
          </div>
        </section>
      </div>

      {data.length === 0 && expenses.length === 0 && (
        <div className='text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200'>
          <p className='text-gray-400 font-medium'>No data available yet for analysis.</p>
        </div>
      )}
    </div>
  )
}

export default Analytics
