'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface Product {
    id: string
    name: string
    originalPrice: number
    discountedPrice: number
    category: string
}

interface CartContextType {
    cartItems: Product[]
    addToCart: (product: Product) => void
    removeFromCart: (productId: string) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}

interface CartProviderProps {
    children: ReactNode
}

export const CartProvider = ({ children }: CartProviderProps) => {
    const [cartItems, setCartItems] = useState<Product[]>([])

    const addToCart = (product: Product) => {
        setCartItems((prevItems) => [...prevItems, product])
    }

    const removeFromCart = (productId: string) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
    }

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    )
}
