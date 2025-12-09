tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        cor: {
          principal: '#e7133f',
          fundo: '#363636',
          sidebarColor: '#363636',
          azul1: '#1e2a6c',
          cinza: '#cccccc',

          // As que você usou no HTML
          principalFraco: '#e7133f20',     // rgba(231,19,63,0.12 aprox)
          principalForte: '#b50f32',       // versão mais escura do principal
          roxo1: '#4a3aff',                // cor usada no ícone
          roxo2: '#6d5afe',                // variação mais clara
          verdeConfirmacao: '#2ecc71',     // confirmação, checkmarks etc.
          alerta: '#f1c40f',               // avisos amarelos
          erro: '#e74c3c',                 // erros, mensagens vermelhas
        },
      },
    },
  },
};
