<template>
  <div class="flex items-center justify-between gap-x-2">
    <div class="flex items-center gap-x-2">
      <UButtonGroup>
        <template v-for="option in sortOptions">
          <UTooltip :text="option.tooltip" ignoreNonKeyboardFocus>
            <UButton
              class="hover:cursor-pointer"
              size="sm"
              variant="subtle"
              :icon="option.icon"
              color="neutral"
              :class="selected === option.value ? 'bg-ui-bg-accented/75' : ''"
              @click="handleSortChange(option.value)">
              {{ option.label }}
            </UButton>
          </UTooltip>
        </template>
      </UButtonGroup>
    </div>
    <UTooltip text="Click to edit location" ignoreNonKeyboardFocus>
      <UButton
        class="not-hover:underline hover:cursor-pointer"
        v-if="locationCookie.isSet"
        icon="mdi:map-marker"
        variant="ghost"
        color="neutral"
        size="sm"
        @click="editLocation">
        {{ locationCookie.place }}
      </UButton>
    </UTooltip>
  </div>
</template>

<script lang="ts" setup>
import { GMLocationModal } from "#components";

const route = useRoute();
const router = useRouter();
const overlay = useOverlay();
const modal = overlay.create(GMLocationModal);
const locationCookie = useLocationCookie();

const sortOptions = [
  {
    label: "Newest",
    value: PostingMode.Recent,
    icon: "mdi:sparkles-outline",
    tooltip: "Sort by newest",
  },
  {
    label: "Near me",
    value: PostingMode.Nearby,
    icon: "mdi:map-marker-radius-outline",
    tooltip: "Sort by nearest",
  },
];

const selected = computed(() =>
  route.query.sort === "nearby" && locationCookie.value.isSet
    ? PostingMode.Nearby
    : PostingMode.Recent,
);

const editLocation = () => {
  modal.open({
    onLocationSet: () => {
      router.replace({
        query: {
          ...route.query,
          page: undefined,
        },
      });
    },
  });
};

function handleSortChange(payload: PostingMode) {
  if (payload === selected.value) return;
  if (payload === PostingMode.Nearby && !locationCookie.value.isSet) {
    modal.open({
      onLocationSet: () => {
        router.replace({
          query: {
            ...route.query,
            sort: "nearby",
            page: undefined,
          },
        });
      },
    });
  } else {
    router.replace({
      query: {
        ...route.query,
        sort: payload === PostingMode.Nearby ? "nearby" : undefined,
        page: undefined,
      },
    });
  }
}
</script>
