
const clientes = [
    { cpf: "111.222.333-44", senha: "123", nome: "Dennis Lopes", saldo: 5000 },
    { cpf: "222.333.444-55", senha: "123", nome: "Nicolas Silva", saldo: 1500 },
    { cpf: "333.444.555-66", senha: "123", nome: "Ana Maria", saldo: 3000 },
    { cpf: "444.555.666-77", senha: "123", nome: "Bruno Costa", saldo: 500 },
    { cpf: "555.666.777-88", senha: "123", nome: "Carla Souza", saldo: 10000 }
];

let usuarioLogado = null;


const secaoLogin = document.querySelector('#login-section');
const secaoCadastro = document.querySelector('#cadastro-section');
const secaoSucesso = document.querySelector('#sucesso-section');
const secaoPainel = document.querySelector('#painel-section');

const campoSaldo = document.querySelector('#saldo-valor');
const boasVindas = document.querySelector('#boas-vindas');
const loginErro = document.querySelector('#login-erro');

const formCadastro = document.querySelector('#form-cadastro');
const cadastroErro = document.querySelector('#cadastro-erro');
const btnCadastrar = document.querySelector('#btn-cadastrar');


document.querySelector('#link-ir-cadastro').addEventListener('click', (e) => {
    e.preventDefault();
    secaoLogin.style.display = 'none';
    secaoCadastro.style.display = 'block';
});

document.querySelector('#link-voltar-login').addEventListener('click', (e) => {
    e.preventDefault();
    secaoCadastro.style.display = 'none';
    secaoLogin.style.display = 'block';
});

function salvarCookie(nome, valor, dias) {
    const d = new Date();
    d.setTime(d.getTime() + (dias * 24 * 60 * 60 * 1000));
    document.cookie = nome + "=" + encodeURIComponent(valor) + ";expires=" + d.toUTCString() + ";path=/";
}

function lerCookie(nome) {
    const nameEQ = nome + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length));
    }
    return null;
}

function apagarCookie(nome) {
    document.cookie = nome + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}


document.querySelector('#btn-login').addEventListener('click', () => {
    const cpfDigitado = document.querySelector('#input-cpf').value.trim();
    const senhaDigitada = document.querySelector('#input-senha').value.trim();

    const clienteEncontrado = clientes.find(c => c.cpf === cpfDigitado && c.senha === senhaDigitada);

    if (clienteEncontrado) {
        usuarioLogado = clienteEncontrado;
        loginErro.style.display = 'none';

 
        const primeiroNome = clienteEncontrado.nome.split(' ')[0];
        const agora = new Date().toLocaleString('pt-BR');

        salvarCookie('senac_cpf', clienteEncontrado.cpf, 30);
        salvarCookie('senac_nome', primeiroNome, 30);
        salvarCookie('senac_ultimo_acesso', agora, 30);

        secaoLogin.style.display = 'none';
        secaoPainel.style.display = 'block';

        campoSaldo.textContent = `R$ ${usuarioLogado.saldo.toFixed(2)}`;
        boasVindas.textContent = `Olá, ${usuarioLogado.nome}`;
    } else {
        loginErro.style.display = 'block';
    }
});


function verificarReconhecimento() {
    const cpfSalvo = lerCookie('senac_cpf');
    const nomeSalvo = lerCookie('senac_nome');
    const ultimoAcesso = lerCookie('senac_ultimo_acesso');
    const subtitulo = document.querySelector('#login-section .subtitle');

    if (!cpfSalvo || !nomeSalvo) return;

    document.querySelector('#input-cpf').value = cpfSalvo;


    subtitulo.textContent = '';
    subtitulo.append('Que bom ter você de volta, ');

    const strong = document.createElement('strong');
    strong.textContent = nomeSalvo;
    subtitulo.append(strong, '!', document.createElement('br'));

    const small = document.createElement('small');
    small.style.color = '#6c757d';
    small.textContent = `Último acesso: ${ultimoAcesso || '-'}`;
    subtitulo.append(small, document.createElement('br'));

    const linkTrocar = document.createElement('a');
    linkTrocar.href = '#';
    linkTrocar.id = 'link-trocar-usuario';
    linkTrocar.textContent = 'Não é você? Trocar de conta';
    linkTrocar.style.cssText = 'font-size: 0.75rem; color: #0056b3; font-weight: bold;';
    subtitulo.append(linkTrocar);

    document.querySelector('#input-senha').focus();

    linkTrocar.addEventListener('click', (e) => {
        e.preventDefault();
        apagarCookie('senac_cpf');
        apagarCookie('senac_nome');
        apagarCookie('senac_ultimo_acesso');

        document.querySelector('#input-cpf').value = '';
        document.querySelector('#input-senha').value = '';
        subtitulo.textContent = 'Portal do Cliente';
        document.querySelector('#input-cpf').focus();
    });
}

const CHAVE_RASCUNHO = 'senac_rascunho_cadastro';

const camposRascunho = {
    nome: '#cad-nome',
    cpf: '#cad-cpf',
    email: '#cad-email',
    celular: '#cad-celular',
    cep: '#cad-cep',
    endereco: '#cad-endereco',
    cidade: '#cad-cidade',
    estado: '#cad-estado'
};


formCadastro.addEventListener('input', () => {
    const dados = {};
    for (const chave in camposRascunho) {
        dados[chave] = document.querySelector(camposRascunho[chave]).value;
    }
    localStorage.setItem(CHAVE_RASCUNHO, JSON.stringify({ dados, timestamp: Date.now() }));
});


