'use client'
import { useState } from 'react'
import { products } from '@/mock/products'
import ProductCard from '@/components/ProductCard'

export default function Store() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [minPrice, setMinPrice] = useState<number>(0)
    const [maxPrice, setMaxPrice] = useState<number>(1000)

    // Categorias, origens, intensidades e tipos de grãos para os filtros
    const categories = ['Espresso', 'Latte', 'Cappuccino', 'Mocha']
    //const origins = ['Brasil', 'Colômbia', 'Etiópia'];
    //const intensities = ['Leve', 'Médio', 'Forte'];
    //const beans = ['Arábica', 'Robusta'];
    
    const filteredProducts = products.filter((product) => {
        return (
            (!selectedCategory || product.category === selectedCategory) &&
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            product.discountedPrice >= minPrice &&
            product.discountedPrice <= maxPrice
        )
    })

    return (
        <>
            <section className="flex flex-col md:flex-row h-[100vh] justify-between px-6 py-12 pt-24">
                <div className="md:w-1/4 bg-gray-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-6">Filtros</h2>
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold">Categoria</h3>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`border px-4 py-2 rounded hover:bg-black hover:text-white transition-colors duration-300 cursor-pointer ${selectedCategory === category ? 'bg-black text-white' : ''}`}
                                >
                                    {category}
                                </button>
                            ))}
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`border px-4 py-2 rounded hover:bg-black hover:text-white transition-colors duration-300 cursor-pointer ${!selectedCategory ? 'bg-black text-white' : ''}`}
                            >
                                Todos
                            </button>
                        </div>
                    </div>
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold">Buscar por Nome</h3>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Digite o nome do café"
                            className="border px-4 py-2 w-full rounded mb-4"
                        />
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold">Preço</h3>
                        <div>
                            <input
                                type="number"
                                value={minPrice}
                                onChange={(e) => setMinPrice(Number(e.target.value))}
                                placeholder="Preço Mínimo"
                                className="border px-4 py-2 w-full rounded mb-4"
                            />
                            <input
                                type="number"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                placeholder="Preço Máximo"
                                className="border px-4 py-2 w-full rounded"
                            />
                        </div>
                    </div>
                </div>
                <div className="md:w-3/4">
                    <h2 className="text-2xl font-semibold text-center mb-8">Todos os Produtos</h2>
                    <div className="grid grid-cols-1 px-8 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
