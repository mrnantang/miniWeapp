<template>
  <view class="ap-page">
    <!-- 加载中 -->
    <view v-if="loading" class="ap-status">
      <view class="ap-spinner" />
      <text class="ap-status-text">加载中...</text>
    </view>

    <!-- 错误 -->
    <view v-else-if="errorMsg" class="ap-status">
      <view class="ap-error-icon">!</view>
      <text class="ap-status-text ap-error-text">{{ errorMsg }}</text>
    </view>

    <!-- 无内容 -->
    <view v-else-if="!htmlContent" class="ap-status">
      <text class="ap-status-text">暂无内容</text>
    </view>

    <!-- 富文本渲染 -->
    <view v-else class="ap-content">
      <view class="ap-header">
        <text class="ap-title">{{ title }}</text>
      </view>
      <scroll-view class="ap-scroll" scroll-y="true">
        <rich-text class="ap-html-body" :nodes="htmlContent" />

        <!-- 关联素材列表 -->
        <view v-if="materials.length > 0" class="ap-materials">
          <text class="ap-section-title">关联素材</text>
          <view v-for="m in materials" :key="m.materialId" class="ap-material-card" @tap="onMaterialClick(m)">
            <view class="ap-material-info">
              <text class="ap-material-name">{{ m.name }}</text>
              <text class="ap-material-type">{{ materialTypeLabel(m.materialType) }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import { getTaskSharePreview, clickMaterial, type TaskShareMaterial } from '@/api/automation'

const loading = ref(true)
const errorMsg = ref('')
const title = ref('')
const htmlContent = ref('')
const materials = ref<TaskShareMaterial[]>([])

const TYPE_LABELS: Record<string, string> = {
  article: '图文',
  poster: '海报',
  video: '视频',
  h5: 'H5',
  document: '文档',
}

function materialTypeLabel(type: string): string {
  return TYPE_LABELS[type] || type
}

/** 点击素材：记录点击 → 跳转素材详情 */
async function onMaterialClick(m: TaskShareMaterial) {
  // fire-and-forget 记录点击
  clickMaterial(m.traceCode).catch(() => {})
  // 跳转素材详情页
  Taro.navigateTo({ url: `/pages/marketing-material-share/index?traceCode=${m.traceCode}` })
}

onMounted(async () => {
  const instance = Taro.getCurrentInstance()
  // 从路由参数获取 shareToken，暂无参数时使用固定值
  const token = instance.router?.params?.token || 'mkt_task_17_6cf86e941e863a9c'

  try {
    const res = await getTaskSharePreview(token)
    title.value = res.title || ''
    htmlContent.value = res.contentHtml || ''
    materials.value = res.materials || []
  } catch {
    errorMsg.value = '内容加载失败，链接可能已过期'
  } finally {
    loading.value = false
  }
})
</script>

<style>
.ap-page {
  min-height: 100vh;
  background: #F5F7F9;
}

/* 状态容器 */
.ap-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 24px;
  padding: 40px;
  box-sizing: border-box;
}

.ap-status-text {
  font-size: 28px;
  color: #999;
}

.ap-error-text {
  color: #e74c3c;
}

/* 加载动画 */
.ap-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e0e0e0;
  border-top-color: #37ae7e;
  border-radius: 50%;
  animation: ap-spin 0.8s linear infinite;
}

@keyframes ap-spin {
  to { transform: rotate(360deg); }
}

/* 错误图标 */
.ap-error-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #e74c3c;
  color: #fff;
  font-size: 36px;
  font-weight: bold;
}

/* 头部 */
.ap-header {
  padding: 20px 24px;
  background: #fff;
  border-bottom: 1px solid #eee;
}

.ap-title {
  font-size: 32px;
  font-weight: 600;
  color: #1a1d24;
}

/* 滚动区 */
.ap-scroll {
  height: calc(100vh - 65px);
  padding: 24px;
  box-sizing: border-box;
}

/* 富文本 */
.ap-html-body {
  font-size: 28px;
  line-height: 1.8;
  color: #1a1d24;
}

/* 关联素材 */
.ap-materials {
  margin-top: 40px;
}

.ap-section-title {
  font-size: 30px;
  font-weight: 600;
  color: #1a1d24;
  display: block;
  margin-bottom: 20px;
}

.ap-material-card {
  display: flex;
  align-items: center;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  margin-bottom: 16px;
}

.ap-material-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
}

.ap-material-name {
  font-size: 28px;
  color: #1a1d24;
  flex: 1;
}

.ap-material-type {
  font-size: 24px;
  color: #37ae7e;
  background: #EDFAF5;
  padding: 4px 16px;
  border-radius: 4px;
  flex-shrink: 0;
  margin-left: 16px;
}
</style>
