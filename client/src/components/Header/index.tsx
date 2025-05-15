'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FiShoppingCart } from 'react-icons/fi'
import CartSidebar from '../CartSidebar'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import usePerfilStore from '../../app/stores/PerfilStore.js'

export default function Header() {

    const router = useRouter();
    const path = usePathname();
    const { perfil, clearPerfil } = usePerfilStore((state) => state)
    const goToLogin = () => {
        router.push('/register?mode=login')
    };

    const goToRegister = () => {
        router.push('/register?mode=register')
    };
    const navLinks = [
        { label: 'Início /', path: '/' },
        { label: 'Loja', path: '/loja' },
        { label: 'Meus pedidos', path: '/pedidos' },
    ]

    const [isCartOpen, setIsCartOpen] = useState(false)

    const logout = () => {
        localStorage.removeItem('token');
        clearPerfil(null);
    }

    return (
        <>
            <header
                className={"flex items-center justify-between md:fixed w-full px-6 py-4 shadow transition-all duration-300 z-50 bg-white"}
            >
                <div className="font-bold text-xl hidden md:flex">☕ Bleecker Café</div>

                <nav className="flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.path}
                            className="relative hover:text-gray-600 transition-colors duration-300"
                        >
                            {link.label}
                            {link.path === path && (
                                <motion.span
                                    layoutId="underline"
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "100%" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute left-0 top-full block h-[1px] bg-black"
                                />
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    {perfil?.token ?
                        <div>
                            <button onClick={logout} className="bg-white text-black px-4 py-2 rounded border mx-2 cursor-pointer">Logout</button>
                        </div>
                        :
                        <div>
                            <button onClick={goToLogin} className="bg-white text-black px-4 py-2 rounded border mx-2 cursor-pointer">Fazer Login</button>
                            <button onClick={goToRegister} className="bg-black text-white px-4 py-2 rounded border cursor-pointer">Criar Conta</button>
                        </div>}
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
