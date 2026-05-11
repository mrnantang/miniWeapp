<template>
  <view class="dev-home">
    <view class="banner-wrap">
      <image class="banner-bg" :src="devBannerImg" mode="aspectFill" />
      <view class="banner-mask" />
      <view class="banner-info">
        <text class="banner-title">运营工作台</text>
        <text class="banner-subtitle">高效管理，精准运营！</text>
      </view>
      <image class="banner-avatar" :src="devOverlayImg" mode="aspectFit" />
    </view>

    <view class="panel">
      <view class="panel-inner">
        <view class="search-row">
          <view class="search-box" @tap="showSearchPopup = true">
            <text class="search-label">查重：</text>
            <text class="search-input-text" :class="{ 'search-input-text--placeholder': !searchKeyword }">{{ searchKeyword || '请输入企业名称/手机号' }}</text>
            <image class="search-icon" :src="iconSearch" mode="aspectFit" />
          </view>
          <view class="filter-btn" @tap="showFilter = true">
            <image :src="iconFilter" mode="aspectFit" />
          </view>
        </view>

        <nut-collapse v-model="activeNames" expand-icon-placement="right">
          <nut-collapse-item name="follow" :border="false">
            <template #title>
              <view class="section-head">
                <view class="section-title-row">
                  <view class="dot" />
                  <text class="section-title">运营概况</text>
                </view>
              </view>
            </template>

            <view class="s-divider" />

            <view class="stats-row">
              <view class="stat-card">
                <text class="stat-label">内容发布量</text>
                <text class="stat-num">1,286</text>
                <view class="stat-change up">
                  <view class="arrow-up" />
                  <text class="change-text">15.3%</text>
                </view>
              </view>
              <view class="v-divider" />
              <view class="stat-card">
                <text class="stat-label">线索获取量</text>
                <text class="stat-num">3,472</text>
                <view class="stat-change up">
                  <view class="arrow-up" />
                  <text class="change-text">22.1%</text>
                </view>
              </view>
              <view class="v-divider" />
              <view class="stat-card">
                <text class="stat-label">线索转化率</text>
                <text class="stat-num">18.6%</text>
                <view class="stat-change up">
                  <view class="arrow-up" />
                  <text class="change-text">3.2%</text>
                </view>
              </view>
            </view>

            <view class="s-divider" />

            <view class="stats-row">
              <view class="stat-card">
                <text class="stat-label">营销活动数</text>
                <text class="stat-num">24</text>
                <view class="stat-change up">
                  <view class="arrow-up" />
                  <text class="change-text">8.5%</text>
                </view>
              </view>
              <view class="v-divider" />
              <view class="stat-card">
                <text class="stat-label">活动参与人数</text>
                <text class="stat-num">5,891</text>
                <view class="stat-change up">
                  <view class="arrow-up" />
                  <text class="change-text">31.7%</text>
                </view>
              </view>
              <view class="v-divider" />
              <view class="stat-card">
                <text class="stat-label">内容传播量</text>
                <text class="stat-num">12,478</text>
                <view class="stat-change up">
                  <view class="arrow-up" />
                  <text class="change-text">45.2%</text>
                </view>
              </view>
            </view>
          </nut-collapse-item>
        </nut-collapse>

        <view class="section">
          <view class="task-head">
            <view class="task-title-row">
              <image class="task-header-icon" :src="iconTaskHeader" mode="aspectFit" />
              <text class="section-title">待处理任务</text>
            </view>
            <view class="task-count-row">
              <text class="task-count">{{ taskCount }}</text>
              <text class="task-count-label">项待处理</text>
            </view>
          </view>

          <scroll-view class="task-tabs-scroll" scroll-x="true" :enhanced="true" :show-scrollbar="false">
            <view class="task-tabs">
              <view class="task-tab" :class="{ 'task-tab--active': activeTaskTab === 0 }" @tap="activeTaskTab = 0">
                <text class="task-tab-text" :class="{ 'task-tab-text--active': activeTaskTab === 0 }">待审核内容(6)</text>
              </view>
              <view class="task-tab" :class="{ 'task-tab--active': activeTaskTab === 1 }" @tap="activeTaskTab = 1">
                <text class="task-tab-text" :class="{ 'task-tab-text--active': activeTaskTab === 1 }">待分配线索(3)</text>
              </view>
              <view class="task-tab" :class="{ 'task-tab--active': activeTaskTab === 2 }" @tap="activeTaskTab = 2">
                <text class="task-tab-text" :class="{ 'task-tab-text--active': activeTaskTab === 2 }">进行中活动(2)</text>
              </view>
            </view>
          </scroll-view>

          <view v-for="card in currentCards" :key="card.name" class="task-card">
            <view class="tc-head">
              <text class="tc-name">{{ card.name }}</text>
              <view class="tc-badge" :class="'tc-badge--' + card.badgeStyle">
                <text class="tc-badge-text" :class="'tc-badge-text--' + card.badgeStyle">{{ card.badge }}</text>
              </view>
            </view>
            <view class="tc-info">
              <view class="tc-info-item">
                <image class="tc-icon" :src="iconPhone" mode="aspectFit" />
                <text class="tc-info-text tc-info-text--active">{{ card.phone }}</text>
              </view>
              <view class="tc-info-item">
                <image class="tc-icon" :src="card.icon2" mode="aspectFit" />
                <text class="tc-info-text">{{ card.label2 }}</text>
              </view>
            </view>
            <view class="tc-tags">
              <view class="tc-info-item">
                <image class="tc-icon" :src="iconIndustry" mode="aspectFit" />
                <text class="tc-info-text">{{ card.industry }}</text>
              </view>
              <view class="tc-info-item">
                <image class="tc-icon" :src="card.icon4" mode="aspectFit" />
                <text class="tc-info-text">{{ card.label4 }}</text>
              </view>
            </view>
            <view v-if="activeTaskTab === 2" class="tc-note">
              <text class="tc-note-label">活动进度：</text>
              <text class="tc-note-text">{{ card.note }}</text>
            </view>
            <view v-else class="tc-follow">
              <text class="tc-follow-text">立即处理</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <tab-bar />

    <nut-popup v-model:visible="showFilter" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0', height: '1022rpx' }" :z-index="2000" safe-area-inset-bottom>
      <view class="filter-popup">
        <view class="filter-header">
          <text class="filter-header-title">全部筛选</text>
        </view>

        <view class="filter-body">
          <view class="filter-sidebar">
            <view
              class="filter-sidebar-item"
              :class="{ 'filter-sidebar-item--active': filterIdx === 0 }"
              @tap="filterIdx = 0"
            >
              <text class="filter-sidebar-text" :class="{ 'filter-sidebar-text--active': filterIdx === 0 }">公司/部门/员工</text>
            </view>
            <view
              class="filter-sidebar-item"
              :class="{ 'filter-sidebar-item--active': filterIdx === 1 }"
              @tap="filterIdx = 1"
            >
              <text class="filter-sidebar-text" :class="{ 'filter-sidebar-text--active': filterIdx === 1 }">时间</text>
            </view>
          </view>

          <scroll-view class="filter-content" scroll-y :enhanced="true" :show-scrollbar="false">
            <view v-if="filterIdx === 0" class="org-tags">
              <text class="org-cat-title">公司</text>
              <view class="org-tag-row">
                <view
                  v-for="c in companyList"
                  :key="c"
                  class="org-tag"
                  :class="{ 'org-tag--active': selectedTags.includes(c) }"
                  @tap="toggleTag(c)"
                >
                  <text class="org-tag-text" :class="{ 'org-tag-text--active': selectedTags.includes(c) }">{{ c }}</text>
                </view>
              </view>

              <text class="org-cat-title">部门</text>
              <view class="org-tag-row">
                <view
                  v-for="d in deptList"
                  :key="d"
                  class="org-tag"
                  :class="{ 'org-tag--active': selectedTags.includes(d) }"
                  @tap="toggleTag(d)"
                >
                  <text class="org-tag-text" :class="{ 'org-tag-text--active': selectedTags.includes(d) }">{{ d }}</text>
                </view>
              </view>

              <text class="org-cat-title">子部门</text>
              <view class="org-tag-row">
                <view
                  v-for="s in subDeptList"
                  :key="s"
                  class="org-tag"
                  :class="{ 'org-tag--active': selectedTags.includes(s) }"
                  @tap="toggleTag(s)"
                >
                  <text class="org-tag-text" :class="{ 'org-tag-text--active': selectedTags.includes(s) }">{{ s }}</text>
                </view>
              </view>

              <text class="org-cat-title">员工</text>
              <view class="org-tag-row" v-for="(row, ri) in employeeRows" :key="ri">
                <view
                  v-for="e in row"
                  :key="e"
                  class="org-tag"
                  :class="{ 'org-tag--active': selectedTags.includes(e) }"
                  @tap="toggleTag(e)"
                >
                  <text class="org-tag-text" :class="{ 'org-tag-text--active': selectedTags.includes(e) }">{{ e }}</text>
                </view>
              </view>
            </view>

            <view v-if="filterIdx === 1" class="time-section">
              <text class="org-cat-title">时间范围</text>
              <view class="time-row">
                <view class="time-box" @tap="openDatePopup('start')">
                  <text class="time-box-text" :class="{ 'time-box-text--set': startTime }">{{ startTime || '开始时间' }}</text>
                </view>
                <view class="time-sep" />
                <view class="time-box" @tap="openDatePopup('end')">
                  <text class="time-box-text" :class="{ 'time-box-text--set': endTime }">{{ endTime || '结束时间' }}</text>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>

        <view class="filter-footer">
          <view class="filter-footer-btn filter-footer-clear" @tap="clearTags">
            <text class="filter-footer-clear-text">清空选择</text>
          </view>
          <view class="filter-footer-btn filter-footer-submit" @tap="onFilterConfirm">
            <text class="filter-footer-submit-text">确认</text>
          </view>
        </view>
      </view>
    </nut-popup>

    <nut-popup v-model:visible="showDatePopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }" :z-index="2100" safe-area-inset-bottom>
      <view class="date-popup">
        <view class="filter-header">
          <text class="filter-header-btn" @tap="showDatePopup = false">取消</text>
          <text class="filter-header-title">{{ datePopupTitle }}</text>
          <text class="filter-header-btn filter-header-confirm" @tap="onDateConfirm">确认</text>
        </view>
        <picker-view
          class="date-picker-body"
          :value="pickerValue"
          indicator-style="height: 68rpx;"
          @change="onPickerChange"
        >
          <picker-view-column>
            <view v-for="y in years" :key="y" class="picker-item">{{ y }}</view>
          </picker-view-column>
          <picker-view-column>
            <view v-for="m in months" :key="m" class="picker-item">{{ m < 10 ? '0' + m : m }}</view>
          </picker-view-column>
          <picker-view-column>
            <view v-for="d in days" :key="d" class="picker-item">{{ d < 10 ? '0' + d : d }}</view>
          </picker-view-column>
        </picker-view>
      </view>
    </nut-popup>

    <DuplicateCheckPopup v-model="showSearchPopup" />


  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import Taro from '@tarojs/taro'
