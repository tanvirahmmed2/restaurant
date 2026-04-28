'use client'
import BanUser from '@/components/buttons/BanUser'
import DeleteUser from '@/components/buttons/DeleteUser'
import UpdateUser from '@/components/buttons/UpdateUser'
import AddPeople from '@/components/forms/AddPeople'
import axios from 'axios'
import { useEffect, useState } from 'react'

const People = () => {
  const [staffs, setStaffs]= useState([])
 useEffect(()=>{
  const fetchStaffs=async()=>{
    try {
      const res= await axios.get('/api/staff/people',{withCredentials:true})
      setStaffs(res.data.payload)
    } catch (error) {
      setStaffs([])
    }
  }
  fetchStaffs()
 },[])


  return (
    <div className='w-full p-4 flex flex-col items-center gap-6'>
        <h1 className='text-2xl font-semibold w-full text-center border-b-2 border-black/10'>People & Access</h1>
        <AddPeople/>
        <div className='w-full flex flex-col items-center justify-center gap-4'>
          <h1 className='text-xl font-semibold text-center'>Sales and Managers</h1>
          <div className='w-full grid grid-cols-4 bg-gray-100 p-3 rounded-t-xl font-bold text-sm uppercase text-gray-500'>
            <p>Name</p>
            <p>Email</p>
            <p>Role</p>
            <p className='text-right'>Actions</p>
          </div>
          <div className='w-full flex flex-col border border-t-0 border-gray-100 rounded-b-xl overflow-hidden'>
            {
              staffs && staffs.map((staff)=>(
                <div key={staff.id} className='w-full grid grid-cols-4 p-4 items-center hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0'>
                  <h1 className='font-bold text-gray-800'>{staff.name}</h1>
                  <p className='text-gray-500 text-sm'>{staff.email}</p>
                  <p>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      staff.role === 'admin' ? 'bg-indigo-100 text-indigo-600' :
                      staff.role === 'manager' ? 'bg-amber-100 text-amber-600' :
                      'bg-emerald-100 text-emerald-600'
                    }`}>
                      {staff.role}
                    </span>
                  </p>
                  <div className='flex flex-row items-center justify-end gap-3'>
                    <BanUser id={staff.id} isBanned={staff.is_banned}/>
                    <UpdateUser id={staff.id}/>
                    <DeleteUser id={staff.id}/>                  
                  </div>
                </div>
              ))
            }
          </div>
        </div>
    </div>
  )
}

export default People
