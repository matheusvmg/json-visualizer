# Plano de Implementação — JSON Visualizer

## Stack Técnica

| Camada | Tecnologia |
|--------|-----------|
| Framework | React 18 (via CDN / Vite) |
| Linguagem | JavaScript (ES2022) |
| Estilização | CSS puro com variáveis (tema Dracula) |
| Diagrama | React Flow (`reactflow`) |
| Syntax Highlight | `highlight.js` ou `prism-react-renderer` |
| Export PNG | `html-to-image` |
| Persistência | `localStorage` nativo |
| Build | Vite (single-page app) |

---

## Estrutura de Arquivos

```
json-visualizer/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── main.jsx                  # Entry point
│   ├── App.jsx                   # Root: layout + tab state
│   ├── styles/
│   │   ├── global.css            # Reset, CSS vars Dracula, tipografia
│   │   └── components.css        # Estilos de componentes
│   ├── components/
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.jsx       # Lista de abas
│   │   │   └── TabItem.jsx       # Item de aba (nome editável, fechar)
│   │   ├── InputPanel/
│   │   │   ├── InputPanel.jsx    # Modal/overlay de entrada de JSON
│   │   │   ├── DropZone.jsx      # Drag-and-drop de arquivo .json
│   │   │   └── PasteArea.jsx     # Textarea para colar JSON
│   │   ├── Editor/
│   │   │   └── JsonEditor.jsx    # Painel esquerdo: JSON formatado com highlight
│   │   ├── Diagram/
│   │   │   ├── DiagramPanel.jsx  # Painel direito: wrapper do React Flow
│   │   │   ├── JsonNode.jsx      # Nó customizado para o diagrama
│   │   │   └── diagramUtils.js   # Converte JSON → nodes + edges do React Flow
│   │   └── Toolbar/
│   │       └── DiagramToolbar.jsx # Zoom in/out, fit, download
│   ├── hooks/
│   │   ├── useTabs.js            # Gerenciamento de abas + localStorage
│   │   └── useJsonParser.js      # Parsing, validação e formatação
│   └── utils/
│       ├── storage.js            # Abstração do localStorage
│       └── exportDiagram.js      # Lógica de export PNG com html-to-image
```

---

## Variáveis CSS — Tema Dracula

```css
:root {
  --bg:         #282a36;
  --bg-alt:     #1e1f29;
  --surface:    #343746;
  --border:     #44475a;
  --comment:    #6272a4;
  --fg:         #f8f8f2;
  --cyan:       #8be9fd;
  --green:      #50fa7b;
  --orange:     #ffb86c;
  --pink:       #ff79c6;
  --purple:     #bd93f9;
  --red:        #ff5555;
  --yellow:     #f1fa8c;
  --font-mono:  'JetBrains Mono', 'Fira Code', monospace;
  --font-ui:    'Inter', sans-serif;
  --radius:     6px;
  --transition: 150ms ease;
}
```

---

## Fases de Implementação

### Fase 1 — Fundação (Setup + Layout)

**Objetivo**: App rodando com layout base e tema Dracula aplicado.

**Tarefas**:
1. `npm create vite@latest json-visualizer -- --template react`
2. Instalar dependências: `reactflow`, `html-to-image`, `highlight.js`
3. Criar `global.css` com variáveis Dracula e reset
4. Implementar `App.jsx` com layout de 3 colunas: sidebar + editor + diagrama
5. Implementar `Sidebar.jsx` com estrutura estática de abas
6. Configurar roteamento de estado por aba (`useTabs.js`)

**Critério de aceite**: Layout renderiza corretamente com tema Dracula; abas são clicáveis e alteram a aba ativa.

---

### Fase 2 — Input de JSON

**Objetivo**: Usuário consegue inserir JSON via upload ou colagem.

**Tarefas**:
1. Implementar `InputPanel.jsx` (modal/overlay que aparece em aba vazia)
2. Implementar `DropZone.jsx`:
   - Aceita drag-and-drop de `.json`
   - Aceita clique para abrir seletor de arquivo
   - Lê o arquivo com `FileReader`
3. Implementar `PasteArea.jsx`:
   - Textarea com placeholder
   - Botão "Format & Visualize"
4. Implementar `useJsonParser.js`:
   - `parseJson(raw: string): { formatted: string, error: string | null, data: any }`
   - Formata com `JSON.stringify(data, null, 2)`
   - Retorna erro descritivo se inválido
5. Exibir erro inline com cor `--red` se JSON inválido

**Critério de aceite**: JSON colado ou uploadado é formatado e o estado da aba é atualizado com `{ raw, formatted, data }`.

---

### Fase 3 — Painel Esquerdo (Editor)

**Objetivo**: Exibir JSON formatado com syntax highlight no painel esquerdo.

**Tarefas**:
1. Implementar `JsonEditor.jsx`:
   - Renderiza `<pre><code>` com o JSON formatado
   - Aplica highlight com `highlight.js` (tema compatível com Dracula)
   - Scroll independente
   - Botão "Copy" no canto superior direito
2. Garantir que chaves, strings, números e booleanos tenham cores Dracula corretas:
   - Chaves: `--cyan`
   - Strings: `--yellow`
   - Números: `--purple`
   - Booleanos/null: `--orange`

**Critério de aceite**: JSON é exibido com syntax highlight correto e botão de cópia funcional.

---

### Fase 4 — Diagrama (Painel Direito)

**Objetivo**: Renderizar o JSON como diagrama interativo no painel direito.

