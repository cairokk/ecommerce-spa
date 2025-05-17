'use client'

import { useEffect, useState } from 'react'
import { products as produtos } from '@/mock/products'
import ProductCard from '@/components/ProductCard'
import useThemeStore from '@/app/stores/ThemeStore'
import axios from 'axios'
import { FiSearch } from 'react-icons/fi'

export default function Store() {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState<string>('')
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    //const { produtos, setProdutos } = useProdutoStore((state: any) => state)

    const categories = ['Espresso', 'Latte', 'Cappuccino', 'Mocha']

    async function getProdutos() {
        try {
            const resposta = await axios.get('http://localhost:8084/produtos', {
                headers: {}
            });
            //setProdutos(resposta.data);
            console.log('Produtos recebidos:', resposta.data);
            //window.dispatchEvent(new Event('storageUpdated'));
        } catch (erro) {
            console.error('Erro ao enviar dados:', erro)
        }
    }

    useEffect(() => {
        getProdutos()
    }, [])

    const toggleCategory = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        )
    }

    const clearFilters = () => {
        setSelectedCategories([])
        setSearchTerm('')
    }

    const filteredProducts = (produtos ?? []).filter((produto: any) => {
        return (
            (selectedCategories.length === 0 || selectedCategories.includes(produto.category)) &&
            produto.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })

    const hasFilters = selectedCategories.length > 0 || searchTerm !== ''

    return (
        <section
            className="min-h-[100vh] pt-20 pb-12 px-4 sm:px-6"
            style={{
                color: isDark ? '#ffffff' : '#000000',
                backgroundColor: isDark ? '#030303' : '#ffffff',
                transition: 'background-color 0.3s ease, color 0.3s ease',
            }}
        >
            <div
                className="rounded-lg p-6 mb-8"
                style={{
                    backgroundColor: isDark ? '#0D1015' : '#f5f5f5',
                    transition: 'background-color 0.3s ease',
                }}
            >
                <div className="text-start mb-8">
                    <h2 className="text-4xl font-bold">Todos Os Produtos</h2>
                    <p
                        className="text-sm mt-2"
                        style={{ opacity: 0.8, color: isDark ? '#cccccc' : '#555555' }}
                    >
                        Descubra Todos Os Produtos Disponíveis
                    </p>
                </div>

                <div className="flex justify-center mb-4">
                    <div className="relative w-full">
                        <FiSearch
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-xl"
                            style={{
                                color: isDark ? '#FFA500' : '#888888',
                            }}
                        />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Faça Sua Pesquisa Aqui"
                            className="pl-12 pr-4 py-3 w-full rounded-lg border-none text-sm shadow focus:outline-none"
                            style={{
                                backgroundColor: isDark ? '#ebebeb' : '#ebebeb',
                                color: isDark ? '#2c2c2c' : '#000000',
                                transition: 'background-color 0.3s ease, color 0.3s ease',
                            }}
                        />
                    </div>
                </div>
            </div>

            <div
                className="rounded-lg p-6 mb-8"
                style={{
                    backgroundColor: isDark ? '#0D1015' : '#f5f5f5',
                    transition: 'background-color 0.3s ease',
                }}
            >
                <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => {
                            const isSelected = selectedCategories.includes(cat)
                            return (
                                <button
                                    key={cat}
                                    onClick={() => toggleCategory(cat)}
                                    className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors duration-300 ${isSelected
                                            ? 'bg-[#8EA4DF] text-white border-transparent'
                                            : isDark
                                                ? 'bg-[#535D77] text-[#e1e1e1] border-gray-600 hover:bg-[#8EA4DF]'
                                                : 'bg-[#e0e0e0] text-[#222222] border-gray-400 hover:bg-[#8EA4DF] hover:text-white'
                                        }`}
                                >
                                    {cat}
                                </button>
                            )
                        })}
                    </div>
                    {hasFilters && (
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 rounded-full text-sm border transition-all duration-300"
                            style={{
                                borderColor: isDark ? '#555555' : '#cccccc',
                                color: isDark ? '#ffffff' : '#000000',
                                backgroundColor: isDark ? 'transparent' : '#f1f1f1',
                            }}
                        >
                            Limpar Filtros
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredProducts.map((product: any) => (
                        <ProductCard key={product.id} product={product} showLabel />
                    ))}
                </div>
            </div>
        </section>
    )
}
