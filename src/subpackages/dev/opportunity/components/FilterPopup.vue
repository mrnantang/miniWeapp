<template>
  <view>
    <nut-popup v-model:visible="visible" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0', height: '1022rpx' }" :z-index="2000" safe-area-inset-bottom>
      <view class="filter-popup">
        <view class="filter-header">
          <text class="filter-header-title">{{ title || '全部筛选' }}</text>
        </view>
        <view class="filter-body">
          <scroll-view v-if="!simple" class="filter-sidebar" scroll-y :enhanced="true" :show-scrollbar="false">
            <view
              v-for="(item, idx) in sidebarItems"
              :key="item.label"
              class="filter-sidebar-item"
              :class="{ 'filter-sidebar-item--active': activeIdx === idx }"
              @tap="activeIdx = idx"
            >
              <text class="filter-sidebar-text" :class="{ 'filter-sidebar-text--active': activeIdx === idx }">{{ item.label }}</text>
            </view>
          </scroll-view>
          <scroll-view class="filter-content" scroll-y :enhanced="true" :show-scrollbar="false">
            <view v-if="currentType === 'org'" class="org-tags">
              <text class="org-cat-title">公司</text>
              <view class="org-tag-row">
                <view v-for="c in companyList" :key="c" class="org-tag" :class="{ 'org-tag--active': selected.includes(c) }" @tap="toggle(c)">
                  <text class="org-tag-text" :class="{ 'org-tag-text--active': selected.includes(c) }">{{ c }}</text>
                </view>
              </view>
              <text class="org-cat-title">部门</text>
              <view class="org-tag-row">
                <view v-for="d in deptList" :key="d" class="org-tag" :class="{ 'org-tag--active': selected.includes(d) }" @tap="toggle(d)">
                  <text class="org-tag-text" :class="{ 'org-tag-text--active': selected.includes(d) }">{{ d }}</text>
                </view>
              </view>
              <text class="org-cat-title">子部门</text>
              <view class="org-tag-row">
                <view v-for="s in subDeptList" :key="s" class="org-tag" :class="{ 'org-tag--active': selected.includes(s) }" @tap="toggle(s)">
                  <text class="org-tag-text" :class="{ 'org-tag-text--active': selected.includes(s) }">{{ s }}</text>
                </view>
              </view>
              <text class="org-cat-title">员工</text>
              <view class="org-tag-row" v-for="(row, ri) in employeeRows" :key="ri">
                <view v-for="e in row" :key="e" class="org-tag" :class="{ 'org-tag--active': selected.includes(e) }" @tap="toggle(e)">
                  <text class="org-tag-text" :class="{ 'org-tag-text--active': selected.includes(e) }">{{ e }}</text>
                </view>
              </view>
            </view>
            <view v-if="currentType === 'industry'" class="org-tags">
              <text class="org-cat-title">客户行业</text>
              <view class="org-tag-row">
                <view v-for="it in industryList" :key="it" class="org-tag" :class="{ 'org-tag--active': selected.includes(it) }" @tap="toggle(it)">
                  <text class="org-tag-text" :class="{ 'org-tag-text--active': selected.includes(it) }">{{ it }}</text>
                </view>
              </view>
            </view>
            <view v-if="currentType === 'leadLevel'" class="org-tags">
              <text class="org-cat-title">线索等级</text>
              <view class="org-tag-row">
                <view v-for="lv in leadLevelList" :key="lv" class="org-tag" :class="{ 'org-tag--active': selected.includes(lv) }" @tap="toggle(lv)">
                  <text class="org-tag-text" :class="{ 'org-tag-text--active': selected.includes(lv) }">{{ lv }}</text>
                </view>
              </view>
            </view>
            <view v-if="currentType === 'region'" class="region-section">
              <view class="region-tabs">
                <view v-for="tab in regionTabs" :key="tab" class="region-tab" :class="{ 'region-tab--active': regionTabActive === tab }" @tap="regionTabActive = tab">
                  <text class="region-tab-text" :class="{ 'region-tab-text--active': regionTabActive === tab }">{{ tab }}</text>
                </view>
              </view>
              <view class="org-tag-row">
                <view v-for="item in currentRegionItems" :key="item" class="org-tag" :class="{ 'org-tag--active': selected.includes(item) }" @tap="toggle(item)">
                  <text class="org-tag-text" :class="{ 'org-tag-text--active': selected.includes(item) }">{{ item }}</text>
                </view>
              </view>
            </view>
            <view v-if="currentType === 'channel'" class="org-tags">
              <text class="org-cat-title">渠道来源</text>
              <view class="org-tag-row">
                <view v-for="ch in channelList" :key="ch" class="org-tag" :class="{ 'org-tag--active': selected.includes(ch) }" @tap="toggle(ch)">
                  <text class="org-tag-text" :class="{ 'org-tag-text--active': selected.includes(ch) }">{{ ch }}</text>
                </view>
              </view>
            </view>
            <view v-if="currentType === 'time'" class="time-section">
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
          <view class="filter-footer-btn filter-footer-clear" @tap="onClear">
            <text class="filter-footer-clear-text">清空选择</text>
          </view>
          <view class="filter-footer-btn filter-footer-submit" @tap="onConfirm">
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
        <picker-view class="date-picker-body" :value="pickerValue" indicator-style="height: 68rpx;" @change="onPickerChange">
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
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  simple: { type: Boolean, default: false },
  activeType: { type: String, default: 'org' },
  title: { type: String, default: '' },
  sidebarItems: { type: Array, default: () => [] },
  initialSelected: { type: Array, default: () => [] },
  multiple: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'clear'])

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const activeIdx = ref(0)
const selected = ref([])
const showDatePopup = ref(false)
const datePickerTarget = ref('start')
const startTime = ref('')
const endTime = ref('')

