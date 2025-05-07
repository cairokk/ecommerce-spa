'use client'

import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-black text-gray-200 px-6 py-12">
            <div className="max-w-screen-xl mx-auto flex justify-between text-sm">

                <div>
                    <h3 className="text-lg font-semibold mb-2">Bleecker Café</h3>
                    <p className="text-gray-300 leading-relaxed">
                        Tudo para quem leva o café a sério. <br />
                        Equipamentos, acessórios e produtos selecionados <br />
                        para transformar sua rotina em um verdadeiro ritual
                    </p>
                </div>


                <div className="text-right">
                    <h4 className="text-lg font-semibold mb-2">Links rápidos</h4>
                    <ul className="space-y-1 text-gray-300">
                        <li>
                            <Link href="/" className="hover:underline">Inicio</Link>
                        </li>
                        <li>
                            <Link href="/loja" className="hover:underline">Loja</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
                <div className="w-12 h-[1px] bg-white mb-4 opacity-50" />
                <p className="text-gray-400">
                    © Unifor – Projeto universitário –{' '}
                    <a
                        href="https://github.com/LeoBat00/distriCommerce-spa.git"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-white transition-colors"
                    >
                        git repository
                    </a>
                </p>
            </div>

        </footer>
    )
}
