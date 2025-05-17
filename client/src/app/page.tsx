'use client'

import { products } from '@/mock/products'
import Link from 'next/link'
import { useState } from 'react'
import ProductCard from '@/components/ProductCard'
import useThemeStore from '@/app/stores/ThemeStore'

export default function Home() {
  const categories = ['Todos', 'Espresso', 'Cappuccino', 'Latte', 'Mocha']
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  const filteredProducts = selectedCategory === 'Todos'
    ? products
    : products.filter((product) => product.category === product.category)

  return (
    <>
      <section
        className="flex flex-col md:flex-row h-[100vh] items-center justify-between w-full px-6 py-12"
        style={{
          color: isDark ? '#f5f5f5' : '#000000',
          transition: 'background-color 0.3s ease, color 0.3s ease',
        }}
      >
        <div className="max-w-screen-xl mx-auto w-full flex md:flex-row flex-col items-stretch gap-8">
          <div className="flex-1 flex flex-col justify-center text-center md:text-left">
            <h1
              className="text-5xl font-bold leading-tight"
              style={{ fontFamily: 'TrenchSlab' }}
            >Desperte Seus Sentidos a Cada Gole</h1>
            <p
              className="mt-4 font-2xl max-w-xl mx-auto md:mx-0 text-gray-600"
              style={{
                color: isDark ? '#ADADAD' : '#404040',
                transition: 'color 0.3s ease',
              }}
            >
              Para quem não abre mão de uma boa experiência - descubra o melhor em cápsulas, moedores, cafeteiras e acessórios
            </p>
            <Link
              href="/loja"
              className="group md:w-[250px] w-full block items-center mt-8 justify-center md:flex px-6 py-3 rounded transition-all duration-300"
              style={{
                backgroundColor: isDark ? '#f5f5f5' : '#000000',
                color: isDark ? '#000000' : '#ffffff',
                transition: 'background-color 0.3s ease, color 0.3s ease',
              }}
            >
              <span className="flex items-center justify-center gap-2">
                Comprar Agora
                <span
                  className="inline-block translate-x-0 group-hover:translate-x-2 transition-transform duration-300"
                >
                  ➜
                </span>
              </span>
            </Link>
          </div>
          {isDark && (
            <img
              src="/GradiantGlowRight.png"
              alt="Efeito de Luz"
              className="absolute right-0 top-1/2 -translate-y-1/2 w-full opacity-40 pointer-events-none z-[-1] transition-opacity duration-300"
            />
          )}
          <div className="flex-1 relative flex items-center justify-center p-6 rounded-lg">


            <img
              src="/coffee-cup2.png"
              alt="Copo de Café"
              className="max-h-[750px] object-contain"
            />
          </div>
        </div>
      </section>

      <section
        className="py-6 relative"
        style={{
          backgroundColor: isDark ? '#1a1a1a' : '#000000',
          backgroundImage: isDark
            ? 'linear-gradient(to right, rgba(100, 126, 194, 0.5), rgba(226, 216, 255, 0.5))'
            : 'none',
          transition: 'background-color 0.3s ease, background-image 0.3s ease',
        }}
      >
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

      <section className="relative">
        {isDark && (
          <img
            src="/gradiantglow.png"
            alt="Glow Effect"
            className="absolute top-[-80px]  w-full h-[709px] opacity-50 pointer-events-none z-[-1] transition-opacity duration-300"
          />
        )}
      </section>

      <section
        className="px-6 py-12 max-w-screen-xl mx-auto"
        style={{
          color: isDark ? '#f5f5f5' : '#000000',
          transition: 'background-color 0.3s ease, color 0.3s ease',
        }}
      >
        <div className='mb-12 flex flex-col items-start gap-3'>
          <h2 className="text-3xl font-semibold text-start ">Vitrine</h2>
          <p className='text-[#9F9F9F]'>Mostrando apenas os mais recomendados</p>
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
