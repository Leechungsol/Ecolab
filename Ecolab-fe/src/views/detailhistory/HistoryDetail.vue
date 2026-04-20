<script setup>
import { apiDetailHistory } from "@/APIs/detailhistory.api";
import ContentBlock from "@/components/common/ContentBlock.vue";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { DxButton } from "devextreme-vue/button";
import DxTextArea from "devextreme-vue/text-area";
import { getCurrentInstance, onMounted, onUnmounted, ref } from "vue";
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
  detailImage: null,
  actionImage: null,
});

const detailImageFile = ref(null);
const actionImageFile = ref(null);

const detailImagePreview = ref("");
const actionImagePreview = ref("");

const isActionImageDeleted = ref(false);

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
    isActionImageDeleted.value = false;

    return data;
  },
});

const getImageSrc = (image) => {
  if (!image) return "";

  if (typeof image !== "string") return "";
  if (image.startsWith("data:image")) return image;
  if (image.startsWith("blob:")) return image;

  return `data:image/*;base64,${image}`;
};

const revokePreviewIfBlob = (url) => {
  if (url && typeof url === "string" && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
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

const compressImage = async (file) => {
  if (!file || !file.type.startsWith("image/")) return file;

  // png, jpg, jpeg, webp 등을 처리
  // 너무 작은 파일이면 원본 유지
  const maxOriginalSize = 1024 * 1024; // 1MB
  const maxWidth = 1600;
  const maxHeight = 1600;
  const outputType = "image/jpeg";
  const quality = 0.8;

  if (file.size <= maxOriginalSize) {
    return file;
  }

  const img = await loadImage(file);

  let { width, height } = img;

  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await canvasToBlob(canvas, outputType, quality);

  if (!blob) {
    return file;
  }

  return new File(
    [blob],
    file.name.replace(/\.[^.]+$/, ".jpg"),
    {
      type: outputType,
      lastModified: Date.now(),
    }
  );
};

const createPreview = (file, type) => {
  if (!file) return;

  const objectUrl = URL.createObjectURL(file);

  if (type === "detail") {
    revokePreviewIfBlob(detailImagePreview.value);
    detailImageFile.value = file;
    detailImagePreview.value = objectUrl;
  }

  if (type === "action") {
    revokePreviewIfBlob(actionImagePreview.value);
    actionImageFile.value = file;
    actionImagePreview.value = objectUrl;
  }
};

const onChangeActionImage = async (e) => {
  try {
    const file = e.target.files?.[0];
    if (!file) return;

    const compressedFile = await compressImage(file);

    createPreview(compressedFile, "action");
    isActionImageDeleted.value = false;

    // 같은 파일 다시 선택해도 change 이벤트 타게 초기화
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
  formData.value.actionImage = null;
  isActionImageDeleted.value = true;
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

    vm?.proxy?.$toast?.success("저장되었습니다.");
  } catch (error) {
    console.error("save error", error?.response?.data || error);
    vm?.proxy?.$toast?.error("저장 중 오류가 발생했습니다.");
  }
};

const onBack = () => {
  router.back();
};

onMounted(() => {
  if (route.params.mbusiKey && route.params.detailKey) {
    refetchDetail();
  }
});

onUnmounted(() => {
  revokePreviewIfBlob(detailImagePreview.value);
  revokePreviewIfBlob(actionImagePreview.value);

  queryClient.removeQueries({
    queryKey: ["detailhistory-detail", route.params.mbusiKey, route.params.detailKey],
    exact: true,
  });
});
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