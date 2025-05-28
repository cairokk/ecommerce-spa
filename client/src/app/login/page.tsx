'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import usePerfilStore from '@/app/stores/PerfilStore'
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi'
import useThemeStore from '@/app/stores/ThemeStore'
import Link from 'next/link'

export default function LoginPage() {
    const router = useRouter()
    const setPerfil = usePerfilStore((state) => state.setPerfil)
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const [formData, setFormData] = useState({ email: '', senha: '' })
    const [mensagem, setMensagem] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.email === 'mock@gmail.com' && formData.senha === '12345') {
            setPerfil({ token: 'mock-token' }) 
            router.push('/loja')
            return
        }

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
            const resposta = await fetch(`${baseUrl}/clientes/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!resposta.ok) throw new Error('Erro ao fazer login')

            const data = await resposta.json()
            setPerfil({ token: data.token })
            router.push('/loja')
        } catch {
            setMensagem('Credenciais inválidas ou erro ao conectar.')
        }
    }


    const inputClass = 'w-full px-4 py-2 pl-10 rounded shadow-md transition-colors duration-300'
    const inputStyle = {
        backgroundColor: isDark ? '#2a2a2a' : '#efeff7',
        color: isDark ? '#ffffff' : '#000000',
    }

    return (
        <div
            className="min-h-[100vh] pt-20 flex items-center justify-center px-4 transition-colors duration-300"
            style={{ backgroundColor: isDark ? '#0f0f0f' : '#E5E9F2' }}
        >
            <div
                className="w-full max-w-sm p-8 rounded-tr-[50px] rounded-bl-[40px] shadow-xl text-center"
                style={{
                    backgroundColor: isDark ? '#1c1c1c' : '#ffffff',
                    color: isDark ? '#f5f5f5' : '#000000',
                }}
            >
                <div className="flex justify-center mb-4 text-orange-400 text-3xl">
                    <FiLogIn />
                </div>
                <h2 className="text-xl font-semibold mb-1">Bem-vindo!</h2>
                <p className="text-sm mb-6" style={{ color: isDark ? '#cfcfcf' : '#6b7280' }}>
                    Entre com sua conta
                </p>

                {mensagem && <div className="text-sm text-red-500 mb-4">{mensagem}</div>}

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className={inputClass}
                            style={inputStyle}
                        />
                    </div>
                    <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            name="senha"
                            type="password"
                            placeholder="Senha"
                            value={formData.senha}
                            onChange={handleChange}
                            className={inputClass}
                            style={inputStyle}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-black text-white rounded hover:bg-gray-800 transition duration-300"
                    >
                        Login
                    </button>
                </form>

                <p className="text-sm mt-6" style={{ color: isDark ? '#cccccc' : '#666666' }}>
                    Ainda não tem uma conta?{' '}
                    <Link href="/register" className="underline font-medium">
                        Cadastre-se
                    </Link>
                </p>
            </div>
        </div>
    )
}
