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
          
          <!-- Crop overlay for non-square images -->
          <div 
            v-if="needsCropping && imageLoaded" 
            class="absolute inset-0 overflow-hidden"
            @mousedown.prevent="startDrag"
            @touchstart.prevent="startDrag">
            
            <!-- Custom overlay with cutout for crop area -->
            <div class="absolute inset-0">
              <!-- Top overlay -->
              <div 
                class="absolute bg-black opacity-60" 
                :style="{
                  left: '0',
                  top: '0',
                  width: '100%',
                  height: `${displayPosition.y}px`
                }">
              </div>
              
              <!-- Left overlay -->
              <div 
                class="absolute bg-black opacity-60" 
                :style="{
                  left: '0',
                  top: `${displayPosition.y}px`,
                  width: `${displayPosition.x}px`,
                  height: `${cropDisplaySize}px`
                }">
              </div>
              
              <!-- Right overlay -->
              <div 
                class="absolute bg-black opacity-60" 
                :style="{
                  left: `${displayPosition.x + cropDisplaySize}px`,
                  top: `${displayPosition.y}px`,
                  width: `calc(100% - ${displayPosition.x + cropDisplaySize}px)`,
                  height: `${cropDisplaySize}px`
                }">
              </div>
              
              <!-- Bottom overlay -->
              <div 
                class="absolute bg-black opacity-60" 
                :style="{
                  left: '0',
                  top: `${displayPosition.y + cropDisplaySize}px`,
                  width: '100%',
                  height: `calc(100% - ${displayPosition.y + cropDisplaySize}px)`
                }">
              </div>
            </div>
            
            <!-- Crop square with white border (no background to see image through) -->
            <div 
              ref="cropBoxRef"
              class="absolute border-2 border-white bg-transparent cursor-move"
              :style="{
                width: `${cropDisplaySize}px`,
                height: `${cropDisplaySize}px`,
                left: `${displayPosition.x}px`,
                top: `${displayPosition.y}px`
              }">
            </div>
          </div>
        </div>
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
interface Position {
  x: number; 
  y: number;
}

interface Dimensions {
  width: number;
  height: number;
}

const props = defineProps<{
  modelValue: File | undefined
}>();

const emit = defineEmits<{
  'update:modelValue': [value: File | undefined]
}>();

const fileInputRef = useTemplateRef<HTMLInputElement>("file-input");
const imageRef = ref<HTMLImageElement | null>(null);
const cropBoxRef = ref<HTMLElement | null>(null);
const previewUrl = ref<string | null>(null);
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes
const toast = useToast();

// Cropping state
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

const onImageLoad = () => {
  if (!imageRef.value) return;
  
  // Get the display dimensions of the image
  displayDimensions.value = {
    width: imageRef.value.clientWidth,
    height: imageRef.value.clientHeight
  };
  
  // Now analyze the image's natural dimensions
  analyzeImage();
  
  imageLoaded.value = true;
};

const calculateScaleFactor = () => {
  if (!imageRef.value || !imageDimensions.value.width) return;
  
  // Calculate scale factor between natural and displayed image
  scaleFactor.value = displayDimensions.value.width / imageDimensions.value.width;
  
  // Update crop display size based on scale factor
  cropDisplaySize.value = cropSize.value * scaleFactor.value;
  
  // Update display position based on crop position and scale factor
  updateDisplayPosition();
};

const updateDisplayPosition = () => {
  displayPosition.value = {
    x: cropPosition.value.x * scaleFactor.value,
    y: cropPosition.value.y * scaleFactor.value
  };
};

const analyzeImage = () => {
  if (!props.modelValue || !imageRef.value) return;
  
  const img = new Image();
  img.onload = () => {
    // Store natural dimensions
    imageDimensions.value = { 
      width: img.naturalWidth, 
      height: img.naturalHeight 
    };
    
    // Check if image is square
    needsCropping.value = img.naturalWidth !== img.naturalHeight;
    
    if (needsCropping.value) {
      // Determine smaller dimension for crop square
      cropSize.value = Math.min(img.naturalWidth, img.naturalHeight);
      
      // Center crop square initially
      cropPosition.value = {
        x: (img.naturalWidth - cropSize.value) / 2,
        y: (img.naturalHeight - cropSize.value) / 2
      };
      
      // Store original image for cropping
      originalImage.value = img;
      
      // Calculate scale factor and update display values
      calculateScaleFactor();
      
      // Process initial crop
      processCrop();
    }
    
    URL.revokeObjectURL(img.src);
  };
  img.src = URL.createObjectURL(props.modelValue);
};

