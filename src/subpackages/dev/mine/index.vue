<template>
  <view class="mine-page">
    <view class="mine-banner">
      <view class="mine-banner-bg" />
      <view class="mine-user">
        <view class="mine-avatar-wrap">
          <view class="mine-avatar">
            <image v-if="avatarUrl" class="mine-avatar-img" :src="avatarUrl" mode="aspectFill" />
            <text v-else class="mine-avatar-text">{{ userName.charAt(0) }}</text>
          </view>
        </view>
        <view class="mine-user-info">
          <text class="mine-user-name">{{ userName }}</text>
          <view class="mine-user-meta">
            <text class="mine-user-meta-text">{{ userDept }}</text>
            <view class="mine-user-meta-sep" />
            <text class="mine-user-meta-text">{{ userRole }}</text>
            <view class="mine-user-meta-sep" />
            <text class="mine-user-meta-text">{{ userCode }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="mine-func-card">
      <text class="mine-card-title">常用功能</text>
      <!-- 切换角色行（仅老板身份可见） -->
      <view v-if="isBoss" class="mine-role-row">
        <view class="mine-role-left">
          <view class="mine-role-icon">
            <image class="mine-role-icon-img" :src="iconCheck" mode="aspectFit" />
          </view>
          <text class="mine-role-label">切换角色</text>
        </view>
        <view class="mine-role-radios">
          <view class="mine-role-radio" @tap="onSwitchRole('boss')">
            <view class="mine-role-radio-box" :class="{ 'mine-role-radio-box--checked': currentRole === 'boss' }">
              <view v-if="currentRole === 'boss'" class="mine-role-radio-check" />
            </view>
            <text class="mine-role-radio-text">老板</text>
          </view>
          <view class="mine-role-radio" @tap="onSwitchRole('sales')">
            <view class="mine-role-radio-box" :class="{ 'mine-role-radio-box--checked': currentRole === 'sales' }">
              <view v-if="currentRole === 'sales'" class="mine-role-radio-check" />
            </view>
            <text class="mine-role-radio-text">销售</text>
          </view>
        </view>
      </view>
      <view class="mine-card-divider" />
      <template v-for="(item, i) in funcList" :key="item.name">
        <view class="mine-func-item" @tap="item.onTap">
          <view class="mine-func-left">
            <image class="mine-func-icon" :src="item.icon" mode="aspectFit" />
            <text class="mine-func-name">{{ item.name }}</text>
          </view>
          <view class="mine-func-right">
            <text v-if="item.tag" class="mine-func-tag">{{ item.tag }}</text>
            <image class="mine-func-arrow" :src="rightArrowIcon" mode="aspectFit" />
          </view>
        </view>
        <view v-if="i < funcList.length - 1" class="mine-card-divider" />
      </template>
    </view>

    <view class="mine-logout" @tap="onLogout">
      <text class="mine-logout-text">退出登录</text>
    </view>

    <tab-bar />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import TabBar from '../tabs/index.vue'
import { getCompanyTree } from '@/api/system'
import { getUserInfo } from '@/utils/storage'
import rightArrowIcon from '@/assets/mine/right.png'
import iconNotify from '@/assets/dev/mine/icon-mine-notify.svg'
import iconProduct from '@/assets/dev/mine/icon-mine-product.svg'
import iconOrder from '@/assets/dev/mine/icon-mine-order.svg'
import iconReimburse from '@/assets/dev/mine/icon-mine-reimburse.svg'
import iconExpense from '@/assets/dev/mine/icon-mine-expense.svg'
import iconPerf from '@/assets/dev/mine/icon-mine-perf.svg'
import iconCheck from '@/assets/mine/check.png'

const userName = ref('')
const userDept = ref('')
const userRole = ref('')
const userCode = ref('')
const avatarUrl = ref('')
const isBoss = ref(false)
const currentRole = ref('sales')

function onSwitchRole(role) {
  currentRole.value = role
  if (role === 'boss') {
    Taro.navigateTo({ url: '/subpackages/boss/mine/index' })
  }
}

/** 从公司架构树中匹配公司名和部门名 */
function resolveCompanyAndDept(tree, companyId, departmentId) {
  for (const company of tree) {
    if (company.companyId === companyId) {
      const dept = company.children?.find(d => d.departmentId === departmentId)
      return { companyName: company.name, deptName: dept?.name || '' }
    }
  }
  return { companyName: '', deptName: '' }
}

onMounted(async () => {
  const userInfo = getUserInfo()
  if (userInfo) {
    userName.value = userInfo.name || ''
    userCode.value = userInfo.status || ''
    avatarUrl.value = userInfo.avatar || userInfo.avatarUrl || ''
    isBoss.value = !!userInfo.isBoss
  }

  // 通过公司架构树获取公司名称和部门名称
  try {
    const res = await getCompanyTree()
    const companyId = Number(userInfo?.companyId) || 0
    const departmentId = Number(userInfo?.departmentId) || 0
    if (companyId && res.items?.length) {
      const { companyName, deptName } = resolveCompanyAndDept(res.items, companyId, departmentId)
      if (companyName) userDept.value = companyName
      if (deptName) userRole.value = deptName
    }
  } catch {
    // 错误已在 request 层处理
  }
})

const funcList = ref([
  { name: '消息通知', icon: iconNotify, tag: '', onTap: () => Taro.navigateTo({ url: '/subpackages/dev/mine/notice/index' }) },
  { name: '产品中心', icon: iconProduct, tag: '', onTap: () => Taro.navigateTo({ url: '/subpackages/dev/mine/product/index' }) },
  { name: '我的订单', icon: iconOrder, tag: '', onTap: () => Taro.navigateTo({ url: '/subpackages/dev/mine/order/index' }) },
  { name: '我的报销', icon: iconReimburse, tag: '', onTap: () => Taro.navigateTo({ url: '/subpackages/dev/mine/reimburse/index' }) },
  { name: '费用申请', icon: iconExpense, tag: '', onTap: () => Taro.navigateTo({ url: '/subpackages/dev/mine/expense/index' }) },
  { name: '业绩分配', icon: iconPerf, tag: '', onTap: () => Taro.navigateTo({ url: '/subpackages/dev/mine/perf/index' }) },
])

const onLogout = () => {
  Taro.reLaunch({ url: '/pages/login/index' })
}
</script>

<style>
.mine-page {
  min-height: 100vh;
  background: #F5F7F9;
}

.mine-banner {
  position: relative;
  padding: 40rpx;
  padding-top: 0;
}

.mine-banner-bg {
  position: absolute;
  height: 240rpx;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, #EAFFF7 0%, #F5F7F9 100%);
  border-radius: 0 0 40rpx 40rpx;
}

.mine-user {
  position: relative;
  display: flex;
  align-items: center;
  gap: 28rpx;
  padding-top: 190rpx;
  padding-bottom: 32rpx;
}

.mine-avatar-wrap {
  width: 120rpx;
  height: 120rpx;
  border-radius: 74rpx;
  padding: 4rpx;
  box-sizing: border-box;
  flex-shrink: 0;
}

.mine-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.mine-avatar-img {
  width: 100%;
  height: 100%;
}

.mine-avatar-text {
  font-size: 44rpx;
  font-weight: 500;
  color: #37AE7E;
}

.mine-user-info {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.mine-user-name {
  font-size: 34rpx;
  font-weight: 500;
  color: #1A1D24;
}

.mine-user-meta {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.mine-user-meta-text {
  font-size: 28rpx;
  color: #62687D;
}

.mine-user-meta-sep {
  width: 2rpx;
  height: 22rpx;
  background: rgba(92, 137, 116, 0.19);
}

.mine-func-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  margin: 0 40rpx;
  padding: 28rpx;
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.mine-card-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #25293B;
}

.mine-card-divider {
  height: 1rpx;
  background: #F4F4F4;
  flex-shrink: 0;
}

.mine-func-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mine-func-left {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.mine-func-icon {
  width: 40rpx;
  height: 40rpx;
  flex-shrink: 0;
}

.mine-func-name {
  font-size: 30rpx;
  color: #25293B;
}

.mine-func-right {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.mine-func-tag {
  font-size: 28rpx;
  color: #9292A5;
}

.mine-func-arrow {
  width: 24rpx;
  height: 24rpx;
  flex-shrink: 0;
}

/* 切换角色 */
.mine-role-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.mine-role-left {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.mine-role-icon {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mine-role-icon-img {
  width: 40rpx;
  height: 40rpx;
}

.mine-role-label {
  font-size: 30rpx;
  color: #25293B;
}

.mine-role-radios {
  display: flex;
  align-items: center;
  gap: 32rpx;
}

.mine-role-radio {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.mine-role-radio-box {
  width: 28rpx;
  height: 28rpx;
  border-radius: 50%;
  border: 2rpx solid #E5E6EB;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-sizing: border-box;
}

.mine-role-radio-box--checked {
  background: #37AE7E;
  border-color: #37AE7E;
}

.mine-role-radio-check {
  width: 10rpx;
  height: 6rpx;
  border-left: 2rpx solid #FFFFFF;
  border-bottom: 2rpx solid #FFFFFF;
  transform: rotate(-45deg);
  margin-top: -2rpx;
  flex-shrink: 0;
}

.mine-role-radio-text {
  font-size: 28rpx;
  color: #1A1D24;
}

.mine-logout {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
  border: 1px solid #FFE8E8;
  background: #FFF2F2;
  border-radius: 16rpx;
  margin: 40rpx 40rpx 0;
}

.mine-logout-text {
  font-size: 28rpx;
  color: #EB6060;
}
</style>