import TabBar from '../tabs/index.vue'
import DuplicateCheckPopup from '@/subpackages/dev/customer/components/DuplicateCheckPopup.vue'
import wechatIcon from '@/assets/dev/icon-wechat.png'
import gradeIcon from '@/assets/dev/icon-grade.png'
import locationIcon from '@/assets/dev/icon-location.png'
import lineOldIcon from '@/assets/dev/icon-line-old.png'
import devBannerImg from '@/assets/dev/dev-banner.png'
import devOverlayImg from '@/assets/dev/dev-overlay.png'
import iconSearch from '@/assets/dev/icon-search.png'
import iconFilter from '@/assets/dev/icon-filter.png'
import iconTaskHeader from '@/assets/dev/icon-task-header.png'
import iconPhone from '@/assets/dev/icon-phone.png'
import iconIndustry from '@/assets/dev/icon-industry.png'

const activeNames = ref(['follow'])
const activeTaskTab = ref(0)

const currentCards = computed(() => {
  if (activeTaskTab.value === 0) return reviewCards
  if (activeTaskTab.value === 1) return assignCards
  return activityCards
})
const taskCount = computed(() => {
  return activeTaskTab.value === 0 ? 6 : activeTaskTab.value === 1 ? 3 : 2
})

const reviewCards = [
  { name: '产品宣传册V3', phone: '张伟', icon2: wechatIcon, label2: '品牌部', industry: '待审核', icon4: locationIcon, label4: '2026-05-10 提交' },
  { name: '季度营销方案', phone: '李芳', icon2: wechatIcon, label2: '市场部', industry: '待审核', icon4: locationIcon, label4: '2026-05-09 提交' },
]

