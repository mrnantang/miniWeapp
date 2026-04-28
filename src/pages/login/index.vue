<template>
  <view class="login-page">
    <view class="banner">
      <image class="banner-img" src="../../assets/login/login-banner.png" mode="aspectFill" />
      <view class="banner-overlay" />
    </view>

    <view class="form-panel">
      <view class="form-content">
        <view class="input-wrapper">
          <image class="input-icon" src="../../assets/login/icon-account.svg" mode="aspectFit" />
          <input
            class="input-field"
            v-model="account"
            placeholder="请输入账号"
            placeholder-style="color:#9292A5;font-size:28rpx"
          />
        </view>

        <view class="input-wrapper">
          <image class="input-icon" src="../../assets/login/icon-password.svg" mode="aspectFit" />
          <input
            class="input-field"
            v-model="password"
            type="password"
            placeholder="请输入密码"
            placeholder-style="color:#9292A5;font-size:28rpx"
          />
        </view>

        <view class="remember-row">
          <nut-checkbox v-model="rememberPwd" icon-size="14">
            <text class="remember-text">记住密码</text>
          </nut-checkbox>
        </view>

        <nut-button
          class="login-btn"
          block
          type="primary"
          :disabled="!canLogin"
          @click="handleLogin"
        >
          登录
        </nut-button>
      </view>
    </view>

    <view v-if="showError" class="error-overlay" @tap="showError = false">
      <view class="error-dialog" @tap.stop>
        <view class="error-content">
          <text class="error-title">账号/密码错误</text>
          <text class="error-subtitle">请输入正确的账号/密码</text>
        </view>
        <view class="error-btn" @tap="showError = false">
          <text class="error-btn-text">我已知晓</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import Taro from '@tarojs/taro'

const account = ref('dev')
const password = ref('123456')
const rememberPwd = ref(false)
const showError = ref(false)

const canLogin = computed(() => account.value.trim() && password.value.trim())

const roleConfig = {
  dev: { root: 'subpackages/dev/home/index', name: '开发端' },
  sales: { root: 'subpackages/sales/home/index', name: '销售端' },
  ops: { root: 'subpackages/ops/dashboard/index', name: '运营端' },
  boss: { root: 'subpackages/boss/overview/index', name: '老板端' },
}

const accountMap = {
  dev: { account: 'dev', password: '123456' },
  sales: { account: 'sales', password: '123456' },
  ops: { account: 'ops', password: '123456' },
  boss: { account: 'boss', password: '123456' },
}

const handleLogin = () => {
  if (!canLogin.value) return

  const matched = Object.entries(accountMap).find(([, v]) =>
    v.account === account.value.trim() && v.password === password.value
  )

  if (matched) {
    Taro.setStorageSync('role', matched[0])
    Taro.reLaunch({ url: '/' + roleConfig[matched[0]].root })
  } else {
    showError.value = true
  }
}
</script>

<style>
.login-page {
  width: 100%;
  min-height: 100vh;
  background: #F5F7F9;
  position: relative;
}

.banner {
  width: 750rpx;
  height: 570rpx;
  position: relative;
  overflow: hidden;
}

.banner-img {
  width: 1252rpx;
  height: 740rpx;
  position: absolute;
  left: 0;
  top: 0;
}

.banner-overlay {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%);
}

.form-panel {
  position: relative;
  margin-top: -38rpx;
  background: #FFFFFF;
  border-radius: 24rpx 24rpx 0 0;
  padding: 48rpx 40rpx 0;
  min-height: calc(100vh - 532rpx);
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 40rpx;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 16rpx;
  background: #F2F3F5;
  border-radius: 8rpx;
  padding: 20rpx 16rpx;
}

.input-icon {
  width: 40rpx;
  height: 40rpx;
  flex-shrink: 0;
}

.input-field {
  flex: 1;
  font-size: 28rpx;
  color: #1A1D24;
  height: 44rpx;
  line-height: 44rpx;
}

.remember-row {
  display: flex;
  align-items: center;
  --nut-checkbox-icon-color: #37AE7E;
  --nut-checkbox-label-color: #62687D;
  --nut-checkbox-label-font-size: 28rpx;
}

.remember-text {
  font-size: 28rpx;
  color: #62687D;
}

.login-btn {
  --nut-button-primary-background-color: #37AE7E;
  --nut-button-primary-border-color: #37AE7E;
  --nut-button-disabled-background-color: #BBBEC2;
  --nut-button-disabled-border-color: #BBBEC2;
  height: 96rpx;
  border-radius: 8rpx;
  font-size: 32rpx;
}

.login-btn.nut-button--disabled {
  background: #BBBEC2;
  opacity: 1;
}

.login-btn .nut-button__text {
  color: #FFFFFF;
}

.login-btn.nut-button--disabled .nut-button__text {
  color: #FFFFFF;
}

.error-overlay {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.error-dialog {
  width: 510rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}

.error-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #1A1D24;
  line-height: 44rpx;
}

.error-subtitle {
  font-size: 24rpx;
  color: #62687D;
  line-height: 44rpx;
}

.error-btn {
  height: 76rpx;
  background: #EFFDF7;
  border: 2rpx solid #5CC79C;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-btn-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #37AE7E;
}
</style>
