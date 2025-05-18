'use client'

import { motion, AnimatePresence } from 'framer-motion'
import useThemeStore from '@/app/stores/ThemeStore'
import { FiAlertTriangle, FiTrash2, FiX } from 'react-icons/fi'

export default function ModalRemoverProduto({
    open,
    onConfirm,
    onCancel,
}: {
    open: boolean
    onConfirm: () => void
    onCancel: () => void
}) {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className={`rounded-lg p-6 w-full max-w-sm shadow-lg transition-colors
                        ${isDark ? 'bg-[#1f1f1f] text-white' : 'bg-white text-black'}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <FiAlertTriangle size={24} className="text-yellow-500" />
                            <h2 className="text-lg font-semibold">Remover item do carrinho?</h2>
                        </div>

                        <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            A quantidade é 1. Se continuar, o produto será removido do seu carrinho.
                        </p>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={onCancel}
                                className={`flex items-center gap-2 px-4 py-2 rounded text-sm transition-colors ${isDark
                                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                    : 'bg-gray-300 hover:bg-gray-400 text-black'
                                    }`}
                            >
                                <FiX size={16} />
                                Cancelar
                            </button>
                            <button
                                onClick={onConfirm}
                                className="flex items-center gap-2 px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
                            >
                                <FiTrash2 size={16} />
                                Remover
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
