<script setup>
// 1. Imports
import Header from "@/components/layout/Header.vue";
import Sidebar from "@/components/layout/Sidebar.vue";
import { DxDrawer } from "devextreme-vue/drawer";
import { DxScrollView } from "devextreme-vue/scroll-view";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

// 2. Hooks
const route = useRoute();

// 3. Define props, emits, models
const props = defineProps({
  isXSmall: Boolean,
  isLarge: Boolean,
});

// 4. Define refs and reactive variables
const scrollViewRef = ref(null);
const menuOpened = ref(props.isLarge);
const menuTemporaryOpened = ref(false);

// 5. APIs

// 6. Computed properties
const drawerOptions = computed(() => {
  const shaderEnabled = !props.isLarge;

  return {
    menuMode: props.isLarge ? "shrink" : "overlap",
    menuRevealMode: props.isXSmall ? "slide" : "expand",
    minMenuSize: 0,
    maxMenuSize: 250,
    closeOnOutsideClick: shaderEnabled,
    shaderEnabled,
  };
});

// 7. Watchers
/**
 * Watches the `isLarge` prop and updates the `menuOpened` value accordingly, unless `menuTemporaryOpened` is true.
 * This ensures the menu state is kept in sync with the `isLarge` prop, except when the menu is temporarily opened.
 */
watch(
  () => props.isLarge,
  (newVal) => {
    if (!menuTemporaryOpened.value) {
      menuOpened.value = newVal;
    }
  },
);

/**
 * Watches the `route.path` and resets the menu state when the route changes, unless the menu is temporarily opened or the layout is in large mode.
 * This ensures the menu is closed when the user navigates to a new route, except when the menu is temporarily opened.
 * It also scrolls the scroll view to the top of the page when the route changes.
 */
watch(
  () => route.path,
  () => {
    if (menuTemporaryOpened.value || !props.isLarge) {
      menuOpened.value = false;
      menuTemporaryOpened.value = false;
    }
    scrollViewRef.value.instance.scrollTo(0);
  },
);

// 8. Methods
/**
 * Toggles the state of the menu between open and closed.
 * If the menu is currently open, it will be temporarily closed.
 * If the menu is currently closed, it will be opened.
 * This function is called when the user interacts with the menu toggle button.
 */
const onToggleMenu = (e) => {
  const pointerEvent = e.event;
  pointerEvent.stopPropagation();
  if (menuOpened.value) {
    menuTemporaryOpened.value = false;
  }
  menuOpened.value = !menuOpened.value;
};

const handleSideBarClick = () => {
  if (menuOpened.value === false) {
    menuTemporaryOpened.value = true;
  }
  menuOpened.value = true;
};

// 9. Lifecycle hooks

// 10. Others
</script>

<template>
  <div class="side-nav-outer-toolbar">
    <Header
      class="layout-header"
      :menu-toggle-enabled="true"
      @on:toggle-menu="onToggleMenu"
    />
    <dx-drawer
      class="layout-body"
      position="before"
      template="menuTemplate"
      v-model:opened="menuOpened"
      :opened-state-mode="drawerOptions.menuMode"
      :reveal-mode="drawerOptions.menuRevealMode"
      :min-size="drawerOptions.minMenuSize"
      :max-size="drawerOptions.maxMenuSize"
      :shading="drawerOptions.shaderEnabled"
      :close-on-outside-click="drawerOptions.closeOnOutsideClick"
    >
      <dx-scroll-view ref="scrollViewRef">
        <div id="load-panel-container">
          <slot />
        </div>
      </dx-scroll-view>
      <template #menuTemplate>
        <Sidebar
          :compact-mode="!menuOpened"
          @click="handleSideBarClick"
        />
      </template>
    </dx-drawer>
  </div>
</template>

<style lang="scss">
.side-nav-outer-toolbar {
  flex-direction: column;
  display: flex;
  height: 100%;
  width: 100%;

  .layout-header {
    z-index: 1501;
  }

  .layout-body {
    flex: 1;
    min-height: 0;

    .dx-drawer-panel-content {
      border-right: 1px solid var(--dx-color-border);
    }
  }

  .dx-drawer {
    height: calc(100% - 56px);
  }
}

.fallback-layout {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
}
</style>
