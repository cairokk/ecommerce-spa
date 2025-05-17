'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FiShoppingCart } from 'react-icons/fi'
import CartSidebar from '../CartSidebar'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import usePerfilStore from '../../app/stores/PerfilStore.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-regular-svg-icons'
import useThemeStore from '../../app/stores/ThemeStore'

export default function Header() {
    const router = useRouter()
    const path = usePathname()
    const { perfil, clearPerfil } = usePerfilStore((state) => state)
    const { theme, toggleTheme } = useThemeStore()

    const goToLogin = () => router.push('/login')
    const [isCartOpen, setIsCartOpen] = useState(false)

    const logout = () => {
        localStorage.removeItem('token')
        clearPerfil(null)
    }

    const navLinks = [
        { label: 'Início', path: '/' },
        { label: 'Loja', path: '/loja' },
        { label: 'Meus pedidos', path: '/pedidos' },
    ]

    const isDark = theme === 'dark'

    return (<>
        <header
            className={`grid grid-cols-3 items-center md:fixed w-full px-10 sm:px-20 md:px-20  py-4 shadow transition-all duration-300 z-50 ${isDark ? "bg-[#040404] text-white" : "bg-white text-black"}`}
        >
            <div className="text-xl hidden md:flex">
                <h1 className=" leading-tight " style={{ fontFamily: 'TrenchSlab' }}>
                    <span style={{ fontFamily: 'PorterSans' }}>0</span> Bleckeer
                </h1>
            </div>


            <nav className="flex items-center justify-center gap-6">
                {navLinks.map((link) => (
                    <Link
                        key={link.label}
                        href={link.path}
                        style={{
                            color: isDark ? '#e0e0e0' : '#000000',
                        }}
                        className="relative hover:opacity-80 transition-colors duration-300"
                    >
                        {link.label}
                        {link.path === path && (
                            <motion.span
                                layoutId="underline"
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: '100%' }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    backgroundColor: isDark ? '#f5f5f5' : '#000000',
                                }}
                                className="absolute left-0 top-full block h-[1px]"
                            />
                        )}
                    </Link>
                ))}
            </nav>

            <div className="flex items-center justify-end gap-4">
                <button
                    onClick={toggleTheme}
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer"
                    style={{
                        backgroundColor: isDark ? '#DD8100' : '#68687C',
                    }}
                    aria-label="Alternar tema"
                >
                    <FontAwesomeIcon icon={isDark ? faSun : faMoon} color="white" />
                </button>

                {perfil?.token ? (
                    <button
                        onClick={logout}
                        style={{
                            backgroundColor: isDark ? '#333' : '#fff',
                            color: isDark ? '#fff' : '#000',
                            border: '1px solid',
                            borderColor: isDark ? '#555' : '#ccc',
                        }}
                        className="px-4 py-2 rounded mx-2 cursor-pointer"
                    >
                        Logout
                    </button>
                ) : (
                    <>
                        <button
                            onClick={goToLogin}
                            style={{
                                backgroundColor: isDark ? '#333' : '#000',
                                color: isDark ? '#fff' : '#fff',
                                border: '1px solid',
                                borderColor: isDark ? '#555' : '#ccc',
                            }}
                            className="px-6 py-2 rounded-3xl mx-2 cursor-pointer"
                        >
                            Fazer Login
                        </button>
                    </>
                )}


                <button
                    onClick={() => setIsCartOpen(true)}
                    className="text-2xl flex border-transparent border rounded-full hover:border-black transition-all duration-300 p-2 items-center justify-center cursor-pointer"
                    aria-label="Abrir carrinho"
                    style={{ color: isDark ? '#f5f5f5' : '#000' }}
                >
                    <FiShoppingCart />
                </button>
            </div>
        </header>

        <CartSidebar />
    </>
    )
}
