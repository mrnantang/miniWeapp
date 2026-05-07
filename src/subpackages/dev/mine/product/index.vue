<template>
  <view class="product-page">
    <NavBar title="产品中心" />

    <view class="product-search-row">
      <view class="product-search-box">
        <input class="product-search-input" placeholder="请输入产品名称/产品编号" placeholder-style="color:#9292A5;font-size:26rpx" />
        <image class="product-search-icon" :src="iconSearchProduct" mode="aspectFit" />
      </view>
      <view class="product-filter-btn" @tap="onFilter">
        <image  :src="iconFilterProduct" mode="aspectFit" />
      </view>
    </view>

    <nut-popup v-model:visible="showFilter" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0', height: '1022rpx' }" :z-index="2000" safe-area-inset-bottom>
      <view class="filter-popup">
        <view class="filter-header">
          <text class="filter-header-title">全部筛选</text>
        </view>
        <view class="filter-body">
          <view class="filter-sidebar">
            <view class="filter-sidebar-item" :class="{ 'filter-sidebar-item--active': filterIdx === 0 }" @tap="filterIdx = 0">
              <text class="filter-sidebar-text" :class="{ 'filter-sidebar-text--active': filterIdx === 0 }">产品分类</text>
            </view>
            <view class="filter-sidebar-item" :class="{ 'filter-sidebar-item--active': filterIdx === 1 }" @tap="filterIdx = 1">
              <text class="filter-sidebar-text" :class="{ 'filter-sidebar-text--active': filterIdx === 1 }">品牌</text>
            </view>
            <view class="filter-sidebar-item" :class="{ 'filter-sidebar-item--active': filterIdx === 2 }" @tap="filterIdx = 2">
              <text class="filter-sidebar-text" :class="{ 'filter-sidebar-text--active': filterIdx === 2 }">状态</text>
            </view>
            <view class="filter-sidebar-item" :class="{ 'filter-sidebar-item--active': filterIdx === 3 }" @tap="filterIdx = 3">
              <text class="filter-sidebar-text" :class="{ 'filter-sidebar-text--active': filterIdx === 3 }">价格范围</text>
            </view>
          </view>
          <scroll-view class="filter-content" scroll-y :enhanced="true" :show-scrollbar="false">
            <view v-if="filterIdx === 0" class="filter-tags-section">
              <text class="filter-section-title">一级分类</text>
              <view class="filter-tag-row">
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags['prodCat1'].includes('全部') }" @tap="toggleFilterTag('prodCat1', '全部')">
                  <text class="filter-tag-text" :class="{ 'filter-tag-text--active': filterTags['prodCat1'].includes('全部') }">全部</text>
                </view>
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags['prodCat1'].includes('手动') }" @tap="toggleFilterTag('prodCat1', '手动')">
                  <text class="filter-tag-text" :class="{ 'filter-tag-text--active': filterTags['prodCat1'].includes('手动') }">手动</text>
                </view>
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags['prodCat1'].includes('自动') }" @tap="toggleFilterTag('prodCat1', '自动')">
                  <text class="filter-tag-text" :class="{ 'filter-tag-text--active': filterTags['prodCat1'].includes('自动') }">自动</text>
                </view>
              </view>
              <text class="filter-section-title">二级分类</text>
              <view class="filter-tag-row">
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags['prodCat2'].includes('全部') }" @tap="toggleFilterTag('prodCat2', '全部')">
                  <text class="filter-tag-text" :class="{ 'filter-tag-text--active': filterTags['prodCat2'].includes('全部') }">全部</text>
                </view>
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags['prodCat2'].includes('E7手动喷粉枪') }" @tap="toggleFilterTag('prodCat2', 'E7手动喷粉枪')">
                  <text class="filter-tag-text" :class="{ 'filter-tag-text--active': filterTags['prodCat2'].includes('E7手动喷粉枪') }">E7手动喷粉枪</text>
                </view>
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags['prodCat2'].includes('自动') }" @tap="toggleFilterTag('prodCat2', '自动')">
                  <text class="filter-tag-text" :class="{ 'filter-tag-text--active': filterTags['prodCat2'].includes('自动') }">自动</text>
                </view>
              </view>
            </view>
            <view v-if="filterIdx === 1" class="filter-tags-section">
              <text class="filter-section-title">审批</text>
              <view class="filter-tag-row">
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags['brand'].includes('全部') }" @tap="toggleFilterTag('brand', '全部')">
                  <text class="filter-tag-text" :class="{ 'filter-tag-text--active': filterTags['brand'].includes('全部') }">全部</text>
                </view>
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags['brand'].includes('德贝尔') }" @tap="toggleFilterTag('brand', '德贝尔')">
                  <text class="filter-tag-text" :class="{ 'filter-tag-text--active': filterTags['brand'].includes('德贝尔') }">德贝尔</text>
                </view>
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags['brand'].includes('瑞的贝尔额') }" @tap="toggleFilterTag('brand', '瑞的贝尔额')">
                  <text class="filter-tag-text" :class="{ 'filter-tag-text--active': filterTags['brand'].includes('瑞的贝尔额') }">瑞的贝尔额</text>
                </view>
              </view>
            </view>
            <view v-if="filterIdx === 2" class="filter-tags-section">
              <text class="filter-section-title">状态</text>
              <view class="filter-tag-row">
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags['status'].includes('全部') }" @tap="toggleFilterTag('status', '全部')">
                  <text class="filter-tag-text" :class="{ 'filter-tag-text--active': filterTags['status'].includes('全部') }">全部</text>
                </view>
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags['status'].includes('已上架') }" @tap="toggleFilterTag('status', '已上架')">
                  <text class="filter-tag-text" :class="{ 'filter-tag-text--active': filterTags['status'].includes('已上架') }">已上架</text>
                </view>
              </view>
              <view class="filter-tag-row">
                <view class="filter-tag" :class="{ 'filter-tag--active': filterTags['status'].includes('已下架') }" @tap="toggleFilterTag('status', '已下架')">
                  <text class="filter-tag-text" :class="{ 'filter-tag-text--active': filterTags['status'].includes('已下架') }">已下架</text>
                </view>
              </view>
            </view>
            <view v-if="filterIdx === 3" class="filter-tags-section">
              <text class="filter-section-title">价格范围</text>
              <view class="filter-price-row">
                <view class="filter-price-box">
                  <input class="filter-price-box-input" v-model="priceRange.min" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:26rpx" />
                </view>
                <view class="filter-price-sep" />
                <view class="filter-price-box">
                  <input class="filter-price-box-input" v-model="priceRange.max" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:26rpx" />
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
        <view class="filter-footer">
          <view class="filter-footer-btn filter-footer-clear" @tap="clearFilter">
            <text class="filter-footer-clear-text">清空选择</text>
          </view>
          <view class="filter-footer-btn filter-footer-submit" @tap="onFilterConfirm">
            <text class="filter-footer-submit-text">确认</text>
          </view>
        </view>
      </view>
    </nut-popup>

    <scroll-view class="product-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
      <view class="product-list">
        <view v-for="(item, idx) in productList" :key="idx" class="product-card" @tap="onProductTap(item)">
          <view class="product-img-wrap">
            <image class="product-img" :src="item.img" mode="aspectFill" />
          </view>
          <view class="product-info">
            <text class="product-name">{{ item.name }}</text>
            <text class="product-desc">{{ item.desc }}</text>
            <text class="product-price">￥<text class="product-price-int">{{ item.priceInt }}</text><text class="product-price-dec">.{{ item.priceDec }}</text></text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Taro from '@tarojs/taro'
