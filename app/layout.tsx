import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Eventura - Login",
  description: "Login to your Eventura account",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-gray-100 text-gray-900">
        {children}
      </body>
    </html>
  )
}
