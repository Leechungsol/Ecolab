<script setup>
// 1. Imports
import { LOCAL_STORAGE } from "@/constants/local-storage.constant";
import { routeStore } from "@/stores/route.store";
import { themeStore } from "@/stores/theme.store";
import authUtil from "@/utils/auth.util";
import { sizes, subscribe, unsubscribe } from "@/utils/media-query.util";
import { useIsMutating } from "@tanstack/vue-query";
import dayjs from "dayjs";
import { DxLoadPanel } from "devextreme-vue/load-panel";
import themes from "devextreme/ui/themes";
import { computed, onBeforeUnmount, onMounted, reactive } from "vue";

// 2. Hooks
const isMutating = useIsMutating();

// 3. Define props, emits, models

// 4. Define refs and reactive variables
const screen = reactive({ getScreenSizeInfo: {} });

// 5. APIs

// 6. Computed properties
const cssClasses = computed(() => {
  return ["app"].concat(screen.getScreenSizeInfo.cssClasses);
});

// 7. Watchers

// 8. Methods
/**
 * Updates the `screen` reactive object with the current screen size information.
 * This function is called when the screen size changes, and updates the `isXSmall`,
 * `isLarge`, and `cssClasses` properties of the `screen` object.
 */
const screenSizeChanged = () => {
  screen.getScreenSizeInfo = getScreenSizeInfo();
};

/**
 * Retrieves the current screen size information, including whether the screen is
 * extra-small or large, and the corresponding CSS classes.
 */
const getScreenSizeInfo = () => {
  const screenSizes = sizes();
  return {
    isXSmall: screenSizes["screen-x-small"],
    isLarge: screenSizes["screen-large"],
    cssClasses: Object.keys(screenSizes).filter((cl) => screenSizes[cl]),
  };
};

// 9. Lifecycle hooks
/**
 * Initializes the application layout when the component is mounted.
 * - Calls the `screenSizeChanged` function to update the screen size information.
 * - Subscribes to the `screenSizeChanged` event to update the screen size information when the screen size changes.
 * - Retrieves the initial theme from local storage or the theme store, and applies it to the application.
 */
onMounted(() => {
  screenSizeChanged();
  subscribe(screenSizeChanged);

  const initTheme =
    localStorage.getItem(LOCAL_STORAGE.THEME) || themeStore.current;
  themes.current(initTheme);
  themeStore.current = initTheme;
});

/**
 * Unsubscribes from the `screenSizeChanged` event when the component is about to be unmounted.
 * This ensures that the `screenSizeChanged` function is no longer called when the screen size changes,
 * preventing potential memory leaks or unnecessary function calls.
 */
onBeforeUnmount(() => {
  unsubscribe(screenSizeChanged);
});

// 10. Others
/**
 * Saves the current time to the local storage when the window is about to be unloaded.
 * This is useful for tracking the last active time of the user, which can be used for
 * various purposes such as session management or user activity monitoring.
 */
window.addEventListener("beforeunload", () => {
  if (authUtil.isLoggedIn()) {
    localStorage.setItem(LOCAL_STORAGE.LAST_ACTIVE_TIME, dayjs().toDate());
  }
});
</script>

<template>
  <div id="root">
    <div :class="cssClasses">
      <component
        :is="$route.meta.layout"
        :is-x-small="screen.getScreenSizeInfo.isXSmall"
        :is-large="screen.getScreenSizeInfo.isLarge"
      >
        <div class="root-content">
          <suspense>
            <router-view />
            <template #fallback>로딩 중...</template>
          </suspense>
        </div>
      </component>
    </div>
    <dx-load-panel
      message="로딩 중..."
      :visible="isMutating || routeStore.isLoading"
      :position="{
        at: '.root-content',
      }"
    />
  </div>
</template>

<style lang="scss">
html,
body {
  margin: 0px;
  min-height: 100%;
  height: 100%;
}

#root {
  height: 100%;
}

* {
  box-sizing: border-box;
}

#app {
  height: 100%;
}

.app {
  background-color: rgba(var(--dx-color-main-bg), 0.5);
  display: flex;
  height: 100%;
  width: 100%;
}

.root-content {
  position: relative;
}

.dx-drawer-content {
  padding: 20px !important;
}

.dx-scrollbar-vertical {
  right: -16px;
}

.dx-popup-title:not(.dx-toolbar-mini) {
  background-color: var(--dx-color-primary);
  .dx-icon,
  .dx-toolbar-item-content {
    color: var(--dx-color-main-bg);
  }
}

.dx-popup-bottom {
  div[aria-label="저장"] {
    background-color: var(--dx-color-success);
    border-color: transparent;
    color: var(--dx-color-main-bg);
  }
}

.dx-calendar.dx-calendar-view-month {
  .dx-calendar-views-wrapper {
    table > thead > tr > th {
      font-size: 14px;
    }
  }
}
</style>
