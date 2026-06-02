<template>
  <view>
    <nut-popup v-model:visible="visible" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0', height: '1022rpx' }" :z-index="2000" safe-area-inset-bottom>
      <view class="filter-popup">
        <view class="filter-header">
          <text class="filter-header-title">{{ title || '全部筛选' }}</text>
        </view>
        <view class="filter-body">
          <scroll-view v-if="!simple" class="filter-sidebar" scroll-y="true" :enhanced="true" :show-scrollbar="false">
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
          <scroll-view class="filter-content" scroll-y="true" :enhanced="true" :show-scrollbar="false">
            <view v-if="currentType === 'userCascader'" class="region-section">
              <view class="region-breadcrumb">
                <text class="region-breadcrumb-item" :class="{ 'region-breadcrumb-item--active': userDrillStack.length === 0 }" @tap="userCascaderBackTo(0)">{{ userDrillStack.length > 0 ? userDrillStack[0].name : '请选择公司' }}</text>
                <template v-for="(node, idx) in userDrillStack.slice(1)" :key="getNodeKey(node)">
                  <text class="region-breadcrumb-sep">/</text>
                  <text class="region-breadcrumb-item" :class="{ 'region-breadcrumb-item--active': idx + 1 === userDrillStack.length - 1 }" @tap="userCascaderBackTo(idx + 1)">{{ node.name }}</text>
                </template>
                <template v-if="selected.length > 0">
                  <text class="region-breadcrumb-sep">/</text>
                  <text class="region-breadcrumb-item region-breadcrumb-item--active">{{ buildUserCascaderPath().split('/').pop() }}</text>
                </template>
              </view>
              <view v-if="userCascaderLoading" class="region-loading"><text class="region-loading-text">加载中...</text></view>
              <view v-else class="org-tag-row">
                <view v-for="item in currentUserCascaderItems" :key="getNodeKey(item)" class="org-tag" :class="{ 'org-tag--active': isUserCascaderSelected(item) }" @tap="onUserCascaderTap(item)">
                  <text class="org-tag-text" :class="{ 'org-tag-text--active': isUserCascaderSelected(item) }">{{ item.name }}</text>
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
import { ref, reactive, computed, watch } from 'vue'
import { getRegionTree } from '@/api/platform'
import { getUserCascader } from '@/api/system'

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
const selectedMap = reactive({})
const selected = computed({
  get: () => {
    if (!selectedMap[currentType.value]) {
      selectedMap[currentType.value] = []
    }
    return selectedMap[currentType.value]
  },
  set: (val) => { selectedMap[currentType.value] = val }
})
const showDatePopup = ref(false)
const datePickerTarget = ref('start')
const startTime = ref('')
const endTime = ref('')

const regionTree = ref([])
const regionTreeLoading = ref(false)
const drillLevel = ref(0)
const drillProvince = ref(null)
const drillCity = ref(null)

const userCascaderTree = ref([])
const userCascaderLoading = ref(false)
const userDrillStack = ref([])

const industryList = ['电气行业', '管道行业', '卷涂行业', '家居行业', '家具行业', '交通行业', '行业类别', '铝材行业', '体育用品', '五金行业', '消防器材', '新能源行业', '重工行业', '其他行业']
const leadLevelList = ['A级线索', 'B级线索', 'C级线索', 'D级线索']

const currentRegionItems = computed(() => {
  if (drillLevel.value === 0) return regionTree.value
  if (drillLevel.value === 1 && drillProvince.value) return drillProvince.value.children || []
  if (drillLevel.value === 2 && drillCity.value) return drillCity.value.children || []
  return []
})

const currentUserCascaderItems = computed(() => {
  if (userDrillStack.value.length === 0) return userCascaderTree.value
  const last = userDrillStack.value[userDrillStack.value.length - 1]
  return last.children || []
})

