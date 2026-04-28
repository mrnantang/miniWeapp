<template>
  <view>
    <view class="mine-page">
      <view class="mine-header">
        <view class="avatar">
          <text class="avatar-text">开</text>
        </view>
        <view class="user-info">
          <text class="user-name">开发端用户</text>
          <text class="user-role">开发端</text>
        </view>
      </view>
      <view class="menu-list">
        <view class="menu-item">
          <text class="menu-label">修改密码</text>
          <text class="menu-arrow">></text>
        </view>
        <view class="menu-item">
          <text class="menu-label">系统设置</text>
          <text class="menu-arrow">></text>
        </view>
        <view class="menu-item">
          <text class="menu-label">开发工具</text>
          <text class="menu-arrow">></text>
        </view>
        <view class="menu-item">
          <text class="menu-label">退出登录</text>
          <text class="menu-arrow">></text>
        </view>
      </view>
    </view>
    <tab-bar />
  </view>
</template>

<script setup>
import TabBar from '../tabs/index.vue'
</script>

<style>
.mine-page {
  min-height: 100vh;
  background: #F5F7F9;
}
.mine-header {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 40rpx;
  background: #FFFFFF;
}
.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: #37AE7E;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-text {
  font-size: 40rpx;
  color: #FFFFFF;
  font-weight: 500;
}
.user-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.user-name {
  font-size: 32rpx;
  color: #1A1D24;
  font-weight: 500;
}
.user-role {
  font-size: 24rpx;
  color: #9292A5;
}
.menu-list {
  margin-top: 20rpx;
  background: #FFFFFF;
}
.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 40rpx;
  border-bottom: 1rpx solid #F2F3F5;
}
.menu-label {
  font-size: 28rpx;
  color: #1A1D24;
}
.menu-arrow {
  font-size: 28rpx;
  color: #BBBEC2;
}
</style>
