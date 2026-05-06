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
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import iconSearch from '@/assets/dev/icon-search.png'
import iconFilter from '@/assets/dev/icon-filter.png'
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

const onFilter = () => {
  Taro.showToast({ title: '筛选', icon: 'none' })
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
  border: 2rpx solid #CEF0E2;
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
</style>
