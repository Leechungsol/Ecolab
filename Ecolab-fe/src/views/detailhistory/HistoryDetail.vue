<script setup>
// 1. Imports
import { apiDetailHistory } from "@/APIs/detailhistory.api";
import ContentBlock from "@/components/common/ContentBlock.vue";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { DxButton } from "devextreme-vue/button";
import DxTextArea from "devextreme-vue/text-area";
import { getCurrentInstance, onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

// 2. Hooks
const route = useRoute();
const router = useRouter();
const vm = getCurrentInstance();
const queryClient = useQueryClient();

// 3. Define props, emits, models

// 4. Define refs and reactive variables
const formData = ref({
  mbusiKey: null,
  detailKey: null,
  detailContents: "",
  actionContents: "",
  detailImage: null,
  actionImage: null,
});

const detailImageFile = ref(null);
const actionImageFile = ref(null);

const detailImagePreview = ref("");
const actionImagePreview = ref("");

// 5. APIs
const { refetch: refetchDetail } = useQuery({
  enabled: false,
  queryKey: ["detailhistory-detail", route.params.mbusiKey, route.params.detailKey],
  queryFn: () =>
    apiDetailHistory.getDetail(route.params.mbusiKey, route.params.detailKey),
  select: (data) => {
    formData.value = {
      mbusiKey: data?.mbusiKey ?? null,
      detailKey: data?.detailKey ?? null,
      detailContents: data?.detailContents ?? "",
      actionContents: data?.actionContents ?? "",
      detailImage: data?.detailImage ?? null,
      actionImage: data?.actionImage ?? null,
    };

    detailImagePreview.value = getImageSrc(data?.detailImage);
    actionImagePreview.value = getImageSrc(data?.actionImage);

    return data;
  },
});

// 6. Computed properties

// 7. Watchers

// 8. Methods
const getImageSrc = (image) => {
  if (!image) return "";

  if (typeof image !== "string") return "";
  if (image.startsWith("data:image")) return image;
  if (image.startsWith("blob:")) return image;

  return `data:image/*;base64,${image}`;
};

const createPreview = (file, type) => {
  if (!file) return;

  const objectUrl = URL.createObjectURL(file);

  if (type === "detail") {
    detailImageFile.value = file;
    detailImagePreview.value = objectUrl;
  }

  if (type === "action") {
    actionImageFile.value = file;
    actionImagePreview.value = objectUrl;
  }
};

const onChangeActionImage = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  createPreview(file, "action");
};

const onSave = async () => {
  try {
    const payload = new FormData();

    payload.append("mbusiKey", formData.value.mbusiKey);
    payload.append("detailKey", formData.value.detailKey);
    payload.append("actionContents", formData.value.actionContents ?? "");

    if (actionImageFile.value) {
      payload.append("actionImageFile", actionImageFile.value);
    }

    await apiDetailHistory.save(payload);

    vm?.proxy?.$toast?.success("저장되었습니다.");
  } catch (error) {
    vm?.proxy?.$toast?.error("저장 중 오류가 발생했습니다.");
  }
};

const onBack = () => {
  router.back();
};

// 9. Lifecycle hooks
onMounted(() => {
  if (route.params.mbusiKey && route.params.detailKey) {
    refetchDetail();
  }
});

onUnmounted(() => {
  queryClient.removeQueries({
    queryKey: ["detailhistory-detail", route.params.mbusiKey, route.params.detailKey],
    exact: true,
  });
});

// 10. Others
</script>

<template>
  <div class="wrapper-content">
    <div class="top-actions">
      <dx-button
        text="뒤로"
        icon="chevronleft"
        styling-mode="outlined"
        @click="onBack"
      />
      <dx-button
        text="저장"
        icon="save"
        type="default"
        @click="onSave"
      />
    </div>

    <content-block title="점검 내용">
      <div class="detail-section">
        <dx-text-area
          v-model:value="formData.detailContents"
          :height="180"
          :read-only="true"
        />

        <div class="image-section">
          <div class="image-title">점검 이미지</div>

          <div
            v-if="detailImagePreview"
            class="image-preview"
          >
            <img
              :src="detailImagePreview"
              alt="detail-image"
            />
          </div>
          <div
            v-else
            class="image-empty"
          >
            등록된 점검 이미지가 없습니다.
          </div>
        </div>
      </div>
    </content-block>

    <content-block title="조치 내용">
      <div class="detail-section">
        <dx-text-area
          v-model:value="formData.actionContents"
          :height="180"
          placeholder="조치 내용을 입력하세요."
        />

        <div class="image-section">
          <div class="image-title">조치 이미지</div>

          <div
            v-if="actionImagePreview"
            class="image-preview"
          >
            <img
              :src="actionImagePreview"
              alt="action-image"
            />
          </div>
          <div
            v-else
            class="image-empty"
          >
            등록된 조치 이미지가 없습니다.
          </div>

          <div class="image-actions">
            <label class="upload-button">
              사진 촬영 / 선택
              <input
                type="file"
                accept="image/*"
                capture="environment"
                @change="onChangeActionImage"
              />
            </label>

            <label class="upload-button secondary">
              파일 선택
              <input
                type="file"
                accept="image/*"
                @change="onChangeActionImage"
              />
            </label>
          </div>
        </div>
      </div>
    </content-block>
  </div>
</template>

<style scoped lang="scss">
.wrapper-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.top-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.image-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.image-title {
  font-size: 14px;
  font-weight: 600;
}

.image-preview {
  width: 100%;
  min-height: 220px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  overflow: hidden;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    max-height: 420px;
    object-fit: contain;
  }
}

.image-empty {
  width: 100%;
  min-height: 220px;
  border: 1px dashed #c7c7c7;
  border-radius: 8px;
  background: #fafafa;
  color: #888;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.upload-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 130px;
  height: 36px;
  padding: 0 14px;
  border-radius: 6px;
  background: #337ab7;
  color: #fff;
  font-size: 13px;
  cursor: pointer;

  input {
    display: none;
  }

  &.secondary {
    background: #6c757d;
  }
}
</style>