'use client'
import BanUser from '@/components/buttons/BanUser'
import DeleteUser from '@/components/buttons/DeleteUser'
import UpdateUser from '@/components/buttons/UpdateUser'
import axios from 'axios'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const People = () => {
  const [staffs, setStaffs] = useState([])
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('manager')
  const [loading, setLoading] = useState(false)

  const fetchStaffs = async () => {
    try {
      const res = await axios.get('/api/user/all?role=management', { withCredentials: true })
      setStaffs(res.data.payload)
    } catch (error) {
      setStaffs([])
    }
  }

  useEffect(() => {
    fetchStaffs()
  }, [])

  const handlePromote = async (e) => {
    e.preventDefault()
    if (!email) return toast.error("Please enter an email")
    setLoading(true)
    try {
      const res = await axios.put('/api/user/management', { email, role }, { withCredentials: true })
      toast.success(res.data.message)
      setEmail('')
      fetchStaffs() // Refresh list
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to promote user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full max-w-5xl mx-auto p-4 flex flex-col items-center gap-8'>
      <div className='w-full border-b border-gray-100 pb-4'>
        <h1 className='text-3xl font-black text-gray-900 tracking-tight'>People & Access</h1>
        <p className='text-gray-500 mt-1'>Manage staff accounts and promote existing users.</p>
      </div>

      <div className='w-full bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4'>
        <h2 className='text-xl font-bold text-gray-800'>Promote User</h2>
        <p className='text-sm text-gray-500'>Enter a registered user's email to promote them to a management role.</p>
        <form onSubmit={handlePromote} className='flex flex-col md:flex-row gap-4'>
          <input 
            type="email" 
            placeholder="user@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black transition-all'
          />
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            className='px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black transition-all'
          >
            <option value="manager">Manager (Inventory & Ops)</option>
            <option value="sales">Sales (POS & Orders)</option>
            <option value="admin">Admin (Full Access)</option>
            <option value="user">User (Demote)</option>
          </select>
          <button 
            type="submit" 
            disabled={loading}
            className='px-8 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-50'
          >
            {loading ? 'Promoting...' : 'Promote'}
          </button>
        </form>
      </div>

      <div className='w-full flex flex-col gap-4'>
        <h2 className='text-xl font-bold text-gray-800'>Management Team</h2>
        <div className='w-full flex flex-col border border-gray-100 rounded-xl overflow-hidden shadow-sm'>
          <div className='w-full grid grid-cols-4 bg-gray-50 p-4 font-bold text-xs uppercase text-gray-400 tracking-widest border-b border-gray-100'>
            <p>Name</p>
            <p>Email</p>
            <p>Role</p>
            <p className='text-right'>Actions</p>
          </div>
          {
            staffs && staffs.map((staff) => (
              <div key={staff.id} className='w-full grid grid-cols-4 p-4 items-center bg-white hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0'>
                <h1 className='font-bold text-gray-800'>{staff.name}</h1>
                <p className='text-gray-500 text-sm'>{staff.email}</p>
                <p>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    staff.role === 'admin' ? 'bg-indigo-100 text-indigo-600' :
                    staff.role === 'manager' ? 'bg-amber-100 text-amber-600' :
                    staff.role === 'sales' ? 'bg-emerald-100 text-emerald-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {staff.role}
                  </span>
                </p>
                <div className='flex flex-row items-center justify-end gap-3'>
                  <BanUser id={staff.id} isBanned={staff.is_banned}/>
                  <DeleteUser id={staff.id}/>                  
                </div>
              </div>
            ))
          }
          {staffs.length === 0 && (
            <div className='p-8 text-center text-gray-500'>No management team members found.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default People
