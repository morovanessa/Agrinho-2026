// Variáveis do Estado do Jogo
let acaoSelecionada = 'lavoura'; // Pode ser 'lavoura' ou 'reflorestar'
let totalArvoresPlantadas = 0;

// Mensagens educativas dinâmicas
const dicasReflorestamento = [
    "Você plantou uma muda nativa! Isso traz polinizadores como abelhas de volta para a sua lavoura.",
    "Área protegida com sucesso! Matas ciliares evitam que a água dos rios seque na época de estiagem.",
    "Excelente escolha! O reflorestamento melhora o microclima local e protege o solo contra erosões.",
    "Florestas plantadas absorvem gás carbônico e podem gerar receita extra via créditos de carbono!"
];

const dicasLavoura = [
    "Lavoura estabelecida! Produzir alimentos gera renda e impulsiona o desenvolvimento econômico regional.",
    "Cultivo plantado. Lembre-se de rotacionar as culturas futuramente para não esgotar o solo.",
    "A produção agrícola está forte! Mas cuidado para não deixar a fazenda sem áreas de preservação verde."
];

// Seleção de elementos do DOM
const btnLavoura = document.getElementById('btn-lavoura');
const btnReflorestar = document.getElementById('btn-reflorestar');
const lotes = document.querySelectorAll('.lote');

const valProducao = document.getElementById('val-producao');
const valReflorestamento = document.getElementById('val-reflorestamento');
const valEquilibrio = document.getElementById('val-equilibrio');
const cardEquilibrio = document.getElementById('card-equilibrio');

const totalArvoresTexto = document.getElementById('total-arvores');
const popUpEducativo = document.getElementById('pop-up-educativo');
const textoAlerta = document.getElementById('texto-alerta');

// --- CONTROLE DE SELEÇÃO DE AÇÕES ---
btnLavoura.addEventListener('click', () => {
    acaoSelecionada = 'lavoura';
    btnLavoura.classList.add('active');
    btnReflorestar.classList.remove('active');
});

btnReflorestar.addEventListener('click', () => {
    acaoSelecionada = 'reflorestar';
    btnReflorestar.classList.add('active');
    btnLavoura.classList.remove('active');
});

// --- CLIQUE NOS LOTES DA FAZENDA ---
lotes.forEach(lote => {
    lote.addEventListener('click', () => {
        if (acaoSelecionada === 'lavoura') {
            // Aplica estado de Lavoura
            lote.className = 'lote lavoura';
            exibirDica(dicasLavoura);
        } else if (acaoSelecionada === 'reflorestar') {
            // Se o lote ainda não era floresta, soma ao contador real de árvores plantadas
            if (!lote.classList.contains('floresta')) {
                totalArvoresPlantadas++;
                totalArvoresTexto.innerText = totalArvoresPlantadas;
            }
            // Aplica estado de Floresta
            lote.className = 'lote floresta';
            exibirDica(dicasReflorestamento);
        }
        
        // Recalcula o placar a cada alteração no terreno
        atualizarDashboard();
    });
});

// --- ATUALIZAÇÃO DO PLACAR E CÁLCULO DE EQUILÍBRIO ---
function atualizarDashboard() {
    const totalLotes = lotes.length; // 16 lotes
    const qtdLavoura = document.querySelectorAll('.lavoura').length;
    const qtdFloresta = document.querySelectorAll('.floresta').length;

    // Converte os blocos em porcentagem (Ex: 4 blocos de 16 = 25%)
    const pctProducao = Math.round((qtdLavoura / totalLotes) * 100);
    const pctFloresta = Math.round((qtdFloresta / totalLotes) * 100);

    valProducao.innerText = pctProducao;
    valReflorestamento.innerText = pctFloresta;

    // LÓGICA DE EQUILÍBRIO (O pulo do gato do Agrinho)
    // O cenário perfeito definido pelo Código Florestal e Agro Sustentável 
    // é dividir a terra de forma equilibrada (Ex: 50% Lavoura e 50% Floresta).
    
    let notaEquilibrio = 0;

    if (qtdLavoura === 0 && qtdFloresta === 0) {
        notaEquilibrio = 0; // Terra totalmente abandonada/degradada
    } else {
        // Fórmula matemática que pune extremos (100% de um e 0% de outro) 
        // e premia o balanço exato das proporções
        const diferenca = Math.abs(pctProducao - pctFloresta);
        const usoTotal = pctProducao + pctFloresta; // Quanto da terra útil já foi ocupado

        // A nota máxima inicial depende de ocupar toda a fazenda de forma produtiva/sustentável
        notaEquilibrio = usoTotal - diferenca; 
        
        if (notaEquilibrio < 0) notaEquilibrio = 0;
    }

    valEquilibrio.innerText = notaEquilibrio;

    // Muda a cor do Card de Equilíbrio baseado na nota do Jogador
    if (notaEquilibrio >= 80) {
        cardEquilibrio.style.backgroundColor = '#d4edda'; // Verde - Sustentável
        cardEquilibrio.style.borderBottomColor = '#27ae60';
    } else if (notaEquilibrio >= 40) {
        cardEquilibrio.style.backgroundColor = '#fff3cd'; // Amarelo - Alerta
        cardEquilibrio.style.borderBottomColor = '#ffc107';
    } else {
        cardEquilibrio.style.backgroundColor = '#f8d7da'; // Vermelho - Crítico
        cardEquilibrio.style.borderBottomColor = '#dc3545';
    }
}

// --- FUNÇÃO AUXILIAR PARA POPUPS EDUCATIVOS ---
function exibirDica(listaDeDicas) {
    // Escolhe uma frase aleatória da lista correspondente
    const fraseAleatoria = listaDeDicas[Math.floor(Math.random() * listaDeDicas.length)];
    
    textoAlerta.innerText = fraseAleatoria;
    popUpEducativo.classList.remove('hidden');
}