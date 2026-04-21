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
    <header class="external-header">
      <div class="external-header-inner">
        <div class="external-logo">
          <div class="logo-icon-wrap">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11.5L11.5 14L15.5 9.5" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="white" stroke-width="2"/>
            </svg>
          </div>
          <div class="logo-text">
            <span class="logo-title">ECOLAB</span>
            <span class="logo-subtitle">식품위생점검</span>
          </div>
        </div>
      </div>
    </header>

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
  background: #f0f4f4;
}

.external-header {
  background: #009688;
  box-shadow: 0 2px 8px rgba(0, 150, 136, 0.25);
  flex-shrink: 0;
  z-index: 10;
}

.external-header-inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px;
  height: 58px;
  display: flex;
  align-items: center;
}

.external-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon-wrap {
  width: 38px;
  height: 38px;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.logo-title {
  font-size: 17px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 1.5px;
}

.logo-subtitle {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 3px;
  letter-spacing: 0.3px;
}

.external-scroll {
  flex: 1;
  min-height: 0;
}

.external-content {
  min-height: 100%;
  padding: 28px 24px;
  box-sizing: border-box;
  max-width: 960px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .external-header-inner {
    padding: 0 16px;
    height: 52px;
  }

  .external-content {
    padding: 16px;
  }

  .logo-title {
    font-size: 15px;
  }
}
</style>