'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FiShoppingCart } from 'react-icons/fi'
import CartSidebar from '../CartSidebar'
import { useRouter } from 'next/navigation'

export default function Header() {

    const router = useRouter();

    const goToLogin = () => {
        router.push('/register?mode=login')
    };

    const goToRegister = () => {
        router.push('/register?mode=register')
    };

    const [scrolling, setScrolling] = useState(false)
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [userLogado, setUserLogado] = useState<String | null>("")

    const logout = () => {
        localStorage.removeItem('token');
        setUserLogado(null);
    }

    const atualizarToken = () => {
        const userLogado = localStorage.getItem('token');
        setUserLogado(userLogado);
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolling(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        window.addEventListener('storageUpdated', atualizarToken);
        atualizarToken();
        return () => {
            window.removeEventListener('storageUpdated', atualizarToken);
        };
    }, [])

    return (
        <>
            <header
                className={"flex items-center justify-between md:fixed w-full px-6 py-4 shadow transition-all duration-300 z-50 bg-white"}
            >
                <div className="font-bold text-xl hidden md:flex">☕ Bleecker Café</div>

                <nav className="flex items-center gap-6">
                    <Link href="/">Inicio /</Link>
                    <Link href="/loja">Loja</Link>
                    <a href="#">Melhores ofertas</a>
                </nav>

                <div className="flex items-center gap-4">
                    {userLogado ?
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
