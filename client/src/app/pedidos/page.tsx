'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import useThemeStore from '@/app/stores/ThemeStore'
import usePerfilStore from '@/app/stores/PerfilStore'
import usePedidoStore from '@/app/stores/PedidoStore'
import axios from 'axios'

interface OrderItem {
    productId: number;
    quantity: number;
}

interface EnderecoEntrega {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
}

interface Pedido {
    id: number;
    customerId: number;
    items: OrderItem[];
    totalPrice: number;
    payMethod: number;
    enderecoEntrega: EnderecoEntrega;
    status: 'CRIADO' | 'PAGO' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO';
}

const statusOptions = ['Todos', 'CRIADO', 'PAGO', 'ENVIADO', 'ENTREGUE', 'CANCELADO'];

export default function PedidosPage() {
    const [statusFilter, setStatusFilter] = useState('Todos')
    const router = useRouter()
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const { perfil, getIdFromToken } = usePerfilStore((state) => state)
    const { pedidos, setPedidos } = usePedidoStore((state) => state)

    const token = perfil?.token;
    const userID = getIdFromToken();

    useEffect(() => {
        if (!token || !userID) {
            router.push('/login');
            return;
        }
        fetchPedidos();
    }, [token, userID])

    const fetchPedidos = async () => {
        try {
            const resposta = await axios.get(`http://localhost:8084/pedidos/usuario/${userID}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPedidos(resposta.data);
        } catch (erro) {
            console.error('Erro ao buscar pedidos:', erro)
        }
    };

    const pedidosFiltrados = statusFilter === 'Todos'
        ? pedidos
        : pedidos.filter(pedido => pedido.status === statusFilter)

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
                        {status}
                    </button>
                ))}
            </div>

            <div className="space-y-6">
                {pedidosFiltrados && pedidosFiltrados.length > 0 ?
                    pedidosFiltrados.map((pedido: Pedido) => (
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
                                    src={'/coffee-base.avif'}
                                    alt={'Pedido #' + pedido.id}
                                    width={120}
                                    height={120}
                                    className="object-contain rounded"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold">Pedido #{pedido.id}</h3>
                                    <p>Status: <strong>{pedido.status}</strong></p>
                                    <div className="flex items-center gap-2">
                                        <p className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                                            R$ {pedido.totalPrice.toFixed(2)}
                                        </p>
                                    </div>
                                    <p className="text-sm">Itens: {pedido.items.length}</p>
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
                    ))
                    : <p>Nenhum pedido encontrado.</p>
                }
            </div>
        </main>
    )
}
