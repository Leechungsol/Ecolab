<script setup>
// 1. Imports
import { sizes } from "@/utils/media-query.util";
import { DxPopup, DxToolbarItem } from "devextreme-vue/popup";
import { DxScrollView } from "devextreme-vue/scroll-view";
import { ref } from "vue";

// 2. Hooks

// 3. Define props, emits, models
const visible = defineModel("visible", { type: Boolean });
const emits = defineEmits(["on:cancel", "on:save", "on:showing", "on:hidden"]);
defineProps({
  title: String,
  maxWidth: {
    type: Number,
    default: 750,
  },
  maxHeight: {
    type: Number,
    default: 450,
  },
});

// 4. Define refs and reactive variables
const popupRef = ref();

// 5. APIs

// 6. Computed properties

// 7. Watchers

// 8. Methods
const onCancel = () => {
  visible.value = false;
  emits("on:cancel");
};

const onSave = () => {
  emits("on:save");
};

const onShowing = () => {
  emits("on:showing");
};

const onHidden = () => {
  emits("on:hidden");
};

// 9. Lifecycle hooks

// 10. Others
</script>

<template>
  <dx-popup
    ref="popupRef"
    :title="title"
    :animation="null"
    :drag-enabled="false"
    :full-screen="sizes()['screen-x-small']"
    :max-width="maxWidth"
    :max-height="maxHeight"
    v-model:visible="visible"
    @showing="onShowing"
    @hidden="onHidden"
  >
    <template #content>
      <dx-scroll-view>
        <slot name="content" />
      </dx-scroll-view>
    </template>

    <dx-toolbar-item
      toolbar="bottom"
      location="after"
      widget="dxButton"
      :options="{
        text: '저장',
        onClick: onSave,
      }"
    />

    <dx-toolbar-item
      toolbar="bottom"
      location="after"
      widget="dxButton"
      :options="{
        text: '취소',
        onClick: onCancel,
      }"
    />
  </dx-popup>
</template>

<style lang="scss">
.dx-popup-content-scrollable {
  overflow: hidden;
}
</style>
