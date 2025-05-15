'use client'
import Header from '@/components/Header';
import { formatarCPF, validarCPF } from '@/utils/cpdUtils';
import { formatarTelefone, validarTelefone } from '@/utils/telefoneUtils';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import usePerfilStore from '../stores/PerfilStore.js';



export default function Register() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const mode = searchParams.get('mode');
    const [mensagem, setMensagem] = useState<String | undefined>();

    const [cpf, setCpf] = useState('');
    const [cpfError, setCpfError] = useState('');

    const [telefone, setTelefone] = useState('');
    const [telefoneError, setTelefoneError] = useState('');

    const setPerfil = usePerfilStore((state) => state.setPerfil);

    const [isLogin, setIsLogin] = useState(true);

    const [formData, setFormData] = useState({
        nome: '',
        sobrenome: '',
        cpf: '',
        telefone: '',
        email: '',
        senha: '',
        confirmarSenha: '',
    });
    let submitted = false;

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let valor = e.target.value;
        valor = formatarCPF(valor);
        setCpf(valor);

        if (!validarCPF(valor.replace(/[^\d]+/g, ''))) {
            setCpfError('CPF inválido');
        } else {
            setCpfError('');
        }

        setFormData({ ...formData, cpf: valor });
    };

    const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let valor = e.target.value;
        valor = formatarTelefone(valor);
        setTelefone(valor);

        if (!validarTelefone(valor.replace(/[^\d]+/g, ''))) {
            setTelefoneError('Telefone inválido');
        } else {
            setTelefoneError('');
        }

        setFormData({ ...formData, telefone: valor });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: { [key: string]: string } = {};

        submitted = true;

        if (!isLogin) {
            if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
            if (!formData.sobrenome) newErrors.sobrenome = 'Sobrenome é obrigatório';
            if (!formData.cpf) newErrors.cpf = 'CPF é obrigatório';
            if (!formData.telefone) newErrors.telefone = 'Telefone é obrigatório';
            if (!formData.confirmarSenha) newErrors.confirmarSenha = 'Confirme sua senha';
            if (formData.senha !== formData.confirmarSenha)
                newErrors.confirmarSenha = 'As senhas não coincidem';
        }

        if (!formData.email) newErrors.email = 'Email é obrigatório';
        if (!formData.senha) newErrors.senha = 'Senha é obrigatória';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            // Aqui você poderia enviar os dados para seu backend

            isLogin ? login(formData) : registrar(formData);

            submitted = false;
        }
    };

    async function registrar(novoUserData: any) {

        try {
           await axios.post('http://localhost:8084/clientes/auth/registrar', formData, {
                headers: {}
            });
            setIsLogin(true);
            
        } catch (erro) {
            if (axios.isAxiosError(erro)) {
                setMensagem(erro.response?.data.error as string || 'Erro desconhecido');
              } else {
                setMensagem('Erro inesperado');
              }
        }

    }

    async function login(loginData: any) {  
        try {
            const resposta = await axios.post('http://localhost:8084/clientes/auth/login', {
                email: loginData.email,
                senha: loginData.senha
            }, {
                headers: {}
            });

            const token = resposta.data.token;
            const perfil = {token: token};
            setPerfil(perfil);
            //window.dispatchEvent(new Event('storageUpdated'));
            router.push('/loja')
        } catch (erro) {
            console.error('Erro ao enviar dados:', erro);
            if (axios.isAxiosError(erro)) {
                setMensagem(erro.response?.data as string || 'Erro desconhecido');
              } else {
                setMensagem('Erro inesperado');
              }
        }

    }

    useEffect(() => {
        if (mode === 'login') {
            setIsLogin(true);
        } else if (mode === 'register') {
            setIsLogin(false);
        }
    }, [mode])

    useEffect(() => {
       setMensagem(undefined);
        }, []);

    return (
        <div className="bg-black pt-20 pb-4 pl-4 pr-4">
            {mensagem &&
                <div className="p-4 mb-4  text-sm text-red-800 rounded-lg bg-red-50 dark:bg-white-800 dark:text-red-400" role="alert">
                    {mensagem}
                </div>
            }
            <div className="min-h-screen flex items-center justify-center px-4 py-8 pt-20">
                <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
                    <h2 className="text-2xl font-bold text-center mb-6">
                        {isLogin ? 'Entrar na conta' : 'Criar nova conta'}
                    </h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {!isLogin && (
                            <>
                                <div className="flex gap-2">
                                    <div className="flex flex-col w-1/2">
                                        <input
                                            name="nome"
                                            type="text"
                                            placeholder="Nome"
                                            value={formData.nome}
                                            onChange={handleChange}
                                            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                                        />
                                        {errors.nome && !submitted && <span className="text-red-500 text-xs">{errors.nome}</span>}
                                    </div>

                                    <div className="flex flex-col w-1/2">
                                        <input
                                            name="sobrenome"
                                            type="text"
                                            placeholder="Sobrenome"
                                            value={formData.sobrenome}
                                            onChange={handleChange}
                                            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                                        />
                                        {errors.sobrenome && <span className="text-red-500 text-xs">{errors.sobrenome}</span>}
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <input
                                        name="cpf"
                                        type="text"
                                        placeholder="CPF"
                                        maxLength={14}
                                        value={formData.cpf}
                                        onChange={handleCpfChange}
                                        className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                    {cpfError && <span className="text-red-500 text-xs">{cpfError}</span>}
                                    {errors.cpf && <span className="text-red-500 text-xs">{errors.cpf}</span>}
                                </div>

                                <div className="flex flex-col">
                                    <input
                                        name="telefone"
                                        type="text"
                                        placeholder="Telefone"
                                        value={formData.telefone}
                                        maxLength={15}
                                        onChange={handleTelefoneChange}
                                        className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                    {errors.telefone && <span className="text-red-500 text-xs">{errors.telefone}</span>}
                                </div>
                            </>
                        )}

                        <div className="flex flex-col">
                            <input
                                name="email"
                                type="email"
                                placeholder="E-mail"
                                value={formData.email}
                                onChange={handleChange}
                                className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                        </div>

                        <div className="flex flex-col">
                            <input
                                name="senha"
                                type="password"
                                placeholder="Senha"
                                value={formData.senha}
                                onChange={handleChange}
                                className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            {errors.senha && <span className="text-red-500 text-xs">{errors.senha}</span>}
                        </div>

                        {!isLogin && (
                            <div className="flex flex-col">
                                <input
                                    name="confirmarSenha"
                                    type="password"
                                    placeholder="Confirmar Senha"
                                    value={formData.confirmarSenha}
                                    onChange={handleChange}
                                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                                />
                                {errors.confirmarSenha && (
                                    <span className="text-red-500 text-xs">{errors.confirmarSenha}</span>
                                )}
                            </div>
                        )}

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
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-black underline cursor-pointer"
                        >
                            {isLogin ? 'Cadastre-se' : 'Entrar'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
