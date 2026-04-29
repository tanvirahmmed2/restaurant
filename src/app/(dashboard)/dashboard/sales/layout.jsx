import { isLogin } from "@/lib/auth/middleware"
import { redirect } from "next/navigation"

const SalesLayout = async ({ children }) => {
  const auth = await isLogin()
  
  if (!auth.success) {
    return redirect('/login')
  }

  const user = auth.payload
  
  // Check for sales or admin role
  if (user.role !== 'sales' && user.role !== 'admin') {
    return redirect('/dashboard')
  }

  return (
    <>
      {children}
    </>
  )
}

export default SalesLayout
