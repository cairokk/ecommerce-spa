'use client'

import { useEffect, useState } from 'react'
import { FiTrash2, FiEdit3, FiBox, FiTag, FiShoppingCart, FiMapPin } from 'react-icons/fi'
import useThemeStore from '@/app/stores/ThemeStore'
import ProtectedRoute from '@/components/ProtectedRoute'
import usePerfilStore from '../stores/PerfilStore'
import axios from 'axios'


interface Product {
    id: string
    idFornecedor: number
    name: string
    originalPrice: number
    discountedPrice: number
    quantidade: number
    origin: string
    intensity: string
    category: string
    beans: string
}

export default function ProdutosFornecedorPage() {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';

    // const perfil = usePerfilStore((state) => state.perfil);
    // const getIdFromToken = usePerfilStore((state) => state.getIdFromToken);
    const { perfil, getIdFromToken } = usePerfilStore((state) => state)

    const [produtos, setProdutos] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [produtoEditandoId, setProdutoEditandoId] = useState<string | null>(null)
    const [novaQuantidade, setNovaQuantidade] = useState<number>(0)
    const fornecedorId = getIdFromToken();
    const token = perfil?.token;

    const [form, setForm] = useState({
        id: '',
        name: '',
        originalPrice: 0,
        discountedPrice: 0,
        category: 'Espresso',
        origin: '',
        quantidade: 0,
        intensity: 'Leve',
        beans: 'Arábica',
    })

    const categories = ['Espresso', 'Latte', 'Cappuccino', 'Mocha']

    useEffect(() => {
        fetchProdutos()
    }, [])

    const fetchProdutos = async () => {
        try {
            setLoading(true)

            const resposta = await axios.get(`http://localhost:8084/produtos/fornecedor/${fornecedorId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const produtosData = resposta.data
            if (produtosData.length === 0) {
                setError('Nenhum produto encontrado.')
            } else {
                setProdutos(produtosData)
            }
            // const mockProdutos: Product[] = [
            //     {
            //         id: '1',
            //         idFornecedor: 1,
            //         name: 'Cápsulas Nespresso',
            //         originalPrice: 650.99,
            //         discountedPrice: 350.99,
            //         quantidade: 13,
            //         origin: 'Brasil',
            //         intensity: 'Leve',
            //         category: 'Cappuccino',
            //         beans: 'Arábica'
            //     },
            //     {
            //         id: '2',
            //         idFornecedor: 1,
            //         name: 'Café Premium',
            //         originalPrice: 40.00,
            //         discountedPrice: 28.50,
            //         quantidade: 7,
            //         origin: 'Colômbia',
            //         intensity: 'Forte',
            //         category: 'Espresso',
            //         beans: 'Blend'
            //     }
            // ]
            // setProdutos(mockProdutos)
        } catch (err) {
            setError('Erro ao carregar produtos.')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setForm(prev => ({
            ...prev,
            [name]: ['originalPrice', 'discountedPrice', 'quantidade'].includes(name) ? Number(value) : value
        }))
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const novoProduto: Product = {
                ...form,
                idFornecedor: fornecedorId
            }

            const response = await axios.post(
                'http://localhost:8084/produtos', novoProduto, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` // se necessário
                }
            });

            setProdutos(prev => [...prev, novoProduto])
            setForm({
                id: '', name: '', originalPrice: 0, discountedPrice: 0,
                category: 'Espresso', origin: '', quantidade: 0,
                intensity: 'Leve', beans: 'Arábica'
            })
        } catch (err) {
            console.error('Erro ao cadastrar produto:', err)
        }
    }

    const handleDelete = async (id: string) => {
        try {

            await axios.delete(`http://localhost:8084/produtos/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setProdutos(produtos.filter(p => p.id !== id))
        } catch (err) {
            console.error('Erro ao deletar produto:', err)
        }
    }

    const inputClass = `${isDark ? 'bg-[#1C2127] text-white' : 'bg-white text-black'} p-2 rounded shadow pl-10 w-full`

    const renderInput = (label, icon, props) => (
        <div className="w-full">
            <label className="block text-xs mb-1 ml-1 text-gray-400">{label}</label>
            <div className="relative">
                <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400">{icon}</div>
                <input {...props} className={inputClass} />
            </div>
        </div>
    )
    const iniciarEdicao = (produto: Product) => {
        setProdutoEditandoId(produto.id)
        setNovaQuantidade(produto.quantidade)
    }
    const salvarNovaQuantidade = async () => {
        if (!produtoEditandoId) return;

        const produtoOriginal = produtos.find(p => p.id === produtoEditandoId);
        if (!produtoOriginal) return;

        const produtoAtualizado = {
            ...produtoOriginal,
            quantidade: novaQuantidade
        };

        await atualizarProduto(produtoEditandoId, produtoAtualizado);
        setProdutoEditandoId(null);
    };

    const atualizarProduto = async (id: string, produtoAtualizado: Product) => {


        try {
            const response = await axios.put(
                `http://localhost:8084/produtos/${id}`, produtoAtualizado, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` // se necessário
                }
            });
     

            setProdutos((prev) =>
                prev.map((produto) =>
                    produto.id === id ? { ...produto, ...produtoAtualizado } : produto
                )
            )
        } catch (error) {
            console.error('Erro ao atualizar produto:', error)
            alert('Erro ao atualizar produto')
        }
    }

    return (
        <ProtectedRoute>
            <main className={`min-h-screen pt-28 px-4 ${isDark ? 'bg-[#000] text-white' : 'bg-gray-100 text-black'}`}>
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold mb-1">Produtos <span className="text-sm font-normal ml-2">{produtos.length} Produtos Cadastrados</span></h1>

                        {loading ? (
                            <p className="mt-6">Carregando produtos...</p>
                        ) : error ? (
                            <p className="mt-6 text-red-500">{error}</p>
                        ) : (
                            <div className="overflow-x-auto rounded-lg mt-4 ">
                                <table className={`
                                    w-full text-sm table-auto 
                                    rounded-md 
                                    border-separate border-spacing-y-2`}>
                                    <thead className={`${isDark ? 'bg-[#48505C]' : 'bg-gray-300'} rounded-md`}>
                                        <tr className="text-left">
                                            <th className="p-3 rounded-l-md">Nome Do Produto</th>
                                            <th className="p-3">Detalhes</th>
                                            <th className="p-3">Preços</th>
                                            <th className="p-3">Estoque</th>
                                            <th className="p-3 rounded-r-md">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {produtos.map(produto => (
                                            <tr key={produto.id} className={`
                                                ${isDark ? 'bg-[#272D37] hover:bg-[#323844]' : 'bg-white  rounded-md shadow-sm hover:bg-gray-100'}
                                                transition-colors duration-200`}>
                                                <td className="p-3 rounded-l-md" >
                                                    <span className="bg-green-400 text-black text-xs font-bold px-2 py-1 rounded">ATIVO</span>
                                                    <div className="font-semibold mt-1">{produto.name}</div>
                                                </td>
                                                <td className="p-3 leading-5">{produto.beans}<br />{produto.category}<br />{produto.intensity}</td>
                                                <td className="p-3">
                                                    <div className="text-xs text-gray-400 mb-1">Preço com Desconto</div>
                                                    <div className="font-semibold mb-1">R$ {produto.discountedPrice.toFixed(2)}</div>
                                                    <div className="text-xs text-gray-400 mb-1">Preço Original</div>
                                                    <div className="text-sm text-gray-400 line-through">R$ {produto.originalPrice.toFixed(2)}</div>
                                                </td>
                                                <td className="p-3 text-lg font-semibold">
                                                    {produtoEditandoId === produto.id ? (
                                                        <input
                                                            type="number"
                                                            value={novaQuantidade}
                                                            autoFocus
                                                            onChange={(e) => setNovaQuantidade(Number(e.target.value))}
                                                            onBlur={salvarNovaQuantidade}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') salvarNovaQuantidade()
                                                                if (e.key === 'Escape') setProdutoEditandoId(null)
                                                            }}
                                                            className="w-16 p-1 rounded border border-gray-300 bg-white text-black"
                                                        />
                                                    ) : (
                                                        produto.quantidade
                                                    )}
                                                </td>                                                <td className="p-0 rounded-r-md">
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <div className="w-full h-full flex items-start justify-start px-3 ">
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => iniciarEdicao(produto)}
                                                                    className="cursor-pointer text-blue-500 text-lg hover:text-blue-600"
                                                                    title="Editar Estoque"
                                                                >
                                                                    <FiEdit3 />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(produto.id)}
                                                                    className="cursor-pointer text-red-500 text-xl hover:text-red-600"
                                                                    title="Excluir Produto"
                                                                >
                                                                    <FiTrash2 />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className={`w-full lg:w-[360px] mt-13 border rounded-lg p-6 
                    ${isDark ? 'border-gray-700 bg-gradient-to-b from-[#2C323B] to-[#232527]' : 'border-gray-300 bg-white'} text-sm`}>
                        <h2 className="text-lg font-semibold mb-4">Criar Novo Produto</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {renderInput('Nome do Produto', <FiBox />, { name: 'name', placeholder: 'Nome Do Produto', value: form.name, onChange: handleChange, required: true })}
                            {renderInput('Preço Original', <FiTag />, { name: 'originalPrice', type: 'number', placeholder: 'Preço Original', value: form.originalPrice, onChange: handleChange, required: true })}
                            {renderInput('Preço com Desconto', <FiTag />, { name: 'discountedPrice', type: 'number', placeholder: 'Preço Descontado', value: form.discountedPrice, onChange: handleChange, required: true })}
                            {renderInput('Origem', <FiMapPin />, { name: 'origin', placeholder: 'Origem', value: form.origin, onChange: handleChange, required: true })}
                            <div>
                                <label className="block text-xs mb-1 ml-1 text-gray-400">Categoria</label>
                                <select name="category" className={inputClass} value={form.category} onChange={handleChange}>
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs mb-1 ml-1 text-gray-400">Grãos</label>
                                <select name="beans" className={inputClass} value={form.beans} onChange={handleChange}>
                                    <option value="Arábica">Arábica</option>
                                    <option value="Robusta">Robusta</option>
                                    <option value="Blend">Blend</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs mb-1 ml-1 text-gray-400">Intensidade</label>
                                <select name="intensity" className={inputClass} value={form.intensity} onChange={handleChange}>
                                    <option value="Leve">Leve</option>
                                    <option value="Médio">Médio</option>
                                    <option value="Forte">Forte</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full py-2 rounded bg-[#FFD06C] text-black font-semibold hover:bg-yellow-100 transition">Cadastrar Produto</button>
                        </form>
                    </div>
                </div>
            </main>
        </ProtectedRoute>

    )
}
