<template>
  <view class="material-page">
    <navBar title="内容素材库" />
    <view style="width: 100%;height: 36rpx;"></view>
    <view style="width: 100%;padding:40rpx;background: #FFFFFF;box-sizing: border-box;">
      <view class="leads-search-row">
        <view class="leads-search-box">
          <input class="leads-search-input" v-model="keyword" placeholder="请输入搜索"
            placeholder-style="color:#9292A5;font-size:30rpx" @input="onSearchInput" />
          <image class="leads-search-icon" :src="iconSearch" mode="aspectFit" />
        </view>
        <view class="leads-btn" @tap="showFilter = true">
          <image :src="iconFilter" mode="aspectFit" />
        </view>
      </view>

      <scroll-view class="material-tabs-scroll" scroll-x="true" :enhanced="true" :show-scrollbar="false">
        <view class="material-tabs">
          <view class="material-tab" :class="{ 'material-tab--active': activeFolderId === 0 }" @tap="onFolderTap(null)">
            <text class="material-tab-text" :class="{ 'material-tab-text--active': activeFolderId === 0 }">全部</text>
          </view>
          <view v-for="folder in folders" :key="folder.id" class="material-tab"
            :class="{ 'material-tab--active': activeFolderId === folder.id }" @tap="onFolderTap(folder)">
            <text class="material-tab-text" :class="{ 'material-tab-text--active': activeFolderId === folder.id }">{{ folder.name }}</text>
          </view>
        </view>
      </scroll-view>

      <scroll-view v-if="currentChildFolders.length > 0" class="material-cats-scroll" scroll-x="true" :enhanced="true" :show-scrollbar="false">
        <view class="material-cats">
          <view
            v-for="child in currentChildFolders"
            :key="child.id"
            class="material-cat"
            :class="{ 'material-cat--active': activeChildFolderId === child.id }"
            @tap="onChildFolderTap(child)"
          >
            <text class="material-cat-text" :class="{ 'material-cat-text--active': activeChildFolderId === child.id }">{{ child.name }}</text>
          </view>
        </view>
      </scroll-view>

      <scroll-view class="material-scroll" scroll-y="true" :enhanced="true" :show-scrollbar="false" @scrolltolower="onLoadMore">
        <view v-if="loading && materialList.length === 0" class="material-empty">
          <text class="material-empty-text">加载中...</text>
        </view>
        <view v-else class="material-list">
          <view v-for="item in materialList" :key="item.id" class="material-card" @tap="onView(item)">
            <view class="material-card-top">
              <image class="material-thumb" :src="item.coverUrl" mode="aspectFill" />
              <view class="material-card-right">
                <view class="material-title-row">
                  <text class="material-title">{{ item.name }}</text>
                  <view class="material-tag">
                    <text class="material-tag-text">{{ MATERIAL_TYPE_MAP[item.materialType] || item.materialType }}</text>
                  </view>
                </view>
                <text class="material-desc">{{ item.summary || '-' }}</text>
              </view>
            </view>
          </view>
        </view>
        <view v-if="loading && materialList.length > 0" class="material-empty">
          <text class="material-empty-text">加载更多...</text>
        </view>
        <view v-if="!loading && materialList.length === 0" class="material-empty">
          <text class="material-empty-text">暂无素材</text>
        </view>
        <text v-if="!hasMore && materialList.length > 0" class="material-more">没有更多了</text>
      </scroll-view>
    </view>

    <nut-popup v-model:visible="showFilter" position="bottom"
      :style="{ borderRadius: '24rpx 24rpx 0 0', height: '680rpx' }" :z-index="2000" safe-area-inset-bottom>
      <view class="filter-popup">
        <view class="filter-header">
          <text class="filter-header-title">全部筛选</text>
        </view>
        <view class="filter-body">
          <scroll-view class="filter-sidebar" scroll-y :enhanced="true" :show-scrollbar="false">
            <view class="filter-sidebar-item filter-sidebar-item--active">
              <text class="filter-sidebar-text filter-sidebar-text--active">素材类型</text>
            </view>
          </scroll-view>
          <scroll-view class="filter-content" scroll-y :enhanced="true" :show-scrollbar="false">
            <view class="org-tags">
              <view class="org-tag-row">
                <view v-for="s in typeOptions" :key="s" class="org-tag" :class="{ 'org-tag--active': filterType === s }"
                  @tap="onFilterTap(s)">
                  <text class="org-tag-text" :class="{ 'org-tag-text--active': filterType === s }">{{ s }}</text>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
        <view class="filter-footer">
          <view class="filter-footer-btn filter-footer-clear" @tap="filterType = '全部'">
            <text class="filter-footer-clear-text">清空选择</text>
          </view>
          <view class="filter-footer-btn filter-footer-submit" @tap="showFilter = false">
            <text class="filter-footer-submit-text">确认</text>
          </view>
        </view>
      </view>
    </nut-popup>

  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Taro, { useDidShow } from '@tarojs/taro'
