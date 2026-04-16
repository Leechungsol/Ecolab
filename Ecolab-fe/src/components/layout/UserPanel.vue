<script setup>
// 1. Imports
import authUtil from "@/utils/auth.util";
import { DxContextMenu, DxPosition } from "devextreme-vue/context-menu";
import { DxList } from "devextreme-vue/list";

// 2. Hooks

// 3. Define props, emits, models
defineProps({
  menuMode: String,
  menuItems: Array,
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
  <div class="user-panel">
    <div class="user-info">
      <div class="image-container">
        <i class="fas fa-user-tie" />
      </div>
      <div class="user-id">{{ authUtil.getUser().userID }}</div>
    </div>

    <dx-context-menu
      v-if="menuMode === 'context'"
      target=".user-button"
      show-event="dxclick"
      css-class="user-menu"
      :items="menuItems"
      :width="160"
    >
      <dx-position
        my="top center"
        at="bottom center"
      />
    </dx-context-menu>

    <dx-list
      v-if="menuMode === 'list'"
      class="dx-toolbar-menu-action"
      :items="menuItems"
    />
  </div>
</template>

<style lang="scss">
.user-info {
  display: flex;
  align-items: center;

  .dx-toolbar-menu-section & {
    padding: 10px 6px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .image-container {
    overflow: hidden;
    border-radius: 50%;
    height: 30px;
    width: 30px;
    margin: 0 4px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);

    > svg {
      width: -webkit-fill-available;
      height: -webkit-fill-available;
    }
  }

  .user-id {
    font-size: 14px;
    color: var(--dx-color-text);
    margin: 0 9px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 165px;
  }
}

.user-panel {
  .dx-list-item .dx-icon {
    vertical-align: middle;
    color: var(--dx-color-text);
    margin-right: 16px;
  }
  .dx-rtl .dx-list-item .dx-icon {
    margin-right: 0;
    margin-left: 16px;
  }
}

.dx-context-menu.user-menu.dx-menu-base {
  &.dx-rtl {
    .dx-submenu .dx-menu-items-container .dx-icon {
      margin-left: 16px;
    }
  }
  .dx-submenu .dx-menu-items-container .dx-icon {
    margin-right: 16px;
  }
  .dx-menu-item .dx-menu-item-content {
    padding: 3px 15px 4px;
  }
}

.dx-theme-generic .user-menu .dx-menu-item-content .dx-menu-item-text {
  padding-left: 4px;
  padding-right: 4px;
}
</style>
