export function toast(msg, type = "info", duration = 4000) {
  try {
    let container = document.getElementById("app_toast_container");
    if (!container) {
      container = document.createElement("div");
      container.id = "app_toast_container";
      container.style.position = "fixed";
      container.style.right = "20px";
      container.style.top = "20px";
      container.style.zIndex = 99999;
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.gap = "8px";
      document.body.appendChild(container);
    }

    const toastEl = document.createElement("div");
    toastEl.className = `app-toast app-toast-${type}`;
    toastEl.style.minWidth = "220px";
    toastEl.style.maxWidth = "360px";
    toastEl.style.padding = "10px 14px";
    toastEl.style.borderRadius = "10px";
    toastEl.style.boxShadow = "0 6px 18px rgba(0,0,0,0.6)";
    toastEl.style.color = "#fff";
    toastEl.style.fontSize = "14px";
    toastEl.style.opacity = "0";
    toastEl.style.transform = "translateY(-6px)";
    toastEl.style.transition = "all 220ms ease";

    // background by type
    const bgMap = {
      success: "linear-gradient(90deg,#059669,#10b981)",
      error: "linear-gradient(90deg,#dc2626,#f43f5e)",
      info: "linear-gradient(90deg,#0ea5e9,#06b6d4)",
      warn: "linear-gradient(90deg,#f59e0b,#f97316)",
    };
    toastEl.style.background = bgMap[type] || bgMap.info;

    // conteúdo
    const text = document.createElement("div");
    text.innerText = msg;
    text.style.lineHeight = "1.2";
    text.style.marginRight = "8px";

    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "✕";
    closeBtn.style.background = "transparent";
    closeBtn.style.border = "none";
    closeBtn.style.color = "rgba(255,255,255,0.9)";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.fontSize = "12px";

    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.justifyContent = "space-between";
    row.appendChild(text);
    row.appendChild(closeBtn);

    toastEl.appendChild(row);
    container.appendChild(toastEl);

    // show
    requestAnimationFrame(() => {
      toastEl.style.opacity = "1";
      toastEl.style.transform = "translateY(0)";
    });

    let hideTimer = setTimeout(() => {
      toastEl.style.opacity = "0";
      toastEl.style.transform = "translateY(-6px)";
      setTimeout(() => toastEl.remove(), 220);
    }, duration);

    closeBtn.addEventListener("click", () => {
      clearTimeout(hideTimer);
      toastEl.style.opacity = "0";
      toastEl.style.transform = "translateY(-6px)";
      setTimeout(() => toastEl.remove(), 180);
    });
  } catch (e) {
    // fallback para ambientes sem DOM
    try { console.log("TOAST:", msg); } catch (e) {}
  }
}

/**
 * Formata um valor numérico para moeda brasileira (R$ 0,00)
 */
export function formatarMoeda(valor) {
  if (!valor && valor !== 0) return '';
  // Remove tudo que não é número
  const apenasNumeros = String(valor).replace(/\D/g, '');
  if (!apenasNumeros) return '';
  
  // Converte para número e divide por 100 para ter centavos
  const numero = parseFloat(apenasNumeros) / 100;
  
  // Formata como moeda brasileira
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numero);
}

/**
 * Converte valor formatado (R$ 0,00) para número normal
 */
export function converterMoedaParaNumero(valorFormatado) {
  if (!valorFormatado) return 0;
  // Remove R$, espaços, pontos e substitui vírgula por ponto
  const apenasNumeros = String(valorFormatado)
    .replace(/R\$/g, '')
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  
  const numero = parseFloat(apenasNumeros) || 0;
  return numero;
}

/**
 * Aplica formatação de moeda em um input enquanto digita
 */
export function aplicarFormatacaoMoeda(inputElement) {
  if (!inputElement) return;
  
  // Salva o valor numérico em um atributo data
  inputElement.addEventListener('input', (e) => {
    const valor = e.target.value;
    // Remove tudo que não é número
    const apenasNumeros = valor.replace(/\D/g, '');
    
    if (apenasNumeros) {
      // Formata o valor
      const valorFormatado = formatarMoeda(apenasNumeros);
      e.target.value = valorFormatado;
    } else {
      e.target.value = '';
    }
  });

  // Ao perder o foco, garante que está formatado
  inputElement.addEventListener('blur', (e) => {
    const valor = e.target.value;
    if (valor && !valor.includes('R$')) {
      const apenasNumeros = valor.replace(/\D/g, '');
      if (apenasNumeros) {
        e.target.value = formatarMoeda(apenasNumeros);
      }
    }
  });
}

/**
 * Obtém o valor numérico de um input formatado
 */
export function obterValorNumerico(inputElement) {
  if (!inputElement) return 0;
  return converterMoedaParaNumero(inputElement.value);
}