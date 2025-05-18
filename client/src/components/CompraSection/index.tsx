'use client'

import { useState } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import useThemeStore from '@/app/stores/ThemeStore'

export default function CompraSection({
    number,
    title,
    children,
    defaultOpen = true
}: {
    number: number
    title: string
    children: React.ReactNode
    defaultOpen?: boolean
}) {
    const [open, setOpen] = useState(defaultOpen)
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    return (
        <div className={`rounded-xl shadow ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'}`}>
            <button
                onClick={() => setOpen(!open)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-t-xl ${isDark ? 'bg-[#48505C]' : 'bg-gray-300'} cursor-pointer transition-colors`}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 border font-bold rounded flex items-center justify-center text-sm ${isDark ? 'border-[#CDCDCD] text-[#CDCDCD]' : 'border-gray-600 text-gray-700'}`}>
                        {number}
                    </div>
                    <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{title}</h2>
                </div>
                {open ? (
                    <FiChevronUp className={isDark ? 'text-white' : 'text-black'} />
                ) : (
                    <FiChevronDown className={isDark ? 'text-white' : 'text-black'} />
                )}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`${isDark ? 'bg-[#2C323B]' : 'bg-gray-100'} overflow-hidden`}
                    >
                        <div className="pt-2">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
