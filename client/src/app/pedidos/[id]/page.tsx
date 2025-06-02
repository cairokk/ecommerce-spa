'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import useThemeStore from '@/app/stores/ThemeStore';
import usePedidoStore from '@/app/stores/PedidoStore';
import { useEffect, useState } from 'react';
import { urlGateway } from '@/app/constants'

export default function PedidoPage() {
    const { id } = useParams();
    const pedidoId = Number(id);
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';
    const { pedidos } = usePedidoStore();
    const [produtos, setProdutos] = useState<Record<number, { name: string; discountedPrice: number }>>({})

    const pedido = pedidos.find((p) => p.id === pedidoId);

    if (!pedido) {
        return (
            <main
                className="w-full min-h-screen flex justify-center items-center px-4 pt-28"
                style={{
                    backgroundColor: isDark ? '#0f0f0f' : '#ffffff',
                    color: isDark ? '#ffffff' : '#000000',
                }}
            >
                <p className="text-center font-semibold">Pedido não encontrado</p>
            </main>
        );
    }

    const statusEtapas = ['CRIADO', 'PAGO', 'ENVIADO', 'ENTREGUE'];
    const indexEtapaAtual = statusEtapas.indexOf(pedido.status);

    const steps = statusEtapas.map((status, index) => ({
        label:
            {
                CRIADO: 'Pedido Realizado',
                PAGO: 'Pagamento Confirmado',
                ENVIADO: 'Saiu para Entrega',
                ENTREGUE: 'Entregue'
            }[status] ?? status,
        active: index <= indexEtapaAtual
    }));

    useEffect(() => {
        async function fetchTodosProdutos() {
            try {
                const resposta = await fetch(`${urlGateway}/produtos`);
                const lista = await resposta.json();

                const mapa: Record<number, { name: string; discountedPrice: number }> = {};
                lista.forEach((produto: { id: number; name: string; discountedPrice: number }) => {
                    mapa[produto.id] = {
                        name: produto.name,
                        discountedPrice: produto.discountedPrice
                    };
                });
                console.log('Produtos carregados:', mapa);
                setProdutos(mapa);
            } catch (erro) {
                console.error('Erro ao buscar produtos:', erro);
            }
        }

        fetchTodosProdutos();
    }, []);


    return (
        <main
            className="w-full min-h-screen flex justify-center pt-28 px-4"
            style={{
                backgroundColor: isDark ? '#0f0f0f' : '#ffffff',
                color: isDark ? '#ffffff' : '#000000',
            }}
        >
            <section
                className="flex flex-col items-center h-full p-10 w-full shadow-md max-w-3xl justify-between rounded-xl transition-colors duration-300"
                style={{
                    backgroundColor: isDark ? '#1c1c1c' : '#f9f9f9',
                }}
            >
                <h1 className="text-3xl font-bold text-center mb-2">
                    Pedido #{pedido.id}
                </h1>
                <p className={`text-center mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    A viagem do seu café <span className="font-bold">continua</span> — rastreie seu pedido com status em tempo real.
                </p>

                <div className="relative w-full flex justify-between items-center mt-6">
                    {steps.map((step, index) => (
                        <div key={index} className="relative z-10 flex flex-col items-center w-full">
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${step.active
                                    ? 'bg-black text-white'
                                    : isDark
                                        ? 'bg-gray-600 text-white'
                                        : 'bg-gray-300 text-black'
                                    }`}
                            >
                                {index + 1}
                            </motion.div>
                            <p className="text-center text-sm font-medium w-24">{step.label}</p>
                        </div>
                    ))}
                </div>

                <div
                    className="w-full mt-10 border rounded-lg p-4"
                    style={{
                        borderColor: isDark ? '#444' : '#e5e5e5',
                        backgroundColor: isDark ? '#2a2a2a' : '#ffffff',
                    }}
                >
                    <h2 className="font-semibold mb-4">Itens do pedido</h2>
                    <ul className="space-y-2">
                        {pedido.items.map((item, index) => (
                            <li key={index} className="flex justify-between text-sm">
                                <span>
                                    {item.quantity}x {produtos[item.productId]?.name || `Produto ${item.productId}`}
                                </span>
                                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                    R${(produtos[item.productId]?.discountedPrice ?? 0 * item.quantity).toFixed(2)}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-4 text-sm" style={{ color: isDark ? '#aaa' : '#555' }}>
                        Status: <strong>{pedido.status}</strong>
                    </p>
                    <p className="text-sm" style={{ color: isDark ? '#aaa' : '#555' }}>
                        Total: <strong>R$ {pedido.totalPrice.toFixed(2)}</strong>
                    </p>
                </div>

                <div className="w-full flex justify-end gap-3 items-center mt-12">
                    <button
                        className={`px-6 py-2 rounded-2xl border transition-all ${isDark
                            ? 'border-white text-white hover:bg-white hover:text-black'
                            : 'border-black text-black hover:bg-black hover:text-white'
                            }`}
                    >
                        Ajuda
                    </button>
                    <Link
                        href="/pedidos"
                        className="bg-black text-white rounded-2xl px-6 py-2 hover:bg-gray-800 transition-all"
                    >
                        Voltar
                    </Link>
                </div>
            </section>
        </main>
    );
}
