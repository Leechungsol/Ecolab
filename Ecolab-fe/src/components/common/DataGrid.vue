<script setup>
// 1. Imports
import navigations from "@/constants/navigation.constant";
import { locateInMenu, sizes } from "@/utils/media-query.util";
import dayjs from "dayjs";
import {
  DxDataGrid,
  DxEditing,
  DxExport,
  DxFilterRow,
  DxPaging,
  DxScrolling,
} from "devextreme-vue/data-grid";
// import { DxSpeedDialAction } from "devextreme-vue/speed-dial-action";
import { exportDataGrid } from "devextreme/excel_exporter";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import { find, forEach } from "lodash";
import { computed } from "vue";
import { useRoute } from "vue-router";

// 2. Hooks
const route = useRoute();

// 3. Define props, emits, models
const props = defineProps({
  dataSource: Array,
  keyExpr: String,
  cssClass: String,
  allowSearch: {
    type: Boolean,
    default: true,
  },
  allowExport: {
    type: Boolean,
    default: false,
  },
  allowUpdating: {
    type: Boolean,
    default: false,
  },
  allowAdding: {
    type: Boolean,
    default: false,
  },
  allowDeleting: {
    type: Boolean,
    default: false,
  },
  allowScrollToTop: {
    type: Boolean,
    default: true,
  },
  showToolbar: {
    type: Boolean,
    default: true,
  },
  showFilter: {
    type: Boolean,
    default: true,
  },
});

const emits = defineEmits([
  "on:search",
  "on:saved",
  "on:cell-prepared",
  "on:cell-dbl-click",
]);

// 4. Define refs and reactive variables

// 5. APIs

// 6. Computed properties
const isMobile = computed(
  () => sizes()["screen-x-small"] || sizes()["screen-small"],
);
// 7. Watchers

// 8. Methods

const onSearch = () => {
  emits("on:search");
};

const onCellPrepared = (e) => {
  emits("on:cell-prepared", e);
};

/**
 * Exports the data grid component to an Excel file.
 */
const onExporting = (e) => {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet("거래처 등록");

  exportDataGrid({
    worksheet,
    component: e.component,
    autoFilterEnabled: true,
  }).then(() => {
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `거래처 등록_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`,
      );
    });
  });

  e.cancel = true;
};

/**
 * Prepares the toolbar for the data grid component by adding a title and a search button (if allowed).
 */
const onToolbarPreparing = (e) => {
  if (props.showToolbar) {
    const toolbarItems = [];
    const menu = find(navigations, { path: route.path });

    toolbarItems.push({
      location: "before",
      cssClass: "title",
      text: menu?.text,
    });

    if (props.allowSearch) {
      toolbarItems.push({
        locateInMenu,
        location: "after",
        widget: "dxButton",
        options: {
          text: "검색",
          icon: "search",
          onClick: onSearch,
          elementAttr: {
            class: "search-button",
          },
        },
      });
    }

    e.toolbarOptions.items.push(...toolbarItems);
  }

  emits("on:toolbar-preparing", e);
};

/**
 * Customizes the columns of a data grid by setting the width and minimum width of certain column types.
 */
const customizeColumns = (columns) => {
  forEach(columns, (column) => {
    if (column.type === "buttons") {
      column.width = 50;
    } else if (!column.minWidth) {
      column.minWidth = 100;
    }
  });
};

// const onScrollTop = () => {
//   const dataGrid = document.getElementById("dx-data-grid");
//   dataGrid.scrollIntoView({
//     behavior: "smooth",
//     block: "start",
//   });
// };

// 9. Lifecycle hooks

// 10. Others
</script>

<template>
  <dx-data-grid
    id="dx-data-grid"
    :class="cssClass"
    :key-expr="keyExpr"
    :data-source="dataSource"
    :show-borders="true"
    :show-row-lines="true"
    :word-wrap-enabled="true"
    :error-row-enabled="false"
    :customize-columns="customizeColumns"
    @exporting="onExporting"
    @cell-prepared="onCellPrepared"
    @toolbar-preparing="onToolbarPreparing"
  >
    <dx-scrolling
      mode="virtual"
      :timeout="0"
      :rendering-threshold="10000"
      :update-timeout="1000"
      :use-native="isMobile"
    />
    <dx-paging :enabled="false" />
    <dx-filter-row :visible="showFilter" />
    <dx-export :enabled="allowExport" />

    <slot name="options" />

    <slot name="columns" />

    <dx-editing
      mode="popup"
      :use-icons="true"
      :allow-updating="allowUpdating"
      :allow-adding="allowAdding"
      :allow-deleting="allowDeleting"
    >
      <slot name="popup-editing" />
    </dx-editing>
  </dx-data-grid>
  <!-- <dx-speed-dial-action
    icon="chevronup"
    :visible="isMobile && allowScrollToTop"
    :element-attr="{
      class: 'scroll-top-button',
    }"
    @click="onScrollTop"
  /> -->
</template>

<style scoped lang="scss">
.toolbbar-container {
  padding-bottom: 10px;
}

#dx-data-grid {
  max-height: calc(100vh - 96px);
  overscroll-behavior: none;
  border-radius: 0;
  margin-left: 0;
  margin-right: 0;
  border: 0;

  .screen-small &,
  .screen-x-small & {
    min-height: 300px;
    max-height: calc(100vh - 178px);
  }
}

:deep(.title) {
  font-weight: bold;
  color: var(--dx-color-primary);

  .screen-x-small & {
    margin-right: 20px;
  }
}

:deep(.dx-header-row) {
  td {
    background-color: var(--dx-color-primary);
    color: var(--dx-color-main-bg);
    text-align: center !important;
  }
}
</style>

<style lang="scss">
.search-button {
  .dx-button-content {
    display: flex;
    justify-content: center !important;
  }
}

@media screen and (orientation: portrait) {
  .scroll-top-button {
    display: none;
  }
}
</style>
