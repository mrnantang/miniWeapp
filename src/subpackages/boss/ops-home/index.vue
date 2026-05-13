<template>
  <view class="dev-home">
    <view class="banner-wrap">
      <image class="banner-bg" :src="devBannerImg" mode="aspectFill" />
      <view class="banner-mask" />
      <view class="banner-info">
        <text class="banner-title">老板工作台</text>
        <text class="banner-subtitle" @tap="showFilter = true">高效管理，精准运营！</text>
      </view>
    </view>

    <view class="boss-panel">
      <view class="boss-panel-inner">
        <view class="boss-section">
          <view class="boss-section-head" @tap="toggleSection('ops')">
            <text class="boss-section-title">运营数据</text>
            <image class="boss-section-arrow" :class="{ 'boss-section-arrow--open': openSections.includes('ops') }" :src="iconArrow" mode="aspectFit" />
          </view>
          <view v-if="openSections.includes('ops')">
            <view class="boss-divider" />
            <view class="boss-metrics-row">
              <view class="boss-metric-card">
                <text class="boss-metric-label">投流消费总金额</text>
                <view class="boss-metric-value-row">
                  <text class="boss-metric-unit">￥</text>
                  <text class="boss-metric-value">123091102.0</text>
                </view>
                <view class="boss-metric-change boss-metric-change--up">
                  <view class="boss-change-arrow boss-change-arrow--up" />
                  <text class="boss-change-text">12.8%</text>
                </view>
              </view>
              <view class="boss-col-divider" />
              <view class="boss-metric-card">
                <text class="boss-metric-label">有效询盘数量</text>
                <text class="boss-metric-value boss-metric-value--standalone">2091</text>
                <view class="boss-metric-change boss-metric-change--down">
                  <view class="boss-change-arrow boss-change-arrow--down" />
                  <text class="boss-change-text boss-change-text--down">4.0%</text>
                </view>
              </view>
              <view class="boss-col-divider" />
              <view class="boss-metric-card">
                <text class="boss-metric-label">投流ROI</text>
                <view class="boss-metric-value-row">
                  <text class="boss-metric-value">67.8</text>
                  <text class="boss-metric-unit">%</text>
                </view>
                <view class="boss-metric-change boss-metric-change--up">
                  <view class="boss-change-arrow boss-change-arrow--up" />
                  <text class="boss-change-text">12.8%</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="boss-divider" />

        <view class="boss-section">
          <view class="boss-section-head" @tap="toggleSection('deal')">
            <text class="boss-section-title">成交数据</text>
            <image class="boss-section-arrow" :class="{ 'boss-section-arrow--open': openSections.includes('deal') }" :src="iconArrow" mode="aspectFit" />
          </view>
          <view v-if="openSections.includes('deal')">
            <view class="boss-divider" />
            <view class="boss-metrics-row">
              <view v-for="(c, ci) in dealRow1" :key="ci" class="boss-metric-card">
                <text class="boss-metric-label">{{ c.label }}</text>
                <view class="boss-metric-value-row">
                  <text v-if="c.prefix" class="boss-metric-unit">{{ c.prefix }}</text>
                  <text class="boss-metric-value">{{ c.value }}</text>
                  <text v-if="c.suffix" class="boss-metric-unit">{{ c.suffix }}</text>
                </view>
                <view class="boss-metric-change" :class="c.up ? 'boss-metric-change--up' : 'boss-metric-change--down'">
                  <view class="boss-change-arrow" :class="c.up ? 'boss-change-arrow--up' : 'boss-change-arrow--down'" />
                  <text class="boss-change-text" :class="c.up ? '' : 'boss-change-text--down'">{{ c.change }}</text>
                </view>
              </view>
              <template v-if="dealRow1.length === 2">
                <view class="boss-col-divider" />
                <view class="boss-metric-card boss-metric-card--empty" />
              </template>
            </view>
            <view class="boss-row-divider" />
            <view class="boss-metrics-row">
              <view v-for="(c, ci) in dealRow2" :key="ci" class="boss-metric-card">
                <text class="boss-metric-label">{{ c.label }}</text>
                <view class="boss-metric-value-row">
                  <text v-if="c.prefix" class="boss-metric-unit">{{ c.prefix }}</text>
                  <text class="boss-metric-value">{{ c.value }}</text>
                  <text v-if="c.suffix" class="boss-metric-unit">{{ c.suffix }}</text>
                </view>
                <view class="boss-metric-change" :class="c.up ? 'boss-metric-change--up' : 'boss-metric-change--down'">
                  <view class="boss-change-arrow" :class="c.up ? 'boss-change-arrow--up' : 'boss-change-arrow--down'" />
                  <text class="boss-change-text" :class="c.up ? '' : 'boss-change-text--down'">{{ c.change }}</text>
                </view>
              </view>
              <template v-if="dealRow2.length === 2">
                <view class="boss-col-divider" />
                <view class="boss-metric-card boss-metric-card--empty" />
              </template>
            </view>
          </view>
        </view>

        <view class="boss-divider" />

        <view class="boss-section">
          <view class="boss-section-head" @tap="toggleSection('lead')">
            <text class="boss-section-title">线索数据</text>
            <image class="boss-section-arrow" :class="{ 'boss-section-arrow--open': openSections.includes('lead') }" :src="iconArrow" mode="aspectFit" />
          </view>
          <view v-if="openSections.includes('lead')">
            <view class="boss-divider" />
            <view class="boss-metrics-row">
              <view v-for="(c, ci) in leadRow1" :key="ci" class="boss-metric-card">
                <text class="boss-metric-label">{{ c.label }}</text>
                <view class="boss-metric-value-row">
                  <text v-if="c.prefix" class="boss-metric-unit">{{ c.prefix }}</text>
                  <text class="boss-metric-value">{{ c.value }}</text>
                  <text v-if="c.suffix" class="boss-metric-unit">{{ c.suffix }}</text>
                </view>
                <view class="boss-metric-change" :class="c.up ? 'boss-metric-change--up' : 'boss-metric-change--down'">
                  <view class="boss-change-arrow" :class="c.up ? 'boss-change-arrow--up' : 'boss-change-arrow--down'" />
                  <text class="boss-change-text" :class="c.up ? '' : 'boss-change-text--down'">{{ c.change }}</text>
                </view>
              </view>
              <template v-if="leadRow1.length === 2">
                <view class="boss-col-divider" />
                <view class="boss-metric-card boss-metric-card--empty" />
              </template>
            </view>
            <view class="boss-row-divider" />
            <view class="boss-metrics-row">
              <view v-for="(c, ci) in leadRow2" :key="ci" class="boss-metric-card">
                <text class="boss-metric-label">{{ c.label }}</text>
                <view class="boss-metric-value-row">
                  <text v-if="c.prefix" class="boss-metric-unit">{{ c.prefix }}</text>
                  <text class="boss-metric-value">{{ c.value }}</text>
                  <text v-if="c.suffix" class="boss-metric-unit">{{ c.suffix }}</text>
                </view>
                <view class="boss-metric-change" :class="c.up ? 'boss-metric-change--up' : 'boss-metric-change--down'">
                  <view class="boss-change-arrow" :class="c.up ? 'boss-change-arrow--up' : 'boss-change-arrow--down'" />
                  <text class="boss-change-text" :class="c.up ? '' : 'boss-change-text--down'">{{ c.change }}</text>
                </view>
              </view>
              <template v-if="leadRow2.length === 2">
                <view class="boss-col-divider" />
                <view class="boss-metric-card boss-metric-card--empty" />
              </template>
            </view>
          </view>
        </view>

        <view class="boss-divider" />

        <view class="boss-section">
          <view class="boss-section-head" @tap="toggleSection('region')">
            <text class="boss-section-title">区域成交数据 | 前五</text>
            <image class="boss-section-arrow" :class="{ 'boss-section-arrow--open': openSections.includes('region') }" :src="iconArrow" mode="aspectFit" />
          </view>
          <view v-if="openSections.includes('region')">
            <view class="boss-divider" />
            <view v-for="(row, ri) in regionRows" :key="ri">
              <view v-if="ri > 0" class="boss-row-divider" />
              <view class="boss-metrics-row">
                <view v-for="(c, ci) in row" :key="ci" class="boss-metric-card">
                  <text class="boss-metric-label">{{ c.label }}</text>
                  <view class="boss-metric-value-row">
                    <text v-if="c.prefix" class="boss-metric-unit">{{ c.prefix }}</text>
                    <text class="boss-metric-value">{{ c.value }}</text>
                    <text v-if="c.suffix" class="boss-metric-unit">{{ c.suffix }}</text>
                  </view>
                  <view class="boss-metric-change" :class="c.up ? 'boss-metric-change--up' : 'boss-metric-change--down'">
                    <view class="boss-change-arrow" :class="c.up ? 'boss-change-arrow--up' : 'boss-change-arrow--down'" />
                    <text class="boss-change-text" :class="c.up ? '' : 'boss-change-text--down'">{{ c.change }}</text>
                  </view>
                </view>
                <template v-if="row.length === 2">
                  <view class="boss-col-divider" />
                  <view class="boss-metric-card boss-metric-card--empty" />
                </template>
              </view>
            </view>
          </view>
        </view>

        <view class="boss-divider" />

        <view class="boss-section">
          <view class="boss-section-head" @tap="toggleSection('personal')">
            <text class="boss-section-title">运营个人成交数据 | 前五</text>
            <image class="boss-section-arrow" :class="{ 'boss-section-arrow--open': openSections.includes('personal') }" :src="iconArrow" mode="aspectFit" />
          </view>
          <view v-if="openSections.includes('personal')">
            <view class="boss-divider" />
            <view v-for="(row, ri) in personalRows" :key="ri">
              <view v-if="ri > 0" class="boss-row-divider" />
              <view class="boss-metrics-row">
                <view v-for="(c, ci) in row" :key="ci" class="boss-metric-card">
                  <text class="boss-metric-label">{{ c.label }}</text>
                  <view class="boss-metric-value-row">
                    <text v-if="c.prefix" class="boss-metric-unit">{{ c.prefix }}</text>
                    <text class="boss-metric-value">{{ c.value }}</text>
                    <text v-if="c.suffix" class="boss-metric-unit">{{ c.suffix }}</text>
                  </view>
                  <view class="boss-metric-change" :class="c.up ? 'boss-metric-change--up' : 'boss-metric-change--down'">
                    <view class="boss-change-arrow" :class="c.up ? 'boss-change-arrow--up' : 'boss-change-arrow--down'" />
                    <text class="boss-change-text" :class="c.up ? '' : 'boss-change-text--down'">{{ c.change }}</text>
                  </view>
                </view>
                <template v-if="row.length === 2">
                  <view class="boss-col-divider" />
                  <view class="boss-metric-card boss-metric-card--empty" />
                </template>
              </view>
            </view>
          </view>
        </view>

        <view class="boss-section">
          <view class="boss-section-head">
            <view class="boss-task-title-row">
              <image class="boss-task-header-icon" :src="iconTaskHeader" mode="aspectFit" />
              <text class="boss-section-title">重点客户跟进情况</text>
            </view>
          </view>

          <view v-for="card in focusCards" :key="card.name" class="task-card">
            <view class="tc-head">
              <text class="tc-name">{{ card.name }}</text>
              <view class="tc-badge" :class="'tc-badge--' + card.badgeStyle">
                <text class="tc-badge-text" :class="'tc-badge-text--' + card.badgeStyle">{{ card.badge }}</text>
              </view>
            </view>
            <view class="tc-info">
              <view class="tc-info-item">
                <image class="tc-icon" :src="iconPhone" mode="aspectFit" />
                <text class="tc-info-text tc-info-text--active">15899280987</text>
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
            <view class="tc-note">
              <text class="tc-note-label">最新跟进：</text>
              <text class="tc-note-text">{{ card.note }}</text>
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

  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import Taro from '@tarojs/taro'