const channelList = ['抖音平台', '百度平台', '腾讯广告', '小红书']

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
    if (props.initialSelected.length > 0) {
      selectedMap[currentType.value] = [...props.initialSelected]
    } else if (!selectedMap[currentType.value]) {
      selectedMap[currentType.value] = []
    }
    activeIdx.value = 0
    drillLevel.value = 0
    drillProvince.value = null
    drillCity.value = null
    userDrillStack.value = []
    startTime.value = ''
    endTime.value = ''
    if (regionTree.value.length === 0) {
      fetchRegionTree().then(() => {
        if (currentType.value === 'region' && selected.value.length > 0) {
          restoreRegionDrill(selected.value[0])
        }
      })
    } else if (currentType.value === 'region' && selected.value.length > 0) {
      restoreRegionDrill(selected.value[0])
    }
    if (userCascaderTree.value.length === 0) {
      fetchUserCascader().then(() => {
        if (currentType.value === 'userCascader' && selected.value.length > 0) {
          restoreUserCascaderDrill(Number(selected.value[0]))
        }
      })
    } else if (currentType.value === 'userCascader' && selected.value.length > 0) {
      restoreUserCascaderDrill(Number(selected.value[0]))
    }
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

const fetchRegionTree = async () => {
  if (regionTree.value.length > 0 || regionTreeLoading.value) return
  regionTreeLoading.value = true
  try {
    const res = await getRegionTree()
    regionTree.value = res.items || []
  } catch {
    // 加载失败保持空列表
  } finally {
    regionTreeLoading.value = false
  }
}

const restoreRegionDrill = (code) => {
  if (!code || regionTree.value.length === 0) return
  for (const province of regionTree.value) {
    for (const city of province.children || []) {
      for (const district of city.children || []) {
        if (district.code === code) {
          drillProvince.value = province
          drillCity.value = city
          drillLevel.value = 2
          return
        }
      }
    }
  }
}

const isRegionSelected = (item) => {
  if (drillLevel.value === 0) return drillProvince.value?.code === item.code
  if (drillLevel.value === 1) return drillCity.value?.code === item.code
  return selected.value.includes(item.code)
}

const onRegionTap = (item) => {
  if (item.level === 1) {
    drillProvince.value = item
    drillCity.value = null
    drillLevel.value = 1
    selected.value = []
  } else if (item.level === 2) {
    drillCity.value = item
    drillLevel.value = 2
    selected.value = []
  } else if (item.level === 3) {
    if (!props.multiple) {
      selected.value = [item.code]
    } else {
      const idx = selected.value.indexOf(item.code)
      if (idx >= 0) {
        selected.value.splice(idx, 1)
      } else {
        selected.value.push(item.code)
      }
    }
  }
}

const drillBackTo = (level) => {
  if (level === 0) {
    drillProvince.value = null
    drillCity.value = null
    drillLevel.value = 0
    selected.value = []
  } else if (level === 1) {
    drillCity.value = null
    drillLevel.value = 1
    selected.value = []
  }
}

const buildRegionPath = () => {
  const parts = []
  if (drillProvince.value) parts.push(drillProvince.value.name)
  if (drillCity.value) parts.push(drillCity.value.name)
  if (drillLevel.value >= 2 && selected.value.length > 0) {
    const district = drillCity.value?.children?.find(c => c.code === selected.value[0])
    if (district) parts.push(district.name)
  }
  return parts.join('/')
}

const findPathByCode = (code) => {
  for (const p of regionTree.value) {
    for (const c of p.children || []) {
      for (const d of c.children || []) {
        if (d.code === code) return `province:${p.code}/city:${c.code}/district:${d.code}`
      }
    }
  }
  return ''
}

const fetchUserCascader = async () => {
  if (userCascaderTree.value.length > 0 || userCascaderLoading.value) return
  userCascaderLoading.value = true
  try {
    const res = await getUserCascader({ permissionCode: 'lead.create', companyId: 1 })
    userCascaderTree.value = res.items || []
  } catch {
    // 加载失败保持空列表
  } finally {
    userCascaderLoading.value = false
  }
  return
}

const getNodeKey = (node) => {
  if (node.nodeType === 'user') return `u-${node.userId}`
  if (node.nodeType === 'department') return `d-${node.departmentId || node.name}`
  return `c-${node.companyId || node.name}`
}

const isUserCascaderSelected = (item) => {
  return selected.value.length > 0 && selected.value[0] === item.userId
}

