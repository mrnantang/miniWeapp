<template>
  <view class="dev-home">
    <view class="banner-wrap">
      <image class="banner-bg" src="../../../assets/dev/dev-banner.png" mode="aspectFill" />
      <view class="banner-mask" />
      <view class="banner-info">
        <text class="banner-title">{{ role === 'sales' ? '销售工作台' : '开发工作台' }}</text>
        <text class="banner-subtitle">快速高效好伙伴！</text>
      </view>
      <image class="banner-avatar" src="../../../assets/dev/dev-overlay.png" mode="aspectFit" />
    </view>

    <view class="panel">
      <view class="panel-inner">
        <view class="search-row">
          <view class="search-box" @tap="showSearchPopup = true">
            <text class="search-label">查重：</text>
            <text class="search-input-text" :class="{ 'search-input-text--placeholder': !searchKeyword }">{{ searchKeyword || '请输入企业名称/手机号' }}</text>
            <image class="search-icon" src="../../../assets/dev/icon-search.png" mode="aspectFit" />
          </view>
           <!-- <view v-if="role === 'sales'" class="location-btn" @tap="showNearbyPopup = true"> -->
          <view  class="location-btn" @tap="showNearbyPopup = true">
            <image src="../../../assets/dev/icon-location-search.png" mode="aspectFit" />
          </view>
          <view class="filter-btn" @tap="showFilter = true">
            <image src="../../../assets/dev/icon-filter.png" mode="aspectFit" />
          </view>
        </view>

        <nut-collapse v-model="activeNames" expand-icon-placement="right">
          <nut-collapse-item name="follow" :border="false">
            <template #title>
              <view class="section-head">
                <view class="section-title-row">
                  <view class="dot" />
                  <text class="section-title">客户跟进情况</text>
                </view>
              </view>
            </template>

            <view class="s-divider" />

            <view class="stats-row">
              <view class="stat-card">
                <text class="stat-label">客户总数量</text>
                <text class="stat-num">2091</text>
                <view class="stat-change up">
                  <view class="arrow-up" />
                  <text class="change-text">12.8%</text>
                </view>
              </view>
              <view class="v-divider" />
              <view class="stat-card">
                <text class="stat-label">电话沟通数量</text>
                <text class="stat-num">289</text>
                <view class="stat-change down">
                  <view class="arrow-down" />
                  <text class="change-text">4.0%</text>
                </view>
              </view>
              <view class="v-divider" />
              <view class="stat-card">
                <text class="stat-label">微信沟通数量</text>
                <text class="stat-num">344</text>
                <view class="stat-change up">
                  <view class="arrow-up" />
                  <text class="change-text">12.8%</text>
                </view>
              </view>
            </view>

            <view class="s-divider" />

            <view class="stats-row">
              <view class="stat-card">
                <text class="stat-label">接待客户数量</text>
                <text class="stat-num">199</text>
                <view class="stat-change down">
                  <view class="arrow-down" />
                  <text class="change-text">4.0%</text>
                </view>
              </view>
              <view class="v-divider" />
              <view class="stat-card">
                <text class="stat-label">重点客户数量</text>
                <text class="stat-num">212</text>
                <view class="stat-change down">
                  <view class="arrow-down" />
                  <text class="change-text">4.0%</text>
                </view>
              </view>
              <view class="v-divider" />
              <view class="stat-card">
                <text class="stat-label">报价客户数量</text>
                <text class="stat-num">978</text>
                <view class="stat-change up">
                  <view class="arrow-up" />
                  <text class="change-text">12.8%</text>
                </view>
              </view>
            </view>

            <view class="s-divider" />

            <view class="stats-row">
              <view class="stat-card">
                <text class="stat-label">签约中客户数量</text>
                <text class="stat-num">2091</text>
                <view class="stat-change up">
                  <view class="arrow-up" />
                  <text class="change-text">12.8%</text>
                </view>
              </view>
              <view class="v-divider" />
              <view class="stat-card stat-card--hidden" />
              <view class="v-divider v-divider--hidden" />
              <view class="stat-card stat-card--hidden" />
            </view>
          </nut-collapse-item>
        </nut-collapse>

        <view class="section">
          <view class="task-head">
            <view class="task-title-row">
              <image class="task-header-icon" src="../../../assets/dev/icon-task-header.png" mode="aspectFit" />
              <text class="section-title">待处理任务</text>
            </view>
            <view class="task-count-row">
              <text class="task-count">{{ taskCount }}</text>
              <text class="task-count-label">项待处理</text>
            </view>
          </view>

          <scroll-view class="task-tabs-scroll" scroll-x :enhanced="true" :show-scrollbar="false">
            <view class="task-tabs" :class="{ 'task-tabs--sales': role === 'sales' }">
              <view v-if="role !== 'sales'" class="task-tab" :class="{ 'task-tab--active': activeTaskTab === 0 }" @tap="activeTaskTab = 0">
                <text class="task-tab-text" :class="{ 'task-tab-text--active': activeTaskTab === 0 }">待跟进线索(2)</text>
              </view>
              <view class="task-tab" :class="{ 'task-tab--active': activeTaskTab === (role === 'sales' ? 0 : 1) }" @tap="activeTaskTab = (role === 'sales' ? 0 : 1)">
                <text class="task-tab-text" :class="{ 'task-tab-text--active': activeTaskTab === (role === 'sales' ? 0 : 1) }">待跟进客户(5)</text>
              </view>
              <view class="task-tab" :class="{ 'task-tab--active': activeTaskTab === (role === 'sales' ? 1 : 2) }" @tap="activeTaskTab = (role === 'sales' ? 1 : 2)">
                <text class="task-tab-text" :class="{ 'task-tab-text--active': activeTaskTab === (role === 'sales' ? 1 : 2) }">重点客户跟进情况</text>
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
                <image class="tc-icon" src="../../../assets/dev/icon-phone.png" mode="aspectFit" />
                <text class="tc-info-text tc-info-text--active">15899280987</text>
              </view>
              <view class="tc-info-item">
                <image class="tc-icon" :src="card.icon2" mode="aspectFit" />
                <text class="tc-info-text">{{ card.label2 }}</text>
              </view>
            </view>
            <view class="tc-tags">
              <view class="tc-info-item">
                <image class="tc-icon" src="../../../assets/dev/icon-industry.png" mode="aspectFit" />
                <text class="tc-info-text">{{ card.industry }}</text>
              </view>
              <view class="tc-info-item">
                <image class="tc-icon" :src="card.icon4" mode="aspectFit" />
                <text class="tc-info-text">{{ card.label4 }}</text>
              </view>
            </view>
            <view v-if="isFocusTab" class="tc-note">
              <text class="tc-note-label">最新跟进：</text>
              <text class="tc-note-text">{{ card.note }}</text>
            </view>
            <view v-if="!isFocusTab" class="tc-follow">
              <text class="tc-follow-text">立刻去跟进</text>
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

    <nut-popup v-model:visible="showSearchPopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0', height: '1074rpx' }" :z-index="2000" safe-area-inset-bottom>
      <view class="search-popup">
        <view class="sp-header">
          <view class="sp-header-side" />
          <text class="sp-header-title">客户查重</text>
          <view class="sp-header-side sp-header-close" @tap="showSearchPopup = false">
            <image class="sp-close-icon" src="../../../assets/dev/icon-close.png" mode="aspectFit" />
          </view>
        </view>

        <view class="sp-input-row">
          <input
            class="sp-input"
            v-model="searchKeyword"
            placeholder="请输入需要查重的数据"
            placeholder-style="color:#BBBEC2;font-size:30rpx"
            @confirm="onSearch"
          />
          <image class="sp-search-icon" src="../../../assets/dev/icon-search.png" mode="aspectFit" @tap="onSearch" />
        </view>

        <view class="sp-body">
          <view v-if="searchState === 'empty'" class="sp-empty">
            <image class="sp-empty-img" src="../../../assets/dev/icon-empty-search.png" mode="aspectFit" />
            <text class="sp-empty-text">暂无数据</text>
          </view>

          <view v-if="searchState === 'tooMany'" class="sp-empty">
            <image class="sp-empty-img" src="../../../assets/dev/icon-too-many.png" mode="aspectFit" />
            <view class="sp-empty-text-wrap">
              <text class="sp-empty-text">查询结果数量太多</text>
              <text class="sp-empty-text">请填写更详细德查询数据</text>
            </view>
          </view>

          <scroll-view v-if="searchState === 'results'" class="sp-results" scroll-y :enhanced="true" :show-scrollbar="false">
            <view
              v-for="item in searchResults"
              :key="item.id"
              class="sp-card"
            >
              <text class="sp-card-name">
                <text v-if="item.before" class="sp-card-name--normal">{{ item.before }}</text>
                <text class="sp-card-name--hl">{{ searchKeyword }}</text>
                <text v-if="item.after" class="sp-card-name--bold">{{ item.after }}</text>
              </text>
              <view class="sp-card-row">
                <text class="sp-card-label">负责人：</text>
                <text class="sp-card-value">{{ item.manager }}</text>
              </view>
              <view class="sp-card-row">
                <text class="sp-card-label">联系电话：</text>
                <text class="sp-card-value">{{ item.phone }}</text>
              </view>
              <view class="sp-card-row">
                <text class="sp-card-label">创建时间：</text>
                <text class="sp-card-value">{{ item.createTime }}</text>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
    </nut-popup>

    <nut-popup v-model:visible="showNearbyPopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0', height: '1022rpx' }" :z-index="2000" safe-area-inset-bottom>
      <view class="nearby-popup">
        <view class="nearby-header">
          <text class="nearby-header-title">搜索附近客户</text>
        </view>

        <view class="nearby-body">
          <view class="nearby-sidebar">
            <view class="nearby-sidebar-item nearby-sidebar-item--active">
              <text class="nearby-sidebar-text nearby-sidebar-text--active">附近客户</text>
            </view>
          </view>

          <scroll-view class="nearby-content" scroll-y :enhanced="true" :show-scrollbar="false">
            <text class="nearby-cat-title">当前定位</text>
            <view class="nearby-loc-row">
              <text class="nearby-loc-text">广东省/深圳市/南山区</text>
              <image class="nearby-loc-icon" src="../../../assets/dev/icon-location-popup.png" mode="aspectFit" />
            </view>

            <view class="nearby-divider" />

            <text class="nearby-cat-title">距离范围</text>
            <view class="nearby-range-grid">
              <view
                v-for="r in distanceRanges"
                :key="r"
                class="nearby-range-tag"
                :class="{ 'nearby-range-tag--active': selectedDistance === r }"
                @tap="selectedDistance = r"
              >
                <text class="nearby-range-text" :class="{ 'nearby-range-text--active': selectedDistance === r }">{{ r }}</text>
              </view>
            </view>

            <view class="nearby-divider" />

            <text class="nearby-cat-title">自定义距离范围</text>
            <view class="nearby-custom-row">
              <view class="nearby-custom-box">
                <text class="nearby-custom-val">0</text>
                <text class="nearby-custom-unit">km</text>
              </view>
              <view class="nearby-custom-sep" />
              <view class="nearby-custom-box">
                <input
                  class="nearby-custom-input"
                  v-model="customDistance"
                  placeholder="请输入"
                  placeholder-style="color:#BBBEC2;font-size:26rpx"
                />
                <text class="nearby-custom-unit">km</text>
              </view>
            </view>
          </scroll-view>
        </view>

        <view class="nearby-footer">
          <view class="nearby-footer-btn nearby-footer-clear" @tap="selectedDistance = ''; customDistance = ''">
            <text class="nearby-footer-clear-text">清空选择</text>
          </view>
          <view class="nearby-footer-btn nearby-footer-submit" @tap="onNearbyConfirm">
            <text class="nearby-footer-submit-text">确认</text>
          </view>
        </view>
      </view>
    </nut-popup>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import Taro from '@tarojs/taro'
