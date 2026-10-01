/**
 * Aplicador de tema — genérico, SEM dado de cliente nenhum (nome, cores, fontes do cliente
 * vivem só em CONFIG.THEME, dentro do config.js de cada cliente). Reaplicar o template em
 * outro cliente continua sendo só trocar config.js + a pasta Assets, sem tocar neste arquivo.
 *
 * Escreve as variáveis CSS em :root a partir de CONFIG.THEME. Um campo ausente/vazio em
 * CONFIG.THEME simplesmente não é escrito, e a variável correspondente mantém o valor padrão
 * já declarado no <style> de cada página (a identidade visual da Underline). Carregado no
 * <head>, logo depois de config.js e antes do <body>, para o tema já estar aplicado no
 * primeiro paint (sem flash das cores padrão).
 */
(function () {
  'use strict';

  // Nome do campo em CONFIG.THEME -> nome da variável CSS correspondente em cada página.
  var MAP = {
    fundo: '--tema-fundo',
    texto: '--tema-texto',
    textoSecundario: '--tema-texto-secundario',
    card: '--tema-card',
    borda: '--tema-borda',
    primaria: '--tema-primaria',
    textoSobrePrimaria: '--tema-texto-sobre-primaria',
    acento: '--tema-acento',
    fonteTitulo: '--tema-fonte-titulo',
    fonteCorpo: '--tema-fonte-corpo',
    raioCard: '--tema-raio-card',
    raioBotao: '--tema-raio-botao',
    sombraCard: '--tema-sombra-card'
  };

  function hexToRgb(hex) {
    var h = String(hex).replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function isHex(v) {
    return typeof v === 'string' && /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(v);
  }

  // Luminância relativa e contraste (WCAG) — usados só para decidir, sem precisar de escolha
  // manual por cliente, se o texto sobre o acento deve ser o "texto" ou o "card" do tema
  // (o acento não tem um par de texto próprio definido em CONFIG.THEME).
  function relLuminance(rgb) {
    function f(c) {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    }
    return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]);
  }

  function contrast(hex1, hex2) {
    var l1 = relLuminance(hexToRgb(hex1)), l2 = relLuminance(hexToRgb(hex2));
    var hi = Math.max(l1, l2), lo = Math.min(l1, l2);
    return (hi + 0.05) / (lo + 0.05);
  }

  function rgba(hex, alpha) {
    var rgb = hexToRgb(hex);
    return 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + alpha + ')';
  }

  window.applyTheme = function (theme) {
    if (!theme) return;
    var root = document.documentElement.style;

    for (var key in MAP) {
      if (theme[key]) root.setProperty(MAP[key], theme[key]);
    }

    // Texto sobre o acento: não é um campo de CONFIG.THEME — é calculado (maior contraste
    // entre "texto" e "card" contra o "acento"), pra nunca depender de escolha manual e nunca
    // repetir o caso de um acento escuro com texto escuro por cima (ilegível).
    if (isHex(theme.acento) && isHex(theme.texto) && isHex(theme.card)) {
      var cTexto = contrast(theme.texto, theme.acento);
      var cCard = contrast(theme.card, theme.acento);
      root.setProperty('--tema-texto-sobre-acento', cCard > cTexto ? theme.card : theme.texto);
    }

    // Paleta para séries de gráfico SEM significado semântico (ex.: prêmios/categorias no
    // admin.html) — 4 tons derivados de acento/primária por transparência. NUNCA usado para
    // as cores semânticas de NPS/status, que ficam fixas no próprio admin.html.
    if (isHex(theme.acento) && isHex(theme.primaria)) {
      root.setProperty('--tema-serie-1', rgba(theme.acento, .65));
      root.setProperty('--tema-serie-2', rgba(theme.primaria, .55));
      root.setProperty('--tema-serie-3', rgba(theme.acento, .35));
      root.setProperty('--tema-serie-4', rgba(theme.primaria, .3));
    }

    // Tom claro de destaque (admin.html, barra de filtros ativos) — tint bem suave do acento.
    if (isHex(theme.acento)) {
      root.setProperty('--tema-destaque-fundo', rgba(theme.acento, .12));
      root.setProperty('--tema-destaque-borda', rgba(theme.acento, .35));
    }

    // Cor do navegador (barra de status mobile) — mesmo princípio da própria demo de
    // referência: acompanha a cor primária, não o fundo.
    if (theme.primaria) {
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', theme.primaria);
    }
  };

  if (typeof CONFIG !== 'undefined') window.applyTheme(CONFIG.THEME);
})();