const assignCards = [
  { name: '超凡实业技术有限公司', phone: '15899280987', icon2: gradeIcon, label2: 'A级线索', industry: '电气行业', icon4: locationIcon, label4: '广东省/深圳市/南山区' },
  { name: '金剑制造实业控股', phone: '13928475621', icon2: gradeIcon, label2: 'B级线索', industry: '机械制造', icon4: locationIcon, label4: '广东省/广州市/天河区' },
  { name: '及时设计文化传媒', phone: '18675340982', icon2: gradeIcon, label2: 'A级线索', industry: '文化传媒', icon4: locationIcon, label4: '广东省/深圳市/南山区' },
]

const activityCards = [
  { name: '618年中大促活动', phone: '进行中', icon2: wechatIcon, label2: '参与人数 1,284', industry: '线上推广', icon4: locationIcon, label4: '剩余 12 天', note: '已触达 3,892 人，转化率 8.2%' },
  { name: '新客户专享优惠', phone: '进行中', icon2: wechatIcon, label2: '参与人数 672', industry: '优惠活动', icon4: locationIcon, label4: '剩余 5 天', note: '已触达 1,456 人，转化率 12.5%' },
]

const showFilter = ref(false)
const filterIdx = ref(0)

const showDatePopup = ref(false)
const datePickerTarget = ref('start')
const startTime = ref('')
const endTime = ref('')

