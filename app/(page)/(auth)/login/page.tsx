import Image from "next/image"
import LoginForm from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F1F5F9]">
      {/* Logo in top left */}
      <div className="p-6 pt-8">
        <Image src="/logo.png" alt="eventura" width={120} height={84} priority />
      </div>

      {/* Login form centered but moved up a bit */}
      <div className="flex flex-1 justify-center items-center px-6 pb-16 -mt-10">
        <div className="flex w-full max-w-[780px] bg-white rounded-[20px] overflow-hidden shadow-lg border border-gray-100">
          <Image
            src="/loginpic.png"
            alt="Login background"
            width={340}
            height={540}
            className="w-[340px] object-cover max-lg:hidden"
            priority
          />

          <LoginForm />
        </div>
      </div>
    </div>
  )
}
