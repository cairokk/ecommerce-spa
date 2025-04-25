// app/layout.tsx
import { CartProvider } from '@/context/CartContext'  
import Header from '@/components/Header' 
import './globals.css' 

export default function RootLayout({
  children,  
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider> 
      <html lang="pt-BR">
        <body>
          <Header /> 
          {children}  
        </body>
      </html>
    </CartProvider>
  )
}