const regionTabActive = ref('省')
const regionTabs = ['省', '市', '区']

const companyList = ['德贝尔总公司', '江苏扬州办事处', '江苏苏州办事处', '江苏徐州办事处']
const deptList = ['销售总部', '开发总部', '财务总部', '外贸总部']
const subDeptList = ['销售一部', '销售二部']
const employeeRows = [
  ['张传送', '李治廷'],
  ['仇茂茂', '李聪'],
  ['屈伊', '陈子奕'],
  ['仇茂茂', '李聪'],
]

const industryList = ['电气行业', '机械制造', '化工行业', '纺织服装', '信息技术', '建筑工程', '食品加工', '医药制造']
const leadLevelList = ['全部', 'A级线索', 'B级线索', 'C级线索', 'D级线索']

const regionProvinceList = ['全部', '广东省', '江苏省', '福建省', '北京市', '天津市', '上海市', '江西省', '广西省', '四川省', '重庆市', '云南省', '贵州省']

const regionDetailList = ['广东省/深圳市/南山区', '广东省/深圳市/福田区', '广东省/广州市/天河区', '江苏省/苏州市/姑苏区', '江苏省/扬州市', '江苏省/徐州市']

const regionCityList = computed(() => {
  const cities = new Set()
  regionDetailList.forEach(r => {
    const parts = r.split('/')
    if (parts.length >= 2) cities.add(parts[1])
  })
  return ['全部', ...cities]
})

const regionDistrictList = computed(() => {
  const districts = new Set()
  regionDetailList.forEach(r => {
    const parts = r.split('/')
    if (parts.length >= 3) districts.add(parts[2])
  })
  return ['全部', ...districts]
})

const currentRegionItems = computed(() => {
  if (regionTabActive.value === '省') return regionProvinceList
  if (regionTabActive.value === '市') return regionCityList.value
  return regionDistrictList.value
})

const channelList = ['全部', '抖音平台', '百度平台', '腾讯广告', '小红书']

const sidebarTypeMap = computed(() => props.sidebarItems.map(i => i.type))

const currentType = computed(() => {
  if (props.simple) return props.activeType
  return sidebarTypeMap.value[activeIdx.value] || 'org'
})

const datePopupTitle = computed(() => datePickerTarget.value === 'start' ? '选择开始时间' : '选择结束时间')

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

watch(() => props.modelValue, (val) => {
  if (val) {
    selected.value = [...props.initialSelected]
    activeIdx.value = 0
    regionTabActive.value = '省'
    startTime.value = ''
    endTime.value = ''
  }
})

const toggle = (tag) => {
  if (!props.multiple) {
    selected.value = [tag]
    return
  }
  const idx = selected.value.indexOf(tag)
  if (idx >= 0) {
    selected.value.splice(idx, 1)
  } else {
    selected.value.push(tag)
  }
}

const onClear = () => {
  selected.value = []
  startTime.value = ''
  endTime.value = ''
  emit('clear')
}

const onConfirm = () => {
  emit('confirm', {
    type: currentType.value,
    selected: [...selected.value],
    startTime: startTime.value,
    endTime: endTime.value,
  })
  visible.value = false
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

const onPickerChange = (e) => {
  pickerValue.value = e.detail.value
}
</script>

<style>
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
  font-weight: bold;
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
  width: 220rpx;
  background: #F6F7FB;
  flex-shrink: 0;
  height: 100%;
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
  white-space: nowrap;
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
.region-section {
  padding: 0;
}
.region-tabs {
  display: flex;
  gap: 24rpx;
  margin-bottom: 24rpx;
}
.region-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.region-tab-text {
  font-size: 26rpx;
  font-weight: 500;
  color: #62687D;
}
.region-tab-text--active {
  color: #1A1D24;
}
.org-tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  margin-bottom: 24rpx;
}
.org-tag {
  width: calc(50% - 12rpx);
  padding: 12rpx 10rpx;
  background: #F6F7FB;
  border-radius: 6rpx;
  text-align: center;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
