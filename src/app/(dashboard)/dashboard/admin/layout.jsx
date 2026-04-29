import { isLogin } from "@/lib/auth/middleware"
import { redirect } from "next/navigation"

const AdminLayout = async ({ children }) => {
  const auth = await isLogin()
  
  if (!auth.success) {
    return redirect('/login')
  }

  const user = auth.payload
  
  if (user.role !== 'admin') {
    return redirect('/dashboard')
  }

  return (
    <>
      {children}
    </>
  )
}

export default AdminLayout
