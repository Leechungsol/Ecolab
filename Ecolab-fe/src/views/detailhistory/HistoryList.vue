<script setup>
// 1. Imports
import { apiBusiness } from "@/APIs/business.api";
import { apiMonthlyBusiness } from "@/APIs/monthlybusiness.api";
import { apiDetailHistory } from "@/APIs/detailhistory.api";
import DataGrid from "@/components/common/DataGrid.vue";
import { useMutation } from "@tanstack/vue-query";
import { HttpStatusCode } from "axios";
import {
  DxButtonItem,
  DxButtonOptions,
  DxForm,
  DxItem,
  DxLabel,
  DxRequiredRule,
} from "devextreme-vue/form";
import DxLoadIndicator from "devextreme-vue/load-indicator";
import { DxButton, DxColumn } from "devextreme-vue/data-grid";
import DataSource from "devextreme/data/data_source";
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

// 2. Hooks
const vm = getCurrentInstance();
const route = useRoute();
const router = useRouter();

// 3. Define props, emits, models

// 4. Define refs and reactive variables
const busiKey = Number(route.params.busiKey);
const checkYm = route.params.checkYm;
const authStorageKey = `business-history-auth-${busiKey}-${checkYm}`;

const isAuthenticated = ref(false);
const mbusiKey = ref(null);

const formData = reactive({
  reportMatch4: "",
});

const store = new DataSource({
  key: "detailKey",
  load: async () => {
    if (!mbusiKey.value) {
      return { data: [] };
    }

    const data = await apiDetailHistory.getList(mbusiKey.value);
    return { data };
  },
});

// 5. APIs
const { mutate: login, isPending } = useMutation({
  mutationKey: ["business-login", busiKey, checkYm],
  mutationFn: async () => {
    await apiBusiness.login({
      busiKey,
      reportMatch4: formData.reportMatch4,
    });

    const result = await apiMonthlyBusiness.getMbusiKey({
      busiKey,
      checkYm,
    });

    return result;
  },
  onSuccess: async ({ mbusiKey: resultMbusiKey }) => {
    try {
      mbusiKey.value = resultMbusiKey;

      sessionStorage.setItem(
        authStorageKey,
        JSON.stringify({
          isAuthenticated: true,
          mbusiKey: resultMbusiKey,
        })
      );

      isAuthenticated.value = true;
    } catch (err) {
      console.error("onSuccess error:", err);
      vm?.proxy?.$toast?.error("목록 조회 중 오류가 발생했습니다.");
    }
  },
  onError: (error) => {
    if (error?.response?.status === HttpStatusCode.NotFound) {
      vm?.proxy?.$toast?.error("인증번호가 일치하지 않습니다.");
    } else {
      vm?.proxy?.$toast?.error("조회 중 오류가 발생했습니다.");
    }
  },
});

// 6. Computed properties

// 7. Watchers

// 8. Methods
const onSearch = () => {
  // reload 지웠으면 굳이 안 써도 되지만,
  // 나중에 재조회 버튼 용도로는 남겨두는 게 좋아
  store.reload();
};

const onToolbarPreparing = (e) => {
  e.toolbarOptions.items = []; // 전부 제거
  e.toolbarOptions.items.unshift({
    location: "after",
    widget: "dxButton",
    options: {
      text: "새로고침",
      icon: "refresh",
      type: "default",
      stylingMode: "contained",
      height: 40,
      onClick: onSearch,
    },
  });
};

const onSubmit = async () => {
  if (!formData.reportMatch4 || formData.reportMatch4.length !== 4) {
    vm?.proxy?.$toast?.warning(
      "REPORTNUMBER 뒤 7자리 중 앞 4자리를 입력해주세요.",
    );
    return;
  }

  login();
};

const onDetail = (e) => {
  if (e.row?.data?.detailKey) {
    router.push({
      name: "HistoryDetail",
      params: {
        mbusiKey: mbusiKey.value,
        detailKey: e.row.data.detailKey,
      },
    });
  }
};

// 9. Lifecycle hooks
onMounted(() => {
  const saved = sessionStorage.getItem(authStorageKey);

  if (!saved) return;

  const parsed = JSON.parse(saved);

  if (parsed?.isAuthenticated) {
    isAuthenticated.value = true;
    mbusiKey.value = parsed.mbusiKey;
  }
});

// 10. Others
</script>

<template>
  <div class="history-list-page">
    <form
      v-if="!isAuthenticated"
      class="login-form"
      @submit.prevent="onSubmit"
    >
      <dx-form
        label-location="top"
        :form-data="formData"
        :disabled="isPending"
        :show-required-mark="false"
        :show-colon-after-label="false"
      >
        <dx-item>
          <template #default>
            <div class="login-title">점검 이력 조회</div>
            <div class="login-sub-title">
              REPORTNUMBER 뒤 7자리 중 앞 4자리를 입력해주세요.
            </div>
          </template>
        </dx-item>

        <dx-item
          data-field="reportMatch4"
          editor-type="dxTextBox"
          :editor-options="{
            maxLength: 4,
            mode: 'text',
            placeholder: '인증번호 4자리',
          }"
        >
          <dx-required-rule />
          <dx-label text="인증번호" />
        </dx-item>

        <dx-button-item>
          <dx-button-options
            width="100%"
            type="default"
            template="signIn"
            :use-submit-behavior="true"
          />
        </dx-button-item>

        <template #signIn>
          <div>
            <span class="dx-button-text">
              <dx-load-indicator
                v-if="isPending"
                width="24px"
                height="24px"
                :visible="true"
              />
              <span v-if="!isPending">확인</span>
            </span>
          </div>
        </template>
      </dx-form>
    </form>

    <div v-else>
      <data-grid
        key-expr="detailKey"
        :data-source="store"
        @on:toolbar-preparing="onToolbarPreparing"
      >
        <template #columns>
          <dx-column type="buttons">
            <dx-button
              icon="info"
              @click="onDetail"
            />
          </dx-column>

          <dx-column
            data-field="detailKey"
            caption="No"
            alignment="center"
            data-type="number"
            :width="80"
          />

          <dx-column
            data-field="detailContents"
            caption="점검 내용"
            data-type="string"
          />

          <dx-column
            data-field="actionContents"
            caption="조치 내용"
            data-type="string"
          />
        </template>
      </data-grid>
    </div>
  </div>
</template>

<style scoped lang="scss">
.history-list-page {
  padding: 20px;
}

.login-form {
  max-width: 420px;
  margin: 40px auto 0;
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
}

.login-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 8px;
}

.login-sub-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}
</style>