import TabBar from '../../boss/tabs/index.vue'
import devBannerImg from '@/assets/login/bossBG.jpg'
import iconFilter from '@/assets/dev/icon-filter.png'
import iconTaskHeader from '@/assets/dev/icon-task-header.png'
import iconPhone from '@/assets/dev/icon-phone.png'
import iconIndustry from '@/assets/dev/icon-industry.png'
import wechatIcon from '@/assets/dev/icon-wechat.png'
import gradeIcon from '@/assets/dev/icon-grade.png'
import locationIcon from '@/assets/dev/icon-location.png'
import lineOldIcon from '@/assets/dev/icon-line-old.png'
import iconArrow from '@/assets/dev/upArror.png'

const openSections = ref(['ops'])

const toggleSection = (key) => {
  const idx = openSections.value.indexOf(key)
  if (idx >= 0) {
    openSections.value.splice(idx, 1)
  } else {
    openSections.value.push(key)
  }
}

const dealRow1 = [
  { label: '意向成交总金额', prefix: '￥', value: '5739400.0', change: '12.8%', up: true },
  { label: '有效询盘', value: '618', change: '12.8%', up: true },
  { label: '客户成交量', value: '89', change: '12.8%', up: true },
]
const dealRow2 = [
  { label: '客户成交率', value: '11.2', suffix: '%', change: '12.8%', up: true },
  { label: '客单价', prefix: '￥', value: '64487.0', change: '4.0%', up: false },
  { label: '成功签约率', value: '11.2', suffix: '%', change: '4.0%', up: false },
]

