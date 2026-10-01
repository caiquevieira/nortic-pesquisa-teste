/**
 * Pesquisa de Satisfação + Roleta da Sorte — Underline
 * Configuração compartilhada — carregada por index.html, caixa.html, admin.html e fidelidade.html
 * (<script src="config.js">, antes do <script> de cada página). Todo dado específico de
 * cliente (nome do restaurante, logo, webhook, prêmios, coordenadas...) vive só aqui, para
 * as páginas nunca ficarem dessincronizadas ao reaplicar o template em outro cliente.
 *
 * Não é um build step: é um segundo arquivo estático, sem bundler, sem transpilação.
 *
 * A senha do caixa e a senha do admin NÃO ficam aqui: são validadas no Code.gs
 * (constantes CASHIER_PASSWORD e ADMIN_PASSWORD).
 */
const CONFIG = {
  RESTAURANT_NAME: 'Nortic Gelato & Café',
  LOGO_DATA_URI: '',                    // data:image/...;base64,... (preferencial)
  LOGO_URL: 'Assets/nortic-logo.png',   // recortado e sem fundo branco; se ambos vazios, mostra um placeholder "Seu logo aqui"
  WEBHOOK_URL: 'https://script.google.com/macros/s/AKfycbyIAAEirtDqZNlXj1l_MQBVrFzd7qK-WpoKiipm5VXhiHXGFb6pMQRCZ83KivYrpKCo/exec',

  // Tema visual deste cliente — aplicado por theme.js em variáveis CSS :root (ver
  // "Identidade visual" no CLAUDE.md). Campo ausente/vazio aqui = mantém o padrão da
  // Underline já declarado no <style> de cada página. Extraído do site de referência do
  // cliente (https://caiquevieira.github.io/nortic-gelato-e-cafe-demo/), tokens Tailwind reais
  // em assets/css/styles.css — não estimado a olho.
  THEME: {
    fundo: '#FBF6EC',
    texto: '#2A1810',
    textoSecundario: '#5E4A40',
    card: '#F1E6D3',
    borda: 'rgba(42,24,16,.12)',
    primaria: '#BC243D',
    textoSobrePrimaria: '#FBF6EC',
    acento: '#1F6F78',
    // Fraunces/Figtree (da demo) são fontes web self-hosted — mantemos zero dependência
    // externa aproximando com stacks de sistema (sem baixar/embutir fonte nenhuma).
    fonteTitulo: 'Georgia, "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, serif',
    fonteCorpo: '-apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    raioCard: '1.5rem',
    raioBotao: '1rem',
    sombraCard: '0 2px 8px rgba(42,24,16,.08)'
  },

  // Mecanismo de prêmio da PESQUISA (index.html/admin.html), só isso: 'ROLETA' (sorteio +
  // cupom) ou 'NENHUM' (agradecimento simples, sem prêmio — a resposta é gravada do mesmo
  // jeito, via "register", só que com Premio Roleta e Status Uso = '-'). Troca o destino final
  // de index.html, o modo de caixa.html (parte do cupom) e os painéis de prêmio/status do
  // admin.html. Independente de LOYALTY_ENABLED abaixo — são dois produtos (ver CLAUDE.md).
  REWARD_MODE: 'NENHUM',

  // Liga o módulo de cartão fidelidade (fidelidade.html + caixa.html, parte de selos +
  // admin-fidelidade.html), independente do que REWARD_MODE faz na pesquisa.
  LOYALTY_ENABLED: true,

  // Geolocalização (só index.html) — SUBSTITUIR pelas coordenadas do restaurante.
  RESTAURANT_LAT: -23.5505,
  RESTAURANT_LNG: -46.6333,
  MAX_DISTANCE_METERS: 2000000000, // TEMPORÁRIO (testes): voltar para 150

  COUPON_PREFIX: 'UND',
  STORAGE_KEY: 'underline-pesquisa',
  API_RETRY_DELAY_MS: 1000,   // espera antes da 2ª tentativa quando a resposta do webhook vem inválida

  // Limite de 1 participação por aparelho por dia (data local do aparelho, via localStorage).
  // false: desliga o bloqueio (útil em testes).
  DAILY_LIMIT_ENABLED: false, // TEMPORÁRIO (testes): voltar para true
  DAILY_LIMIT_MESSAGE: 'Você já participou hoje. Volte amanhã!',

  // Validade do cupom. Manter igual à constante COUPON_VALIDITY_DAYS do Code.gs
  // (a regra que vale é a do backend). Placeholders: {dias} e {data} (dd/mm/aaaa).
  COUPON_VALIDITY_DAYS: 30,
  // Aviso em destaque logo abaixo do cupom (vazio = não mostra).
  COUPON_SAVE_TEXT: 'Tire um print desta tela e guarde o seu cupom para usar na próxima visita.',
  COUPON_POLICY_TEXT: 'Válido para sua próxima visita. Não cumulativo com outras promoções ou descontos. Válido por {dias} dias a partir da data de emissão.',

  CONSENT_TEXT: 'Ao continuar, você concorda com o uso do seu nome e WhatsApp pelo estabelecimento para fins desta pesquisa e do resgate do prêmio.',

  // Etapa opcional de avaliação no Google (só index.html) — só aparece quando as 3 notas do
  // CSAT são 5. Trocar pelo link de avaliação do Place ID de cada cliente.
  GOOGLE_REVIEW_URL: 'https://search.google.com/local/writereview?placeid=ChIJ8c9z_0j_zpQR2PkScmZf2KI',
  REVIEW_TITLE: 'Ficamos felizes que você gostou!',
  REVIEW_TEXT: 'Sua avaliação no Google ajuda outras pessoas a conhecerem o nosso trabalho.',
  REVIEW_BTN_RATE: 'Avaliar no Google',
  REVIEW_BTN_SKIP: 'Pular',
  // 2ª tela: aparece assim que o cliente clica em "Avaliar no Google" (a aba nova abre e,
  // ao mesmo tempo, a tela avança sozinha para esta — sem precisar de mais nenhuma ação).
  REVIEW_THANKS_TITLE: 'Obrigado por avaliar!',
  REVIEW_THANKS_TEXT: 'Quando terminar de escrever sua avaliação, toque no botão abaixo para continuar.',
  REVIEW_BTN_DONE: 'Já avaliei',

  // Tela final da pesquisa quando REWARD_MODE é 'NENHUM' (sem roleta/cupom) — só agradecimento,
  // depois do CSAT + feedback (e do convite ao Google, se as 3 notas foram 5).
  SURVEY_DONE_TITLE: 'Obrigado pela sua avaliação!',
  SURVEY_DONE_TEXT: 'Sua opinião foi registrada. Volte sempre!',

  QUESTIONS: [
    'Como foi a qualidade da comida e o sabor?',
    'Como foi a velocidade e a qualidade do atendimento?',
    'Como foi o ambiente, o conforto e a limpeza?'
  ],

  // Cada item é uma fatia da roleta (só index.html). peso: chance relativa da fatia (não
  // precisa somar 100); prêmios repetidos somam os pesos. rotulo: texto curto na fatia.
  // Se estes prêmios mudarem, atualizar também DEMO_PRIZES em gerarDadosDemo() no Code.gs
  // (os pesos agregados não são lidos de um lugar só).
  PRIZES: [
    { nome: 'Refrigerante lata', rotulo: 'Refrigerante', peso: 30 },
    { nome: '5% de desconto',    rotulo: '5% OFF',       peso: 5 },
    { nome: 'Drink do dia',      rotulo: 'Drink do dia', peso: 10 },
    { nome: '10% de desconto',   rotulo: '10% OFF',      peso: 5 },
    { nome: 'Refrigerante lata', rotulo: 'Refrigerante', peso: 30 },
    { nome: '5% de desconto',    rotulo: '5% OFF',       peso: 5 },
    { nome: 'Drink do dia',      rotulo: 'Drink do dia', peso: 10 },
    { nome: '10% de desconto',   rotulo: '10% OFF',      peso: 5 }
  ],

  // Admin (só admin.html)
  ADMIN_TITLE: 'Painel administrativo',

  // ---- Cartão fidelidade (só quando LOYALTY_ENABLED) ----------
  // Selos necessários pra liberar o prêmio. Manter igual à constante LOYALTY_GOAL do Code.gs
  // (a regra que vale é a do backend — mesmo motivo do COUPON_VALIDITY_DAYS acima).
  LOYALTY_GOAL: 10,
  LOYALTY_PRIZE_LABEL: 'Sobremesa da casa grátis',
  // Prefixo do código de resgate (gerado ao tocar em "Retirar prêmio"). Manter igual a
  // LOYALTY_CODE_PREFIX no Code.gs.
  LOYALTY_CODE_PREFIX: 'FID',
  LOYALTY_CARD_TITLE: 'Seu cartão fidelidade',
  // Placeholder {faltam}.
  LOYALTY_PROGRESS_TEXT: 'Faltam {faltam} selos para o seu prêmio.',
  LOYALTY_COMPLETE_TEXT: 'Prêmio disponível! Toque em "Retirar prêmio".',
  LOYALTY_REDEEM_BUTTON_TEXT: 'Retirar prêmio',
  LOYALTY_REDEEM_INSTRUCTION: 'Mostre este código ao garçom para retirar o seu prêmio.',
  LOYALTY_REDEEM_POLICY_TEXT: 'Válido para retirada nesta visita, mediante confirmação do estabelecimento.',
  LOYALTY_NOT_FOUND_MESSAGE: 'Não encontramos um cartão fidelidade com esse telefone. Peça ao garçom para vincular seu telefone na próxima compra.'
};
