<template>
  <view class="prod-detail-page">
    <NavBar title="商品详情" />

    <scroll-view class="prod-detail-scroll" scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <view v-if="loading" class="prod-detail-empty">
        <text class="prod-detail-empty-text">加载中...</text>
      </view>
      <view v-else-if="!product" class="prod-detail-empty">
        <text class="prod-detail-empty-text">产品不存在</text>
      </view>
      <template v-else>
      <view class="prod-detail-banner">
        <image class="prod-detail-banner-img" :src="product.coverImageUrl" mode="aspectFill" />
      </view>

      <view class="prod-detail-card">
        <view class="prod-detail-name-row">
          <text class="prod-detail-name">{{ product.name }}</text>
          <text class="prod-detail-price"><text class="prod-detail-price-symbol">￥</text><text class="prod-detail-price-int">{{ formatPrice(product.priceAmount).int }}</text><text class="prod-detail-price-dec">.{{ formatPrice(product.priceAmount).dec }}</text></text>
        </view>
        <view class="prod-detail-divider" />
        <text class="prod-detail-desc">{{ product.summary || '-' }}</text>
        <view class="prod-detail-divider" />
        <view class="prod-detail-attr-row">
          <text class="prod-detail-attr-label">产品编号</text>
          <text class="prod-detail-attr-value">{{ product.productNo || '-' }}</text>
        </view>
        <view class="prod-detail-divider" />
        <view class="prod-detail-attr-row">
          <text class="prod-detail-attr-label">产品分类</text>
          <text class="prod-detail-attr-value">{{ product.categoryName || '-' }}</text>
        </view>
        <view class="prod-detail-divider" />
        <view class="prod-detail-attr-row">
          <text class="prod-detail-attr-label">型号</text>
          <text class="prod-detail-attr-value">{{ product.model || '-' }}</text>
        </view>
        <view class="prod-detail-divider" />
        <view class="prod-detail-attr-row">
          <text class="prod-detail-attr-label">品牌</text>
          <text class="prod-detail-attr-value">{{ product.brandName || '-' }}</text>
        </view>
        <view class="prod-detail-divider" />
        <view class="prod-detail-attr-row">
          <text class="prod-detail-attr-label">单位</text>
          <text class="prod-detail-attr-value">{{ product.unit || '-' }}</text>
        </view>
      </view>

      <view v-if="product.parameters && product.parameters.length > 0" class="prod-detail-card">
        <text class="prod-detail-section-title">产品参数</text>
        <template v-for="(p, pi) in product.parameters" :key="p.id">
          <view class="prod-detail-divider" />
          <view class="prod-detail-param-row">
            <text class="prod-detail-param-label">{{ p.name }}</text>
            <text class="prod-detail-param-value">{{ p.value }}</text>
          </view>
        </template>
      </view>

      <view v-if="caseList.length > 0" class="prod-detail-card">
        <view class="prod-detail-tabs">
          <text class="prod-detail-tab prod-detail-tab--active">应用案例</text>
          <text class="prod-detail-tab-sep" />
          <text class="prod-detail-tab">使用说明</text>
          <text class="prod-detail-tab-sep" />
          <text class="prod-detail-tab">安装说明</text>
        </view>
        <view class="prod-detail-divider" />
        <view class="prod-detail-case-list">
          <view v-for="(item, ci) in caseList" :key="ci" class="prod-detail-case-item">
            <image class="prod-detail-case-img" :src="item.img" mode="aspectFill" />
            <view class="prod-detail-case-info">
              <text class="prod-detail-case-name">{{ item.name }}</text>
              <text class="prod-detail-case-desc">{{ item.desc }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="prod-detail-bottom-spacer" />
      </template>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { getProductDetail, type ProductDetailResponse } from '@/api/product'

const loading = ref(false)
const product = ref<ProductDetailResponse | null>(null)

function formatPrice(amount?: number) {
  if (!amount && amount !== 0) return { int: '-', dec: '00' }
  const yuan = (amount / 100).toFixed(2)
  const [int, dec] = yuan.split('.')
  return { int, dec }
}

const caseList = ref<{ name: string; desc: string; img: string }[]>([])

async function fetchDetail(id: number) {
  loading.value = true
  try {
    const data = await getProductDetail(id)
    product.value = data
    caseList.value = (data.mediaAssets || []).map(a => ({
      name: a.fileName || '',
      desc: '',
      img: a.fileUrl || '',
    }))
  } catch {
    product.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const pages = Taro.getCurrentPages()
  const current = pages[pages.length - 1]
  const id = current?.options?.id
  if (id) {
    fetchDetail(Number(id))
  } else {
    loading.value = false
  }
})
</script>

<style>
.prod-detail-page {
  min-height: 100vh;
  background: #F5F7F9;
}

.prod-detail-scroll {
  height: calc(100vh - 88rpx);
}

.prod-detail-banner {
  width: 750rpx;
  height: 750rpx;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-top: 22rpx;
}

.prod-detail-banner-img {
  width: 100%;
  height: 100%;
}

.prod-detail-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  margin: 24rpx 40rpx;
  padding: 28rpx;
}

.prod-detail-name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.prod-detail-name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.prod-detail-name {
  font-size: 32rpx;
  font-weight: 500;
  color: #1A1D24;
  flex: 1;
}

.prod-detail-price {
  font-size: 28rpx;
  font-weight: 700;
  color: #F53F3F;
  flex-shrink: 0;
}

.prod-detail-price-symbol {
  font-size: 22rpx;
}

.prod-detail-price-int {
  font-size: 34rpx;
}

.prod-detail-price-dec {
  font-size: 22rpx;
}

.prod-detail-divider {
  height: 1rpx;
  background: #E5E6EB;
  margin: 24rpx 0;
}

.prod-detail-desc {
  font-size: 28rpx;
  color: #505361;
  line-height: 44rpx;
}

.prod-detail-attr-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.prod-detail-attr-label {
  font-size: 28rpx;
  color: #62687D;
}

.prod-detail-attr-value {
  font-size: 28rpx;
  color: #1A1D24;
  text-align: right;
}

.prod-detail-section-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #1A1D24;
  display: block;
}

.prod-detail-param-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.prod-detail-param-label {
  font-size: 28rpx;
  color: #62687D;
  flex-shrink: 0;
  margin-right: 24rpx;
}

.prod-detail-param-value {
  font-size: 28rpx;
  color: #1A1D24;
  text-align: right;
  flex: 1;
}

.prod-detail-tabs {
  display: flex;
  align-items: center;
  gap: 32rpx;
}

.prod-detail-tab {
  font-size: 28rpx;
  color: #9292A5;
  font-weight: 400;
}

.prod-detail-tab--active {
  color: #37AE7E;
  font-weight: 500;
}

.prod-detail-tab-sep {
  width: 2rpx;
  height: 24rpx;
  background: #D9D9D9;
}

.prod-detail-case-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.prod-detail-case-item {
  display: flex;
  gap: 16rpx;
}

.prod-detail-case-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
  background: #F6F7FB;
  flex-shrink: 0;
}

.prod-detail-case-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  justify-content: center;
}

.prod-detail-case-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #1A1D24;
}

.prod-detail-case-desc {
  font-size: 24rpx;
  color: #62687D;
  line-height: 36rpx;
}

.prod-detail-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 200rpx 0;
}

.prod-detail-empty-text {
  font-size: 28rpx;
  color: #9292A5;
}

.prod-detail-bottom-spacer {
  height: 40rpx;
}
</style>
