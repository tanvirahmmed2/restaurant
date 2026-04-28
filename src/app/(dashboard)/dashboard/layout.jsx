import ManageNavbar from "@/components/bar/ManageNavbar"
import ManageSidebar from "@/components/bar/ManageSidebar"
import { isLogin } from "@/lib/auth/middleware"
import { redirect } from "next/navigation"

export const metadata = {
  title: 'Manage | Restaurant',
  description: 'Management site'
}

const PosLayout = async ({ children }) => {
  const auth = await isLogin()
  
  if (!auth.success) {
    return redirect('/login')
  }

  const user = auth.payload
  const staffRoles = ['admin', 'manager', 'sales']
  
  if (!staffRoles.includes(user.role)) {
    return redirect('/')
  }

  return (
    <div className='w-full mt-16 overflow-x-hidden relative'>
      <ManageNavbar />
      <ManageSidebar />
      {children}
    </div>
  )
}

export default PosLayout