**Tarefas**:
1. Implementar `diagramUtils.js`:
   - Função `jsonToGraph(data, parentId?, path?): { nodes, edges }`
   - Objetos → nó com lista de pares `key: value`
   - Arrays → nó com índices como filhos
   - Valores primitivos exibidos inline no nó pai
   - Valores objeto/array criam nós filhos com edge
   - Layout automático (top-down ou left-right com `dagre`)
2. Implementar `JsonNode.jsx` (custom node do React Flow):
   - Fundo `--surface`, borda `--border`, border-radius `--radius`
   - Header com nome do nó (chave pai) em `--purple`
   - Linhas de propriedades: chave em `--cyan`, valor em `--fg`
   - Valores string em `--yellow`, números em `--purple`, booleanos em `--green`/`--red`
   - Botão collapse/expand para nós com filhos
3. Implementar `DiagramPanel.jsx`:
   - Instancia `<ReactFlow>` com `nodes`, `edges` e `nodeTypes`
   - Background com padrão de pontos (`--border`)
   - Desativa interações não necessárias (sem edição)
4. Instalar e configurar `dagre` para layout automático de nós

**Critério de aceite**: JSON é convertido em diagrama legível com nós conectados e colapsáveis.

---

### Fase 5 — Toolbar do Diagrama

**Objetivo**: Controles de zoom, pan e fit.

**Tarefas**:
1. Implementar `DiagramToolbar.jsx`:
   - Botão Zoom In (`+`)
   - Botão Zoom Out (`-`)
   - Botão Fit (`⊡`) — usa `fitView()` do React Flow
   - Botão Download (ícone câmera/download)
2. Usar `useReactFlow()` para acessar `zoomIn()`, `zoomOut()`, `fitView()`
3. Estilizar toolbar como barra flutuante sobre o diagrama (canto superior direito)

**Critério de aceite**: Todos os controles de zoom e fit funcionam corretamente.

---

### Fase 6 — Export PNG

**Objetivo**: Usuário pode baixar o diagrama como imagem PNG.

**Tarefas**:
1. Implementar `exportDiagram.js`:
   - Usa `html-to-image` para capturar o elemento do diagrama
   - Captura com `toPng(element, { backgroundColor: '#282a36' })`
   - Faz download com nome `{tabName}_{timestamp}.png`
2. Conectar ao botão Download da toolbar
3. Mostrar feedback visual durante o export (loading state no botão)

**Critério de aceite**: Clique no download gera PNG com o diagrama completo em fundo Dracula.

---

### Fase 7 — Abas e Persistência

**Objetivo**: Abas infinitas com persistência no localStorage.

**Tarefas**:
1. Implementar `useTabs.js`:
   ```js
   // Estado: { tabs: Tab[], activeTabId: string }
   // Tab: { id, name, raw, formatted, data }
   // Ações: createTab, closeTab, renameTab, setTabContent, setActiveTab
   ```
2. Implementar persistência em `storage.js`:
   - `saveTabs(tabs)` → `localStorage.setItem('jsonviz_tabs', JSON.stringify(tabs))`
   - `loadTabs()` → parse do localStorage
   - Salvar a cada mudança de conteúdo (debounce 500ms)
3. Implementar `TabItem.jsx`:
   - Nome da aba com duplo-clique para editar inline
   - Botão `×` para fechar (com confirmação se tiver conteúdo)
   - Indicador visual na aba ativa
4. Botão `+` na sidebar para criar nova aba

**Critério de aceite**: Abas são criadas, renomeadas, fechadas e persistidas; ao recarregar a página, as abas são restauradas.

---

### Fase 8 — Polish & UX

**Objetivo**: Refinar a experiência geral.

**Tarefas**:
1. Tela de boas-vindas em aba vazia (instrução para colar ou fazer upload)
2. Animação de entrada do diagrama ao carregar novo JSON
3. Tooltip nos botões da toolbar
4. Feedback de erro ao tentar fazer upload de arquivo não-JSON
5. Responsividade para ≥ 1280px (garantir que o split-view não quebre)
6. Scrollbar customizada com tema Dracula
7. Favicon e `<title>` da página

---

## Esquema de Dados

### Tab (localStorage)
```ts
interface Tab {
  id: string;          // UUID v4
  name: string;        // Nome editável pelo usuário
  raw: string;         // JSON original inserido pelo usuário
  formatted: string;   // JSON formatado (JSON.stringify com 2 espaços)
  data: any;           // JSON.parse(raw) — objeto JS
  createdAt: number;   // timestamp
}
```

### Chave localStorage
```
jsonviz_tabs → JSON.stringify(Tab[])
jsonviz_active → string (id da aba ativa)
```

---

## Dependências

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "reactflow": "^11.11.4",
    "dagre": "^0.8.5",
    "html-to-image": "^1.11.11",
    "highlight.js": "^11.10.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.1"
  }
}
```

---

## Ordem de Entrega Recomendada para Agentes

| Prioridade | Fase | Complexidade |
|-----------|------|-------------|
| 1 | Fase 1 — Fundação | Baixa |
| 2 | Fase 2 — Input | Baixa |
| 3 | Fase 3 — Editor | Baixa |
| 4 | Fase 4 — Diagrama | **Alta** |
| 5 | Fase 7 — Abas + Persistência | Média |
| 6 | Fase 5 — Toolbar | Baixa |
| 7 | Fase 6 — Export PNG | Baixa |
| 8 | Fase 8 — Polish | Média |

> **Nota para agentes**: A Fase 4 (Diagrama) é o coração da aplicação. Dedicar atenção especial à função `jsonToGraph` em `diagramUtils.js` e ao layout com `dagre` é crítico para a qualidade final. O `JsonNode` customizado deve respeitar rigorosamente o esquema de cores Dracula.
