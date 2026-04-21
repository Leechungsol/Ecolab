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
import { computed, getCurrentInstance, onMounted, reactive, ref } from "vue";
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
const checkYmLabel = computed(() => {
  if (!checkYm) return "";
  const parts = checkYm.split("-");
  if (parts.length < 2) return "";
  const year = parts[0];
  const month = Number(parts[1]);
  if (!year || isNaN(month)) return "";
  return `${year}년 ${month}월`;
});

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
      "영업신고번호 7자리 중 뒤 4자리를 입력해주세요.",
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
      class="login-wrap"
      @submit.prevent="onSubmit"
    >
      <div class="login-card">
        <div class="login-card-accent" />
        <div class="login-card-body">
          <div class="login-title">점검 이력 조회</div>
          <div v-if="checkYmLabel" class="login-period">{{ checkYmLabel }} 점검이력 조회</div>
          <div class="login-sub-title">
            영업신고번호 7자리 중 뒤 4자리를 입력해주세요.
            <span class="login-example">예) 제 2026-1234567 호 → <strong>4567</strong></span>
          </div>

          <dx-form
            label-location="top"
            :form-data="formData"
            :disabled="isPending"
            :show-required-mark="false"
            :show-colon-after-label="false"
          >
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
                  <span v-if="!isPending">조회하기</span>
                </span>
              </div>
            </template>
          </dx-form>
        </div>
      </div>
    </form>

    <div v-else class="list-section">
      <div class="list-header">
        <h4 class="list-header-title">점검 목록</h4>
      </div>
      <data-grid
        key-expr="detailKey"
        :data-source="store"
        :show-column-lines="true"
        :show-filter="false"
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
            data-field="detailContents"
            caption="점검 내용"
            data-type="string"
            :min-width="120"
          />

          <dx-column
            data-field="actionContents"
            caption="조치 내용"
            data-type="string"
            :min-width="120"
          />
        </template>
      </data-grid>
    </div>
  </div>
</template>

<style scoped lang="scss">
.history-list-page {
  padding: 0;
}

/* ── 로그인 카드 ── */
.login-wrap {
  display: flex;
  justify-content: center;
  padding-top: 32px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 150, 136, 0.10), 0 1px 4px rgba(0,0,0,0.06);
  overflow: hidden;
}

.login-card-accent {
  height: 5px;
  background: linear-gradient(90deg, #009688 0%, #4db6ac 100%);
}

.login-card-body {
  padding: 32px 28px 28px;
}

.login-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a2e2e;
  margin-bottom: 6px;
}

.login-period {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  color: #009688;
  background: rgba(0, 150, 136, 0.08);
  border-radius: 20px;
  padding: 3px 10px;
  margin-bottom: 12px;
}

.login-sub-title {
  font-size: 13px;
  color: #6b8080;
  margin-bottom: 24px;
  line-height: 1.8;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.login-example {
  font-size: 12px;
  color: #8fa8a8;
  font-family: monospace;

  strong {
    color: #009688;
    font-weight: 700;
  }
}

/* ── 목록 섹션 ── */
.list-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.list-header {
  padding-left: 10px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 22px;
    border-radius: 2px;
    background-color: #009688;
  }
}

.list-header-title {
  margin: 0;
  font-weight: bold;
  color: var(--dx-color-primary);
}

@media (max-width: 768px) {
  .login-wrap {
    padding-top: 16px;
  }

  .login-card-body {
    padding: 24px 20px 20px;
  }
}
</style>