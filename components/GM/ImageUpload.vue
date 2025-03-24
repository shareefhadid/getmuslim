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
        <div class="relative w-full">
          <img
            class="w-full"
            ref="imageRef"
            :src="previewUrl || undefined"
            @load="onImageLoad"
            alt="Preview" />

          <div
            class="absolute inset-0 overflow-hidden"
            v-if="needsCropping && imageLoaded"
            @mousedown.prevent="startDrag"
            @touchstart.prevent="startDrag">
            <div
              class="absolute bg-transparent border-2 border-white cursor-move"
              ref="cropBoxRef"
              :style="{
                top: `${displayPosition.y}px`,
                left: `${displayPosition.x}px`,
                width: `${cropDisplaySize}px`,
                height: `${cropDisplaySize}px`,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)'
              }"></div>
          </div>
        </div>
        <p class="text-ui-text-muted text-sm">{{ modelValue.name }}</p>
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
interface Position {
  x: number;
  y: number;
}

interface Dimensions {
  width: number;
  height: number;
}

const props = defineProps<{
  modelValue: File | undefined;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: File | undefined];
}>();

const fileInputRef = useTemplateRef<HTMLInputElement>("file-input");
const imageRef = ref<HTMLImageElement | null>(null);
const cropBoxRef = ref<HTMLElement | null>(null);
const previewUrl = ref<string | null>(null);
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes
const toast = useToast();

const needsCropping = ref(false);
const imageLoaded = ref(false);
const imageDimensions = ref<Dimensions>({ width: 0, height: 0 });
const displayDimensions = ref<Dimensions>({ width: 0, height: 0 });
const cropSize = ref(0);
const cropDisplaySize = ref(0);
const cropPosition = ref<Position>({ x: 0, y: 0 });
const displayPosition = ref<Position>({ x: 0, y: 0 });
const isDragging = ref(false);
const dragOffset = ref<Position>({ x: 0, y: 0 });
const originalImage = ref<HTMLImageElement | null>(null);
const scaleFactor = ref(1);

const validateFile = (file: File): boolean => {
  // Check for accepted image formats (only PNG and JPEG/JPG)
  const acceptedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  
  if (!acceptedTypes.includes(file.type)) {
    toast.add({
      title: "Invalid file type",
      description: "Please upload only PNG or JPG images",
      color: "error",
    });
    return false;
  }

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

const onImageLoad = () => {
  if (!imageRef.value) return;

  displayDimensions.value = {
    width: imageRef.value.clientWidth,
    height: imageRef.value.clientHeight,
  };

  analyzeImage();
  imageLoaded.value = true;
};

const calculateScaleFactor = () => {
  if (!imageRef.value || !imageDimensions.value.width) return;

  scaleFactor.value =
    displayDimensions.value.width / imageDimensions.value.width;
  cropDisplaySize.value = cropSize.value * scaleFactor.value;
  updateDisplayPosition();
};

const updateDisplayPosition = () => {
  displayPosition.value = {
    x: cropPosition.value.x * scaleFactor.value,
    y: cropPosition.value.y * scaleFactor.value,
  };
};

const analyzeImage = () => {
  if (!props.modelValue || !imageRef.value) return;

  const img = new Image();
  img.onload = () => {
    imageDimensions.value = {
      width: img.naturalWidth,
      height: img.naturalHeight,
    };

    needsCropping.value = img.naturalWidth !== img.naturalHeight;

    if (needsCropping.value) {
      cropSize.value = Math.min(img.naturalWidth, img.naturalHeight);

      cropPosition.value = {
        x: (img.naturalWidth - cropSize.value) / 2,
        y: (img.naturalHeight - cropSize.value) / 2,
      };

      originalImage.value = img;
      calculateScaleFactor();
      processCrop();
    }

    URL.revokeObjectURL(img.src);
  };
  img.src = URL.createObjectURL(props.modelValue);
};

const startDrag = (event: MouseEvent | TouchEvent) => {
  if (!cropBoxRef.value || !imageRef.value) return;

  const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
  const clientY = "touches" in event ? event.touches[0].clientY : event.clientY;

  const cropRect = cropBoxRef.value.getBoundingClientRect();

  dragOffset.value = {
    x: clientX - cropRect.left,
    y: clientY - cropRect.top,
  };

  isDragging.value = true;

  if ("touches" in event) {
    window.addEventListener("touchmove", handleDrag, { passive: false });
    window.addEventListener("touchend", endDrag);
  } else {
    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("mouseup", endDrag);
  }
};

const handleDrag = (event: MouseEvent | TouchEvent) => {
  if (!isDragging.value || !imageRef.value) return;

  if ("touches" in event) {
    event.preventDefault();
  }

  const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
  const clientY = "touches" in event ? event.touches[0].clientY : event.clientY;

  const imageRect = imageRef.value.getBoundingClientRect();

  let newDisplayX = clientX - imageRect.left - dragOffset.value.x;
  let newDisplayY = clientY - imageRect.top - dragOffset.value.y;

  newDisplayX = Math.max(
    0,
    Math.min(
      newDisplayX,
      displayDimensions.value.width - cropDisplaySize.value,
    ),
  );
  newDisplayY = Math.max(
    0,
    Math.min(
      newDisplayY,
      displayDimensions.value.height - cropDisplaySize.value,
    ),
  );

  displayPosition.value = { x: newDisplayX, y: newDisplayY };

  cropPosition.value = {
    x: newDisplayX / scaleFactor.value,
    y: newDisplayY / scaleFactor.value,
  };
};

const endDrag = () => {
  isDragging.value = false;
  processCrop();

  window.removeEventListener("mousemove", handleDrag);
  window.removeEventListener("mouseup", endDrag);
  window.removeEventListener("touchmove", handleDrag);
  window.removeEventListener("touchend", endDrag);
};

const processCrop = () => {
  if (!originalImage.value || !needsCropping.value || !props.modelValue) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  canvas.width = cropSize.value;
  canvas.height = cropSize.value;

  ctx.drawImage(
    originalImage.value,
    cropPosition.value.x,
    cropPosition.value.y,
    cropSize.value,
    cropSize.value,
    0,
    0,
    cropSize.value,
    cropSize.value,
  );

  canvas.toBlob((blob) => {
    if (blob && props.modelValue) {
      const croppedFile = new File(
        [blob],
        props.modelValue.name || "cropped-image.jpg",
        { type: "image/jpeg" },
      );

      emit("update:modelValue", croppedFile);
    }
  }, "image/jpeg");
};

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    const file = input.files[0];
    if (validateFile(file)) {
      imageLoaded.value = false;

      emit("update:modelValue", file);

      if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value);
      }
      previewUrl.value = URL.createObjectURL(file);
    } else {
      input.value = "";
      emit("update:modelValue", undefined);
      previewUrl.value = null;
    }
  }
};

const handleDrop = (event: DragEvent) => {
  const files = event.dataTransfer?.files;
  if (files?.length) {
    const file = files[0];
    if (validateFile(file)) {
      imageLoaded.value = false;

      emit("update:modelValue", file);

      if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value);
      }
      previewUrl.value = URL.createObjectURL(file);
    } else {
      emit("update:modelValue", undefined);
      previewUrl.value = null;
    }
  }
};

const handleClearImage = () => {
  emit("update:modelValue", undefined);
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }

  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }

  needsCropping.value = false;
  originalImage.value = null;
  imageLoaded.value = false;
};

onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }

  window.removeEventListener("mousemove", handleDrag);
  window.removeEventListener("mouseup", endDrag);
  window.removeEventListener("touchmove", handleDrag);
  window.removeEventListener("touchend", endDrag);
});
</script>