import TabBar from '../tabs/index.vue'
import wechatIcon from '../../../assets/dev/icon-wechat.png'
import gradeIcon from '../../../assets/dev/icon-grade.png'
import locationIcon from '../../../assets/dev/icon-location.png'
import lineOldIcon from '../../../assets/dev/icon-line-old.png'

const role = Taro.getStorageSync('role') || 'dev'
const activeNames = ref(['follow'])
const activeTaskTab = ref(0)

const isLeadTab = computed(() => role === 'dev' && activeTaskTab.value === 0)
const isFocusTab = computed(() => {
  if (role === 'sales') return activeTaskTab.value === 1
  return activeTaskTab.value === 2
})

const currentCards = computed(() => {
  if (isLeadTab.value) return leadCards
  if (isFocusTab.value) return focusCards
  return customerCards
})
const taskCount = computed(() => {
  if (role === 'sales') return activeTaskTab.value === 0 ? 5 : 3
  return activeTaskTab.value === 0 ? 2 : activeTaskTab.value === 1 ? 5 : 3
})

const leadCards = [
  { name: '超凡实业技术有限公司', badge: '待定', badgeStyle: 'cyan', icon2: wechatIcon, label2: 'rnbujhu2818', industry: '电气行业', icon4: locationIcon, label4: '广东省/深圳市/南山区', note: '' },
  { name: '超凡实业技术有限公司', badge: '待定', badgeStyle: 'cyan', icon2: wechatIcon, label2: 'rnbujhu2818', industry: '电气行业', icon4: locationIcon, label4: '广东省/深圳市/南山区', note: '' },
  { name: '超凡实业技术有限公司', badge: '待定', badgeStyle: 'cyan', icon2: wechatIcon, label2: 'rnbujhu2818', industry: '电气行业', icon4: locationIcon, label4: '广东省/深圳市/南山区', note: '' },
]

