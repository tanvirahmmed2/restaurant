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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className='w-full flex flex-col gap-12'>
      <div className='flex flex-col gap-1'>
        <h1 className='text-2xl font-semibold text-gray-900 tracking-tight'>Business Analytics</h1>
        <p className='text-gray-500 text-sm'>In-depth performance and financial analysis.</p>
      </div>

      <div className='flex flex-col gap-16'>
        {/* Sales Overview */}
        <section className='flex flex-col gap-6'>
          <div className='flex items-center gap-3'>
            <div className='w-1 h-4 bg-emerald-500 rounded-full'></div>
            <h2 className='text-lg font-semibold text-gray-900 tracking-tight'>Sales Performance</h2>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-white p-6 rounded-xl border border-gray-100 hover:border-gray-300 transition-all'>
              <LastMonthSales data={data} />
            </div>
            <div className='bg-white p-6 rounded-xl border border-gray-100 hover:border-gray-300 transition-all'>
              <LastYearSales data={data} />
            </div>
            <div className='bg-black p-6 rounded-xl shadow-xl text-white'>
              <TotalSales data={data} />
            </div>
          </div>
        </section>

        {/* Expenses Overview */}
        <section className='flex flex-col gap-6'>
          <div className='flex items-center gap-3'>
            <div className='w-1 h-4 bg-rose-500 rounded-full'></div>
            <h2 className='text-lg font-semibold text-gray-900 tracking-tight'>Expense Analysis</h2>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-white p-6 rounded-xl border border-gray-100 hover:border-gray-300 transition-all'>
              <LastMonthExpense data={expenses}/>
            </div>
            <div className='bg-white p-6 rounded-xl border border-gray-100 hover:border-gray-300 transition-all'>
              <LastYearExpense data={expenses}/>
            </div>
            <div className='bg-gray-50 p-6 rounded-xl border border-gray-200 text-gray-900'>
              <TotalExpense data={expenses}/>
            </div>
          </div>
        </section>
      </div>

      {data.length === 0 && expenses.length === 0 && (
        <div className='text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200'>
          <p className='text-gray-400 text-sm font-semibold uppercase tracking-widest'>No data available yet</p>
        </div>
      )}
    </div>
  )
}

export default Analytics
