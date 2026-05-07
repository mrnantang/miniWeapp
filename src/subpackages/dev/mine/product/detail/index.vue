<template>
  <view class="prod-detail-page">
    <NavBar title="商品详情" />

    <scroll-view class="prod-detail-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
      <view class="prod-detail-banner">
        <image class="prod-detail-banner-img" :src="product.img" mode="aspectFill" />
      </view>

      <view class="prod-detail-card">
        <view class="prod-detail-name-row">
          <text class="prod-detail-name">{{ product.name }}</text>
          <text class="prod-detail-price"><text class="prod-detail-price-symbol">￥</text><text class="prod-detail-price-int">{{ product.priceInt }}</text><text class="prod-detail-price-dec">.{{ product.priceDec }}</text></text>
        </view>
        <view class="prod-detail-divider" />
        <text class="prod-detail-desc">永不停产的方案，多台主机，多支自动单枪可实现分离、独立控制</text>
        <view class="prod-detail-divider" />
        <view class="prod-detail-attr-row">
          <text class="prod-detail-attr-label">产品编号</text>
          <text class="prod-detail-attr-value">bB9991902001</text>
        </view>
        <view class="prod-detail-divider" />
        <view class="prod-detail-attr-row">
          <text class="prod-detail-attr-label">产品分类</text>
          <text class="prod-detail-attr-value">E7 手动喷枪</text>
        </view>
        <view class="prod-detail-divider" />
        <view class="prod-detail-attr-row">
          <text class="prod-detail-attr-label">型号</text>
          <text class="prod-detail-attr-value">E7</text>
        </view>
        <view class="prod-detail-divider" />
        <view class="prod-detail-attr-row">
          <text class="prod-detail-attr-label">品牌</text>
          <text class="prod-detail-attr-value">德贝尔</text>
        </view>
        <view class="prod-detail-divider" />
        <view class="prod-detail-attr-row">
          <text class="prod-detail-attr-label">单位</text>
          <text class="prod-detail-attr-value">套</text>
        </view>
      </view>

      <view class="prod-detail-card">
        <text class="prod-detail-section-title">产品参数</text>
        <view class="prod-detail-divider" />
        <view class="prod-detail-param-row">
          <text class="prod-detail-param-label">输入电压</text>
          <text class="prod-detail-param-value">12VDC</text>
        </view>
        <view class="prod-detail-divider" />
        <view class="prod-detail-param-row">
          <text class="prod-detail-param-label">输出电压</text>
          <text class="prod-detail-param-value">0-100KV可调</text>
        </view>
        <view class="prod-detail-divider" />
        <view class="prod-detail-param-row">
          <text class="prod-detail-param-label">输出电流</text>
          <text class="prod-detail-param-value">0-120uA可调</text>
        </view>
        <view class="prod-detail-divider" />
        <view class="prod-detail-param-row">
          <text class="prod-detail-param-label">防护等级</text>
          <text class="prod-detail-param-value">防水级</text>
        </view>
        <view class="prod-detail-divider" />
        <view class="prod-detail-param-row">
          <text class="prod-detail-param-label">重量</text>
          <text class="prod-detail-param-value">610克/支</text>
        </view>
        <view class="prod-detail-divider" />
        <view class="prod-detail-param-row">
          <text class="prod-detail-param-label">尺寸</text>
          <text class="prod-detail-param-value">440*60*42mm</text>
        </view>
        <view class="prod-detail-divider" />
        <view class="prod-detail-param-row">
          <text class="prod-detail-param-label">静电线长度</text>
          <text class="prod-detail-param-value">15米/条</text>
        </view>
        <view class="prod-detail-divider" />
        <view class="prod-detail-param-row">
          <text class="prod-detail-param-label">一次上粉率</text>
          <text class="prod-detail-param-value">平板工件出粉量每分钟为750g，一次上粉率可达85%</text>
        </view>
        <view class="prod-detail-divider" />
        <view class="prod-detail-param-row">
          <text class="prod-detail-param-label">扁喷嘴选配</text>
          <text class="prod-detail-param-value">扁嘴4.0mm</text>
        </view>
      </view>

      <view class="prod-detail-card">
        <view class="prod-detail-tabs">
          <text class="prod-detail-tab prod-detail-tab--active">应用案例</text>
          <text class="prod-detail-tab-sep" />
          <text class="prod-detail-tab">使用说明</text>
          <text class="prod-detail-tab-sep" />
          <text class="prod-detail-tab">安装说明</text>
        </view>
        <view class="prod-detail-divider" />
        <view class="prod-detail-case-list">
          <view v-for="(item, idx) in caseList" :key="idx" class="prod-detail-case-item">
            <image class="prod-detail-case-img" :src="item.img" mode="aspectFill" />
            <view class="prod-detail-case-info">
              <text class="prod-detail-case-name">{{ item.name }}</text>
              <text class="prod-detail-case-desc">{{ item.desc }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="prod-detail-bottom-spacer" />
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import NavBar from '@/components/NavBar.vue'

const product = ref({
  name: 'V12智能数控喷粉枪',
  priceInt: '2888',
  priceDec: '00',
  img: '',
})

const caseList = ref([
  { name: 'E7手动基本操作说明', desc: '2018年10月德贝尔开始进入佛山市场，在佛山南海', img: '' },
  { name: 'E7手动基本操作说明', desc: '2018年10月德贝尔开始进入佛山市场，在佛山南海', img: '' },
  { name: 'E7手动基本操作说明', desc: '2018年10月德贝尔开始进入佛山市场，在佛山南海', img: '' },
])
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

.prod-detail-bottom-spacer {
  height: 40rpx;
}
</style>
