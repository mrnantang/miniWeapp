<template>
  <view class="material-page">
    <navBar title="内容素材库" />
    <view style="width: 100%;height: 36rpx;"></view>
    <view style="width: 100%;padding:40rpx;background: #FFFFFF;box-sizing: border-box;">
      <view class="leads-search-row">
        <view class="leads-search-box">
          <input class="leads-search-input" v-model="keyword" placeholder="请输入搜索"
            placeholder-style="color:#9292A5;font-size:30rpx" />
          <image class="leads-search-icon" :src="iconSearch" mode="aspectFit" />
        </view>
        <view class="leads-btn" @tap="showFilter = true">
          <image :src="iconFilter" mode="aspectFit" />
        </view>
        <view class="leads-btn" @tap="goAdd">
          <image :src="iconAdd" mode="aspectFit" />
        </view>
      </view>

      <scroll-view class="material-tabs-scroll" scroll-x="true" :enhanced="true" :show-scrollbar="false">
        <view class="material-tabs">
          <view v-for="tab in tabs" :key="tab" class="material-tab"
            :class="{ 'material-tab--active': activeTab === tab }" @tap="activeTab = tab">
            <text class="material-tab-text" :class="{ 'material-tab-text--active': activeTab === tab }">{{ tab }}</text>
          </view>
        </view>
      </scroll-view>

      <scroll-view class="material-cats-scroll" scroll-x="true" :enhanced="true" :show-scrollbar="false">
        <view class="material-cats">
          <view v-for="cat in cats" :key="cat" class="material-cat"
            :class="{ 'material-cat--active': activeCat === cat }" @tap="activeCat = cat">
            <text class="material-cat-text" :class="{ 'material-cat-text--active': activeCat === cat }">{{ cat }}</text>
          </view>
        </view>
      </scroll-view>

      <scroll-view class="material-list" scroll-y :enhanced="true" :show-scrollbar="false">
        <view v-for="(item, idx) in materialList" :key="idx" class="material-card">
          <view class="material-card-top">
            <view class="material-thumb" />
            <view class="material-card-right">
              <view class="material-title-row">
                <text class="material-title">秋季新品发布海报</text>
                <view class="material-tag">
                  <text class="material-tag-text">图文</text>
                </view>
              </view>
              <text class="material-desc">秋季新品发布海报秋季新品发布海报秋季新品发布海报秋季新品发，布海报秋季新品发布海报秋季</text>
            </view>
          </view>
          <view class="material-card-actions">
            <view class="material-action-btn material-action-btn--delete">
              <text class="material-action-btn-text material-action-btn-text--delete">删除</text>
            </view>
            <view class="material-action-btn material-action-btn--edit">
              <text class="material-action-btn-text">编辑</text>
            </view>
            <view class="material-action-btn material-action-btn--edit">
              <text class="material-action-btn-text">查看</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="material-bottom-bar">
      <view class="material-bottom-btn">
        <text class="material-bottom-btn-text">编辑素材文件夹</text>
      </view>
      <view class="material-bottom-btn">
        <text class="material-bottom-btn-text">素材类型管理</text>
      </view>
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
                <view v-for="s in tabs2" :key="s" class="org-tag" :class="{ 'org-tag--active': filterType === s }"
                  @tap="filterType = s; showFilter = false">
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

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import iconSearch from '@/assets/dev/icon-search.png'
import iconFilter from '@/assets/dev/icon-filter.png'
import iconAdd from '@/assets/dev/icon-add.png'
import navBar from '@/components/NavBar.vue'

const activeTab = ref('应用案例')
const activeCat = ref('应用案例1')
const tabs = ['应用案例', '使用说明', '安装说明', '产品详解', '公司简介', '开发公海', '大公海']
const tabs2 = ['全部', '图文', '视频', '海报', '资料']
const cats = ['应用案例1', '应用案例2', '应用案例3', '重点客户跟进情况']

const materialList = ref([1, 2, 3, 4, 5, 6])

const keyword = ref('')
const showFilter = ref(false)
const filterType = ref('全部')

const goAdd = () => {
  Taro.navigateTo({ url: '/subpackages/ops/mine/material/add/index' })
}
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
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}
.material-card-top {
  display: flex;
  gap: 20rpx;
  align-items: center;
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
.material-card-actions {
  display: flex;
  gap: 16rpx;
}
.material-action-btn {
  flex: 1;
  height: 64rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.material-action-btn--delete {
  background: #FFF0F0;
  border: 1rpx solid #FFD8D8;
}
.material-action-btn--edit {
  background: #FFFFFF;
  border: 1rpx solid #37AE7E;
}
.material-action-btn-text {
  font-size: 28rpx;
  color: #37AE7E;
}
.material-action-btn-text--delete {
  color: #F53F3F;
}

.material-bottom-bar {
  display: flex;
  gap: 28rpx;
  padding: 16rpx 40rpx calc(16rpx + env(safe-area-inset-bottom));
  background: #FFFFFF;
}
.material-bottom-btn {
  flex: 1;
  height: 72rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #EFFDF7;
  border: 2rpx solid #5CC79C;
}
.material-bottom-btn-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #5CC79C;
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
