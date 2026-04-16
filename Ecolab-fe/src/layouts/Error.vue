<script setup>
// 1. Imports
import { DxButton } from "devextreme-vue/button";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

// 2. Hooks
const route = useRoute();
const router = useRouter();

// 3. Define props, emits, models

// 4. Define refs and reactive variables
const content = ref(route.meta.content);

// 5. APIs

// 6. Computed properties
const icon = computed(() => {
  if (route.name === "not-found") {
    return "fas fa-question-circle";
  }
  if (route.name === "forbidden") {
    return "fas fa-ban";
  }
  return "";
});

// 7. Watchers

// 8. Methods
const onBackHome = () => {
  router.push({ name: "home" });
};

// 9. Lifecycle hooks

// 10. Others
</script>

<template>
  <div class="error-layout-container">
    <i :class="icon" />
    <h3 class="content">{{ content }}</h3>
    <dx-button
      text="Home"
      icon="chevronleft"
      type="default"
      @click="onBackHome"
    />
  </div>
</template>

<style scoped lang="scss">
.error-layout-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.content {
  font-weight: bold !important;
}

.svg-inline--fa {
  margin-top: 24px;
  font-size: 64px;

  &.fa-question-circle {
    color: var(--dx-color-warning);
  }

  &.fa-ban {
    color: var(--dx-color-danger);
  }
}
</style>
