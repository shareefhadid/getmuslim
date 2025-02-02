<template>
  <div class="h-full">
    <Html class="h-full scroll-smooth" />
    <Body class="flex h-full flex-col antialiased" />
    <UApp>
      <NuxtLayout class="flex h-full flex-col">
        <NuxtPage class="grow" />
      </NuxtLayout>
    </UApp>
  </div>
</template>

<script setup lang="ts">
useHead({
  script: [
    {
      src: "https://tally.so/widgets/embed.js",
      async: true,
    },
  ],
  link: [
    {
      rel: "alternate",
      type: "application/rss+xml",
      title: "getmuslim RSS Feed",
      href: "/feed.xml",
    },
  ],
});

useSchemaOrg([
  defineWebSite({
    name: "getmuslim",
    description: "Find Muslim-owned businesses and organizations",
    url: useRuntimeConfig().public.siteUrl,
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: "getmuslim",
      logo: `${useRuntimeConfig().public.siteUrl}/logo.png`,
    },
  }),
]);
</script>

<style>
@import "tailwindcss";
@import "@nuxt/ui";

#__nuxt {
  flex-grow: 1;
}

:root {
  /* Custom colors */
  --ui-color-neutral-850: var(--color-zinc-850);

  /* Least prominent text */
  --ui-text-dimmed: var(--ui-color-neutral-500);
  /* Slightly muted text */
  --ui-text-muted: var(--ui-color-neutral-600);
  /* Moderately prominent text */
  --ui-text-toned: var(--ui-color-neutral-700);
  /* Default text color */
  --ui-text: var(--ui-color-neutral-800);
  /* Most prominent text */
  --ui-text-highlighted: var(--ui-color-neutral-900);

  /* Main background color */
  --ui-bg: var(--ui-color-neutral-50);
  /* Slightly elevated background */
  --ui-bg-elevated: var(--ui-color-neutral-100);
  /* More prominent background */
  --ui-bg-accented: var(--ui-color-neutral-200);
  /* Inverted background color */
  --ui-bg-inverted: var(--ui-color-neutral-900);

  /* Default border color */
  --ui-border: var(--ui-color-neutral-200);
  /* More prominent border */
  --ui-border-accented: var(--ui-color-neutral-300);
  /* Inverted border color */
  --ui-border-inverted: var(--ui-color-neutral-900);

  --ui-primary: var(--ui-color-primary-500);
  --ui-secondary: var(--ui-color-secondary-500);
  --ui-success: var(--ui-color-success-500);
  --ui-info: var(--ui-color-info-500);
  --ui-warning: var(--ui-color-warning-500);
  --ui-error: var(--ui-color-error-500);

  --ui-radius: var(--radius-md);
}

.dark {
  /* Least prominent text */
  --ui-text-dimmed: var(--ui-color-neutral-400);
  /* Slightly muted text */
  --ui-text-muted: var(--ui-color-neutral-300);
  /* Moderately prominent text */
  --ui-text-toned: var(--ui-color-neutral-200);
  /* Default text color */
  --ui-text: var(--ui-color-neutral-100);
  /* Most prominent text */
  --ui-text-highlighted: var(--color-white);

  /* Main background color */
  --ui-bg: var(--ui-color-neutral-900);
  /* Slightly elevated background */
  --ui-bg-elevated: var(--ui-color-neutral-850);
  /* More prominent background */
  --ui-bg-accented: var(--ui-color-neutral-700);
  /* Inverted background color */
  --ui-bg-inverted: var(--color-white);

  /* Default border color */
  --ui-border: var(--ui-color-neutral-800);
  /* More prominent border */
  --ui-border-accented: var(--ui-color-neutral-700);
  /* Inverted border color */
  --ui-border-inverted: var(--color-white);

  --ui-primary: var(--ui-color-primary-400);
  --ui-secondary: var(--ui-color-secondary-400);
  --ui-success: var(--ui-color-success-400);
  --ui-info: var(--ui-color-info-400);
  --ui-warning: var(--ui-color-warning-400);
  --ui-error: var(--ui-color-error-400);
}

@theme {
  /* breakpoints */
  --breakpoint-xs: 32rem;
  /* fonts */
  --font-family-sans: "Lexend", sans-serif;
  /* colors */
  --color-primary-50: var(--ui-color-primary-50);
  --color-primary-100: var(--ui-color-primary-100);
  --color-primary-200: var(--ui-color-primary-200);
  --color-primary-300: var(--ui-color-primary-300);
  --color-primary-400: var(--ui-color-primary-400);
  --color-primary-500: var(--ui-color-primary-500);
  --color-primary-600: var(--ui-color-primary-600);
  --color-primary-700: var(--ui-color-primary-700);
  --color-primary-800: var(--ui-color-primary-800);
  --color-primary-900: var(--ui-color-primary-900);
  --color-primary-950: var(--ui-color-primary-950);

  --color-ui-text-dimmed: var(--ui-text-dimmed);
  --color-ui-text-muted: var(--ui-text-muted);
  --color-ui-text-toned: var(--ui-text-toned);
  --color-ui-text: var(--ui-text);
  --color-ui-text-highlighted: var(--ui-text-highlighted);

  --color-ui-bg: var(--ui-bg);
  --color-ui-bg-elevated: var(--ui-bg-elevated);
  --color-ui-bg-accented: var(--ui-bg-accented);
  --color-ui-bg-inverted: var(--ui-bg-inverted);

  --color-ui-border: var(--ui-border);
  --color-ui-border-accented: var(--ui-border-accented);
  --color-ui-border-inverted: var(--ui-border-inverted);

  --color-ui-primary: var(--ui-primary);
  --color-ui-secondary: var(--ui-secondary);
  --color-ui-success: var(--ui-success);
  --color-ui-info: var(--ui-info);
  --color-ui-warning: var(--ui-warning);
  --color-ui-error: var(--ui-error);

  --color-zinc-850: #1f1f22;

  /* shadows */
  --shadow-2xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-xs: 0 1px 3px 0px rgb(0 0 0 / 0.05);
  --shadow-sm: 0 2px 5px 0px rgb(0 0 0 / 0.08), 0 2px 3px 0px rgb(0 0 0 / 0.08);
  --shadow-md: 0 4px 8px -1px rgb(0 0 0 / 0.08), 0 3px 6px -1px rgb(0 0 0 / 0.08);
  --shadow-lg: 0 10px 20px -2px rgb(0 0 0 / 0.08),
    0 5px 10px -3px rgb(0 0 0 / 0.08);
  --shadow-xl: 0 20px 30px -4px rgb(0 0 0 / 0.08),
    0 8px 15px -5px rgb(0 0 0 / 0.08);
  --shadow-2xl: 0 30px 60px -10px rgb(0 0 0 / 0.2);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
