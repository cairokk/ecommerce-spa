'use client'

import { FiX } from 'react-icons/fi'
import { FaTrashAlt } from 'react-icons/fa'
import useCarrinhoStore from '../../app/stores/CarrinhoStore.js'
import useThemeStore from '@/app/stores/ThemeStore'

type CartItem = {
  id: number;
  name: string;
  quantidade: number;
  discountedPrice: number;
  price: number;
  image: string;
};

export default function CartSidebar() {
  const {
    carrinho,
    removeProduto,
    setCarrinho,
    isCartOpen,
    setIsCartOpen
  } = useCarrinhoStore((state) => state)

  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  const cartItems: CartItem[] = carrinho?.produtos || []
  const { diminuirQuantidade } = useCarrinhoStore((state) => state)


  return (
    <>
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black opacity-25 z-40"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-80 z-50 shadow-lg transform transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{
          backgroundColor: isDark ? '#1c1c1c' : '#ffffff',
          color: isDark ? '#ffffff' : '#000000',
        }}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700">
          <h2 className="text-lg font-bold">Seu Carrinho</h2>
          <button onClick={() => setIsCartOpen(false)} className="text-gray-500 cursor-pointer dark:text-gray-300">
            <FiX size={24} />
          </button>
        </div>

        <div className="p-4">
          {cartItems.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-300">Seu carrinho está vazio</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img
                      src="/coffee-base.avif"
                      alt={item.name}
                      className="w-16 h-16 object-contain mr-4"
                    />
                    <div className='flex flex-col mr-2'>
                      <h3 className="text-sm font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        R$ {item.discountedPrice} &times; {item.quantidade}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => diminuirQuantidade(item.id)}
                      className="w-8 cursor-pointer h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white transition-colors duration-300"
                    >
                      −
                    </button>

                    <button
                      onClick={() => removeProduto(item.id)}
                      className="text-red-500 cursor-pointer hover:text-red-700"
                    >
                      <FaTrashAlt size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-300 dark:border-gray-700">
          <button
            onClick={() => setIsCartOpen(false)}
            className="bg-black text-white w-full py-2 rounded-md cursor-pointer hover:bg-gray-800 transition-colors duration-300"
          >
            Finalizar Compra
          </button>
        </div>
      </aside>
    </>
  )
}
