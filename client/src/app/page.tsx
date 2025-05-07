'use client'

import { products } from '@/mock/products'
import Link from 'next/link'
import { useState } from 'react'
import ProductCard from '@/components/ProductCard'

export default function Home() {
  const categories = ['Todos', 'Espresso', 'Cappuccino', 'Latte', 'Mocha']
  const [selectedCategory, setSelectedCategory] = useState('Todos')

  const filteredProducts = selectedCategory === 'Todos'
    ? products
    : products.filter((product) => product.category === selectedCategory)

  return (
    <>
      <section className="flex flex-col md:flex-row h-[100vh] items-center justify-between w-full bg-white px-6 py-12">
        <div className="max-w-screen-xl mx-auto w-full flex md:flex-row flex-col items-stretch gap-8">
          <div className="flex-1 flex flex-col justify-center text-center md:text-left">
            <h1 className="text-5xl font-bold leading-tight">Desperte seus sentidos a cada gole</h1>
            <p className="text-gray-600 mt-4 font-2xl max-w-xl mx-auto md:mx-0">
              Para quem não abre mão de uma boa experiência - descubra o melhor em cápsulas, moedores, cafeteiras e acessórios
            </p>
            <Link
              href="/loja"
              className="group md:w-[250px] w-full block items-center mt-8 justify-center md:flex bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors duration-300"
            >
              <span className="flex items-center justify-center gap-2">
                Comprar Agora
                <span
                  className="overflow-hidden inline-block w-0 group-hover:w-auto group-hover:ml-2 transition-all duration-300"
                >
                  ➜
                </span>
              </span>
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-center bg-gradient-to-r from-[#f3f3f3] to-white p-6 rounded-lg">
            <img src="/coffee-cup2.png" alt="Copo de Café" className="max-h-[750px] object-contain" />
          </div>
        </div>
      </section>

      <section className="bg-black py-6">
        <div className="max-w-screen-xl mx-auto px-6">
          <ul className="flex items-center justify-between gap-8 overflow-x-auto whitespace-nowrap">
            {[
              { name: '3 Corações', src: '/3coracoes.png' },
              { name: 'Nespresso', src: '/nespresso.png' },
              { name: 'Orfeu', src: '/orfeu.png' },
              { name: 'Baggio', src: '/baggio.png' },
            ].map((brand) => (
              <li
                key={brand.name}
                className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              >
                <img src={brand.src} alt={brand.name} className="h-10 md:h-12 object-contain" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-6 py-12 max-w-screen-xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-8">— Mais vendidos —</h2>

        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`border px-6 py-2 rounded transition-colors duration-300 cursor-pointer ${selectedCategory === cat ? 'bg-black text-white' : 'hover:bg-black hover:text-white'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} showLabel={true} />
          ))}
        </div>

      </section>
    </>
  )
}