const onUserCascaderTap = (item) => {
  if (item.nodeType === 'user') {
    if (!props.multiple) {
      selected.value = [item.userId]
    } else {
      const idx = selected.value.indexOf(item.userId)
      if (idx >= 0) {
        selected.value.splice(idx, 1)
      } else {
        selected.value.push(item.userId)
      }
    }
  } else {
    userDrillStack.value.push(item)
    selected.value = []
  }
}

const userCascaderBackTo = (index) => {
  userDrillStack.value = userDrillStack.value.slice(0, index)
  selected.value = []
}

const buildUserCascaderPath = () => {
  const parts = userDrillStack.value.map(n => n.name)
  if (selected.value.length > 0) {
    const lastChildren = userDrillStack.value.length > 0
      ? userDrillStack.value[userDrillStack.value.length - 1].children || []
      : userCascaderTree.value
    const selectedUser = lastChildren.find(c => c.userId === selected.value[0])
    if (selectedUser) parts.push(selectedUser.name)
  }
  return parts.join('/')
}

const getSelectedUserId = () => {
  if (selected.value.length > 0) return selected.value[0]
  return undefined
}

const getSelectedUserName = () => {
  if (selected.value.length === 0) return undefined
  const lastChildren = userDrillStack.value.length > 0
    ? userDrillStack.value[userDrillStack.value.length - 1].children || []
    : userCascaderTree.value
  const user = lastChildren.find(c => c.userId === selected.value[0])
  return user ? user.name : undefined
}

const restoreUserCascaderDrill = (targetId) => {
  if (!targetId || userCascaderTree.value.length === 0) return
  const findPath = (nodes, path = []) => {
    for (const node of nodes) {
      if (node.nodeType === 'user' && node.userId === targetId) return [...path]
      if (node.children && node.children.length > 0) {
        const found = findPath(node.children, [...path, node])
        if (found) return found
      }
    }
    return null
  }
  const path = findPath(userCascaderTree.value)
  if (path) {
    userDrillStack.value = path
  }
}

const onClear = () => {
  selected.value = []
  startTime.value = ''
  endTime.value = ''
  const payload = { type: currentType.value }
  if (!props.simple && props.sidebarItems[activeIdx.value]) {
    payload.paramKey = props.sidebarItems[activeIdx.value].paramKey || currentType.value
  }
  emit('clear', payload)
}

const onConfirm = () => {
  const payload = {
    type: currentType.value,
    selected: currentType.value === 'region' && !props.simple
      ? selected.value.map(code => findPathByCode(code)).filter(Boolean)
      : [...selected.value],
    startTime: startTime.value,
    endTime: endTime.value,
  }

  if (!props.simple && props.sidebarItems[activeIdx.value]) {
    payload.paramKey = props.sidebarItems[activeIdx.value].paramKey || currentType.value
  }

  if (currentType.value === 'region' && props.simple) {
    payload.regionCodes = {
      provinceCode: drillProvince.value?.code || '',
      cityCode: drillCity.value?.code || '',
      districtCode: drillLevel.value >= 2 ? selected.value[0] : '',
    }
    payload.regionPath = buildRegionPath()
  }

  if (currentType.value === 'userCascader') {
    payload.userId = getSelectedUserId()
    payload.userName = getSelectedUserName()
    payload.userCascaderPath = buildUserCascaderPath()
    // 从 drill stack 提取公司/部门（老板端看板 API 参数 + 展示）
    if (userDrillStack.value.length >= 1) {
      payload.companyId = userDrillStack.value[0].companyId
      payload.companyName = userDrillStack.value[0].name
    }
    if (userDrillStack.value.length >= 2) {
      payload.departmentId = userDrillStack.value[1].departmentId
      payload.departmentName = userDrillStack.value[1].name
    }
  }

  emit('confirm', payload)
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
.region-breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-bottom: 24rpx;
  padding: 16rpx 0;
}
.region-breadcrumb-item {
  font-size: 26rpx;
  color: #62687D;
}
.region-breadcrumb-item--active {
  color: #37AE7E;
  font-weight: 500;
}
.region-breadcrumb-sep {
  font-size: 26rpx;
  color: #BBBEC2;
}
.region-loading {
  display: flex;
  justify-content: center;
  padding: 40rpx 0;
}
.region-loading-text {
  font-size: 26rpx;
  color: #9292A5;
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
