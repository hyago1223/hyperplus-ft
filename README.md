# Hyperplus

Hyperplus é uma plataforma de streaming desenvolvida com foco em organização de vídeos por categorias, autenticação de usuários e gerenciamento de conteúdos através de um painel administrativo.

O projeto permite exibir vídeos por seções como Populares, Patrocinados e Para Toda Família, além de oferecer funcionalidades para cadastro, login, upload de vídeos, criação de séries e gerenciamento de episódios.

## Funcionalidades

- Cadastro e login de usuários
- Autenticação com JWT
- Controle de acesso para administradores
- Upload de vídeos
- Listagem de vídeos por categoria
- Sistema de busca
- Gerenciamento de séries
- Gerenciamento de episódios
- Exibição de conteúdos na página inicial
- Integração entre frontend e backend

## Tecnologias utilizadas

### Frontend
- Next.js
- React
- CSS Modules
- JavaScript

### Backend
- Node.js
- Express
- MySQL
- Sequelize
- JWT
- Multer

## Estrutura do projeto

```bash
hyperplus/
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   └── services/
│
├── backend/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── models/
│   ├── routes/
│   └── middlewares/
