<template>
  <div>
    <Html class="scroll-smooth" />
    <UApp>
      <NuxtPage />
    </UApp>
  </div>
</template>

<style>
@import "tailwindcss";
@import "@nuxt/ui";

:root {
  /* Least prominent text */
  --ui-text-dimmed: var(--ui-color-neutral-400);
  /* Slightly muted text */
  --ui-text-muted: var(--ui-color-neutral-500);
  /* Moderately prominent text */
  --ui-text-toned: var(--ui-color-neutral-600);
  /* Default text color */
  --ui-text: var(--ui-color-neutral-700);
  /* Most prominent text */
  --ui-text-highlighted: var(--ui-color-neutral-900);

  /* Main background color */
  --ui-bg: var(--ui-color-neutral-100);
  /* Slightly elevated background */
  --ui-bg-elevated: var(--color-white);
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

  --ui-radius: var(--radius-sm);
}

.dark {
  /* Least prominent text */
  --ui-text-dimmed: var(--ui-color-neutral-500);
  /* Slightly muted text */
  --ui-text-muted: var(--ui-color-neutral-400);
  /* Moderately prominent text */
  --ui-text-toned: var(--ui-color-neutral-300);
  /* Default text color */
  --ui-text: var(--ui-color-neutral-200);
  /* Most prominent text */
  --ui-text-highlighted: var(--color-white);

  /* Main background color */
  --ui-bg: var(--ui-color-neutral-900);
  /* Slightly elevated background */
  --ui-bg-elevated: var(--ui-color-neutral-800);
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
  /* fonts */
  --font-family-sans: 'Schibsted Grotesk', sans-serif;
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
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>