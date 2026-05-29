<template>
  <view class="detail-page">
    <navBar title="素材详情" />
    <scroll-view class="page-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
      <view v-if="loading" class="detail-empty">
        <text class="detail-empty-text">加载中...</text>
      </view>
      <template v-else-if="detail">
        <view class="form-card">
          <view class="form-row">
            <text class="form-label">素材类型</text>
            <text class="form-value">{{ MATERIAL_TYPE_MAP[detail.materialType] || detail.materialType }}</text>
          </view>
          <view class="form-divider" />

          <view class="form-row">
            <text class="form-label">素材名称</text>
            <text class="form-value">{{ detail.name || '-' }}</text>
          </view>
          <view class="form-divider" />

          <view class="form-row">
            <text class="form-label">素材简介</text>
            <text class="form-value">{{ detail.summary || '-' }}</text>
          </view>
          <view class="form-divider" />

          <view class="form-row">
            <text class="form-label">所属文件夹</text>
            <text class="form-value">{{ detail.folderName || '-' }}</text>
          </view>
          <view class="form-divider" />

          <view v-if="detail.coverUrl" class="form-row">
            <text class="form-label">素材封面</text>
            <image class="detail-cover" :src="detail.coverUrl" mode="aspectFill" />
          </view>
        </view>

        <view v-if="detail.contentHtml" class="editor-card">
          <text class="editor-title">内容正文</text>
          <view class="editor-preview">
            <rich-text :nodes="detail.contentHtml" />
          </view>
        </view>

        <view v-if="detail.files && detail.files.length > 0" class="form-card">
          <text class="section-title">附件文件</text>
          <view v-for="f in detail.files" :key="f.id" class="form-row">
            <text class="form-label">{{ f.fileRole === 'poster' ? '海报图片' : f.fileRole === 'cover' ? '封面' : f.fileName }}</text>
            <text class="form-value file-link" @tap="previewFile(f.fileUrl)">{{ f.fileName }}</text>
          </view>
        </view>
      </template>
      <view v-else class="detail-empty">
        <text class="detail-empty-text">素材不存在</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import navBar from '@/components/NavBar.vue'
import { getMaterialDetail, MATERIAL_TYPE_MAP, type MaterialDetailResponse } from '@/api/material'

const loading = ref(true)
const detail = ref<MaterialDetailResponse | null>(null)

async function fetchDetail() {
  const instance = Taro.getCurrentInstance()
  const id = Number(instance.router?.params?.id)
  const companyId = Number(instance.router?.params?.companyId)
  if (!id || !companyId) {
    loading.value = false
    return
  }
  try {
    const res = await getMaterialDetail(id, companyId)
    detail.value = res
  } catch {
    detail.value = null
  } finally {
    loading.value = false
  }
}

function previewFile(url: string) {
  if (!url) return
  Taro.previewImage({
    urls: [url],
    current: url,
  })
}

fetchDetail()
</script>

<style>
.detail-page {
  min-height: 100vh;
  background: #F5F7F9;
}
.page-scroll {
  padding: 20rpx 0;
}

.form-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 32rpx;
  margin: 20rpx;
}
.form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 0;
}
.form-label {
  font-size: 30rpx;
  color: #62687D;
  flex-shrink: 0;
}
.form-value {
  font-size: 30rpx;
  color: #1A1D24;
  text-align: right;
  flex: 1;
  margin-left: 24rpx;
}
.form-divider {
  height: 1rpx;
  background: #F4F4F4;
}
.detail-cover {
  width: 156rpx;
  height: 156rpx;
  border-radius: 8rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #1A1D24;
  display: block;
}

.editor-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  margin: 0 20rpx 20rpx;
  padding: 32rpx;
}
.editor-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #1A1D24;
  margin-bottom: 24rpx;
}
.editor-preview {
  border: 1rpx solid #EBEBEB;
  border-radius: 8rpx;
  padding: 16rpx;
  min-height: 200rpx;
}

.file-link {
  color: #37AE7E;
}

.detail-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 200rpx 0;
}
.detail-empty-text {
  font-size: 28rpx;
  color: #9292A5;
}
</style>