function recuperarRascunho() {
    const salvo = localStorage.getItem(CHAVE_RASCUNHO);
    if (!salvo) return;

    try {
        const { dados } = JSON.parse(salvo);
        for (const chave in camposRascunho) {
            document.querySelector(camposRascunho[chave]).value = dados[chave] || '';
        }
        console.log('Rascunho de cadastro recuperado com sucesso!');
    } catch (erro) {
        console.error('Rascunho inválido, descartando:', erro);
        localStorage.removeItem(CHAVE_RASCUNHO);
    }
}


const btnLimparRascunho = document.querySelector('#link-limpar-rascunho');
if (btnLimparRascunho) {
    btnLimparRascunho.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Deseja realmente descartar o rascunho do cadastro?')) {
            localStorage.removeItem(CHAVE_RASCUNHO);
            formCadastro.reset();
        }
    });
}

const API_URL = 'https://senac-bank-api.dennislopes.com.br/api/clientes';

const regex = {
    nome: /^[A-Za-zÀ-ÖØ-öø-ÿ]+(\s+[A-Za-zÀ-ÖØ-öø-ÿ]+)+$/,   // nome + sobrenome, letras e espaços
    cpf: /^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/,               // 000.000.000-00 ou 00000000000
    email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,                    // formato básico de e-mail
    celular: /^\(?\d{2}\)?\s?\d{5}\s?-?\s?\d{4}$/,             // 11 dígitos; (), espaço e - opcionais
    cep: /^\d{5}-?\d{3}$/,                                     // 00000-000 ou 00000000
    senha: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/             // 8+ caracteres, minúscula, maiúscula e número
};

function mostrarErro(mensagem, campo) {
    cadastroErro.textContent = mensagem;
    cadastroErro.style.display = 'block';
    campo.focus();
}

function limparErro() {
    cadastroErro.textContent = '';
    cadastroErro.style.display = 'none';
}

formCadastro.addEventListener('submit', async (e) => {
    e.preventDefault();
    limparErro();

    const campoNome = document.querySelector('#cad-nome');
    const campoCpf = document.querySelector('#cad-cpf');
    const campoEmail = document.querySelector('#cad-email');
    const campoCelular = document.querySelector('#cad-celular');
    const campoCep = document.querySelector('#cad-cep');
    const campoEndereco = document.querySelector('#cad-endereco');
    const campoCidade = document.querySelector('#cad-cidade');
    const campoEstado = document.querySelector('#cad-estado');
    const campoSenha = document.querySelector('#cad-senha');
    const campoConfirma = document.querySelector('#cad-confirma-senha');

    const nome = campoNome.value.trim();
    const cpf = campoCpf.value.trim();
    const email = campoEmail.value.trim();
    const celular = campoCelular.value.trim();
    const cep = campoCep.value.trim();
    const senha = campoSenha.value;
    const confirma = campoConfirma.value;


    if (!regex.nome.test(nome)) {
        return mostrarErro('Informe nome e sobrenome (apenas letras e espaços).', campoNome);
    }
    if (!regex.cpf.test(cpf)) {
        return mostrarErro('CPF inválido. Use 000.000.000-00 ou 11 dígitos.', campoCpf);
    }
    if (!regex.email.test(email)) {
        return mostrarErro('Informe um e-mail válido (ex: exemplo@email.com).', campoEmail);
    }
    if (!regex.celular.test(celular)) {
        return mostrarErro('Celular inválido. Informe DDD + 9 dígitos (11 dígitos no total).', campoCelular);
    }
    if (!regex.cep.test(cep)) {
        return mostrarErro('CEP inválido. Use 00000-000 ou 8 dígitos.', campoCep);
    }
    if (!regex.senha.test(senha)) {
        return mostrarErro('A senha deve ter no mínimo 8 caracteres, com letra minúscula, maiúscula e número.', campoSenha);
    }
    if (senha !== confirma) {
        return mostrarErro('As senhas não coincidem.', campoConfirma);
    }

    const dados = {
        nome,
        cpf: cpf.replace(/\D/g, ''),
        email,
        celular: celular.replace(/\D/g, ''),
        cep: cep.replace(/\D/g, ''),
        endereco: campoEndereco.value.trim(),
        cidade: campoCidade.value.trim(),
        estado: campoEstado.value.trim().toUpperCase(),
        senha
    };

    btnCadastrar.disabled = true;
    btnCadastrar.textContent = 'Enviando...';

    try {
        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (!resposta.ok) {
            throw new Error(`Erro ${resposta.status}`);
        }

    
        localStorage.removeItem(CHAVE_RASCUNHO);
        formCadastro.reset();

        secaoCadastro.style.display = 'none';
        secaoSucesso.style.display = 'block';
    } catch (erro) {
        console.error('Falha ao cadastrar:', erro);
        mostrarErro('Não foi possível concluir o cadastro. Tente novamente em instantes.', campoNome);
    } finally {
        btnCadastrar.disabled = false;
        btnCadastrar.textContent = 'Concluir Registo';
    }
});


document.querySelector('#btn-voltar-inicio').addEventListener('click', () => {
    location.reload();
});

document.querySelector('#btn-sair').addEventListener('click', () => {
    location.reload();
});


document.querySelector('#btn-depositar').addEventListener('click', () => { });
document.querySelector('#btn-sacar').addEventListener('click', () => { });
document.querySelector('#btn-transferir').addEventListener('click', () => { });

window.addEventListener('DOMContentLoaded', () => {
    verificarReconhecimento();
    recuperarRascunho();
});