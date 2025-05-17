'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import {
    FiUser,
    FiUserCheck,
    FiMail,
    FiPhone,
    FiLock,
    FiCreditCard,
    FiUserPlus,
} from 'react-icons/fi'
import { formatarCPF, validarCPF } from '@/utils/cpdUtils'
import { formatarTelefone, validarTelefone } from '@/utils/telefoneUtils'
import useThemeStore from '@/app/stores/ThemeStore'

export default function RegisterPage() {
    const router = useRouter()
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const [mensagem, setMensagem] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        nome: '',
        sobrenome: '',
        cpf: '',
        telefone: '',
        email: '',
        senha: '',
        confirmarSenha: '',
    })
    const [cpfError, setCpfError] = useState('')
    const [telefoneError, setTelefoneError] = useState('')
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = formatarCPF(e.target.value)
        setFormData((prev) => ({ ...prev, cpf: value }))
        const isValid = validarCPF(value.replace(/[^\d]+/g, ''))
        setCpfError(isValid ? '' : 'CPF inválido')
    }

    const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = formatarTelefone(e.target.value)
        setFormData((prev) => ({ ...prev, telefone: value }))
        const isValid = validarTelefone(value.replace(/[^\d]+/g, ''))
        setTelefoneError(isValid ? '' : 'Telefone inválido')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const newErrors: { [key: string]: string } = {}

        if (!formData.nome) newErrors.nome = 'Nome é obrigatório'
        if (!formData.sobrenome) newErrors.sobrenome = 'Sobrenome é obrigatório'
        if (!formData.cpf) newErrors.cpf = 'CPF é obrigatório'
        if (!formData.telefone) newErrors.telefone = 'Telefone é obrigatório'
        if (!formData.email) newErrors.email = 'Email é obrigatório'
        if (!formData.senha) newErrors.senha = 'Senha é obrigatória'
        if (!formData.confirmarSenha) newErrors.confirmarSenha = 'Confirme sua senha'
        if (formData.senha !== formData.confirmarSenha) {
            newErrors.confirmarSenha = 'As senhas não coincidem'
        }

        if (cpfError) newErrors.cpf = cpfError
        if (telefoneError) newErrors.telefone = telefoneError

        setErrors(newErrors)
        if (Object.keys(newErrors).length > 0) return

        try {
            await axios.post('http://localhost:8084/clientes/auth/registrar', formData)
            router.push('/login')
        } catch {
            setMensagem('Erro ao registrar. Verifique os dados e tente novamente.')
        }
    }

    const inputClass =
        'w-full px-4 py-2 pl-10 rounded shadow-md transition-colors duration-300'

    const inputStyle = {
        backgroundColor: isDark ? '#2a2a2a' : '#f6f6fa',
        color: isDark ? '#ffffff' : '#000000',
    }

    const renderInput = (
        name: string,
        placeholder: string,
        value: string,
        onChange: any,
        Icon: any,
        type: string = 'text',
        maxLength?: number
    ) => (
        <div className="relative">
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                maxLength={maxLength}
                className={inputClass}
                style={inputStyle}
            />
            {errors[name] && (
                <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
            )}
        </div>
    )

    return (
        <div
            className="min-h-[100vh] pt-20 flex items-center justify-center px-4  transition-colors duration-300"
            style={{ backgroundColor: isDark ? '#0f0f0f' : '#E5E9F2' }}
        >
            <div
                className="w-full max-w-sm p-8 rounded-bl-[50px] rounded-tr-[40px] shadow-xl text-center transition-colors duration-300"
                style={{
                    backgroundColor: isDark ? '#1c1c1c' : '#ffffff',
                    color: isDark ? '#f5f5f5' : '#000000',
                }}
            >
                <div className="flex justify-center mb-4 text-orange-400 text-3xl">
                    <FiUserPlus />
                </div>
                <h2 className="text-xl font-semibold mb-1">Criar Conta</h2>
                <p className="text-sm mb-6" style={{ color: isDark ? '#cfcfcf' : '#6b7280' }}>
                    Preencha seus dados
                </p>

                {mensagem && <div className="text-sm text-red-500 mb-4">{mensagem}</div>}

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div className="flex gap-2">
                        <div className="w-1/2 relative">
                            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                name="nome"
                                placeholder="Nome"
                                value={formData.nome}
                                onChange={handleChange}
                                className={inputClass}
                                style={inputStyle}
                            />
                        </div>
                        <div className="w-1/2 relative">
                            <FiUserCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                name="sobrenome"
                                placeholder="Sobrenome"
                                value={formData.sobrenome}
                                onChange={handleChange}
                                className={inputClass}
                                style={inputStyle}
                            />
                        </div>
                    </div>
                    {errors.nome && <p className="text-xs text-red-500">{errors.nome}</p>}
                    {errors.sobrenome && <p className="text-xs text-red-500">{errors.sobrenome}</p>}

                    {renderInput('cpf', 'CPF', formData.cpf, handleCpfChange, FiCreditCard, 'text', 14)}
                    {renderInput('telefone', 'Telefone', formData.telefone, handleTelefoneChange, FiPhone, 'text', 15)}
                    {renderInput('email', 'Email', formData.email, handleChange, FiMail)}
                    {renderInput('senha', 'Senha', formData.senha, handleChange, FiLock, 'password')}
                    {renderInput('confirmarSenha', 'Confirmar senha', formData.confirmarSenha, handleChange, FiLock, 'password')}

                    <button
                        type="submit"
                        className="w-full py-2 bg-black text-white rounded hover:bg-gray-800 transition duration-300"
                    >
                        Registrar
                    </button>
                </form>

                <p className="text-sm mt-6" style={{ color: isDark ? '#cccccc' : '#666666' }}>
                    Já tem uma conta?{' '}
                    <a href="/login" className="underline font-medium">
                        Entrar
                    </a>
                </p>
            </div>
        </div>
    )
}
