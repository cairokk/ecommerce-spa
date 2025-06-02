'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import useThemeStore from '@/app/stores/ThemeStore'
import usePerfilStore from '@/app/stores/PerfilStore'
import usePedidoStore from '@/app/stores/PedidoStore'
import { urlGateway } from '@/app/constants'
import axios from 'axios'

interface OrderItem {
    productId: number
    quantity: number
}

interface EnderecoEntrega {
    rua: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    estado: string
    cep: string
}

interface Pedido {
    id: number
    customerId: number
    items: OrderItem[]
    totalPrice: number
    payMethod: number
    enderecoEntrega: EnderecoEntrega
    status: 'CRIADO' | 'PAGO' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO'
}

const statusOptions = ['Todos', 'CRIADO', 'PAGO', 'ENVIADO', 'ENTREGUE', 'CANCELADO']

export default function PedidosPage() {
    const [statusFilter, setStatusFilter] = useState('Todos')
    const router = useRouter()
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const { perfil, getIdFromToken } = usePerfilStore((state) => state)
    const { pedidos, setPedidos } = usePedidoStore((state) => state)
    const [nomesProdutos, setNomesProdutos] = useState<Record<number, string>>({})

    const token = perfil?.token
    const userID = getIdFromToken()
    const getStatusVisual = (status: Pedido['status']) => {
        switch (status) {
            case 'CRIADO':
                return { border: '#faa754', label: 'Aguardando pagamento' }
            case 'PAGO':
                return { border: '#4fd683', label: 'Pagamento confirmado' }
            case 'ENVIADO':
                return { border: '#4a80d1', label: 'Saiu para entrega' }
            case 'ENTREGUE':
                return { border: '', label: 'Pedido entregue', }
            case 'CANCELADO':
                return { border: '#ff7070', label: 'Pedido cancelado' }
            default:
                return { border: '#ccc', label: 'Status desconhecido' }
        }
    }

    useEffect(() => {
        if (!token || !userID) {
            router.push('/login');
            return;
        }

        async function carregarTudo() {
            await fetchPedidos();
            await fetchTodosProdutos();
        }

        carregarTudo();
    }, [token, userID]);

    async function fetchTodosProdutos() {
        try {
            const resposta = await axios.get(`${urlGateway}/produtos`);
            const lista = resposta.data;

            const mapa: Record<number, string> = {};
            lista.forEach((produto: { id: number; name: string }) => {
                mapa[produto.id] = produto.name;
            });

            setNomesProdutos(mapa);
        } catch (erro) {
            console.error('Erro ao buscar lista de produtos:', erro);
        }
    }



    const fetchPedidos = async () => {
        try {
            const resposta = await axios.get(`${urlGateway}/pedidos/usuario/${userID}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setPedidos(resposta.data)
        } catch (erro) {
            console.error('Erro ao buscar pedidos:', erro)
        }
    }

    const pedidosFiltrados = statusFilter === 'Todos'
        ? pedidos
        : pedidos.filter(p => p.status === statusFilter)

    return (
        <main
            className="min-h-screen px-14 w-full pt-20 py-12 mx-auto transition-colors duration-300"
            style={{
                backgroundColor: isDark ? '#0f0f0f' : '#ffffff',
                color: isDark ? '#f5f5f5' : '#000000',
            }}
        >
            <h1 className="text-2xl font-bold mt-8 mb-6 ">Meus Pedidos</h1>


            <div className="flex border-b mb-8" style={{ borderColor: isDark ? '#3f3f3f' : '#d1d5db' }}>
                {statusOptions.map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className="px-4 py-2 font-medium border-b-2 transition-colors duration-300"
                        style={{
                            borderColor: statusFilter === status ? '#f97316' : 'transparent',
                            color:
                                statusFilter === status
                                    ? isDark ? '#ffffff' : '#000000'
                                    : isDark ? '#a3a3a3' : '#6b7280',
                        }}
                    >
                        {{
                            'CRIADO': 'Pedidos Realizados',
                            'PAGO': 'Pagos',
                            'ENVIADO': 'Em Andamento',
                            'ENTREGUE': 'Entregues',
                            'CANCELADO': 'Cancelados',
                            'Todos': 'Todos'
                        }[status]}
                    </button>
                ))}
            </div>

            <div className="space-y-6 ">
                {pedidosFiltrados.length > 0 ? pedidosFiltrados.map((pedido) => (
                    <div
                        key={pedido.id}
                        className="rounded-xl overflow-hidden shadow-lg"
                        style={{
                            backgroundColor: isDark ? '#1c1c1c' : '#ffffff',
                            color: isDark ? '#f5f5f5' : '#000000',
                        }}
                    >
                        <div
                            className="flex justify-start gap-5 items-center border-b-2 px-6 pl-0 py-3"
                            style={{
                                borderColor: getStatusVisual(pedido.status).border,
                                backgroundColor: isDark ? '#48505C' : '#ebedf1',
                            }}
                        >
                            <div className="text-sm font-medium">
                                <p className="opacity-80 ml-6" style={{ color: isDark ? '#e5e5e5' : '#000000' }}>
                                    Status do pedido
                                </p>
                                <span
                                    className="font-semibold rounded-r-md inline-block"
                                    style={{
                                        backgroundColor: getStatusVisual(pedido.status).border,
                                        color:
                                            pedido.status === 'ENTREGUE'
                                                ? isDark ? '#e5e5e5' : '#000000'
                                                : '#ffffff',
                                        padding: pedido.status === 'ENTREGUE' ? '0 0 0 1.5rem ' : '0.25rem 0.75rem 0.25rem 1.5rem',
                                    }}
                                >
                                    {getStatusVisual(pedido.status).label}
                                </span>
                            </div>
                            <div className="text-sm font-medium text-left">
                                <p className="opacity-80 ">Total</p>
                                <p className="font-semibold" style={{ color: isDark ? '#ffffff' : '#000000' }}>
                                    R$ {pedido.totalPrice.toFixed(2)}
                                </p>                            </div>
                        </div>

                        <div
                            className="p-6 flex justify-between items-end"
                            style={{ backgroundColor: isDark ? '#1c1c1c' : '#F6F6F6' }}
                        >
                            <div className="flex items-center gap-4">
                                <Image
                                    src="/coffee-base.avif"
                                    alt={`Pedido #${pedido.id}`}
                                    width={80}
                                    height={80}
                                    className="rounded"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold" style={{ color: isDark ? '#ffffff' : '#000000' }}>
                                        Pedido {pedido.id.toString().padStart(2, '0')}
                                    </h3>
                                    <ul className="text-sm" style={{ color: isDark ? '#d4d4d4' : '#4b5563' }}>
                                        {(() => {
                                            const agrupado = pedido.items.reduce<Record<number, number>>((acc, item) => {
                                                acc[item.productId] = (acc[item.productId] || 0) + item.quantity;
                                                return acc;
                                            }, {});

                                            const productIds = Object.keys(agrupado).map(Number);
                                            const mostrar = productIds.slice(0, 3);
                                            const temMais = productIds.length > 3;

                                            return (
                                                <>
                                                    {mostrar.map((productId, index) => (
                                                        <li key={productId}>
                                                            {nomesProdutos[productId]
                                                                ? `${nomesProdutos[productId]}${agrupado[productId] > 1 ? ` (x${agrupado[productId]})` : ''}`
                                                                : 'Carregando...'}
                                                            {agrupado[productId] > 1 && ` (x${agrupado[productId]})`}
                                                        </li>
                                                    ))}
                                                    {temMais && <li>e outros itens</li>}
                                                </>
                                            );
                                        })()}
                                    </ul>
                                </div>
                            </div>
                            <button
                                onClick={() => router.push(`/pedidos/${pedido.id}`)}
                                className="px-4 py-2 cursor-pointer rounded-full text-sm shadow hover:opacity-90 transition"
                                style={{
                                    backgroundColor: isDark ? '#ffffff' : '#000000',
                                    color: isDark ? '#000000' : '#ffffff',
                                }}
                            >
                                Visualizar rastreio
                            </button>

                        </div>
                    </div>
                )) : (
                    <p style={{ color: isDark ? '#a3a3a3' : '#4b5563' }}>Nenhum pedido encontrado.</p>
                )}
            </div>
        </main>
    )
}
