'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Header() {
    const [scrolling, setScrolling] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolling(true)
            } else {
                setScrolling(false)
            }
        };

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        };
    }, []);

    return (
        <header
            className={`flex items-center justify-between md:fixed w-full px-6 py-4 shadow transition-all duration-300 ${scrolling ? 'bg-white' : 'bg-transparent'
                }`}
        >
            <div className="font-bold text-xl hidden md:flex">☕ Bleecker Café</div>
            <nav className="flex items-center gap-6">
                <Link href="/">Inicio /</Link>
                <Link href="/loja">Loja</Link>
                <a href="#">Melhores ofertas</a>
            </nav>
            <Link href="/register" className="bg-black text-white px-4 py-2 rounded">Criar conta</Link>
        </header>
    );
}