const customerCards = [
  { name: '超凡实业技术有限公司', badge: '待跟进', badgeStyle: 'yellow', icon2: gradeIcon, label2: 'A级客户', industry: '电气行业', icon4: lineOldIcon, label4: '旧线', note: '' },
  { name: '超凡实业技术有限公司', badge: '待跟进', badgeStyle: 'yellow', icon2: gradeIcon, label2: 'A级客户', industry: '电气行业', icon4: lineOldIcon, label4: '旧线', note: '' },
  { name: '超凡实业技术有限公司', badge: '待跟进', badgeStyle: 'yellow', icon2: gradeIcon, label2: 'A级客户', industry: '电气行业', icon4: lineOldIcon, label4: '旧线', note: '' },
]

const focusCards = [
  { name: '超凡实业技术有限公司', badge: '待跟进', badgeStyle: 'yellow', icon2: gradeIcon, label2: 'A级客户', industry: '电气行业', icon4: lineOldIcon, label4: '旧线', note: '客户有意向，但未表明哪款产品' },
  { name: '金石科技', badge: '已拜访', badgeStyle: 'cyan', icon2: wechatIcon, label2: 'rnbujhu2818', industry: 'A级客户', icon4: locationIcon, label4: '广东省/深圳市/南山区', note: '客户有意向，但未表明哪款产品' },
  { name: '金剑制造实业控股', badge: '已报价', badgeStyle: 'blue', icon2: wechatIcon, label2: 'rnbujhu2818', industry: 'A级客户', icon4: locationIcon, label4: '广东省/深圳市/南山区', note: '客户有意向，但未表明哪款产品' },
]

