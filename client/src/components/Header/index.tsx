'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FiShoppingCart } from 'react-icons/fi'
import CartSidebar from '../CartSidebar'

export default function Header() {
    const [scrolling, setScrolling] = useState(false)
    const [isCartOpen, setIsCartOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolling(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            <header
                className={`flex items-center justify-between md:fixed w-full px-6 py-4 shadow transition-all duration-300 z-50 ${scrolling ? 'bg-white' : 'bg-transparent'}`}
            >
                <div className="font-bold text-xl hidden md:flex">☕ Bleecker Café</div>

                <nav className="flex items-center gap-6">
                    <Link href="/">Inicio /</Link>
                    <Link href="/loja">Loja</Link>
                    <a href="#">Melhores ofertas</a>
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="/register" className="bg-black text-white px-4 py-2 rounded">
                        Criar conta
                    </Link>
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="text-2xl"
                        aria-label="Abrir carrinho"
                    >
                        <FiShoppingCart />
                    </button>
                </div>
            </header>

            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    )
}
