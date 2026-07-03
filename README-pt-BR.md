# Hot Potatoes Mobile Converter

> [Read in English](README.md)

Converte arquivos de exercício do [Hot Potatoes](https://hotpot.uvic.ca/) (JQuiz, JCloze, JMatch, JMix) em versões otimizadas para dispositivos móveis — abra a página, solte um arquivo `.htm` e baixe o resultado convertido.

**Experimente:** [luisdiasdev.github.io/hotpotatoes-mobile](https://luisdiasdev.github.io/hotpotatoes-mobile/)

## Como funciona

1. **Insere** `<meta name="viewport">` — a principal correção para renderização em telas menores.
2. **Adiciona CSS responsivo** dentro de um bloco `@media (max-width: 600px)`:
   - Aumenta áreas de toque (botões, teclado virtual, opções de resposta) para no mínimo 44×44px.
   - Empilha layouts lado-a-lado verticalmente em telas estreitas.
   - Corrige o modal de feedback (posicionamento absoluto → fixo).
   - Reduz as margens do body de 5% para 1%.
   - Equilibra o espaçamento esquerdo/direito das listas de questões.
   - Centraliza os controles de navegação entre perguntas.
   - Redimensiona imagens para caberem dentro de seus contêineres.
   - Previne zoom do iOS ao focar em campos de entrada (`font-size: 16px`).
   - Amplia cartões de arrastar-e-soltar para toque.
3. **Preserva toda a lógica JavaScript original dos exercícios** — apenas CSS e meta são adicionados; nada no `<body>` ou `<script>` é alterado.

## Uso

Abra o `index.html` no navegador (localmente ou hospedado no Netlify/GitHub Pages), arraste um arquivo `.htm` para a área de upload e clique em **Download mobile version**.

## Publicação

Envie os arquivos `index.html` e `main.js` para o [Netlify Drop](https://app.netlify.com/drop) ou faça push para um repositório no GitHub Pages. Sem etapa de build, sem servidor — tudo roda no navegador.

## Arquivos

| Arquivo | Função |
| --- | --- |
| `index.html` | Interface do conversor (área de upload + botão de download) |
| `main.js` | Lógica de conversão e interação com o navegador |

## Tipos de exercício suportados

- JQuiz (múltipla escolha, resposta curta, híbrido, seleção múltipla)
- JCloze (lacunas)
- JMatch (associação, flashcards)
- JMix (frases embaralhadas)
- JCross (palavras cruzadas)

## Licença

MIT — veja [LICENSE](LICENSE). Hot Potatoes é desenvolvido pela [Half-Baked Software](https://hotpot.uvic.ca/).
