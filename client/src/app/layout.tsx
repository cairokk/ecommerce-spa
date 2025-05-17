'use client'

import { useEffect } from 'react'
import { CartProvider } from '@/context/CartContext'
import useThemeStore from '@/app/stores/ThemeStore'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore()

  useEffect(() => {
    const body = document.body
    if (theme === 'dark') {
      body.style.backgroundColor = '#040404' 
    } else {
      body.style.backgroundColor = '#ffffff' 
    }
  }, [theme])
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
