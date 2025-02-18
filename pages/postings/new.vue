<template>
  <UContainer class="w-full py-16">
    <div class="flex flex-col gap-4">
      <h1 class="text-2xl font-bold">Submit posting</h1>
      <p class="text-ui-text-muted">
        Know a Muslim-owned business you think should be listed? Submit it here
        and it will be reviewed and added as soon as possible.
      </p>
      <UForm
        class="mt-3 space-y-4"
        :schema="schema"
        :state="state"
        @submit="onSubmit">
        <div class="flex w-sm max-w-full flex-col gap-6">
          <UFormField label="Business Name" name="title" required>
            <UInput class="w-full" v-model="state.title" />
          </UFormField>

          <UFormField
            class="col-span-2"
            label="Description"
            name="description"
            required>
            <UTextarea
              class="w-full"
              v-model="state.description"
              :ui="{ base: ['resize-none'] }"
              :rows="2" />
          </UFormField>

          <UFormField
            label="Address"
            name="address"
            required
            description="You can also enter your city.">
            <UInputMenu
              class="w-full"
              v-model:search-term="state.address"
              trailing-icon=""
              :items="items">
              <template #empty>{{ emptyText }}</template>
            </UInputMenu>
          </UFormField>

          <UFormField
            label="Display Location"
            name="show_address"
            description="Whether your location should be displayed publicly">
            <USwitch v-model="state.show_address" />
          </UFormField>

          <UFormField label="Website" name="website">
            <UInput class="w-full" v-model="state.website" type="url" />
          </UFormField>

          <UFormField label="Email" name="email">
            <UInput class="w-full" v-model="state.email" type="email" />
          </UFormField>

          <UFormField label="Phone number" name="phone">
            <UInput class="w-full" v-model="state.phone" type="tel" />
          </UFormField>

          <UFormField label="Google Maps Link" name="google_maps">
            <UInput class="w-full" v-model="state.google_maps" type="url" />
          </UFormField>

          <UFormField label="Categories (max 3)" name="category">
            <UInputMenu
              class="w-full"
              v-model="state.category"
              :items="categoryOptions"
              multiple />
          </UFormField>

          <UFormField label="Image" name="featured_image">
            <UInput class="w-full" v-model="state.featured_image" type="file" />
          </UFormField>
        </div>

        <UButton type="submit">Submit</UButton>
      </UForm>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import type { SearchBoxFeatureSuggestion } from "@mapbox/search-js-core";
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters."),
  address: z.string().min(3, "Address must be at least 3 characters"),
  show_address: z.boolean().default(true),
  featured_image: z.string().optional(),
  website: z
    .string()
    .url("Must be a valid URL (should start with https://)")
    .optional(),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().optional(),
  google_maps: z
    .string()
    .url("Must be a valid Google Maps URL (should start with https://)")
    .optional(),
  category: z
    .array(
      z.object({
        label: z.string(),
        value: z.number(),
        icon: z.union([z.string(), z.null()]),
      }),
    )
    .min(1, "At least one category is required")
    .max(3, "Maximum 3 categories allowed"),
});

const location = ref<string | undefined>(undefined);

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  title: "",
  description: "",
  address: "",
  show_address: true,
  featured_image: undefined,
  website: undefined,
  email: undefined,
  phone: undefined,
  google_maps: undefined,
  category: [] as { label: string; value: number; icon: string | null }[],
});

const toast = useToast();
const { categories } = await useCategories();
const categoryOptions = computed(() =>
  categories.value.map((cat) => ({
    label: cat.label,
    value: cat.id,
    icon: cat.icon,
  })),
);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({
    title: "Success",
    description: "The form has been submitted.",
    color: "success",
  });
  console.log(event.data);
}

// Address search
const { suggestions, status, debouncing } = useSearchLocation(
  toRef(state, "address"),
  "place,address",
);

const emptyText = computed(() => {
  if (state.address?.length < 3) {
    return "Type 3 or more letters to searching";
  } else if (status.value === "success" && !debouncing) {
    return "No results";
  } else {
    return "Searching...";
  }
});

const items = computed(() => {
  return suggestions.value.map((suggestion, index) => {
    return {
      label: `${suggestion.name}, ${suggestion.place_formatted}`,
      onSelect: async (e: Event) => {
        if (suggestion) {
          const { feature } = await $fetch<{
            feature: SearchBoxFeatureSuggestion;
          }>("/api/retrieve-location", {
            method: "POST",
            body: { suggestion },
            headers: useRequestHeaders(["cookie"]),
          });
          if (feature) {
            location.value = `POINT(${feature.geometry.coordinates[0]} ${feature.geometry.coordinates[1]})`;
          }
        }
      },
    };
  });
});
</script>