import iconSearch from '@/assets/dev/icon-search.png'
import iconFilter from '@/assets/dev/icon-filter.png'
import navBar from '@/components/NavBar.vue'
import { getUserInfo } from '@/utils/storage'
import {
  getFolderTree,
  getMaterialList,
  MATERIAL_TYPE_MAP,
  type FolderNode,
  type MaterialItem,
} from '@/api/material'

const keyword = ref('')
const showFilter = ref(false)
const filterType = ref('全部')
const typeOptions = ['全部', '图文', '视频', '海报', '资料']
const TYPE_REVERSE_MAP: Record<string, string> = {
  '全部': '',
  '图文': 'article',
  '海报': 'poster',
  '视频': 'video',
  '资料': 'document',
}

// 文件夹
const folders = ref<FolderNode[]>([])
const activeFolderId = ref<number>(0)
const activeChildFolderId = ref<number>(0)

const currentChildFolders = ref<FolderNode[]>([])

function updateChildFolders() {
  if (activeFolderId.value === 0) {
    currentChildFolders.value = []
  } else {
    const parent = folders.value.find(f => f.id === activeFolderId.value)
    currentChildFolders.value = parent?.children || []
  }
}

// 列表
const materialList = ref<MaterialItem[]>([])
const loading = ref(false)
const page = ref(1)
const pageSize = 10
const hasMore = ref(true)
const total = ref(0)

let searchTimer: ReturnType<typeof setTimeout> | null = null

async function fetchFolders() {
  try {
    const data = await getFolderTree()
    folders.value = data || []
    updateChildFolders()
  } catch {
    // ignore
  }
}

async function fetchList(reset = false) {
  if (loading.value) return
  if (reset) {
    page.value = 1
    materialList.value = []
    hasMore.value = true
  }
  if (!hasMore.value && !reset) return
  loading.value = true
  try {
    const userInfo = getUserInfo<{ companyId: number; departmentId: number }>()
    const params: Record<string, unknown> = {
      page: page.value,
      pageSize,
      companyId: userInfo?.companyId,
    }
    if (keyword.value) params.name = keyword.value
    if (activeChildFolderId.value > 0) {
      params.folderId = activeChildFolderId.value
    } else if (activeFolderId.value > 0) {
      params.folderId = activeFolderId.value
    }
    if (filterType.value !== '全部') {
      params.types = [TYPE_REVERSE_MAP[filterType.value]]
    }
    const res = await getMaterialList(params)
    if (reset) {
      materialList.value = res.items || []
    } else {
      materialList.value = [...materialList.value, ...(res.items || [])]
    }
    total.value = res.total
    hasMore.value = materialList.value.length < res.total
  } catch {
    // ignore
  } finally {
    loading.value = false
  }
}

function onSearchInput() {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    fetchList(true)
  }, 300)
}

function onLoadMore() {
  if (loading.value || !hasMore.value) return
  page.value++
  fetchList(false)
}

function onFolderTap(folder: FolderNode | null) {
  activeFolderId.value = folder ? folder.id : 0
  activeChildFolderId.value = 0
  updateChildFolders()
  fetchList(true)
}

function onChildFolderTap(child: FolderNode) {
  activeChildFolderId.value = child.id
  fetchList(true)
}

function onFilterTap(type: string) {
  filterType.value = type
  showFilter.value = false
  fetchList(true)
}

function onFilterConfirm() {
  showFilter.value = false
  fetchList(true)
}

function onView(item: MaterialItem) {
  Taro.navigateTo({ url: `/subpackages/ops/mine/material/detail/index?id=${item.id}&companyId=${item.companyId}` })
}

useDidShow(() => {
  fetchFolders()
  fetchList(true)
})
</script>

<style>
.material-page {
  min-height: 100vh;
  background: #F5F7F9;
}

.leads-search-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  background: #FFFFFF;
}

.leads-search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
  height: 68rpx;
  background: #FFFFFF;
  border: 2rpx solid #E4E9EF;
  border-radius: 12rpx;
  padding: 0 20rpx;
}

.leads-search-input {
  flex: 1;
  font-size: 30rpx;
  height: 44rpx;
  line-height: 44rpx;
}

.leads-search-icon {
  width: 36rpx;
  height: 36rpx;
  flex-shrink: 0;
}

