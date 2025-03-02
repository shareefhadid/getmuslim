<template>
  <div
    class="border-ui-border relative w-full rounded-lg border-2 border-dashed p-4 transition-all"
    :class="{
      'hover:border-ui-border-accented hover:cursor-pointer': !modelValue,
    }"
    @dragover.prevent
    @drop.prevent="handleDrop"
    @click="!modelValue && fileInputRef?.click()">
    <input
      class="hidden"
      ref="file-input"
      type="file"
      accept="image/*"
      @change="handleFileSelect" />
    <div class="text-center">
      <div class="space-y-2" v-if="modelValue">
        <img
          class="w-full"
          :src="previewUrl || undefined"
          alt="Preview" />
        <p class="text-ui-text-muted text-sm">
          {{ modelValue.name }}
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <UButton
            class="hover:cursor-pointer"
            icon="mdi:refresh"
            @click.stop="fileInputRef?.click()">
            Replace
          </UButton>
          <UButton
            class="hover:cursor-pointer"
            icon="mdi:delete"
            @click.stop="handleClearImage">
            Clear
          </UButton>
        </div>
      </div>
      <div v-else>
        <p class="text-ui-text-muted text-sm">
          Drag and drop an image here, or click to select
        </p>
        <p class="text-ui-text-dimmed mt-1 text-xs">
          Recommended size: 512 x 512px (max 1MB, png or jpg)
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: File | undefined
}>();

const emit = defineEmits<{
  'update:modelValue': [value: File | undefined]
}>();

const fileInputRef = useTemplateRef("file-input");
const previewUrl = ref<string | null>(null);
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes
const toast = useToast();

const validateFile = (file: File) => {
  // Check if file is an image
  if (!file.type.startsWith("image/")) {
    toast.add({
      title: "Invalid file type",
      description: "Please upload an image file (JPG, PNG, GIF)",
      color: "error",
    });
    return false;
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    toast.add({
      title: "Image is too large",
      description: "Must be less than 1MB",
      color: "error",
    });
    return false;
  }

  return true;
};

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    const file = input.files[0];
    if (validateFile(file)) {
      emit('update:modelValue', file);
      previewUrl.value = URL.createObjectURL(file);
    } else {
      input.value = ""; // Reset input
      emit('update:modelValue', undefined);
      previewUrl.value = null;
    }
  }
};

const handleDrop = (event: DragEvent) => {
  const files = event.dataTransfer?.files;
  if (files?.length) {
    const file = files[0];
    if (validateFile(file)) {
      emit('update:modelValue', file);
      previewUrl.value = URL.createObjectURL(file);
    } else {
      emit('update:modelValue', undefined);
      previewUrl.value = null;
    }
  }
};

const handleClearImage = () => {
  emit('update:modelValue', undefined);
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }
  // Reset file input
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
};

// Clean up object URL when component is unmounted
onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script> 