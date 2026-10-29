# SportSee

> **Langues / Languages / Idiomas :** [Français](#français) · [English](#english) · [Português](#português)

## Français

### Présentation

SportSee est un tableau de bord d'analyse des performances sportives. Cette application React permet de consulter les activités, les objectifs hebdomadaires et les statistiques d'un utilisateur.

Ce projet a été réalisé dans le cadre de la formation OpenClassrooms **« Développeur d’application Full-stack »**, correspondant au titre **« Développeur concepteur logiciel » de niveau 6**.

Le dépôt contient le **frontend**. Le backend est fourni séparément par OpenClassrooms : [OpenClassrooms-Student-Center/P6JS](https://github.com/OpenClassrooms-Student-Center/P6JS).

Les maquettes du projet sont disponibles sur [Figma](https://www.figma.com/design/DiH1y32VLrenSxN9EzkJDn/Sportsee-React?node-id=0-1&p=f&t=fLZ8mAQ3e5gL2glh-0).

### Fonctionnalités

- Connexion à l'API avec authentification par jeton.
- Tableau de bord avec les distances parcourues sur quatre semaines, les fréquences cardiaques, les séances et les statistiques hebdomadaires.
- Navigation entre les périodes disponibles.
- Page de profil avec les informations personnelles et les statistiques globales.
- Déconnexion et protection des pages réservées aux utilisateurs connectés.

### Technologies

- React 19 et TypeScript
- React Router 7
- Recharts
- Tailwind CSS 4
- Vite

### Prérequis

- Node.js 20.19 ou supérieur
- npm
- Yarn pour installer et lancer le backend

### Installation et lancement

1. Démarrez le backend dans un premier terminal :

   ```bash
   git clone https://github.com/OpenClassrooms-Student-Center/P6JS.git
   cd P6JS
   yarn
   yarn dev
   ```

   L'API doit être disponible sur `http://localhost:8000`.

2. Dans un second terminal, à la racine de ce dépôt, installez et démarrez le frontend :

   ```bash
   npm install
   npm run dev
   ```

   Ouvrez l'adresse indiquée par Vite, généralement `http://localhost:5173`.

> Le frontend utilise actuellement l'URL `http://localhost:8000/api` pour accéder à l'API. Le backend doit donc être démarré avant de se connecter.

### Comptes de démonstration

Utilisez l'un des comptes fournis par le backend :

| Nom d'utilisateur | Mot de passe |
|---|---|
| `sophiemartin` | `password123` |
| `emmaleroy` | `password789` |
| `marcdubois` | `password456` |

### Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Démarre le serveur de développement. |
| `npm run typecheck` | Génère les types de routes et vérifie les types TypeScript. |
| `npm run build` | Génère le build de production. |
| `npm run start` | Démarre le serveur de production après le build. |

Pour lancer la version de production en local :

```bash
npm run build
npm run start
```

---

## English

### Overview

SportSee is a sports performance analytics dashboard. This React application lets users review their activities, weekly goals, and statistics.

This project was completed as part of the OpenClassrooms **“Full-stack Application Developer”** training programme, associated with the French **“Développeur concepteur logiciel” Level 6 qualification**.

This repository contains the **frontend**. The backend is provided separately by OpenClassrooms: [OpenClassrooms-Student-Center/P6JS](https://github.com/OpenClassrooms-Student-Center/P6JS).

The project mockups are available on [Figma](https://www.figma.com/design/DiH1y32VLrenSxN9EzkJDn/Sportsee-React?node-id=0-1&p=f&t=fLZ8mAQ3e5gL2glh-0).

### Features

- Sign in to the API using token-based authentication.
- Dashboard showing distance over four weeks, heart rate, sessions, and weekly statistics.
- Browse available time periods.
- Profile page with personal information and overall statistics.
- Sign out and protected pages for authenticated users.

### Technologies

- React 19 and TypeScript
- React Router 7
- Recharts
- Tailwind CSS 4
- Vite

### Prerequisites

- Node.js 20.19 or later
- npm
- Yarn to install and run the backend

### Installation and start-up

1. Start the backend in a terminal:

   ```bash
   git clone https://github.com/OpenClassrooms-Student-Center/P6JS.git
   cd P6JS
   yarn
   yarn dev
   ```

   The API should be available at `http://localhost:8000`.

2. In a second terminal, from the root of this repository, install and start the frontend:

   ```bash
   npm install
   npm run dev
   ```

   Open the address displayed by Vite, usually `http://localhost:5173`.

> The frontend currently uses `http://localhost:8000/api` to reach the API. Start the backend before signing in.

### Demo accounts

Use one of the accounts provided by the backend:

| Username | Password |
|---|---|
| `sophiemartin` | `password123` |
| `emmaleroy` | `password789` |
| `marcdubois` | `password456` |

### Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server. |
| `npm run typecheck` | Generate route types and run the TypeScript checks. |
| `npm run build` | Create the production build. |
| `npm run start` | Start the production server after building. |

To run the production build locally:

```bash
npm run build
npm run start
```

---

## Português

### Apresentação

SportSee é um painel de análise do desempenho desportivo. Esta aplicação React permite consultar as atividades, os objetivos semanais e as estatísticas de um utilizador.

Este projeto foi desenvolvido no âmbito da formação OpenClassrooms **« Développeur d’application Full-stack »**, correspondente ao título francês **« Développeur concepteur logiciel », nível 6**.

Este repositório contém o **frontend**. O backend é disponibilizado separadamente pela OpenClassrooms: [OpenClassrooms-Student-Center/P6JS](https://github.com/OpenClassrooms-Student-Center/P6JS).

Os mockups do projeto estão disponíveis no [Figma](https://www.figma.com/design/DiH1y32VLrenSxN9EzkJDn/Sportsee-React?node-id=0-1&p=f&t=fLZ8mAQ3e5gL2glh-0).

### Funcionalidades

- Início de sessão na API com autenticação por token.
- Painel com as distâncias percorridas em quatro semanas, a frequência cardíaca, as sessões e as estatísticas semanais.
- Navegação entre os períodos disponíveis.
- Página de perfil com os dados pessoais e as estatísticas globais.
- Terminar sessão e proteger as páginas destinadas a utilizadores autenticados.

### Tecnologias

- React 19 e TypeScript
- React Router 7
- Recharts
- Tailwind CSS 4
- Vite

### Pré-requisitos

- Node.js 20.19 ou superior
- npm
- Yarn para instalar e iniciar o backend

### Instalação e execução

1. Inicie o backend num primeiro terminal:

   ```bash
   git clone https://github.com/OpenClassrooms-Student-Center/P6JS.git
   cd P6JS
   yarn
   yarn dev
   ```

   A API deverá estar disponível em `http://localhost:8000`.

2. Num segundo terminal, na raiz deste repositório, instale e inicie o frontend:

   ```bash
   npm install
   npm run dev
   ```

   Abra o endereço indicado pelo Vite, normalmente `http://localhost:5173`.

> Atualmente, o frontend utiliza `http://localhost:8000/api` para aceder à API. É necessário iniciar o backend antes de iniciar sessão.

### Contas de demonstração

Utilize uma das contas disponibilizadas pelo backend:

| Nome de utilizador | Palavra-passe |
|---|---|
| `sophiemartin` | `password123` |
| `emmaleroy` | `password789` |
| `marcdubois` | `password456` |

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run typecheck` | Gera os tipos das rotas e verifica os tipos TypeScript. |
| `npm run build` | Cria a versão de produção. |
| `npm run start` | Inicia o servidor de produção após a compilação. |

Para executar localmente a versão de produção:

```bash
npm run build
npm run start
```
