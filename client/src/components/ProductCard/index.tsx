'use client'

import { Product } from '@/types/product'
import { FaShoppingCart } from 'react-icons/fa'
import useCarrinhoStore from '../../app/stores/CarrinhoStore.js'
import useThemeStore from '@/app/stores/ThemeStore'

interface ProductCardProps {
    product: Product
    showLabel?: boolean
}

const ProductCard = ({ product, showLabel = false }: ProductCardProps) => {
    const { addProdutoFiltrado, setIsCartOpen } = useCarrinhoStore((state) => state)
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    return (
        <div
            className={`relative rounded-2xl p-1 shadow-lg hover:scale-105 transition-colors transition-transform duration-300 ${isDark ? 'bg-[#1c1c1c] text-white' : 'bg-[#f9f9f9] text-black'
                }`}
        >
            {showLabel && (
                <span className="absolute top-2 left-0 bg-white text-black text-xs font-semibold px-3 py-1 rounded-r-md shadow-md">
                    Recomendado
                </span>
            )}

            <div
                className="h-[200px] rounded-xl p-4 flex justify-center items-center mb-4"
                style={{
                    background: isDark
                        ? 'linear-gradient(to bottom right, #556E6C, #527072)'
                        : 'linear-gradient(to bottom right, #dde8dd, #cfe2d2)',
                    transition: 'background 0.3s ease',
                }}
            >
                <img
                    src="/coffee-base.avif"
                    alt={product.name}
                    className="w-[180px] h-auto object-contain"
                />
            </div>

            <div className="flex flex-col px-4 items-start justify-center">
                <h3
                    className="font-semibold text-start text-base mb-1"
                    style={{
                        color: isDark ? '#ffffff' : '#1c1c1c',
                        transition: 'color 0.3s ease',
                    }}
                >
                    {product.name}
                </h3>

                <div className="flex items-center gap-5 mb-1 justify-center">
                    <p
                        className="text-lg"
                        style={{
                            color: isDark ? '#ffffff' : '#1c1c1c',
                            transition: 'color 0.3s ease',
                        }}
                    >
                        R$ {product.discountedPrice.toFixed(2)}
                    </p>
                    <p className="text-sm line-through text-gray-400 opacity-70">
                        R$ {product.originalPrice.toFixed(2)}
                    </p>
                </div>

                <p
                    className="text-sm text-gray-400 text-center mb-4"
                    style={{ transition: 'color 0.3s ease' }}
                >
                    Restam: {product.quantidade}
                </p>

                {product.quantidade > 0 && (
                    <button
                        onClick={() => {
                            addProdutoFiltrado({ ...product, quantidadeDisponivel: product.quantidade })
                            setIsCartOpen(true)
                        }}
                        className="absolute bottom-4 right-4 rounded-full cursor-pointer w-10 h-10 flex items-center justify-center transition-all duration-300 hover:bg-white hover:text-black"
                        style={{
                            backgroundColor: isDark ? '#2c2c2c' : '#e2e2e2',
                            color: isDark ? '#ffffff' : '#000000',
                            transition: 'background-color 0.3s ease, color 0.3s ease',
                        }}
                    >
                        <FaShoppingCart />
                    </button>
                )}
            </div>
        </div>
    )
}

export default ProductCard