import { Popup } from '@nutui/nutui-taro'
import NavBar from '@/components/NavBar.vue'
import iconSearchProduct from '@/assets/dev/icon-search-product.svg'
import iconFilterProduct from '@/assets/dev/icon-filter-product.svg'

const productList = ref([
  { name: 'V12智能数控喷粉枪', desc: '这部分是产品简介，这是文本', priceInt: '2888', priceDec: '00', img: '' },
  { name: 'E7静电自动喷粉枪/自动喷粉机', desc: '这部分是产品简介，这是文本', priceInt: '2888', priceDec: '00', img: '' },
  { name: 'V16高端定制喷粉枪', desc: '这部分是产品简介，这是文本', priceInt: '2888', priceDec: '00', img: '' },
  { name: 'E7静电自动喷粉枪/自动喷粉机', desc: '这部分是产品简介，这是文本', priceInt: '2888', priceDec: '00', img: '' },
  { name: 'V16高端定制喷粉枪', desc: '这部分是产品简介，这是文本', priceInt: '2888', priceDec: '00', img: '' },
  { name: 'E7静电自动喷粉枪/自动喷粉机', desc: '这部分是产品简介，这是文本', priceInt: '2888', priceDec: '00', img: '' },
  { name: 'E7静电自动喷粉枪/自动喷粉机', desc: '这部分是产品简介，这是文本', priceInt: '2888', priceDec: '00', img: '' },
])