const datePopupTitle = computed(() => datePickerTarget.value === 'start' ? '选择开始时间' : '选择结束时间')

const selectedTags = ref([])
const searchKeyword = ref('')

const companyList = ['德贝尔总公司', '江苏扬州办事处', '江苏苏州办事处', '江苏徐州办事处']
const deptList = ['销售总部', '开发总部', '财务总部', '外贸总部']
const subDeptList = ['销售一部', '销售二部']
const employeeRows = [
  ['张传送', '李治廷'],
  ['仇茂茂', '李聪'],
  ['屈伊', '陈子奕'],
  ['仇茂茂', '李聪'],
]

const toggleTag = (tag) => {
  const idx = selectedTags.value.indexOf(tag)
  if (idx >= 0) {
    selectedTags.value.splice(idx, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

const clearTags = () => {
  selectedTags.value = []
  startTime.value = ''
  endTime.value = ''
}

const onFilterConfirm = () => {
  showFilter.value = false
}

const openDatePopup = (type) => {
  datePickerTarget.value = type
  showDatePopup.value = true
}

const onDateConfirm = () => {
  const y = years[pickerValue.value[0]]
  const m = months[pickerValue.value[1]]
  const d = days.value[pickerValue.value[2]]
  const dateStr = `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`
  if (datePickerTarget.value === 'start') {
    startTime.value = dateStr
  } else {
    endTime.value = dateStr
  }
  showDatePopup.value = false
}

const showSearchPopup = ref(false)

const now = new Date()
const currentYear = now.getFullYear()
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)
const months = Array.from({ length: 12 }, (_, i) => i + 1)

const daysInMonth = (y, m) => new Date(y, m, 0).getDate()
const days = computed(() => {
  const y = years[pickerValue.value[0]]
  const m = months[pickerValue.value[1]]
  return Array.from({ length: daysInMonth(y, m) }, (_, i) => i + 1)
})

const pickerValue = ref([2, now.getMonth(), now.getDate() - 1])

const onPickerChange = (e) => {
  pickerValue.value = e.detail.value
}
</script>

<style>
.dev-home {
  min-height: 100vh;
  background: #F5F7F9;
}

.banner-wrap {
  width: 750rpx;
  height:420rpx;
  position: relative;
  overflow: hidden;
}
.banner-bg {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.banner-mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 100%);
}
.banner-info {
  position: absolute;
  left: 40rpx;
  top: 230rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.banner-title {
  font-size: 40rpx;
  font-weight: 600;
  color: #FFFFFF;
}
.banner-subtitle {
  font-size: 24rpx;
  color: rgba(255,255,255,0.7);
}
.banner-avatar {
  position: absolute;
  right: 0;
  top: 80rpx;
  width: 400rpx;
  height: 400rpx;
}

.panel {
  position: relative;
  margin-top: -38rpx;
  background: #FFFFFF;
  border-radius: 24rpx 24rpx 0 0;
  box-shadow: 0 -6rpx 46rpx rgba(64,200,166,0.31);
  padding-bottom: 120rpx;
}
.panel-inner {
  padding: 40rpx 40rpx 0;
  display: flex;
  flex-direction: column;
  gap: 44rpx;
  padding-bottom: 280rpx;
}

.search-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
}
.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
  height: 68rpx;
  background: #F6F7FB;
  border: 2rpx solid #E4E9EF;
  border-radius: 12rpx;
  padding: 0 20rpx;
}
.search-label {
  font-size: 28rpx;
  color: #62687D;
  flex-shrink: 0;
}
.search-input-text {
  flex: 1;
  font-size: 28rpx;
  height: 44rpx;
  line-height: 44rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.search-input-text--placeholder {
  color: #BBBEC2;
}
.search-input-text:not(.search-input-text--placeholder) {
  color: #1A1D24;
}
.search-icon {
  width: 36rpx;
  height: 36rpx;
  flex-shrink: 0;
}
.filter-btn {
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
.filter-icon {
  width: 34rpx;
  height: 34rpx;
}
.section {
  display: flex;
  flex-direction: column;
}
.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 0;
}
.section-title-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.dot {
  width: 8rpx;
  height: 8rpx;
  background: #37AE7E;
  border-radius: 2rpx;
}
.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #25293B;
}
.s-divider {
  height: 1rpx;
  background: #F4F4F4;
}
.stats-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24rpx 0;
}
.stat-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}
.stat-card--hidden {
  visibility: hidden;
}
.stat-label {
  font-size: 22rpx;
  color: #9292A5;
}
.stat-num {
  font-size: 36rpx;
  font-weight: 600;
  color: #1A1D24;
}
.stat-change {
  display: flex;
  align-items: center;
  gap: 4rpx;
}
.stat-change.up .change-text {
  color: #37AE7E;
}
.stat-change.down .change-text {
  color: #EE5A5A;
}
.arrow-up {
  width: 0;
  height: 0;
  border-left: 6rpx solid transparent;
  border-right: 6rpx solid transparent;
  border-bottom: 6rpx solid #37AE7E;
}
.arrow-down {
  width: 0;
  height: 0;
  border-left: 6rpx solid transparent;
  border-right: 6rpx solid transparent;
  border-top: 6rpx solid #EE5A5A;
}
.change-text {
  font-size: 20rpx;
}
.v-divider {
  width: 1rpx;
  height: 90rpx;
  background: #F4F4F4;
  flex-shrink: 0;
}
.v-divider--hidden {
  visibility: hidden;
}
.task-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}
.task-title-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.task-header-icon {
  width: 32rpx;
  height: 32rpx;
}
.task-count-row {
  display: flex;
  align-items: baseline;
  gap: 6rpx;
}
.task-count {
  font-size: 32rpx;
  font-weight: 600;
  color: #37AE7E;
}
.task-count-label {
  font-size: 22rpx;
  color: #9292A5;
}

