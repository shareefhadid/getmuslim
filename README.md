# getmuslim

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
- **UI Components**: [Nuxt UI](https://ui3.nuxt.dev)
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

## Environment variables

Setup the following environment variables:

```
SUPABASE_URL=
SUPABASE_KEY=
MAPBOX_ACCESS_TOKEN=
NUXT_HUB_PROJECT_KEY=
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

## Supabase local development

Start supabase:

```sh
supabase start
```

Pull remote db:

```sh
supabase db pull
```

Create a migration:

```sh
# create_employees_table will be the migration name
supabase migration new create_employees_table
```

Apply migrations locally:

```sh
# only apply migrations
supabase migration up

# reset db completely
supabase db reset
```

See changes between local db and migrations:

```sh
# Diffs local migration files against the local database.
supabase db diff
```

See changes between remote db and migrations:

```sh
# Diffs local migration files against the linked project.
supabase db diff --linked
```

Generate migration from diff:

```sh
# Useful if you made changes directly without a migration
supabase db diff -f file_name
```

Deploy local migrations to remote db:

```sh
supabase db push
```

### Sample data

To add sample data, create a `supabase/seed.sql` file. You can apply this using:

```sh
supabase db reset
```
