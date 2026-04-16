<script setup>
// 1. Imports

// 2. Hooks

// 3. Define props, emits, models
defineProps({
  title: String,
});

// 4. Define refs and reactive variables

// 5. APIs

// 6. Computed properties

// 7. Watchers

// 8. Methods

// 9. Lifecycle hooks

// 10. Others
</script>

<template>
  <div class="container">
    <div class="title">
      <h4>
        {{ title }}
      </h4>
      <slot name="action" />
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 10px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    width: 4px;
    height: 24px;
    border-radius: var(--dx-border-radius);
    background-color: var(--dx-color-primary);
  }

  h4 {
    margin-block: 0;
    font-weight: bold;
    color: var(--dx-color-primary);
  }
}

.content {
  padding: 10px 0;
}
</style>