.task-tabs-scroll {
  width: 100%;
  white-space: nowrap;
  padding-bottom: 0;
  border-bottom: 1rpx solid #E5E6EB;
}
.task-tabs {
  display: inline-flex;
  flex-wrap: nowrap;
  gap: 40rpx;
}
.task-tabs--sales {
  gap: 24rpx;
}
.task-tab {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  padding-bottom: 30rpx;
  border-bottom: 4rpx solid transparent;
}
.task-tab--active {
  border-bottom-color: #37AE7E;
}
.task-tab-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #9292A5;
  white-space: nowrap;
}
.task-tab-text--active {
  color: #1A1D24;
}

.task-card {
  background: #F6F7FB;
  border-radius: 12rpx;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-top: 24rpx;
}
.tc-head {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.tc-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #1A1D24;
}
.tc-badge {
  padding: 2rpx 12rpx;
  border-radius: 8rpx;
}
.tc-badge--cyan {
  background: #EDFAF5;
}
.tc-badge--yellow {
  background: #FEF6E0;
}
.tc-badge--green {
  background: #E8F8E8;
}
.tc-badge--gray {
  background: #F2F3F5;
}
.tc-badge--blue {
  background: #E5F0FF;
}
.tc-badge-text {
  font-size: 20rpx;
  font-weight: 500;
}
.tc-badge-text--cyan {
  color: #37AE7E;
}
.tc-badge-text--yellow {
  color: #E6A23C;
}
.tc-badge-text--green {
  color: #67C23A;
}
.tc-badge-text--gray {
  color: #909399;
}
.tc-badge-text--blue {
  color: #409EFF;
}
.tc-info {
  display: flex;
  align-items: center;
  gap: 24rpx;
}
.tc-info-item {
  display: flex;
  align-items: center;
  gap: 6rpx;
}
.tc-icon {
  width: 28rpx;
  height: 28rpx;
  flex-shrink: 0;
}
.tc-info-text {
  font-size: 24rpx;
  color: #9292A5;
}
.tc-info-text--active {
  color: #37AE7E;
}
.tc-tags {
  display: flex;
  align-items: center;
  gap: 24rpx;
}
.tc-note {
  display: flex;
  align-items: flex-start;
  gap: 4rpx;
}
.tc-note-label {
  font-size: 22rpx;
  color: #9292A5;
  flex-shrink: 0;
}
.tc-note-text {
  font-size: 22rpx;
  color: #62687D;
}
.tc-follow {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56rpx;
  background: #EDFAF5;
  border: 2rpx solid #CEF0E2;
  border-radius: 8rpx;
}
.tc-follow-text {
  font-size: 26rpx;
  color: #37AE7E;
  font-weight: 500;
}

