<script setup>
// 1. Imports
import { DxScrollView } from "devextreme-vue/scroll-view";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

// 2. Hooks
const route = useRoute();

// 3. Define props, emits, models

// 4. Define refs and reactive variables
const scrollViewRef = ref(null);

// 5. APIs

// 6. Computed properties

// 7. Watchers
watch(
  () => route.path,
  () => {
    scrollViewRef.value?.instance?.scrollTo(0);
  },
);

// 8. Methods

// 9. Lifecycle hooks

// 10. Others
</script>

<template>
  <div class="external-layout">
    <dx-scroll-view ref="scrollViewRef" class="external-scroll">
      <div class="external-content" id="load-panel-container">
        <slot />
      </div>
    </dx-scroll-view>
  </div>
</template>

<style lang="scss">
.external-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #f5f6f8;
}

.external-scroll {
  flex: 1;
  min-height: 0;
}

.external-content {
  min-height: 100%;
  padding: 24px;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .external-content {
    padding: 16px;
  }
}
</style>