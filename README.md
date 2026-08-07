# Hyperplus

Plataforma de streaming desenvolvida com **Next.js** e **React**, focada em organização de vídeos por categorias, autenticação de usuários e gerenciamento de conteúdos através de um painel administrativo.

O projeto exibe vídeos por seções como Populares, Patrocinados e Para Toda Família, além de oferecer cadastro, login, upload de vídeos, criação de séries e gerenciamento de episódios.

> Este repositório contém apenas o **frontend**. O backend (Node.js + Express + MySQL) é mantido em outro repositório.

## Funcionalidades

- Cadastro e login de usuários
- Autenticação com JWT
- Controle de acesso para administradores
- Upload de vídeos
- Listagem de vídeos por categoria
- Sistema de busca
- Gerenciamento de séries e episódios
- Painel administrativo
- Player de vídeo com controles customizados
- Exibição de conteúdos na página inicial (Hero, Trending, Top 10, etc.)
- Integração entre frontend e backend

## Tecnologias

### Frontend (este repositório)

| Tecnologia | Uso |
| --- | --- |
| [Next.js](https://nextjs.org) | Framework (App Router, Server/Client Components) |
| [React 19](https://react.dev) | UI |
| CSS Modules | Estilização por componente |
| Tailwind CSS v4 | Utilitários globais |
| [hls.js](https://github.com/video-dev/hls.js) | Reprodução de streams HLS |
| next-themes | Alternância de tema claro/escuro |

### Backend (repositório separado)

- Node.js
- Express
- MySQL
- Sequelize
- JWT
- Multer

## Como executar

### Pré-requisitos

- Node.js 18+
- Backend rodando em `http://localhost:3000` (ou outro endereço, veja configuração)

### Instalação

```bash
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
NEXT_PUBLIC_SERVER_API=http://localhost:3000
```

> `NEXT_PUBLIC_SERVER_API` é a URL base da API. Se não for definida, o código usa `http://localhost:3000` como padrão.

### Scripts

| Script | Comando | Descrição |
| --- | --- | --- |
| Desenvolvimento | `npm run dev` | Inicia o servidor na porta **80** |
| Build | `npm run build` | Gera o build de produção |
| Produção | `npm start` | Inicia o build de produção |

## Estrutura do projeto

```bash
hyperplus-ft/
├── public/
│   ├── img/            # Imagens padrão (avatars, placeholders)
│   └── music/          # Áudios (ex.: url.mp3 usado na página 404)
├── src/
│   ├── app/            # Rotas do App Router
│   │   ├── admin/      # Painel administrativo
│   │   ├── help/       # Central de ajuda
│   │   ├── home/       # Página inicial (logado)
│   │   ├── login/      # Login + recuperação de senha
│   │   ├── player/     # Player de vídeo
│   │   ├── search/     # Busca de séries
│   │   ├── serie/      # Detalhes da série / episódios
│   │   ├── settings/   # Configurações da conta
│   │   ├── signup/     # Cadastro com seleção de plano
│   │   ├── layout.js   # Layout raiz (Header, Footer, AuthProvider)
│   │   └── page.js     # Landing page
│   ├── components/
│   │   ├── auth/       # Contexto de autenticação (AuthContext)
│   │   ├── admin/      # Formulários e seções do painel
│   │   ├── home/       # Hero, linhas de séries, cards
│   │   ├── player/     # Player, controles, progress bar
│   │   └── ...
│   ├── lib/
│   │   ├── env/        # Configuração de ambiente e rotas da API
│   │   └── hls/        # Integração hls.js (em desenvolvimento)
│   ├── service/
│   │   ├── fetch/      # Helpers de fetch (UFetch, BFetch, uploads)
│   │   └── middleware/ # Validações (email, força de senha)
│   ├── proxy.js        # (Em análise) middleware de autenticação
├── .env                # Variáveis de ambiente (não versionado)
├── next.config.mjs
└── package.json
```

## Configuração de ambiente e rotas da API

Toda a configuração centralizada em `src/lib/env/index.js`:

- `serverApi` — URL base da API (`NEXT_PUBLIC_SERVER_API`)
- `routes` — rotas internas do frontend
- `api` — endpoints do backend agrupados por domínio (usuário, série, busca, comentários, planos, admin)

## Convenções

- Páginas e componentes usam **JavaScript** (sem TypeScript)
- Estilos em **CSS Modules** (`*.module.css`) ou utilitários globais em `globals.css`
- Componentes que usam hooks de navegação (`useSearchParams`, `useRouter`) devem ser client components (`'use client'`)
- Autenticação via contexto `useAuth()` (`src/components/auth/AuthContext.js`)
- Requisições para a API usam os helpers de `src/service/fetch`

## Roadmap (próximos passos)

- [ ] Reprodução HLS (hls.js) no player
- [ ] Re-organizar as pastas do projeto
- [ ] Ativar middleware de autenticação (`src/proxy.js`)