.filter-popup {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 40rpx;
  position: relative;
}
.filter-header-btn {
  font-size: 28rpx;
  color: #9292A5;
}
.filter-header-confirm {
  color: #37AE7E;
}
.filter-header-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 32rpx;
  font-weight: 500;
  color: #1A1D24;
  white-space: nowrap;
}
.filter-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.filter-sidebar {
  width: 190rpx;
  background: #F6F7FB;
  flex-shrink: 0;
}
.filter-sidebar-item {
  padding: 20rpx 40rpx;
  background: transparent;
}
.filter-sidebar-item--active {
  background: #FFFFFF;
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
.org-tags {
  display: flex;
  flex-direction: column;
}
.org-cat-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #1A1D24;
  display: block;
  margin: 6rpx 0 24rpx 0;
}
.org-cat-title:first-child {
  margin-top: 0;
}
.org-tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  margin-bottom: 24rpx;
}
.org-tag {
  width: 208rpx;
  padding: 12rpx 10rpx;
  background: #F6F7FB;
  border-radius: 6rpx;
  box-sizing: border-box;
  text-align: center;
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

.time-section {
  padding: 0;
}
.time-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.time-box {
  flex: 1;
  height: 60rpx;
  background: #F6F7FB;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.time-box-text {
  font-size: 26rpx;
  color: #BBBEC2;
}
.time-box-text--set {
  color: #1A1D24;
}
.time-sep {
  width: 8rpx;
  height: 2rpx;
  background: #1A1D24;
  flex-shrink: 0;
}

.date-popup {
  display: flex;
  flex-direction: column;
}
.date-picker-body {
  width: 100%;
  height: 440rpx;
}
.date-picker-view {
  width: 100%;
  height: 440rpx;
  display: none;
}
.picker-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 68rpx;
  font-size: 28rpx;
  color: #1A1D24;
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
