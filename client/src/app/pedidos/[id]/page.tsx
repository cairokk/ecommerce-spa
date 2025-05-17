'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { pedidos } from '../../../mock/pedidos';
import useThemeStore from '@/app/stores/ThemeStore';

export default function PedidoPage() {
    const params = useParams();
    const pedidoId = params.id as string;
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';

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

    const steps = [
        { label: 'Pedido Realizado', active: true },
        {
            label: 'Aguardando Pagamento',
            active: pedido.status === 'Aguardando Pagamento' || pedido.status === 'Saiu para Entrega',
        },
        {
            label: 'Saiu para Entrega',
            active: pedido.status === 'Saiu para Entrega',
        },
    ];

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
                <h1 className="text-3xl font-bold text-center mb-2">Pedido #{pedido.id}</h1>
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
                            <li key={index} className="flex justify-between">
                                <span>{item.quantity}x {item.name}</span>
                                <span>R${item.price.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-4 text-sm text-gray-500">
                        Status: <strong>{pedido.status}</strong>
                    </p>
                    <p className="text-sm text-gray-500">
                        Total: <strong>R${pedido.total.toFixed(2)}</strong>
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