const showFilter = ref(false)
const filterIdx = ref(0)

const showDatePopup = ref(false)
const datePickerTarget = ref('start')
const startTime = ref('')
const endTime = ref('')

const datePopupTitle = computed(() => datePickerTarget.value === 'start' ? '选择开始时间' : '选择结束时间')

const selectedTags = ref([])

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
const searchKeyword = ref('')
const searchState = ref('empty')
const searchResults = ref([])

const showNearbyPopup = ref(false)
const selectedDistance = ref('')
const customDistance = ref('')
const distanceRanges = ['10km以内', '30km以内', '50km以内', '100km以内']

const onNearbyConfirm = () => {
  showNearbyPopup.value = false
}

const mockSearchData = [
  { id: 1, name: '金山重工股份有限公司', manager: '张松', phone: '15899209987', createTime: '2024/01/23 10:12' },
  { id: 2, name: '金山重工有限公司', manager: '张松', phone: '15899209987', createTime: '2024/01/23 10:12' },
  { id: 3, name: '金山集团', manager: '张松', phone: '15899209987', createTime: '2024/01/23 10:12' },
]

const onSearch = () => {
  const kw = searchKeyword.value.trim()
  if (!kw) {
    searchState.value = 'empty'
    searchResults.value = []
    return
  }
  if (kw.length < 4) {
    searchState.value = 'tooMany'
    searchResults.value = []
    return
  }
  const filtered = mockSearchData.filter((item) => item.name.includes(kw))
  if (filtered.length === 0) {
    searchState.value = 'empty'
    searchResults.value = []
    return
  }
  searchResults.value = filtered.map((item) => {
    const idx = item.name.indexOf(kw)
    return {
      ...item,
      before: idx > 0 ? item.name.slice(0, idx) : '',
      after: item.name.slice(idx + kw.length),
    }
  })
  searchState.value = 'results'
}

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
.location-btn {
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
  background: #DEE8FA;
}

