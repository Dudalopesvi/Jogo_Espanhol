# Juega+ 🧩🌎

Plataforma web de jogos para **aprender espanhol e descobrir o mundo hispanohablante**.
Feita só com **HTML5, CSS3 e JavaScript puro** — sem frameworks, sem build, sem backend.

> A interface inteira está em espanhol (público-alvo: quem estuda o idioma). Este README está em português.

---

## ✨ O que tem

### 🧩 Rompecabezas — bandeiras
- Monte a bandeira de um dos **20 países** hispanohablantes (SVGs reais, locais).
- **3 níveis:** Fácil (3×3), Medio (4×4) e Difícil (5×5).
- Sorteio aleatório ou **escolha do país** (lista com bandeira, capital, região e idioma).
- Troca de peças por **clique/toque** (selecionar uma, depois outra), **drag-and-drop** no desktop e **teclado** (Enter/Espaço).
- A vitória é detectada **automaticamente** a cada troca (`checkPuzzleWin()`) e abre um modal com movimentos, tempo, pontuação, capital, idioma, região e um "dato" curioso.

### 🕵️ ¿Quién soy? — cartinha física
- 16 personagens (reais e **fictícios, identificados como tal**) com 4 pistas cada.
- Carta com **frente e verso (flip 3D)**; as pistas ficam dentro da carta.
- **Swipe** com o dedo ou o mouse: a carta acompanha o gesto, inclina e some; se o gesto for curto, volta.
- Botões ↶ Volver · 🔄 Girar carta · ↷ Siguiente, e setas do teclado.
- Menos pistas usadas = mais pontos. Respostas aceitam maiúsculas, acentos e espaços extras.

### 🔤 Termo
- Palavra de 5 letras, 6 tentativas, lógica correta para **letras repetidas** (duas passadas: verdes primeiro, depois amarelos limitados).
- **Entrada pelo teclado real do dispositivo:** um `<input>` transparente cobre o tabuleiro. No desktop basta digitar; no celular, tocar no tabuleiro abre o teclado nativo.
- Teclado virtual (com Ñ) **opcional**: oculto por padrão no celular, visível no desktop.
- Feedback sem depender só de cor (✓ ● ✕).

### 🌎 El mundo hispanohablante — mapa-múndi
- Mapa-múndi com **176 países** em SVG local; os 20 países da lista aparecem em verde-água.
- Hover mostra o nome; clique mostra bandeira, idioma, capital, região e um dado.
- Atalhos de região (Mundo, América, Europa, África) e lista de países para toque no celular.
- Completar uma bandeira no Rompecabezas pinta o país de **roxo** no mapa ("país descubierto").

### ⭐ Puntuación global
- Os três jogos terminam na mesma função (`finishGame`), que atualiza o total, jogos, vitórias e melhor pontuação.
- Dados salvos no `localStorage` (chave `juegaplus.stats.v1`), com botão de reiniciar.

---

## 🛠️ Tecnologias

HTML5 · CSS3 (variáveis, grid, flexbox, `<dialog>`, animações) · JavaScript Vanilla (ES2022).
Nenhuma dependência de execução. A fonte **Inter** é carregada do Google Fonts, mas há fallback (`"Segoe UI", Arial`) e o site funciona offline.

## 📁 Estrutura

```text
juegos-espanol/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── script.js        # lógica dos jogos, pontuação, mapa e navegação
│   └── world.js         # dados do mapa-múndi (gerados; ver Créditos)
└── assets/
    ├── flags/           # 20 bandeiras SVG + licença
    ├── icons/           # favicon
    └── images/          # créditos do mapa
```

## ▶️ Como executar

Abra o `index.html` no navegador. Se preferir um servidor local:

```bash
python3 -m http.server 8000
# acesse http://localhost:8000
```

## 🚀 Publicação

O projeto é **100% estático**: publique a pasta no GitHub Pages, Netlify ou Vercel.
Na Vercel, use *Framework Preset: Other*, **sem** Build Command e **sem** Output Directory, e garanta que o `index.html` esteja na raiz do diretório publicado (ajuste *Root Directory* se necessário).

---

## 🧠 Como funciona

| Área | Funções principais |
| --- | --- |
| App e navegação | `initApp`, `showScreen`, `go` (telas trocadas por hash, sem recarregar) |
| Pontuação | `calculateScore`, `loadStats`, `saveStats`, `addScore`, `registerGame`, `registerVictory`, `finishGame`, `updateScoreUI`, `resetStats` |
| Rompecabezas | `startPuzzle`, `swapPieces`, `checkPuzzleWin`, `finishPuzzle` |
| ¿Quién soy? | `renderCard`, `setFlip`, `showHint`, `checkWhoAmIAnswer`, `finishWhoAmI`, `changeCard`, `initCardGestures` |
| Termo | `initTermo`, `handleTermoInput`, `checkTermoGuess`, `evaluate`, `updateKeyboard`, `finishTermo` |
| Mapa | `drawWorld`, `selectCountry`, `setMapView` |

### Regras de pontuação (máximo de 1000 pontos por partida)

| Jogo | Regra |
| --- | --- |
| Rompecabezas | base 600 / 800 / 1000 (Fácil / Medio / Difícil), menos 5 a 3 pontos por movimento e por segundo conforme o nível; mínimo 50 |
| ¿Quién soy? | 1000, 750, 500 ou 250 pontos conforme a pista em que acertou |
| Termo | vitória: `1000 − 180 × (tentativas − 1)`, mínimo 100; derrota: 20 pontos por letra verde do melhor palpite |

---

## ♿ Acessibilidade e responsividade
HTML semântico, `aria-label`/`aria-live`, foco visível, navegação por teclado, `inert` no lado oculto da carta, respeito a `prefers-reduced-motion` e botões com área de toque de pelo menos 44 px. Testado sem scroll horizontal em 320, 375, 430, 768 e 1280 px.

## ⚠️ Limitações conhecidas
- O Termo aceita **qualquer** sequência de 5 letras como palpite (o banco tem 63 palavras, pequeno demais para validar como dicionário).
- As bandeiras usam a versão **1:1 recortada** (tabuleiro quadrado); Peru e Costa Rica aparecem sem brasão (versão civil).
- Puerto Rico (território dos EUA) não é exibido como país.
- Capitais, idiomas e "datos" foram escritos à mão: **confira antes de usar em contexto avaliativo**.
- Testado em Chromium headless com toque simulado; **não** foi testado em aparelhos físicos nem com leitores de tela.

## 🙏 Créditos e licenças de terceiros
- **Bandeiras:** [flag-icons](https://github.com/lipis/flag-icons) — MIT (licença em `assets/flags/`).
- **Mapa-múndi:** [Natural Earth](https://www.naturalearthdata.com/) (domínio público) via [world-atlas](https://github.com/topojson/world-atlas) (ISC), projeção Miller.
- **Nomes dos países em espanhol:** [i18n-iso-countries](https://github.com/michaelwittig/node-i18n-iso-countries) — MIT.
- **Fonte:** [Inter](https://rsms.me/inter/) — SIL OFL.

---

Desenvolvido por **Eduarda Lopes Vieira**.
