# getmuslim
test
Find local Muslim businesses and organizations easily.

## Overview

`getmuslim` is a platform that helps users discover Muslim-owned businesses and organizations in their area. Built with **Nuxt 3** and powered by **Supabase**, it offers a fast and modern experience for exploring local halal restaurants, Islamic centers, and more.

## Features

- **Location-based search** using **Mapbox**
- **Fast and efficient** with **Bun**
- **Scalable backend** powered by **Supabase**
- **Modern UI** with **Nuxt UI** and **VueUse**
- **Data validation** with **Zod**

## Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Geolocation**: [Mapbox Search](https://www.mapbox.com/)
- **UI Components**: [Nuxt UI](https://ui.nuxt.com/)
- **State & Utilities**: [VueUse](https://vueuse.org/)
- **Validation**: [Zod](https://zod.dev/)
- **Package Manager**: [Bun](https://bun.sh/)

## Installation

Ensure you have **Bun** installed:

```sh
curl -fsSL https://bun.sh/install | bash
```

Then, clone the repo and install dependencies:

```sh
git clone https://github.com/shareefhadid/getmuslim
cd getmuslim
bun install
```

## Development

Start the local development server:

```sh
bun run dev
```

Run with debugging:

```sh
bun run dev:debug
```

## Building

To build the project:

```sh
bun run build
```

To preview a production build:

```sh
bun run preview
```

## Database Type Generation

If you need to update Supabase types:

```sh
bun run db:generate
```

## Formatting

Format Vue files with Prettier:

```sh
bun run format:vue
```

## Deployment

Deployments are configured with nuxthub through a github action.

To manually deploy:

```sh
nuxthub deploy
```