.stats-row {
  display: flex;
  padding: 28rpx 0;
}
.stat-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.stat-card--hidden {
  visibility: hidden;
}
.stat-label {
  font-size: 24rpx;
  color: #62687D;
}
.stat-num {
  font-size: 28rpx;
  font-weight: 700;
  color: #1A1D24;
}
.stat-change {
  display: flex;
  align-items: center;
  gap: 4rpx;
}
.stat-change.down .change-text {
  color: #F53F3F;
}
.stat-change.up .change-text {
  color: #37AE7E;
}
.arrow-up {
  width: 0;
  height: 0;
  border-left: 10rpx solid transparent;
  border-right: 10rpx solid transparent;
  border-bottom: 16rpx solid #37AE7E;
}
.arrow-down {
  width: 0;
  height: 0;
  border-left: 10rpx solid transparent;
  border-right: 10rpx solid transparent;
  border-top: 16rpx solid #F53F3F;
}
.change-text {
  font-size: 24rpx;
}
.v-divider {
  width: 1rpx;
  background: #DEE8FA;
  flex-shrink: 0;
  margin: 0 16rpx;
}
.v-divider--hidden {
  visibility: hidden;
}

.task-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 28rpx;
}
.task-title-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.task-header-icon {
  width: 38rpx;
  height: 38rpx;
  flex-shrink: 0;
}
.task-icon-dot {
  width: 8rpx;
  height: 32rpx;
  background: #37AE7E;
  border-radius: 2rpx;
  display: none;
}
.task-count-row {
  display: flex;
  align-items: baseline;
  gap: 4rpx;
}
.task-count {
  font-size: 28rpx;
  font-weight: 700;
  color: #1A1D24;
}
.task-count-label {
  font-size: 26rpx;
  color: #8C91A8;
}