const leadRow1 = [
  { label: '总线索量', value: '2091', change: '12.8%', up: true },
  { label: '新增线索量', value: '284', change: '4.0%', up: false },
  { label: '公海线索量', value: '978', change: '12.8%', up: true },
]
const leadRow2 = [
  { label: '昨日新增线索量', value: '199', change: '4.0%', up: false },
  { label: '总线索转化率', value: '11.2', suffix: '%', change: '12.8%', up: true },
  { label: '新增线索转化率', value: '11.2', suffix: '%', change: '4.0%', up: false },
]

const regionRows = [
  [
    { label: '广东省', prefix: '￥', value: '5739400.0', change: '12.8%', up: true },
    { label: '江苏省', prefix: '￥', value: '5739400.0', change: '12.8%', up: true },
    { label: '福建省', prefix: '￥', value: '5739400.0', change: '12.8%', up: true },
  ],
  [
    { label: '北京市', prefix: '￥', value: '5739400.0', change: '12.8%', up: true },
    { label: '广东省', prefix: '￥', value: '5739400.0', change: '12.8%', up: true },
    { label: '江苏省', prefix: '￥', value: '5739400.0', change: '4.0%', up: false },
  ],
  [
    { label: '福建省', prefix: '￥', value: '5739400.0', change: '12.8%', up: true },
    { label: '广东省', prefix: '￥', value: '5739400.0', change: '4.0%', up: false },
    { label: '江苏省', prefix: '￥', value: '5739400.0', change: '4.0%', up: false },
  ],
  [
    { label: '福建省', prefix: '￥', value: '5739400.0', change: '12.8%', up: true },
    { label: '广东省', prefix: '￥', value: '5739400.0', change: '4.0%', up: false },
    { label: '江苏省', prefix: '￥', value: '5739400.0', change: '4.0%', up: false },
  ],
]

