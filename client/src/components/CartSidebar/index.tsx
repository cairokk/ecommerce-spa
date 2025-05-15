'use client'

import { FiX } from 'react-icons/fi'
import { FaTrashAlt } from 'react-icons/fa'
import { useCart } from '@/context/CartContext' 
import useCarrinhoStore from '../../app/stores/CarrinhoStore.js'

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

type CartItem = {
  id: number;
  name: string;
  quantity: number;
  discountedPrice: number;
  price: number;
  image: string;
};

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { carrinho, removeProduto } = useCarrinhoStore((state) => state);
  const cartItems:CartItem[] = carrinho?.produtos || []


  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-25 z-40"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">Seu Carrinho</h2>
          <button onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>
        <div className="p-4">
          {cartItems.length === 0 ? (
            <p>Seu carrinho esta vazio</p>
          ) : (
            <div>
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <img
                      src="/coffee-base.avif"
                      alt={item.name}
                      className="w-16 h-16 object-contain mr-4"
                    />
                    <div>
                      <h3 className="text-sm font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-500">R${item.discountedPrice}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeProduto(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrashAlt size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="bg-black text-white w-full py-2 rounded-md hover:bg-gray-800"
          >
            Finalizar Compra
          </button>
        </div>
      </aside>
    </>
  )
}