.task-tabs-scroll {
  width: 100%;
  white-space: nowrap;
  padding-bottom: 28rpx;
}
.task-tabs {
  display: inline-flex;
  gap: 24rpx;
}
.task-tab {
  padding: 10rpx 16rpx;
  background: #FFFFFF;
  border: 1rpx solid #E8EAF3;
  border-radius: 8rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.task-tab--active {
  background: #EDFAF5;
  border-color: #B1E9D3;
}
.task-tab-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #62687D;
  white-space: nowrap;
}
.task-tabs--sales .task-tab {
  padding: 10rpx 58rpx;
}
.task-tab-text--active {
  color: #37AE7E;
}

.task-card {
  background: #FBFBFB;
  border: 1rpx solid #ECEBEB;
  border-radius: 16rpx;
  padding: 28rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 28rpx;
}
.task-card:last-child {
  margin-bottom: 0;
}
.tc-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tc-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #1A1D24;
}
.tc-badge {
  background: #D8F8FF;
  border-radius: 6rpx;
  padding: 2rpx 12rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
}
.tc-badge--yellow {
  background: #FFF8E1;
}
.tc-badge--blue {
  background: #D8E8FF;
}
.tc-badge-text {
  font-size: 24rpx;
  color: #15C2E9;
}
.tc-badge-text--yellow {
  color: #C79100;
}
.tc-badge-text--blue {
  color: #4A8FE2;
}
.tc-info {
  display: flex;
  align-items: center;
  gap: 4rpx;
}
.tc-info-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex: 1;
}
.tc-icon {
  width: 36rpx;
  height: 36rpx;
  flex-shrink: 0;
}
.tc-info-text {
  font-size: 26rpx;
  color: #62687D;
}
.tc-info-text--active {
  color: #37AE7E;
}
.tc-tags {
  display: flex;
  align-items: center;
  gap: 4rpx;
}
.tc-note {
  display: flex;
  padding: 10rpx 12rpx;
  background: #FFFFFF;
  border: 1rpx solid #ECEBEB;
  border-radius: 6rpx;
}
.tc-note-label {
  font-size: 24rpx;
  color: #62687D;
  flex-shrink: 0;
}
.tc-note-text {
  font-size: 24rpx;
  color: #1A1D24;
}
.tc-follow {
  width: 100%;
  height: 56rpx;
  background: #FFFFFF;
  border: 1rpx solid #37AE7E;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tc-follow-text {
  font-size: 24rpx;
  color: #37AE7E;
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
.filter-header-btn {
  font-size: 28rpx;
  color: #9292A5;
}
.filter-header-title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 500;
  color: #1A1D24;
}
.filter-header-confirm {
  color: #37AE7E;
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

.search-popup {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.sp-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24rpx 40rpx;
}
.sp-header-side {
  width: 44rpx;
  height: 44rpx;
}
.sp-header-close {
  display: flex;
  align-items: center;
  justify-content: center;
}
.sp-close-icon {
  width: 28rpx;
  height: 28rpx;
}
.sp-header-title {
  flex: 1;
  text-align: center;
  font-size: 34rpx;
  font-weight: 500;
  color: #333333;
}
.sp-input-row {
  display: flex;
  align-items: center;
  margin: 0 40rpx;
  height: 72rpx;
  background: #FBFBFB;
  border: 1rpx solid #ECEBEB;
  border-radius: 8rpx;
  padding: 0 20rpx;
}
.sp-input {
  flex: 1;
  font-size: 30rpx;
  height: 44rpx;
  line-height: 44rpx;
}
.sp-search-icon {
  width: 36rpx;
  height: 36rpx;
  flex-shrink: 0;
}
.sp-body {
  flex: 1;
  margin: 24rpx 40rpx 0;
  overflow: hidden;
}
.sp-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 120rpx;
  gap: 40rpx;
}
.sp-empty-img {
  width: 140rpx;
  height: 130rpx;
}
.sp-empty-text-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}
.sp-empty-text {
  font-size: 32rpx;
  color: #9CA5B1;
  text-align: center;
  line-height: 44rpx;
}
.sp-results {
  height: 100%;
}
.sp-card {
  background: #FBFBFB;
  border: 1rpx solid #ECEBEB;
  border-radius: 8rpx;
  padding: 28rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  margin-bottom: 16rpx;
}
.sp-card-name {
  font-size: 28rpx;
  line-height: 1.4;
}
.sp-card-name--normal {
  color: #1A1D24;
  font-weight: 400;
}
.sp-card-name--hl {
  color: #37AE7E;
  font-weight: 600;
}
.sp-card-name--bold {
  color: #1A1D24;
  font-weight: 600;
}
.sp-card-row {
  display: flex;
  align-items: center;
}
.sp-card-label {
  font-size: 28rpx;
  color: #62687D;
}
.sp-card-value {
  font-size: 28rpx;
  color: #1A1D24;
}

