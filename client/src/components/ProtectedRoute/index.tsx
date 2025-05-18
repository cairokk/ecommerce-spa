'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import usePerfilStore from '@/app/stores/PerfilStore'
import useThemeStore from '@/app/stores/ThemeStore'

interface ProtectedRouteProps {
    children: React.ReactNode
    requiredRole?: string
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const router = useRouter()
    const { perfil } = usePerfilStore()
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const [checking, setChecking] = useState(true)

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!perfil) {
                router.push('/login')
            } else {
                setChecking(false)
            }
        }, 1000)

        return () => clearTimeout(timeout)
    }, [perfil, router])

    if (checking || !perfil) {
        return (
            <main className={`w-full h-screen flex items-center justify-center ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
                <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-yellow-500"></div>
                    <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Verificando autenticação...</p>
                </div>
            </main>
        )
    }

    if (requiredRole && perfil?.role !== requiredRole) {
        return (
            <main className={`w-full h-screen flex items-center justify-center ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
                <div className="text-center space-y-2">
                    <p className="text-xl font-semibold text-red-500">Acesso negado</p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Você não tem permissão para acessar esta página.</p>
                </div>
            </main>
        )
    }

    return <>{children}</>
}
