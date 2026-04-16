<script setup>
// 1. Imports
import navigations from "@/constants/navigation.constant";
import { routeStore } from "@/stores/route.store";
import { sizes } from "@/utils/media-query.util";
import { DxTreeView } from "devextreme-vue/tree-view";
import { some } from "lodash";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

// 2. Hooks
const route = useRoute();
const router = useRouter();

// 3. Define props, emits, models
const emits = defineEmits(["on:click"]);
const props = defineProps({
  compactMode: Boolean,
});

// 4. Define refs and reactive variables
const treeViewRef = ref(null);

// 5. APIs

// 6. Computed properties

// 7. Watchers
/**
 * Watches the current route path and updates the selection state of the tree view accordingly.
 * This ensures that the correct item in the tree view is selected based on the current route.
 */
watch(
  () => route.path,
  () => {
    updateSelection();
  },
);

/**
 * Watches the `routeStore.authority` and updates the `routeStore.items` based on the current route path and the navigation configuration.
 * - If the item's path is "/", it sets the `selected` property based on the current route path, and the `expanded` property based on the screen size.
 * - For other items, it sets the `selected` property based on whether the current route path starts with the item's path, the `expanded` property based on the screen size, and the `visible` property based on whether the item's `formId` is present in the `routeStore.authority.value`.
 * This watcher is immediately triggered to initialize the `routeStore.items`.
 */
watch(
  () => routeStore.authority,
  (newVal) => {
    routeStore.items = navigations.map((item) => {
      if (item.path === "/") {
        return {
          ...item,
          selected: route.path === item.path,
          expanded: sizes()["screen-large"],
          visible: true,
        };
      }
      return {
        ...item,
        selected: route.path.startsWith(item.path),
        expanded: sizes()["screen-large"],
        visible: !item.formId || some(newVal, { formId: item.formId }),
      };
    });
  },
  { immediate: true },
);

/**
 * Watches the `compactMode` prop and updates the tree view state accordingly.
 * If `compactMode` is true, the tree view is collapsed. Otherwise, the selection and expansion state of the tree view is updated based on the current route path.
 */
watch(
  () => props.compactMode,
  () => {
    if (props.compactMode) {
      treeViewRef.value.instance.collapseAll();
    } else {
      updateSelection();
    }
  },
);

// 8. Methods
/**
 * Emits a click event with the provided arguments.
 */
const forwardClick = (args) => {
  emits("on:click", args);
};

/**
 * Handles the click event on a tree view item. If the item has a path, it navigates to that path in the router, unless the component is in compact mode. The event propagation is stopped to prevent further handling of the click event.
 */
const onItemClick = (e) => {
  if (!e.itemData.path || props.compactMode) {
    return;
  }
  router.push(e.itemData.path);

  const pointerEvent = e.event;
  pointerEvent.stopPropagation();
};

/**
 * Updates the selection and expansion state of the tree view based on the current route path.
 * This function is called when the component's `compactMode` prop changes, to ensure the tree view is in the correct state.
 */
const updateSelection = () => {
  if (!treeViewRef.value || !treeViewRef.value.instance) {
    return;
  }

  treeViewRef.value.instance.selectItem(route.path);
  treeViewRef.value.instance.expandItem(route.path);
};

// 9. Lifecycle hooks
/**
 * Collapses the tree view when the component is in compact mode.
 * This is called when the component is mounted, and ensures the tree view is in the correct state when the component is first rendered.
 */
onMounted(() => {
  if (props.compactMode) {
    treeViewRef.value.instance.collapseAll();
  }
});

// 10. Others
</script>

<template>
  <div
    class="side-navigation-menu"
    @click="forwardClick"
  >
    <slot />
    <div class="menu-container">
      <dx-tree-view
        ref="treeViewRef"
        width="100%"
        key-expr="path"
        selection-mode="single"
        expand-event="click"
        :items="routeStore.items"
        :focus-state-enabled="false"
        :search-enabled="true"
        :search-editor-options="{
          placeholder: '검색어를 입력하세요.',
        }"
        @item-click="onItemClick"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.side-navigation-menu {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  height: 100%;
  width: 250px !important;
  background-color: var(--dx-color-main-bg);

  .menu-container {
    min-height: 100%;
    display: flex;
    flex: 1;
  }
}

:deep(.dx-treeview) {
  white-space: nowrap;

  .dx-treeview-search {
    margin: 10px;
  }

  .dx-treeview-item {
    padding-left: 0;

    .dx-icon {
      margin: 0 !important;
    }

    .dx-item-content {
      display: flex;
      gap: 12px !important;
    }
  }

  .dx-treeview-node {
    padding: 0 0 !important;
  }

  .dx-treeview-toggle-item-visibility {
    right: 10px;
    left: auto;
  }

  .dx-rtl .dx-treeview-toggle-item-visibility {
    left: 10px;
    right: auto;
  }

  .dx-treeview-node {
    &[aria-level="1"] {
      font-weight: bold;
      border-bottom: 1px solid var(--dx-color-border);
    }

    &[aria-level="2"] .dx-treeview-item-content {
      font-weight: normal;
      padding: 0 20px;
    }
  }

  .dx-treeview-node-container {
    .dx-treeview-node {
      &.dx-state-selected:not(.dx-state-focused) > .dx-treeview-item {
        background: transparent;
      }

      &.dx-state-selected > .dx-treeview-item * {
        color: var(--dx-color-primary);
      }

      .dx-treeview-item {
        height: 36px;
      }
    }
  }
}
</style>