.nearby-popup {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.nearby-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24rpx 40rpx;
}
.nearby-header-btn {
  font-size: 28rpx;
  color: #9292A5;
}
.nearby-header-title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 500;
  color: #1A1D24;
}
.nearby-header-confirm {
  color: #37AE7E;
}
.nearby-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.nearby-sidebar {
  width: 190rpx;
  background: #F6F7FB;
  flex-shrink: 0;
}
.nearby-sidebar-item {
  padding: 20rpx 40rpx;
  background: #FFFFFF;
}
.nearby-sidebar-item--active {
  background: #FFFFFF;
}
.nearby-sidebar-text {
  font-size: 26rpx;
  font-weight: 500;
  color: #37AE7E;
}
.nearby-content {
  flex: 1;
  background: #FFFFFF;
  padding: 24rpx;
}
.nearby-cat-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #1A1D24;
  display: block;
  margin-bottom: 24rpx;
}
.nearby-loc-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  height: 60rpx;
  background: #EDFAF5;
  border-radius: 6rpx;
  padding: 0 20rpx;
  margin-bottom: 24rpx;
}
.nearby-loc-text {
  font-size: 26rpx;
  color: #37AE7E;
}
.nearby-loc-icon {
  width: 42rpx;
  height: 42rpx;
  flex-shrink: 0;
}
.nearby-divider {
  height: 1rpx;
  background: #F4F4F4;
  margin-bottom: 24rpx;
}
.nearby-range-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  margin-bottom: 24rpx;
}
.nearby-range-tag {
  padding: 12rpx 20rpx;
  background: #F6F7FB;
  border-radius: 6rpx;
}
.nearby-range-tag--active {
  background: #EDFAF5;
}
.nearby-range-text {
  font-size: 26rpx;
  color: #62687D;
}
.nearby-range-text--active {
  color: #37AE7E;
}
.nearby-custom-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.nearby-custom-box {
  flex: 1;
  height: 60rpx;
  background: #F6F7FB;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16rpx;
}
.nearby-custom-val {
  font-size: 26rpx;
  color: #1A1D24;
}
.nearby-custom-input {
  flex: 1;
  font-size: 26rpx;
  height: 44rpx;
  line-height: 44rpx;
  text-align: center;
}
.nearby-custom-unit {
  font-size: 26rpx;
  color: #62687D;
  flex-shrink: 0;
}
.nearby-custom-sep {
  width: 16rpx;
  height: 2rpx;
  background: #D9D9D9;
  flex-shrink: 0;
}
.nearby-footer {
  display: flex;
  gap: 28rpx;
  padding: 20rpx 40rpx 0;
}
.nearby-footer-btn {
  flex: 1;
  height: 76rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nearby-footer-clear {
  background: #EFFDF7;
  border: 2rpx solid #5CC79C;
}
.nearby-footer-clear-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #5CC79C;
}
.nearby-footer-submit {
  background: linear-gradient(270deg, rgba(102,220,166,1) 0%, rgba(88,188,150,1) 100%);
}
.nearby-footer-submit-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #FFFFFF;
}
</style>
