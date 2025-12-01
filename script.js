document.addEventListener('DOMContentLoaded', function() {
    console.log('Script.js carregado e DOM content loaded.'); // Mensagem de depuração

    // Seleciona todos os botões com a classe 'btn-toggle-content'
    const toggleButtons = document.querySelectorAll('.btn-toggle-content');

    if (toggleButtons.length === 0) {
        console.warn('Nenhum botão com a classe "btn-toggle-content" encontrado.'); // Aviso se nenhum botão for encontrado
    } else {
        console.log(`Encontrados ${toggleButtons.length} botões de alternância.`);
    }

    // Itera sobre cada botão e adiciona um event listener
    toggleButtons.forEach(button => {
        // Armazena o texto original do botão para referência futura, se necessário
        // const originalButtonText = button.textContent;

        button.addEventListener('click', function() {
            console.log('Botão clicado:', this.textContent); // Mensagem de depuração ao clicar

            // Obtém o ID da área de conteúdo alvo a partir do atributo 'data-target' do botão
            const targetId = this.dataset.target;
            const contentArea = document.getElementById(targetId);

            // Verifica se a área de conteúdo existe
            if (contentArea) {
                // Alterna a classe 'show-content' na área de conteúdo
                contentArea.classList.toggle('show-content');
                console.log(`Conteúdo '${targetId}' visibilidade alternada. Agora tem 'show-content': ${contentArea.classList.contains('show-content')}`);

                // --- Lógica removida: Não altera mais o texto do botão ---
                // if (contentArea.classList.contains('show-content')) {
                //     this.textContent = `Esconder ${originalButtonText}`;
                // } else {
                //     this.textContent = `Ver ${originalButtonText}`;
                // }

                // Opcional: Esconder outras áreas de conteúdo se estiverem abertas
                // Isso garante que apenas uma seção de treino esteja visível por vez
                document.querySelectorAll('.hidden-content.show-content').forEach(openContent => {
                    if (openContent.id !== targetId) {
                        openContent.classList.remove('show-content');
                        console.log(`Conteúdo '${openContent.id}' escondido.`);
                        // Não é necessário alterar o texto do botão correspondente aqui,
                        // pois o texto do botão principal não muda mais.
                    }
                });

            } else {
                console.error(`Área de conteúdo com ID '${targetId}' não encontrada. Verifique o HTML.`);
            }
        });
    });

    // Carregar progresso do localStorage ao iniciar
    document.querySelectorAll('.btn-complete').forEach(button => {
      const Dia = button.getAttribute('data-Dia');
      if (localStorage.getItem(`Dia-${Dia}-complete`)) {
            button.classList.add('completed');
            button.textContent = '✓ Concluído';
        }
    });

    // Exibir o conteúdo do Dia 1 por padrão
    const day1Content = document.getElementById('Dia1Content');
    if (day1Content) {
        day1Content.classList.add('show-content');
    }

    // Toggle conteúdo com validação
    document.querySelectorAll('.btn-toggle-content').forEach(button => {
      button.addEventListener('click', function(e) {
        const requiredDia = this.getAttribute('data-requires-Dia');
            const target = this.getAttribute('data-target');
            const content = document.getElementById(target);

            // Day 1 é sempre liberado (data-requires-day="0")
        if (requiredDia !== '0') {
          if (!localStorage.getItem(`Dia-${requiredDia}-complete`)) {
                    // Esconde todos os conteúdos abertos
                    document.querySelectorAll('.hidden-content.show-content').forEach(openContent => {
                        openContent.classList.remove('show-content');
                    });
                    // Mostra o conteúdo do dia anterior
            const prevContent = document.getElementById(`Dia${requiredDia}Content`);
                    if (prevContent) {
                        prevContent.classList.add('show-content');
                    }
            alert(`É necessário completar o Dia ${requiredDia} antes de acessar este dia.`);
                    return;
                }
            }

            // Esconde todos os conteúdos abertos
            document.querySelectorAll('.hidden-content.show-content').forEach(openContent => {
                openContent.classList.remove('show-content');
            });
            // Mostra o conteúdo do dia clicado
            content.classList.add('show-content');
        });
    });

    // Marcar dia como concluído
    document.querySelectorAll('.btn-complete').forEach(button => {
      button.addEventListener('click', function(e) {
            e.stopPropagation();
        const Dia = this.getAttribute('data-Dia');

            if (this.classList.contains('completed')) {
          localStorage.removeItem(`Dia-${Dia}-complete`);
                this.classList.remove('completed');
                this.textContent = 'Concluído';
            } else {
          localStorage.setItem(`Dia-${Dia}-complete`, 'true');
                this.classList.add('completed');
                this.textContent = '✓ Concluído';
            }
        });
    });

    // Salvar progresso no localStorage
    document.querySelectorAll('.Dia-complete').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
        localStorage.setItem(`Dia-${this.dataset.Dia}-complete`, this.checked);
        });

        // Recuperar estado salvo
      if (localStorage.getItem(`Dia-${checkbox.dataset.Dia}-complete`)) {
            checkbox.checked = true;
        }
    });

    // Ajusta o espaçamento superior com base na altura real do header (#profile)
    (function () {
      function adjustHeaderSpacing() {
        const profile = document.querySelector('body.main-page #profile');
        if (!profile) return;
  
        const container = document.querySelector('body.main-page #container') || document.querySelector('.main-content') || document.querySelector('main');
        const list = document.querySelector('body.main-page ul');
  
        const height = Math.ceil(profile.getBoundingClientRect().height);
        // aplica margem superior para empurrar conteúdo abaixo do header fixo
        if (container) container.style.marginTop = height + 'px';
        if (list) list.style.marginTop = height + 'px';
      }
  
      window.addEventListener('DOMContentLoaded', () => {
        adjustHeaderSpacing();
  
        // se a imagem do logo carregar depois, recalcule
        const img = document.querySelector('body.main-page #profile img');
        if (img) {
          if (!img.complete) img.addEventListener('load', adjustHeaderSpacing);
          // observa mudanças de tamanho do header (mais robusto)
          if ('ResizeObserver' in window) {
            const ro = new ResizeObserver(adjustHeaderSpacing);
            ro.observe(document.querySelector('body.main-page #profile'));
          }
        }
      });
  
      window.addEventListener('resize', adjustHeaderSpacing);
    })();

    // Ajusta margem superior do conteúdo com base na altura do .logo fixo
    (function () {
      function adjustSpacing() {
        const bodyMain = document.querySelector('body.main-page');
        if (!bodyMain) return;
  
        const logo = document.querySelector('.logo');
        const container = document.querySelector('#container') || document.querySelector('.main-content') || document.querySelector('main') || document.querySelector('body.main-page > .content');
  
        if (!logo || !container) return;
  
        const rect = logo.getBoundingClientRect();
        const height = Math.ceil(rect.height) + Math.ceil(Math.max(12, rect.top)); // adiciona pequeno gap
        container.style.marginTop = height + 'px';
      }
  
      window.addEventListener('DOMContentLoaded', () => {
        adjustSpacing();
  
        // recalcula quando a imagem do logo terminar de carregar (se houver)
        const img = document.querySelector('.logo img');
        if (img) {
          if (!img.complete) img.addEventListener('load', adjustSpacing);
        }
  
        // observa mudanças de tamanho do logo (ex.: fonte, load, zoom)
        if ('ResizeObserver' in window) {
          const logoEl = document.querySelector('.logo');
          if (logoEl) {
            const ro = new ResizeObserver(adjustSpacing);
            ro.observe(logoEl);
          }
        }
      });
  
      window.addEventListener('resize', adjustSpacing);
    })();

    // Ajusta margem superior do #container com base na altura real do .logo (fixo)
    (function () {
      const GAP = 2; // Reduzido para aproximar o conteúdo

      function adjustSpacing() {
        const logo = document.querySelector('.logo');
        const container = document.querySelector('#container');
        if (!logo || !container) return;

        const rect = logo.getBoundingClientRect();
        // rect.bottom é a distância do topo da viewport até a borda inferior do logo
        const space = Math.ceil(rect.bottom + GAP);
        container.style.marginTop = space + 'px';
      }

      window.addEventListener('DOMContentLoaded', () => {
        adjustSpacing();

        const img = document.querySelector('.logo img');
        if (img) {
          if (!img.complete) img.addEventListener('load', adjustSpacing);
        }

        window.addEventListener('resize', adjustSpacing);

        if ('ResizeObserver' in window) {
          const ro = new ResizeObserver(adjustSpacing);
          ro.observe(document.querySelector('.logo'));
        }
      });
    })();
});
