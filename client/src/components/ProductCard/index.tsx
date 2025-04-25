import { Product } from '@/types/product'
import { FaShoppingCart } from 'react-icons/fa'

interface ProductCardProps {
    product: Product
    onAddToCart: (product: Product) => void
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
    return (
        <div
            key={product.id}
            className="border rounded p-4 relative flex flex-col justify-center shadow hover:scale-105 transform transition duration-300 cursor-pointer"
        >
            <div className="w-full flex justify-center">
                <img
                    src="/coffee-base.avif"
                    alt={product.name}
                    className="w-[200px] h-auto object-contain"
                />
            </div>
            <h3 className="font-semibold mb-2 text-center">{product.name}</h3>
            <p className="text-gray-600 line-through text-center">R${product.originalPrice}</p>
            <p className="font-bold text-lg text-center">R${product.discountedPrice}</p>
            <button
                className="absolute bottom-4 right-4 bg-black text-white rounded-full w-10 h-10 flex items-center justify-center"
                onClick={() => onAddToCart(product)}
            >
                <FaShoppingCart />
            </button>
        </div>
    )
}

export default ProductCard
