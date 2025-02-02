<template>
  <div class="flex items-center justify-between gap-x-2">
    <div class="flex items-center gap-x-2">
      <UButtonGroup>
        <template v-for="option in sortOptions">
          <UTooltip :text="option.tooltip" ignoreNonKeyboardFocus>
            <UButton
              size="xs"
              variant="subtle"
              :icon="option.icon"
              color="neutral"
              class="hover:cursor-pointer"
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
        size="xs"
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
const modal = useModal();
const locationCookie = useLocationCookie();

const sortOptions = [
  {
    label: "Newest",
    value: PostingMode.Recent,
    icon: "mdi:sparkles-outline",
    tooltip: "Sort by newest",
  },
  {
    label: "Nearest",
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
  modal.open(GMLocationModal, {
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
    modal.open(GMLocationModal, {
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