const startDrag = (event: MouseEvent | TouchEvent) => {
  if (!cropBoxRef.value || !imageRef.value) return;
  
  // Get initial position
  const clientX = 'touches' in event 
    ? event.touches[0].clientX 
    : event.clientX;
  const clientY = 'touches' in event 
    ? event.touches[0].clientY 
    : event.clientY;
  
  const cropRect = cropBoxRef.value.getBoundingClientRect();
  
  // Calculate offset from crop square origin
  dragOffset.value = {
    x: clientX - cropRect.left,
    y: clientY - cropRect.top
  };
  
  isDragging.value = true;
  
  // Add move and end event listeners
  if ('touches' in event) {
    window.addEventListener('touchmove', handleDrag, { passive: false });
    window.addEventListener('touchend', endDrag);
  } else {
    window.addEventListener('mousemove', handleDrag);
    window.addEventListener('mouseup', endDrag);
  }
};

const handleDrag = (event: MouseEvent | TouchEvent) => {
  if (!isDragging.value || !imageRef.value) return;
  
  // Prevent default to stop scrolling on mobile
  if ('touches' in event) {
    event.preventDefault();
  }
  
  // Get current position
  const clientX = 'touches' in event 
    ? event.touches[0].clientX 
    : event.clientX;
  const clientY = 'touches' in event 
    ? event.touches[0].clientY 
    : event.clientY;
  
  const imageRect = imageRef.value.getBoundingClientRect();
  
  // Calculate new position relative to image container
  let newDisplayX = clientX - imageRect.left - dragOffset.value.x;
  let newDisplayY = clientY - imageRect.top - dragOffset.value.y;
  
  // Constrain to image display boundaries
  newDisplayX = Math.max(0, Math.min(newDisplayX, displayDimensions.value.width - cropDisplaySize.value));
  newDisplayY = Math.max(0, Math.min(newDisplayY, displayDimensions.value.height - cropDisplaySize.value));
  
  // Update display position
  displayPosition.value = { x: newDisplayX, y: newDisplayY };
  
  // Calculate actual image position based on scale factor
  cropPosition.value = {
    x: newDisplayX / scaleFactor.value,
    y: newDisplayY / scaleFactor.value
  };
};

const endDrag = () => {
  isDragging.value = false;
  
  // Process crop when dragging ends
  processCrop();
  
  // Remove event listeners
  window.removeEventListener('mousemove', handleDrag);
  window.removeEventListener('mouseup', endDrag);
  window.removeEventListener('touchmove', handleDrag);
  window.removeEventListener('touchend', endDrag);
};

const processCrop = () => {
  if (!originalImage.value || !needsCropping.value || !props.modelValue) return;
  
  // Create canvas for cropping
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return;
  
  // Set canvas size to crop size (square)
  canvas.width = cropSize.value;
  canvas.height = cropSize.value;
  
  // Draw only the cropped portion to canvas
  ctx.drawImage(
    originalImage.value,
    cropPosition.value.x,
    cropPosition.value.y,
    cropSize.value,
    cropSize.value,
    0,
    0,
    cropSize.value,
    cropSize.value
  );
  
  // Convert canvas to blob and create new File
  canvas.toBlob((blob) => {
    if (blob && props.modelValue) {
      const croppedFile = new File(
        [blob], 
        props.modelValue.name || 'cropped-image.jpg',
        { type: 'image/jpeg' }
      );
      
      // Update model value with cropped file without affecting the preview
      emit('update:modelValue', croppedFile);
    }
  }, 'image/jpeg');
};

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    const file = input.files[0];
    if (validateFile(file)) {
      // Reset loading state
      imageLoaded.value = false;
      
      // Set original file and preview URL
      emit('update:modelValue', file);
      
      // Update preview URL
      if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value);
      }
      previewUrl.value = URL.createObjectURL(file);
      
      // Image analysis will happen on image load
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
      // Reset loading state
      imageLoaded.value = false;
      
      // Set original file
      emit('update:modelValue', file);
      
      // Update preview URL
      if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value);
      }
      previewUrl.value = URL.createObjectURL(file);
      
      // Image analysis will happen on image load
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
  
  // Reset cropping state
  needsCropping.value = false;
  originalImage.value = null;
  imageLoaded.value = false;
};

// Clean up object URL when component is unmounted
onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
  
  // Remove any lingering event listeners
  window.removeEventListener('mousemove', handleDrag);
  window.removeEventListener('mouseup', endDrag);
  window.removeEventListener('touchmove', handleDrag);
  window.removeEventListener('touchend', endDrag);
});
</script> 