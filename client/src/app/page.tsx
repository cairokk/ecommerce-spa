import Header from '@/components/Header'
import { products } from '@/mock/products'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Header />
      <section className="flex flex-col md:flex-row h-[100vh] items-center justify-between w-full bg-white">
        <div className="text-center md:text-left md:w-2/3 md:px-12">
          <h1 className="text-6xl font-bold leading-tight">Desperte seus sentidos a cada gole</h1>
          <p className="text-gray-600 mt-4 max-w-xl mx-auto md:mx-0">
            Lorem Ipsum Dolor Sit Amet, Consectetur Adipisicing Elit, Sed Do Eiusmod
          </p>
          <Link href="/loja" className="w-[250px] items-center mt-8 justify-center flex bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors duration-300">Comprar Agora
          </Link>
        </div>
        <div className="flex justify-center h-full md:justify-center mt-8 items-center md:mt-0 w-full bg-[#FAFAFA] p-6 rounded-lg">
          <img src="/coffee-cup2.png" alt="Copo de Café" className="max-h-[750px] object-contain" />
        </div>
      </section>

      <section className="bg-black py-6 flex justify-center h-20">
       
      </section>

      <section className="px-6 py-12">
        <h2 className="text-2xl font-semibold text-center mb-8">— Mais vendidos —</h2>

        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          {['Espresso', 'Cappuccino', 'Latte', 'Mocha'].map((cat) => (
            <button
              key={cat}
              className="border px-6 py-2 rounded hover:bg-black hover:text-white transition-colors duration-300 cursor-pointer"
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded p-4 flex flex-col justify-center shadow relative hover:scale-105 transform transition duration-300 cursor-pointer"
            >
              <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">NOVO</span>
              <div className="w-full flex justify-center">
                <img src="/coffee-base.avif" alt={product.name} className="w-[200px] h-auto object-contain" />
              </div>
              <h3 className="font-semibold mb-2 text-center">{product.name}</h3>
              <p className="text-gray-600 line-through text-center">R${product.originalPrice}</p>
              <p className="font-bold text-lg text-center">R${product.discountedPrice}</p>
              <button className="absolute bottom-4 right-4 bg-black text-white rounded-full w-10 h-10 flex items-center justify-center">
                ➜
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-100 py-10 text-center px-6">
        <h4 className="text-xl font-semibold mb-4">Se torne um fornecedor</h4>
        <input
          type="email"
          placeholder="Digite o e-mail..."
          className="border px-4 py-2 w-72 max-w-full rounded focus:outline-none focus:ring-2 focus:ring-black transition duration-300"
        />
      </section>
    </>
  );
}
