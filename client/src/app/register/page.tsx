'use client'
import Header from '@/components/Header';
import { useState } from 'react';

export default function Register() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <>
        <div className='text-white'>
            <Header/>    
        </div>
        
        <div className="min-h-screen flex items-center justify-center bg-black px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-6">
                    {isLogin ? 'Entrar na conta' : 'Criar nova conta'}
                </h2>

                <form className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="E-mail"
                        className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button
                        type="submit"
                        className="bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors duration-300"
                    >
                        {isLogin ? 'Entrar' : 'Registrar'}
                    </button>
                </form>

                <p className="text-sm text-center mt-4 text-gray-600">
                    {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-black underline"
                    >
                        {isLogin ? 'Cadastre-se' : 'Entrar'}
                    </button>
                </p>
            </div>
        </div>
        </>
    );
}