const personalRows = [
  [
    { label: '张传送', prefix: '￥', value: '5739400.0', change: '12.8%', up: true },
    { label: '李治廷', prefix: '￥', value: '5739400.0', change: '12.8%', up: true },
    { label: '仇茂茂', prefix: '￥', value: '5739400.0', change: '12.8%', up: true },
  ],
  [
    { label: '李聪', prefix: '￥', value: '5739400.0', change: '12.8%', up: true },
    { label: '屈伊', prefix: '￥', value: '5739400.0', change: '4.0%', up: false },
    { label: '陈子奕', prefix: '￥', value: '5739400.0', change: '4.0%', up: false },
  ],
]

const focusCards = [
  { name: '超凡实业技术有限公司', badge: '待跟进', badgeStyle: 'yellow', icon2: gradeIcon, label2: 'A级客户', industry: '电气行业', icon4: lineOldIcon, label4: '旧线', note: '客户有意向，但未表明哪款产品' },
  { name: '金石科技', badge: '已拜访', badgeStyle: 'cyan', icon2: wechatIcon, label2: 'rnbujhu2818', industry: 'A级客户', icon4: locationIcon, label4: '广东省/深圳市/南山区', note: '客户有意向，但未表明哪款产品' },
  { name: '金剑制造实业控股', badge: '已报价', badgeStyle: 'blue', icon2: wechatIcon, label2: 'rnbujhu2818', industry: 'A级客户', icon4: locationIcon, label4: '广东省/深圳市/南山区', note: '客户有意向，但未表明哪款产品' },
]

