<script setup>
// 1. Imports
import Icon from "@/assets/images/SeoYeonIcon.png";
import Logo from "@/assets/images/SeoYeonLogo.jpg";
import DxScrollView from "devextreme-vue/scroll-view";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

// 2. Hooks
const route = useRoute();

// 3. Define props, emits, models

// 4. Define refs and reactive variables
const title = ref(route.meta.title);
const description = ref("");

// 5. APIs

// 6. Computed properties

// 7. Watchers
/**
 * Watches for changes to the current route path and updates the `title` and `description` reactive variables accordingly.
 * This ensures that the title and description displayed in the public layout are always up-to-date with the current route.
 */
watch(
  () => route.path,
  () => {
    title.value = route.meta.title;
    description.value = route.meta.description;
  },
);

// 8. Methods

// 9. Lifecycle hooks

// 10. Others
</script>

<template>
  <dx-scroll-view class="public-layout">
    <div class="dx-card">
      <div class="header">
        <div class="logo">
          <img
            :src="Icon"
            :height="35"
          />
          <img
            :src="Logo"
            :height="35"
          />
        </div>
        <div class="title">{{ title }}</div>
        <div class="description">{{ description }}</div>
      </div>
      <slot />
    </div>
  </dx-scroll-view>
</template>

<style lang="scss">
.public-layout {
  .dx-scrollable-content {
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;

    .dx-card {
      width: 400px;
      margin: auto auto;
      padding: 40px;
      flex-grow: 0;

      .screen-x-small & {
        width: 100%;
        height: 100%;
        border-radius: 0;
        box-shadow: none;
        margin: 0;
        border: 0;
        flex-grow: 1;
      }

      .header {
        margin-bottom: 30px;

        .logo {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 6px;
        }

        .title {
          color: var(--dx-color-text);
          line-height: 28px;
          font-weight: 500;
          font-size: 24px;
        }

        .description {
          color: rgba(var(--dx-color-text), 0.7);
          line-height: 18px;
        }
      }
    }
  }
}
</style>