const showFilter = ref(false)
const filterIdx = ref(0)

const filterTags = reactive({
  prodCat1: ['全部'],
  prodCat2: ['全部'],
  brand: ['全部'],
  status: ['全部'],
})
const priceRange = reactive({
  min: '',
  max: '',
})

const toggleFilterTag = (key, tag) => {
  const arr = filterTags[key]
  if (tag === '全部') {
    filterTags[key] = ['全部']
    return
  }
  const idx = arr.indexOf(tag)
  if (arr.includes('全部')) {
    filterTags[key] = [tag]
  } else if (idx >= 0) {
    arr.splice(idx, 1)
    if (arr.length === 0) {
      filterTags[key] = ['全部']
    }
  } else {
    arr.push(tag)
  }
}

const onFilter = () => {
  showFilter.value = true
}

const clearFilter = () => {
  showFilter.value = false
}

const onFilterConfirm = () => {
  showFilter.value = false
}

const onProductTap = (item) => {
  Taro.navigateTo({ url: '/subpackages/dev/mine/product/detail/index' })
}
</script>

<style>
.product-page {
  min-height: 100vh;
  background: #F5F7F9;
}

.product-search-row {
  display: flex;
  gap: 20rpx;
  padding: 24rpx 40rpx;
}

.product-search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 12rpx 20rpx;
  background: #FFFFFF;
  border: 2rpx solid #E4E9EF;
  border-radius: 12rpx;
  height: 68rpx;
  box-sizing: border-box;
}

.product-search-icon {
  width: 36rpx;
  height: 36rpx;
  flex-shrink: 0;
}

.product-search-input {
  flex: 1;
  font-size: 26rpx;
  color: #1A1D24;
}

.product-filter-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68rpx;
  height: 68rpx;
  background: #EDFAF5;
  border-radius: 12rpx;
  flex-shrink: 0;
}

.product-scroll {
  height: calc(100vh - 88rpx - 116rpx);
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding: 0 40rpx 40rpx;
}

.product-card {
  display: flex;
  background: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
}

.product-img-wrap {
  width: 180rpx;
  height: 180rpx;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-img {
  width: 100%;
  height: 100%;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20rpx 24rpx;
}

.product-name {
  font-size: 30rpx;
  font-weight: 500;
  color: #23252C;
}

.product-desc {
  font-size: 24rpx;
  color: #505361;
}

.product-price {
  font-size: 22rpx;
  font-weight: 700;
  color: #F53F3F;
}

.product-price-int {
  font-size: 28rpx;
}

.product-price-dec {
  font-size: 22rpx;
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
  position: relative;
}

.filter-header-title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 500;
  color: #1A1D24;
}

.filter-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.filter-sidebar {
  width: 260rpx;
  background: #F6F7FB;
  flex-shrink: 0;
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
}

.filter-sidebar-text--active {
  color: #37AE7E;
}

.filter-content {
  flex: 1;
  background: #FFFFFF;
  padding: 24rpx;
}

.filter-tags-section {
  padding: 0;
}

.filter-section-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #1A1D24;
  display: block;
  margin: 6rpx 0 24rpx 0;
}

.filter-section-title:first-child {
  margin-top: 0;
}

.filter-tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  margin-bottom: 24rpx;
}

.filter-tag {
  width: 208rpx;
  padding: 12rpx 10rpx;
  background: #F6F7FB;
  border-radius: 6rpx;
  box-sizing: border-box;
  text-align: center;
}

.filter-tag--active {
  background: #EDFAF5;
}

.filter-tag-text {
  font-size: 26rpx;
  color: #62687D;
}

.filter-tag-text--active {
  color: #37AE7E;
}

.filter-price-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.filter-price-box {
  flex: 1;
  height: 60rpx;
  background: #F6F7FB;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-price-box-input {
  width: 100%;
  height: 100%;
  font-size: 26rpx;
  color: #1A1D24;
  text-align: center;
  background: transparent;
  border: none;
  outline: none;
}

.filter-price-sep {
  width: 8rpx;
  height: 2rpx;
  background: #1A1D24;
  flex-shrink: 0;
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
  background: linear-gradient(270deg, rgba(102,220,166,1) 0%, rgba(88,188,150,1) 100%);
}

.filter-footer-submit-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #FFFFFF;
}
</style>