.leads-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68rpx;
  height: 68rpx;
  background: #EDFAF5;
  border-radius: 12rpx;
  flex-shrink: 0;
}

.leads-btn image {
  width: 68rpx;
  height: 68rpx;
}

.material-tabs-scroll {
  background: #FFFFFF;
  border-bottom: 1rpx solid #E6EBF0;
  white-space: nowrap;
}

.material-tabs {
  display: inline-flex;
}

.material-tab {
  display: inline-flex;
  flex-shrink: 0;
  padding: 30rpx 0;
  margin-right: 40rpx;
  border-bottom: 4rpx solid transparent;
}

.material-tab:last-child {
  margin-right: 0;
}

.material-tab--active {
  border-bottom-color: #37AE7E;
}

.material-tab-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #9292A5;
  white-space: nowrap;
}

.material-tab-text--active {
  color: #1A1D24;
}

.material-cats-scroll {
  background: #FFFFFF;
  white-space: nowrap;
  padding: 24rpx 0;
}

.material-cats {
  display: inline-flex;
  gap: 12rpx;
}

.material-cat {
  display: inline-flex;
  flex-shrink: 0;
  padding: 10rpx 24rpx;
  border-radius: 6rpx;
  background: #FFFFFF;
  border: 2rpx solid #E8EAF3;
}

.material-cat--active {
  background: #EDFAF5;
  border-color: #B1E9D3;
}

.material-cat-text {
  font-size: 26rpx;
  color: #62687D;
  white-space: nowrap;
}

.material-cat-text--active {
  color: #37AE7E;
}

.material-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.material-card {
  background: #FBFBFB;
  border: 2rpx solid #ECEBEB;
  border-radius: 16rpx;
  padding: 28rpx;
}
.material-card-top {
  display: flex;
  gap: 20rpx;
  align-items: center;
}
.material-scroll {
  height: calc(100vh - 88rpx - 36rpx - 116rpx - 90rpx - 60rpx);
}
.material-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
}
.material-empty-text {
  font-size: 28rpx;
  color: #9292A5;
}
.material-more {
  display: block;
  text-align: center;
  font-size: 24rpx;
  color: #9292A5;
  padding: 40rpx 0 80rpx;
}
.material-thumb {
  width: 96rpx;
  height: 96rpx;
  background: #E8EAF3;
  border-radius: 6rpx;
  flex-shrink: 0;
}
.material-card-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.material-title-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  justify-content: space-between;
}
.material-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #23252C;
}
.material-tag {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rpx 12rpx;
  height: 40rpx;
  background: #ECF2F9;
  border-radius: 6rpx;
}
.material-tag-text {
  font-size: 24rpx;
  color: #62687D;
}
.material-desc {
  width: 480rpx;
  font-size: 28rpx;
  color: #62687D;
  line-height: 44rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.filter-popup {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.filter-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24rpx 40rpx;
}

.filter-header-title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
  color: #1A1D24;
}

.filter-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.filter-sidebar {
  width: 220rpx;
  background: #F6F7FB;
  flex-shrink: 0;
  height: 100%;
}

.filter-sidebar-item {
  padding: 20rpx 40rpx;
}

.filter-sidebar-item--active {
  background: #FFFFFF;
  border-radius: 6rpx;
}

.filter-sidebar-text {
  font-size: 26rpx;
  font-weight: 500;
  color: #62687D;
  white-space: nowrap;
}

.filter-sidebar-text--active {
  color: #37AE7E;
}

.filter-content {
  flex: 1;
  background: #FFFFFF;
  padding: 24rpx;
}

.org-tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
}

.org-tag {
  width: calc(50% - 12rpx);
  padding: 12rpx 10rpx;
  background: #F6F7FB;
  border-radius: 6rpx;
  text-align: center;
  box-sizing: border-box;
}

.org-tag--active {
  background: #EDFAF5;
}

.org-tag-text {
  font-size: 26rpx;
  color: #62687D;
}

.org-tag-text--active {
  color: #37AE7E;
}

.filter-footer {
  display: flex;
  gap: 28rpx;
  padding: 20rpx 40rpx 0;
}

.filter-footer-btn {
  flex: 1;
  height: 76rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-footer-clear {
  background: #EFFDF7;
  border: 2rpx solid #5CC79C;
}

.filter-footer-clear-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #5CC79C;
}

.filter-footer-submit {
  background: linear-gradient(270deg, rgba(102, 220, 166, 1) 0%, rgba(88, 188, 150, 1) 100%);
}

.filter-footer-submit-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #FFFFFF;
}

</style>
