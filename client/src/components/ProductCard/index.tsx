'use client'

import { Product } from '@/types/product'
import { FaShoppingCart } from 'react-icons/fa'
import { useCart } from '@/context/CartContext'
import useCarrinhoStore from '../../app/stores/CarrinhoStore.js'

interface ProductCardProps {
    product: Product
    showLabel?: boolean
}

const ProductCard = ({ product, showLabel = false }: ProductCardProps) => {
    //const { addToCart } = useCart()
    const { addProduto } = useCarrinhoStore((state) => state);


    return (
        <div className="border rounded p-4 relative flex flex-col justify-center shadow hover:scale-105 transform transition duration-300 cursor-pointer">
            {showLabel && (
                <span className="absolute top-2 left-0 bg-black text-white text-xs px-2 py-1 rounded-r shadow-md">
                    Recomendado
                </span>
            )}
            <div className="w-full flex justify-center">
                <img
                    src="/coffee-base.avif"
                    alt={product.name}
                    className="w-[200px] h-auto object-contain"
                />
            </div>
            <h3 className="font-semibold mb-2 text-center">{product.name}</h3>
            
            <p className="text-gray-800 text-center">
                Quantidade disponível: {product.quantidade}
            </p>
            <p className="text-gray-600 line-through text-center">
                R${product.originalPrice}
            </p>
            <p className="font-bold text-lg text-center">
                R${product.discountedPrice}
            </p>
            { product.quantidade !== 0 && <button
                onClick={() => addProduto(product)}
                className="absolute bottom-4 right-4 bg-black text-white rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 hover:bg-gray-800 hover:scale-110"
            >
                <FaShoppingCart />
            </button>
                }
        </div>
    )
}

export default ProductCard
