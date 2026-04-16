<script setup>
// 1. Imports
import { LOCAL_STORAGE } from "@/constants/local-storage.constant";
import { THEME_OPTIONS } from "@/constants/theme.constant";
import { themeStore } from "@/stores/theme.store";
import authUtil from "@/utils/auth.util";
import { locateInMenu } from "@/utils/media-query.util";
import { DxButton } from "devextreme-vue/button";
import { DxSelectBox } from "devextreme-vue/select-box";
import { DxItem, DxToolbar } from "devextreme-vue/toolbar";
import themes from "devextreme/ui/themes";
import { useRouter } from "vue-router";
import UserPanel from "./UserPanel.vue";

// 2. Hooks
const router = useRouter();

// 3. Define props, emits, models
const emits = defineEmits(["on:toggle-menu"]);
defineProps({
  menuToggleEnabled: Boolean,
});

// 4. Define refs and reactive variables

// 5. APIs

// 6. Computed properties

// 7. Watchers

// 8. Methods
/**
 * Logs the user out and redirects them to the login page.
 */
const onLogout = () => {
  authUtil.logOut();
  router.push({ name: "login" });
};

/**
 * Changes the current theme and updates the theme in the theme store and local storage.
 */
const onChangeTheme = (e) => {
  themes.current(e.value);
  themeStore.current = e.value;
  localStorage.setItem(LOCAL_STORAGE.THEME, e.value);
};

const onToggleMenu = (e) => {
  emits("on:toggle-menu", e);
};

// 9. Lifecycle hooks

// 10. Others
/**
 * An array of user menu items, each with a text label and an icon. The "로그아웃" item also has an onClick handler function.
 * These menu items are used to provide a user menu in the application header.
 */
const userMenuItems = [
  // {
  //   text: "프로필",
  //   icon: "fas fa-user",
  // },
  {
    text: "로그아웃",
    icon: "fas fa-sign-out-alt",
    onClick: onLogout,
  },
];
</script>

<template>
  <header class="header-component">
    <dx-toolbar class="header-toolbar">
      <dx-item
        location="before"
        css-class="menu-button"
        :visible="menuToggleEnabled"
      >
        <template #default>
          <dx-button
            icon="menu"
            styling-mode="text"
            @click="onToggleMenu"
          />
        </template>
      </dx-item>

      <dx-item
        location="before"
        css-class="header-title dx-toolbar-label"
        text="식품위생점검"
      />

      <dx-item
        location="after"
        :locate-in-menu="locateInMenu"
      >
        <template #default>
          <dx-select-box
            display-expr="label"
            value-expr="value"
            :data-source="THEME_OPTIONS"
            :value="themes.current()"
            @value-changed="onChangeTheme"
          />
        </template>
      </dx-item>

      <dx-item
        location="after"
        :locate-in-menu="locateInMenu"
        menu-item-template="menuUserItem"
      >
        <template #default>
          <div>
            <dx-button
              class="user-button authorization"
              height="100%"
              styling-mode="text"
              :width="210"
            >
              <user-panel
                menu-mode="context"
                :menu-items="userMenuItems"
              />
            </dx-button>
          </div>
        </template>
      </dx-item>

      <template #menuUserItem>
        <user-panel
          menu-mode="list"
          :menu-items="userMenuItems"
        />
      </template>
    </dx-toolbar>
  </header>
</template>

<style lang="scss">
.header-component {
  flex: 0 0 auto;
  z-index: 1;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);

  .dx-toolbar .dx-toolbar-item.menu-button > .dx-toolbar-item-content .dx-icon {
    color: var(--dx-color-primary);
  }
}

.dx-toolbar.header-toolbar .dx-toolbar-items-container .dx-toolbar-after {
  padding: 0 20px;

  .screen-x-small & {
    padding: 0 20px;
  }
}

.dx-toolbar .dx-toolbar-item.dx-toolbar-button.menu-button {
  width: 60px;
  text-align: center;
  padding: 0;
}

.header-title .dx-item-content {
  padding: 0;
  margin: 0;
  font-weight: bold;
}

.dx-theme-generic {
  .dx-toolbar.header-toolbar {
    padding: 10px 0;
  }

  .user-button > .dx-button-content {
    padding: 3px;
  }
}

.item-theme {
  display: flex;
  align-items: center;

  > img {
    padding-right: 10px;
  }
}

.item-theme-selected {
  > img {
    margin-left: 10px;
    padding: 0 !important;
    width: 18px;
    height: 18px;
  }
}
</style>
