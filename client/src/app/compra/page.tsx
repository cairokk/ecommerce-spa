'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useCarrinhoStore from '@/app/stores/CarrinhoStore'
import ModalRemoverProduto from '@/components/ModalRemoverProduto'
import CompraSection from '@/components/CompraSection'
import useCartaoStore from '@/app/stores/CartaoStore'
import { urlGateway } from '@/app/constants'
import { FiPlus, } from 'react-icons/fi'
import { PiQrCodeBold } from 'react-icons/pi'
import ProtectedRoute from '@/components/ProtectedRoute'
import useEnderecoStore from '@/app/stores/EnderecoStore'
import usePerfilStore from '@/app/stores/PerfilStore'
import {
    validarEnderecoCompleto,
    obterCamposComErro
} from '../../utils/enderecoUtils'

import {
    formatarNumeroCartao,
    formatarValidade,
    formatarCVV,
    validarCartaoCompleto,
} from '../../utils/cartaoUtils';
import { useRef, useEffect } from 'react'
import useThemeStore from '@/app/stores/ThemeStore'
import { FiTrash2 } from 'react-icons/fi'
import axios from 'axios'

export default function CompraPage() {
    const {
        carrinho,
        diminuirQuantidade,
        addProdutoFiltrado,
        clearCarrinho
    } = useCarrinhoStore((state) => state)

    const { cartoes, adicionarCartao, selecionado, selecionarCartao, removerCartao } = useCartaoStore()
    const { enderecos, adicionarEndereco, selecionadoEndereco, selecionarEndereco, removerEndereco } = useEnderecoStore()

    const [metodoPagamento, setMetodoPagamento] = useState<'cartao' | 'pix'>('cartao')
    const [selectedIds, setSelectedIds] = useState<number[]>(carrinho.produtos.map((p: any) => p.id))
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [mostrarFormularioEndereco, setMostrarFormularioEndereco] = useState(false)

    const [nomeTitular, setNomeTitular] = useState('')
    const [numero, setNumero] = useState('')
    const [validade, setValidade] = useState('')
    const [cvv, setCvv] = useState('')

    const [novoEndereco, setNovoEndereco] = useState({
        cep: '', cidade: '', rua: '', numero: '', bairro: '', complemento: '', estado: ''
    })

    const handleChangeEndereco = (e: any) => {
        const { name, value } = e.target;

        const camposNumericos = ['cep', 'numero'];
        const camposSomenteTexto = ['cidade', 'bairro', 'estado'];

        let novoValor = value;

        if (camposNumericos.includes(name)) {
            novoValor = value.replace(/\D/g, '');
            if (name === 'cep' && novoValor.length > 8) novoValor = novoValor.slice(0, 8);
            if (name === 'cep' && novoValor.length === 8) {
                novoValor = novoValor.replace(/(\d{5})(\d{3})/, '$1-$2');
            }
        }

        if (camposSomenteTexto.includes(name)) {
            novoValor = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
        }

        setNovoEndereco((prev) => ({ ...prev, [name]: novoValor }));
    };



    const router = useRouter()

    const [modalAberto, setModalAberto] = useState(false)
    const [produtoParaRemover, setProdutoParaRemover] = useState<string | null>(null)
    const [errosEndereco, setErrosEndereco] = useState<{ [key: string]: boolean }>({})
    const { perfil, getIdFromToken } = usePerfilStore((state) => state)
    const token = perfil?.token;
    const userID = getIdFromToken(token)


    const cartaoRef = useRef<HTMLButtonElement | null>(null)
    const pixRef = useRef<HTMLButtonElement | null>(null)
    const underlineRef = useRef<HTMLDivElement | null>(null)

    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    useEffect(() => {
        const el = metodoPagamento === 'cartao' ? cartaoRef.current : pixRef.current;
        const underline = underlineRef.current;

        if (el && underline) {
            const { offsetLeft, offsetWidth } = el;
            underline.style.left = `${offsetLeft}px`;
            underline.style.width = `${offsetWidth}px`;
        }
    }, [metodoPagamento]);

    const toggleItemSelecionado = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        )
    }

    const produtosSelecionados = carrinho.produtos.filter((p: any) => selectedIds.includes(p.id))
    const totalSelecionado = produtosSelecionados.reduce((acc: any, item: any) => acc + item.discountedPrice * item.quantidade, 0)

    const confirmarPedido = async () => {
        if (produtosSelecionados.length === 0) {
            alert('Selecione ao menos um item para continuar.')
            return
        }

        if (metodoPagamento === 'cartao' && !selecionado) {
            alert('Selecione um cartão para prosseguir com o pagamento.')
            return
        }
        if (!selecionadoEndereco) {
            alert('Selecione um endereço para prosseguir com o pagamento.')
            return
        }

        const cartaoSelecionado = cartoes.find((c: any) => c.id === selecionado)
        const enderecoSelecionado = enderecos.find((e: any) => e.id === selecionadoEndereco)
        const { id, ...enderecoSemId } = enderecoSelecionado || {};

        const pedidoPayload = {
            customerId: userID,
            items: produtosSelecionados.map((p: any) => ({
                productId: p.id,
                quantity: p.quantidade,
            })),
            totalPrice: totalSelecionado,
            payMethod: metodoPagamento === 'cartao' ? 1 : 2,
            cartao: metodoPagamento === 'cartao' && cartaoSelecionado ? {
                numero: cartaoSelecionado.numero,
                nome: cartaoSelecionado.nomeTitular,
                validade: cartaoSelecionado.validade,
                cvv: cartaoSelecionado.cvv,
            } : null,
            enderecoEntrega: enderecoSemId,
        }
        const baseUrl = urlGateway
        const response = await axios.post(
            `${baseUrl}/pedidos`, pedidoPayload, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        // Aqui deixar a chamada  pra api 

        clearCarrinho()
        alert('Pedido confirmado com sucesso!')
        router.push('/pedidos')
    }


    return (
        <ProtectedRoute>
            <main className={`min-h-screen pt-28 px-4 pb-5 md:px-20 flex flex-col md:flex-row gap-8 ${isDark ? 'bg-gradient-to-b from-[#0f0f0f] to-[#1e1e1e] text-white' : 'bg-gray-100 text-black'}`}>
                <div className="flex-1 space-y-6">
                    <h1 className="text-2xl font-bold">Finalizar Compras</h1>

                    <CompraSection number={1} title="Escolha os Itens a Serem Comprados">
                        {carrinho.produtos.map((item: any) => (
                            <div
                                key={item.id}
                                className={`flex flex-col md:flex-row justify-between items-center gap-4 p-5 rounded-xl ${isDark ? 'bg-[#2C323B]' : 'bg-white border border-gray-200'}`}
                            >
                                <div className="flex items-center gap-4 flex-1 w-full min-w-0">
                                    <img src="/coffee-base.avif" alt={item.name} className="w-16 h-16 rounded-lg flex-shrink-0" />
                                    <div className="flex flex-col min-w-0">
                                        <p className={`text-base font-semibold truncate ${isDark ? 'text-white' : 'text-black'}`}>{item.name}</p>
                                        <p className="text-sm text-gray-400">Vendido Pela Bleecker Café</p>
                                        <p className={`text-sm font-bold mt-1 ${isDark ? 'text-white' : 'text-black'}`}>R$ {item.discountedPrice.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-[auto_auto_auto] items-center gap-4 flex-shrink-0">
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => {
                                                if (item.quantidade === 1) {
                                                    setProdutoParaRemover(item.id)
                                                    setModalAberto(true)
                                                } else {
                                                    diminuirQuantidade(item.id)
                                                }
                                            }}
                                            className={`w-8 h-8 flex items-center justify-center rounded-md transition ${isDark ? 'bg-[#1C2127] text-white hover:bg-[#242931]' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
                                        >
                                            −
                                        </button>
                                        <span className={`w-8 h-8 flex items-center justify-center rounded-md text-center text-sm ${isDark ? 'bg-[#1C2127] text-white' : 'bg-gray-200 text-black'}`}>{item.quantidade}</span>
                                        <button
                                            onClick={() => addProdutoFiltrado(item)}
                                            disabled={item.quantidade >= item.estoque}
                                            className={`w-8 h-8 flex items-center justify-center rounded-md transition ${item.quantidade >= item.estoque
                                                ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                                                : isDark
                                                    ? 'bg-[#1C2127] hover:bg-[#242931] text-white'
                                                    : 'bg-gray-200 hover:bg-gray-300 text-black'}`}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="text-left min-w-[100px]">
                                        <p className="text-sm text-gray-400">Total:</p>
                                        <p className="text-lg font-semibold whitespace-nowrap">
                                            R$ {(item.discountedPrice * item.quantidade).toFixed(2)}
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(item.id)}
                                        onChange={() => toggleItemSelecionado(item.id)}
                                        className="w-5 h-5 rounded bg-[#1C2127] border-none accent-[#1C2127] cursor-pointer"
                                    />
                                </div>

                            </div>
                        ))}
                    </CompraSection>

                    <CompraSection number={2} title="Método de Pagamento">
                        <div className={`relative border-b px-7 ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                            <div className="flex gap-8 mt-2 relative">
                                <button
                                    ref={cartaoRef}
                                    onClick={() => setMetodoPagamento('cartao')}
                                    className={`pb-3 text-base  transition-colors ${metodoPagamento === 'cartao' ? (isDark ? 'text-white font-semibold' : 'text-black font-semibold') : 'text-gray-500 font-medium '}`}
                                >
                                    Cartão
                                </button>
                                <button
                                    ref={pixRef}
                                    onClick={() => setMetodoPagamento('pix')}
                                    className={`pb-3 text-base transition-colors ${metodoPagamento === 'pix' ? (isDark ? 'text-white font-semibold' : 'text-black font-semibold') : 'text-gray-500 font-medium  '}`}
                                >
                                    Pix
                                </button>
                                <div
                                    ref={underlineRef}
                                    className="absolute bottom-0 h-[2px] bg-blue-500 transition-all duration-300"
                                />
                            </div>
                        </div>

                        {metodoPagamento === 'cartao' && (
                            <div className={`${isDark ? 'bg-[#2C323B]' : 'bg-gray-200'} p-4 rounded-md space-y-4`}>
                                {cartoes.map((cartao: any) => (
                                    <div
                                        key={cartao.id}
                                        className={`flex items-center justify-between ${isDark ? 'bg-[#39424E]' : 'bg-white'} shadow-xl rounded-md p-3 w-full text-left transition border 
                                        ${selecionado === cartao.id ? 'border-yellow-400' : 'border-transparent'}`}
                                    >
                                        <button
                                            onClick={() => selecionarCartao(cartao.id)}
                                            className="flex items-center gap-4 w-full text-left"
                                        >
                                            <div className="w-10 h-6 bg-purple-600 rounded-sm" />
                                            <div>
                                                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-black'}`}>{cartao.nomeTitular}</p>
                                                <p className="text-gray-400 text-xs">•••• {cartao.numero.slice(-4)} - {cartao.validade}</p>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => removerCartao(cartao.id)}
                                            className="ml-4 text-red-400 hover:text-red-600"
                                        >
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>
                                ))}

                                <button
                                    onClick={() => setMostrarFormulario(true)}
                                    className={`flex items-center gap-4 transition ${isDark ? 'text-indigo-300 hover:text-indigo-400' : 'text-gray-700 hover:text-black'}`}
                                >
                                    <div className="w-12 h-8 rounded-md flex items-center justify-center">
                                        <FiPlus size={20} />
                                    </div>
                                    <span className="text-sm font-medium">Adicionar Um Novo Cartão</span>
                                </button>

                                {mostrarFormulario && (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault()

                                            const cartao = { nomeTitular, numero, validade, cvv }

                                            if (!validarCartaoCompleto(cartao)) {
                                                alert('Por favor, preencha todos os campos corretamente do cartão.')
                                                return
                                            }

                                            adicionarCartao(cartao)
                                            setMostrarFormulario(false)
                                            setNomeTitular('')
                                            setNumero('')
                                            setValidade('')
                                            setCvv('')
                                        }}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
                                    >
                                        <input
                                            className={`${isDark ? 'bg-[#1C2127] text-white' : 'bg-white text-black'} py-2 px-5 shadow-md rounded-xl`}
                                            placeholder="Número do Cartão"
                                            value={numero}
                                            onChange={(e) => setNumero(formatarNumeroCartao(e.target.value).slice(0, 19))}
                                        />
                                        <input
                                            className={`${isDark ? 'bg-[#1C2127] text-white' : 'bg-white text-black'} py-2 px-5 shadow-md rounded-xl`}
                                            placeholder="Nome do Titular"
                                            value={nomeTitular}
                                            onChange={(e) => setNomeTitular(e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, ''))}
                                        />
                                        <input
                                            className={`${isDark ? 'bg-[#1C2127] text-white' : 'bg-white text-black'} py-2 px-5 shadow-md rounded-xl`}
                                            placeholder="Validade (MM/AA)"
                                            value={validade}
                                            onChange={(e) => setValidade(formatarValidade(e.target.value))}
                                        />
                                        <input
                                            className={`${isDark ? 'bg-[#1C2127] text-white' : 'bg-white text-black'} py-2 px-5 shadow-md rounded-xl`}
                                            placeholder="CVV"
                                            value={cvv}
                                            onChange={(e) => setCvv(formatarCVV(e.target.value))}
                                        />
                                        <div className="col-span-1 md:col-span-2 flex mt-8 justify-end gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setMostrarFormulario(false)}
                                                className="px-6 py-2 rounded-xl font-semibold bg-[#BEBEBE] text-black cursor-pointer hover:bg-gray-400 transition"
                                            >
                                                Voltar
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-6 py-2 rounded-xl font-semibold bg-[#FFD06C] text-black cursor-pointer hover:bg-yellow-300 transition"
                                            >
                                                Adicionar Cartão
                                            </button>
                                        </div>
                                    </form>
                                )}

                            </div>
                        )}
                        {metodoPagamento === 'pix' && (
                            <div className={`${isDark ? 'bg-[#2C323B]' : 'bg-gray-200'}  p-4 rounded-md space-y-4 cursor-not-allowed opacity-60`}>
                                <div className={`${isDark ? 'bg-[#39424E]' : 'bg-white'} flex items-center gap-4 p-3 rounded-md w-full text-left shadow-xl`}>
                                    <div className="w-10 h-10 flex items-center justify-center bg-green-600 rounded-full">
                                        <PiQrCodeBold size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-black'}`}>Pagamento via Pix</p>
                                        <p className="text-gray-400 text-xs">Essa opção estará disponível em breve</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CompraSection>
                    <CompraSection number={3} title="Endereço de Entrega">

                        <div className={`${isDark ? 'bg-[#2C323B]' : 'bg-gray-200'} p-4 rounded-md space-y-4 `}>
                            {enderecos.map((endereco: any) => (
                                <div
                                    key={endereco.id}
                                    className={`flex items-center justify-between ${isDark ? 'bg-[#39424E]' : 'bg-white'} shadow-xl rounded-md p-3 w-full text-left transition border
                                    ${selecionadoEndereco === endereco.id ? 'border-yellow-400' : 'border-transparent'}`}
                                >
                                    <div className="flex flex-col cursor-pointer" onClick={() => selecionarEndereco(endereco.id)}>
                                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-black'}`}>
                                            {endereco.rua}, {endereco.numero} - {endereco.bairro}
                                        </p>
                                        <p className="text-gray-400 text-xs">{endereco.cidade} - {endereco.cep}</p>
                                    </div>
                                    <button
                                        onClick={() => removerEndereco(endereco.id)}
                                        className="ml-4 text-red-400 hover:text-red-600"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                </div>
                            ))}

                            <button
                                onClick={() => setMostrarFormularioEndereco(true)}
                                className={`flex items-center gap-4 transition ${isDark ? 'text-indigo-300 hover:text-indigo-400' : 'text-gray-700 hover:text-black'}`}
                            >
                                <div className="w-12 h-8 rounded-md flex items-center justify-center">
                                    <FiPlus size={20} />
                                </div>
                                <span className="text-sm font-medium">Adicionar Um Novo Endereço</span>
                            </button>

                            {mostrarFormularioEndereco && (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();

                                        const isValido = validarEnderecoCompleto(novoEndereco);

                                        if (!isValido) {
                                            const novosErros = obterCamposComErro(novoEndereco);
                                            alert('Preencha todos os campos obrigatórios corretamente.');
                                            return;
                                        }

                                        adicionarEndereco(novoEndereco);
                                        setNovoEndereco({ cep: '', cidade: '', rua: '', numero: '', bairro: '', complemento: '', estado: '' });
                                        setMostrarFormularioEndereco(false);
                                    }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
                                >
                                    {['cep', 'cidade', 'rua', 'numero', 'bairro', 'complemento', 'estado'].map((field) => (
                                        <input
                                            key={field}
                                            name={field}
                                            value={novoEndereco[field as keyof typeof novoEndereco]}
                                            onChange={handleChangeEndereco}
                                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                            className={`py-2 px-4 rounded-md shadow w-full transition
            ${isDark ? 'bg-[#1C2127] text-white' : 'bg-white text-black'}
        `}
                                        />
                                    ))}
                                    <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMostrarFormularioEndereco(false)
                                                setErrosEndereco({})
                                            }}
                                            className="px-6 py-2 rounded-xl bg-gray-400 text-black font-semibold hover:bg-gray-500 transition"
                                        >
                                            Voltar
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 rounded-xl font-semibold bg-[#FFD06C] text-black cursor-pointer hover:bg-yellow-300 transition"
                                        >
                                            Usar Esse Endereço
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </CompraSection>
                </div>

                <aside className={`w-full md:w-1/3 ${isDark ? 'bg-[#48505C]' : 'bg-white'} p-4 rounded-xl shadow h-fit sticky top-42`}>
                    <h2 className="font-semibold text-lg mb-4">Itens Selecionados</h2>
                    <div className="space-y-2 text-sm">
                        {produtosSelecionados.map((item: any) => (
                            <div key={item.id} className="flex justify-between">
                                <span>{item.name}</span>
                                <span>R$ {(item.discountedPrice * item.quantidade).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <hr className="my-4 border-gray-600" />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>R$ {totalSelecionado.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={confirmarPedido}
                        className="w-full mt-6 py-2 rounded-md bg-[#FFD06C] cursor-pointer text-black font-semibold hover:bg-yellow-200 transition-colors"
                    >
                        Confirmar Pedido
                    </button>
                </aside>

                <ModalRemoverProduto
                    open={modalAberto}
                    onCancel={() => {
                        setModalAberto(false)
                        setProdutoParaRemover(null)
                    }}
                    onConfirm={() => {
                        if (produtoParaRemover) {
                            diminuirQuantidade(produtoParaRemover)
                        }
                        setModalAberto(false)
                        setProdutoParaRemover(null)
                    }}
                />
            </main>
        </ProtectedRoute>
    )
}
