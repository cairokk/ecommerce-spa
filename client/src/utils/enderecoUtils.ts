export function validarEnderecoCompleto(endereco: Record<string, string>) {
    const camposObrigatorios = ['cep', 'cidade', 'rua', 'numero', 'bairro', 'estado'];

    for (const campo of camposObrigatorios) {
        if (!endereco[campo] || endereco[campo].trim().length === 0) {
            return false;
        }
    }

    const cepValido = /^\d{5}-?\d{3}$/.test(endereco.cep);
    return cepValido;
}

export function obterCamposComErro(endereco: Record<string, string>) {
    const camposObrigatorios = ['cep', 'cidade', 'rua', 'numero', 'bairro', 'estado'];
    const erros: Record<string, boolean> = {};

    for (const campo of camposObrigatorios) {
        if (!endereco[campo] || endereco[campo].trim().length === 0) {
            erros[campo] = true;
        }
    }

    if (!/^\d{5}-?\d{3}$/.test(endereco.cep)) {
        erros['cep'] = true;
    }

    return erros;
}

export function formatarCEP(cep: string) {
    const somenteNumeros = cep.replace(/\D/g, '').slice(0, 8);
    if (somenteNumeros.length === 8) {
        return somenteNumeros.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    return somenteNumeros;
}
