import { isLogin } from "@/lib/auth/middleware"
import { redirect } from "next/navigation"

const ManagerLayout = async ({ children }) => {
  const auth = await isLogin()
  
  if (!auth.success) {
    return redirect('/login')
  }

  const user = auth.payload
  
  if (user.role !== 'manager' && user.role !== 'admin') {
    return redirect('/dashboard')
  }

  return (
    <>
      {children}
    </>
  )
}

export default ManagerLayout
