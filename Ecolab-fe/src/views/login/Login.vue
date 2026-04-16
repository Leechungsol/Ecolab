<script setup>
// 1. Imports
import { apiUser } from "@/APIs/user.api";
import { LOCAL_STORAGE } from "@/constants/local-storage.constant";
import authUtil from "@/utils/auth.util";
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
import { getCurrentInstance, onMounted, reactive } from "vue";

// 2. Hooks
const vm = getCurrentInstance();

// 3. Define props, emits, models

// 4. Define refs and reactive variables
const formData = reactive({
  userID: "",
  userPwd: "",
});

// 5. APIs
const { mutate: login, isPending } = useMutation({
  mutationKey: ["login"],
  mutationFn: apiUser.login,
  onSuccess: ({ token, ...data }) => {
    /**
     * Handles the successful login process by setting the authentication token and user data, then redirecting the user to the specified route.
     */
    authUtil.setToken(token);
    authUtil.setUser(data);

    localStorage.setItem(LOCAL_STORAGE.USER_ID_LAST_LOGGED_IN, formData.userID);
    window.location.href = window.location.origin;
  },
  onError: (error) => {
    if (error.response.status === HttpStatusCode.NotFound) {
      vm.proxy.$toast.error("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  },
});

// 6. Computed properties

// 7. Watchers

// 8. Methods
const onSubmit = async () => {
  login(formData);
};

// 9. Lifecycle hooks
onMounted(() => {
  if (localStorage.getItem(LOCAL_STORAGE.USER_ID_LAST_LOGGED_IN)) {
    formData.userID = localStorage.getItem(
      LOCAL_STORAGE.USER_ID_LAST_LOGGED_IN,
    );
  }
});

// 10. Others
</script>

<template>
  <form
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
      <dx-item
        data-field="userID"
        editor-type="dxTextBox"
      >
        <dx-required-rule />
        <dx-label text="아이디" />
      </dx-item>
      <dx-item
        data-field="userPwd"
        editor-type="dxTextBox"
        :editor-options="{
          mode: 'userPwd',
        }"
      >
        <dx-required-rule />
        <dx-label text="비밀번호" />
      </dx-item>
      <dx-button-item>
        <dx-button-options
          width="100%"
          type="default"
          template="signIn"
          :use-submit-behavior="true"
        >
        </dx-button-options>
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
</template>

<style lang="scss"></style>
