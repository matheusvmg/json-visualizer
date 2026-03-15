# PRD — JSON Visualizer

## Visão Geral

Uma aplicação web minimalista para visualizar, formatar e explorar JSONs de forma estruturada. O usuário pode carregar múltiplos JSONs via upload ou colagem, visualizá-los formatados e como diagramas interativos, com suporte a abas infinitas e persistência via localStorage.

---

## Objetivos

- Tornar a leitura e exploração de JSONs rápida e visualmente clara
- Oferecer uma alternativa elegante às ferramentas genéricas de formatação de JSON
- Manter tudo no cliente, sem servidor, com persistência local

---

## Usuário-alvo

Desenvolvedores e engenheiros que trabalham diariamente com APIs, logs e configurações em JSON.

---

## Design & Estética

- **Tema**: Dracula — fundo escuro (`#282a36`), roxo (`#6272a4`), ciano (`#8be9fd`), verde (`#50fa7b`), rosa (`#ff79c6`), laranja (`#ffb86c`), vermelho (`#ff5555`), texto (`#f8f8f2`)
- **Estética**: Minimalista, clean, funcional — sem elementos decorativos desnecessários
- **Fonte de código**: `JetBrains Mono` ou `Fira Code` para o painel de JSON
- **Fonte UI**: `Inter` ou similar para elementos de interface
- **Layout**: Split-view (50/50) — painel esquerdo com JSON formatado, painel direito com diagrama

---

## Features

### F1 — Input de JSON

| ID | Descrição |
|----|-----------|
| F1.1 | Upload de arquivo `.json` via drag-and-drop ou botão |
| F1.2 | Colar JSON em textarea dedicada |
| F1.3 | Ao receber o JSON (qualquer método), ele é imediatamente formatado com indentação de 2 espaços |
| F1.4 | Erros de parsing são exibidos inline com mensagem clara |

### F2 — Visualização Split-View

| ID | Descrição |
|----|-----------|
| F2.1 | Painel esquerdo: editor read-only com JSON formatado e syntax highlight (tema Dracula) |
| F2.2 | Painel direito: diagrama de nós interativo representando a estrutura do JSON |
| F2.3 | O diagrama exibe objetos como nós retangulares com pares chave–valor |
| F2.4 | Arrays são exibidos com seus índices como filhos |
| F2.5 | Nós colapsáveis para objetos e arrays aninhados |
| F2.6 | Hover em nó destaca o caminho correspondente no painel esquerdo |

### F3 — Controles do Diagrama

| ID | Descrição |
|----|-----------|
| F3.1 | Zoom in / Zoom out via botões e scroll do mouse |
| F3.2 | Fit-to-screen (centralizar/justificar diagrama na viewport) |
| F3.3 | Pan (arrastar o diagrama livremente) |
| F3.4 | Mini-mapa opcional para JSONs muito grandes |

### F4 — Export do Diagrama

| ID | Descrição |
|----|-----------|
| F4.1 | Botão "Download" exporta o diagrama como imagem PNG |
| F4.2 | A imagem captura o diagrama completo (não apenas a área visível) |
| F4.3 | Nome do arquivo = nome da aba atual + timestamp |

### F5 — Abas (Tabs)

| ID | Descrição |
|----|-----------|
| F5.1 | Sidebar lateral com lista de abas |
| F5.2 | Cada aba representa um JSON independente |
| F5.3 | Usuário pode criar novas abas (botão `+`) |
| F5.4 | Cada aba tem nome editável (padrão: `JSON 1`, `JSON 2`, etc.) |
| F5.5 | Fechar aba remove o JSON da sessão e do localStorage |
| F5.6 | Sem limite de abas |

### F6 — Persistência

| ID | Descrição |
|----|-----------|
| F6.1 | Cada JSON (por aba) é salvo no `localStorage` ao ser carregado |
| F6.2 | Ao reabrir a aplicação, as abas e JSONs são restaurados |
| F6.3 | Chave de armazenamento: `jsonviz_tabs` (array de objetos `{id, name, content}`) |

---

## Fluxo Principal

```
Usuário abre app
  → Restaura abas do localStorage (ou mostra tela de boas-vindas)
  → Seleciona aba ou cria nova
  → Cola / faz upload de JSON
  → JSON é validado e formatado
  → Split-view é renderizado (editor + diagrama)
  → Usuário explora o diagrama (zoom, pan, colapso)
  → Usuário pode exportar como PNG ou fechar a aba
```

---

## Requisitos Não-Funcionais

- Toda a lógica é client-side (sem backend)
- Performance: JSONs de até ~2MB devem renderizar sem travamentos
- Responsivo para telas ≥ 1280px (não otimizado para mobile)
- Sem dependências de tracking ou analytics

---

## Fora de Escopo (v1)

- Edição do JSON no painel esquerdo
- Compartilhamento de JSONs via URL
- Diff entre dois JSONs
- Modo mobile
- Temas alternativos ao Dracula
