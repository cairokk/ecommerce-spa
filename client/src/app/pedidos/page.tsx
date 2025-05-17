'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import useThemeStore from '@/app/stores/ThemeStore'

const pedidosMock = [
    {
        id: 1,
        name: 'Capsulas nespresso',
        image: '/coffee-base.avif',
        price: 2999.0,
        originalPrice: 4999.0,
        status: 'Feito',
    },
    {
        id: 2,
        name: 'Café Orfeu Gourmet',
        image: '/coffee-base.avif',
        price: 199.9,
        originalPrice: 299.9,
        status: 'Andamento',
    },
];

const statusOptions = ['Todos', 'Feito', 'Andamento', 'Entregue'];

export default function PedidosPage() {
    const [statusFilter, setStatusFilter] = useState('Todos')
    const router = useRouter()
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    const pedidosFiltrados = statusFilter === 'Todos'
        ? pedidosMock
        : pedidosMock.filter(pedido => pedido.status === statusFilter)

    return (
        <main
            className="min-h-screen px-6 py-12 max-w-screen-lg mx-auto transition-colors duration-300"
            style={{
                backgroundColor: isDark ? '#0f0f0f' : '#ffffff',
                color: isDark ? '#ffffff' : '#000000',
            }}
        >
            <h1 className="text-2xl font-bold mb-6">Meus Pedidos</h1>

            <div className="flex gap-4 mb-8 flex-wrap">
                {statusOptions.map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-6 py-2 rounded border transition-colors duration-300
                        ${statusFilter === status
                                ? isDark
                                    ? 'bg-white text-black border-white'
                                    : 'bg-black text-white border-black'
                                : isDark
                                    ? 'bg-transparent text-white border-gray-600 hover:bg-white hover:text-black'
                                    : 'hover:bg-black hover:text-white border-gray-300 text-black'
                            }`}
                    >
                        {status.toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="space-y-6">
                {pedidosFiltrados.map((pedido) => (
                    <div
                        key={pedido.id}
                        className="flex items-center justify-between border rounded-xl p-4 shadow-sm hover:shadow-md transition"
                        style={{
                            backgroundColor: isDark ? '#1f1f1f' : '#f9f9f9',
                            borderColor: isDark ? '#333333' : '#e5e5e5',
                        }}
                    >
                        <div className="flex items-center min-h-[100px] gap-4">
                            <Image
                                src={pedido.image}
                                alt={pedido.name}
                                width={120}
                                height={120}
                                className="object-contain rounded"
                            />
                            <div>
                                <h3 className="text-lg font-semibold">{pedido.name}</h3>
                                <div className="flex items-center gap-2">
                                    <p className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                                        R$ {pedido.price.toFixed(2)}
                                    </p>
                                    <p className="line-through text-gray-500 text-sm">
                                        R$ {pedido.originalPrice.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push(`/pedidos/${pedido.id}`)}
                            className={`px-4 py-2 rounded-full transition-all ${isDark
                                    ? 'bg-white text-black hover:bg-gray-300'
                                    : 'bg-black text-white hover:bg-gray-800'
                                }`}
                        >
                            →
                        </button>
                    </div>
                ))}
            </div>
        </main>
    )
}
