'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { CartProvider } from '@/context/CartContext'
import useThemeStore from '@/app/stores/ThemeStore'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore()
  const pathname = usePathname()

  useEffect(() => {
    const body = document.body
    body.style.backgroundColor = theme === 'dark' ? '#040404' : '#ffffff'
  }, [theme, pathname]) 

  return (
    <CartProvider>
      <html lang="pt-BR">
        <body>
          <Header />
          {children}
          <Footer />
        </body>
      </html>
    </CartProvider>
  )
}