const showFilter = ref(false)
const filterIdx = ref(0)

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

.boss-panel {
  position: relative;
  margin-top: -38rpx;
  background: #FFFFFF;
  border-radius: 24rpx 24rpx 0 0;
  box-shadow: 0 -6rpx 46rpx rgba(64,200,166,0.31);
  padding-bottom: 120rpx;
}
.boss-panel-inner {
  padding: 40rpx;
}

.boss-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 0;
}
.boss-section-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #1A1D24;
}
.boss-section-arrow {
  width: 36rpx;
  height: 36rpx;
  transition: transform 0.2s;
  flex-shrink: 0;
}
.boss-section-arrow--open {
  transform: rotate(-180deg);
}

.boss-divider {
  height: 1rpx;
  background: #DEE8FA;
}
.boss-row-divider {
  height: 1rpx;
  background: #DEE8FA;
  margin: 0 -28rpx;
}

.boss-metrics-row {
  display: flex;
  align-items: flex-start;
  padding: 16rpx 0;
}
.boss-metric-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.boss-metric-card--empty {
  visibility: hidden;
}
.boss-metric-label {
  font-size: 24rpx;
  color: #62687D;
}
.boss-metric-value-row {
  display: flex;
  align-items: center;
  gap: 4rpx;
}
.boss-metric-value {
  font-size: 28rpx;
  font-weight: 700;
  color: #1A1D24;
}
.boss-metric-value--standalone {
  margin-top: 0;
}
.boss-metric-unit {
  font-size: 16rpx;
  font-weight: 700;
  color: #1A1D24;
}
.boss-metric-change {
  display: flex;
  align-items: center;
  gap: 4rpx;
}
.boss-change-arrow {
  width: 0;
  height: 0;
  border-left: 8rpx solid transparent;
  border-right: 8rpx solid transparent;
}
.boss-change-arrow--up {
  border-bottom: 10rpx solid #37AE7E;
}
.boss-change-arrow--down {
  border-top: 10rpx solid #F53F3F;
}
.boss-change-text {
  font-size: 24rpx;
  color: #37AE7E;
}
.boss-change-text--down {
  color: #F53F3F;
}
.boss-col-divider {
  width: 1rpx;
  background: #DEE8FA;
  flex-shrink: 0;
  margin: 0 8rpx;
  align-self: stretch;
}

.boss-task-title-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.boss-task-header-icon {
  width: 38rpx;
  height: 38rpx;
  flex-shrink: 0;
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
