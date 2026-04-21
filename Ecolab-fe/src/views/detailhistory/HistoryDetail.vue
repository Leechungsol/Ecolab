<script setup>
import { apiDetailHistory } from "@/APIs/detailhistory.api";
import ContentBlock from "@/components/common/ContentBlock.vue";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { DxButton } from "devextreme-vue/button";
import DxTextArea from "devextreme-vue/text-area";
import { getCurrentInstance, nextTick, onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const vm = getCurrentInstance();
const queryClient = useQueryClient();

const formData = ref({
  mbusiKey: null,
  detailKey: null,
  detailContents: "",
  actionContents: "",
  hasDetailImage: false,
  hasActionImage: false,
});

const actionTextAreaRef = ref(null);
const actionImageFile = ref(null);
const detailImagePreview = ref("");
const actionImagePreview = ref("");
const isActionImageDeleted = ref(false);

const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

const buildDetailImageUrl = (detailKey) =>
  `/api/detailhistory/image/detail/${detailKey}?t=${Date.now()}`;

const buildActionImageUrl = (detailKey) =>
  `/api/detailhistory/image/action/${detailKey}?t=${Date.now()}`;

const revokePreviewIfBlob = (url) => {
  if (url && typeof url === "string" && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
};

const createPreview = (file) => {
  if (!file) return;

  revokePreviewIfBlob(actionImagePreview.value);

  const objectUrl = URL.createObjectURL(file);
  actionImageFile.value = file;
  actionImagePreview.value = objectUrl;
};

const loadImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = reader.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const canvasToBlob = (canvas, type, quality) => {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
};

const compressImageSafe = async (file) => {
  try {
    if (!file || !file.type.startsWith("image/")) return file;

    const lowerName = file.name?.toLowerCase() ?? "";
    const isHeic =
      file.type.includes("heic") ||
      file.type.includes("heif") ||
      lowerName.endsWith(".heic") ||
      lowerName.endsWith(".heif");

    if (isHeic) {
      return file;
    }

    if (file.size <= 1024 * 1024) {
      return file;
    }

    const img = await loadImage(file);

    let width = img.width;
    let height = img.height;

    const maxWidth = 1600;
    const maxHeight = 1600;

    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.drawImage(img, 0, 0, width, height);

    const blob = await canvasToBlob(canvas, "image/jpeg", 0.8);
    if (!blob) return file;

    return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error("compressImageSafe fallback", error);
    return file;
  }
};

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
      hasDetailImage: data?.hasDetailImage ?? false,
      hasActionImage: data?.hasActionImage ?? false,
    };

    detailImagePreview.value = data?.hasDetailImage
      ? buildDetailImageUrl(data.detailKey)
      : "";

    if (!actionImageFile.value) {
      actionImagePreview.value = data?.hasActionImage
        ? buildActionImageUrl(data.detailKey)
        : "";
    }

    isActionImageDeleted.value = false;

    return data;
  },
});

const onChangeActionImage = async (e) => {
  try {
    const file = e.target.files?.[0];
    if (!file) return;

    const safeFile = await compressImageSafe(file);

    createPreview(safeFile);
    isActionImageDeleted.value = false;
    e.target.value = "";
  } catch (error) {
    console.error("image change error", error);
    vm?.proxy?.$toast?.error("이미지 처리 중 오류가 발생했습니다.");
  }
};

const onRemoveActionImage = () => {
  revokePreviewIfBlob(actionImagePreview.value);

  actionImageFile.value = null;
  actionImagePreview.value = "";
  isActionImageDeleted.value = true;
  formData.value.hasActionImage = false;
};

const onSave = async () => {
  try {
    const payload = new FormData();

    payload.append("mbusiKey", String(formData.value.mbusiKey));
    payload.append("detailKey", String(formData.value.detailKey));
    payload.append("actionContents", formData.value.actionContents ?? "");
    payload.append("deleteActionImage", isActionImageDeleted.value ? "Y" : "N");

    if (actionImageFile.value) {
      payload.append("actionImageFile", actionImageFile.value);
    }

    await apiDetailHistory.save(payload);

    if (isActionImageDeleted.value) {
      actionImagePreview.value = "";
    } else if (actionImageFile.value) {
      revokePreviewIfBlob(actionImagePreview.value);
      actionImagePreview.value = buildActionImageUrl(formData.value.detailKey);
      formData.value.hasActionImage = true;
    }

    actionImageFile.value = null;
    isActionImageDeleted.value = false;

    vm?.proxy?.$toast?.success("저장되었습니다.");
  } catch (error) {
    console.error("save error", error?.response?.data || error);
    vm?.proxy?.$toast?.error("저장 중 오류가 발생했습니다.");
  }
};

const onBack = () => {
  router.back();
};

onMounted(async () => {
  if (route.params.mbusiKey && route.params.detailKey) {
    await refetchDetail();
    nextTick(() => {
      actionTextAreaRef.value?.instance?.focus();
    });
  }
});

onUnmounted(() => {
  revokePreviewIfBlob(actionImagePreview.value);

  queryClient.removeQueries({
    queryKey: ["detailhistory-detail", route.params.mbusiKey, route.params.detailKey],
    exact: true,
  });
});
</script>

<template>
  <div class="wrapper-content">
    <div class="detail-topbar">
      <dx-button
        text="목록으로"
        icon="chevronleft"
        styling-mode="text"
        class="back-button"
        @click="onBack"
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
          ref="actionTextAreaRef"
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
              {{ isMobile ? "사진 촬영/선택" : "사진 선택" }}
              <input
                type="file"
                accept="image/*"
                @change="onChangeActionImage"
              />
            </label>

            <button
              type="button"
              class="upload-button secondary"
              @click="onRemoveActionImage"
            >
              파일 삭제
            </button>

            <dx-button
              text="저장"
              icon="save"
              type="default"
              @click="onSave"
            />
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

.detail-topbar {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #fff;
  border-radius: 12px;
  padding: 6px 12px 6px 6px;
  box-shadow: 0 1px 4px rgba(0, 150, 136, 0.08), 0 0 0 1px rgba(0,150,136,0.08);
}

.back-button {
  color: #009688 !important;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.image-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.image-preview,
.image-empty,
.image-actions {
  width: 100%;
}

.image-title {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: #00796b;
  background: rgba(0, 150, 136, 0.08);
  border: 1px solid rgba(0, 150, 136, 0.2);
  border-radius: 20px;
  padding: 3px 10px 3px 8px;
  align-self: flex-start;

  &::before {
    content: "";
    display: inline-block;
    width: 6px;
    height: 6px;
    background: #009688;
    border-radius: 50%;
    flex-shrink: 0;
  }
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

.image-actions .dx-button {
  margin-left: auto;
}

.upload-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 130px;
  height: 36px;
  padding: 0 14px;
  border-radius: 6px;
  border: none;
  background: #009688;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;

  &:hover {
    background: #00796b;
  }

  input {
    display: none;
  }

  &.secondary {
    background: #b2bec3;

    &:hover {
      background: #8ea0a6;
    }
  }
}
</style>