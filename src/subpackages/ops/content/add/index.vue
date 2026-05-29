<template>
  <view class="add-page">
    <navBar title="新增营销任务" />
    <scroll-view class="page-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
      <view class="form-card">
        <view class="form-row">
          <text class="form-label">营销任务编号</text>
          <text class="form-value form-value--disabled">无需输入，自动生成</text>
        </view>
        <view class="form-divider" />

        <view class="form-row">
          <text class="form-label">营销任务名称</text>
          <input class="form-input" v-model="form.name" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx" />
        </view>
        <view class="form-divider" />

        <view class="form-row" @tap="onSelectCustomer">
          <text class="form-label">受众客户</text>
          <view class="form-value-row">
            <text class="form-value" :class="{ 'form-value--set': form.audienceLabel }">{{ form.audienceLabel || '请选择' }}</text>
            <image class="form-arrow" :src="rightArrowIcon" mode="aspectFit" />
          </view>
        </view>
        <view class="form-divider" />

        <view class="form-row" @tap="onSelectChannel">
          <text class="form-label">营销渠道（可多选）</text>
          <view class="form-value-row">
            <text class="form-value" :class="{ 'form-value--set': form.channelLabel }">{{ form.channelLabel || '请选择' }}</text>
            <image class="form-arrow" :src="rightArrowIcon" mode="aspectFit" />
          </view>
        </view>
        <view class="form-divider" />

        <view class="form-row" @tap="onToggleLoop">
          <text class="form-label">是否循环推送</text>
          <view class="form-value-row">
            <text class="form-value form-value--set">{{ form.loop ? '是' : '否' }}</text>
            <image class="form-arrow" :src="rightArrowIcon" mode="aspectFit" />
          </view>
        </view>
        <view class="form-divider" />

        <view class="form-row">
          <text class="form-label">循环间隔（天）</text>
          <input class="form-input" v-model="form.interval" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx" type="number" />
        </view>
        <view class="form-divider" />

        <view class="form-row">
          <text class="form-label">任务开始时间</text>
          <picker mode="date" :value="form.startTime" @change="onDateChange">
            <view class="form-value-row01">
              <text class="form-value" :class="{ 'form-value--set': form.startTime }">{{ form.startTime || '请选择' }}</text>
              <image class="form-arrow" :src="rightArrowIcon" mode="aspectFit" />
            </view>
          </picker>
        </view>
      </view>

      <view class="editor-card">
        <view class="editor-header">
          <text class="editor-title">营销内容</text>
          <view class="editor-select-btn" @tap="onSelectMaterial">
            <text class="editor-select-text">选择素材</text>
          </view>
        </view>
        <view class="editor-wrap">
          <editor id="editor" class="editor-body" @ready="onEditorReady" placeholder="请输入营销内容" />
        </view>
      </view>

      <view class="btn-row">
        <view class="btn-cancel" @tap="goBack"><text class="btn-cancel-text">取消</text></view>
        <view class="btn-save" @tap="onSave"><text class="btn-save-text">保存</text></view>
      </view>
    </scroll-view>

    <nut-popup v-model:visible="showMaterialPopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }" :z-index="2000" safe-area-inset-bottom>
      <view class="material-popup">
        <view class="material-header">
          <text class="material-header-btn" @tap="showMaterialPopup = false">取消</text>
          <text class="material-header-title">选择素材</text>
          <text class="material-header-btn material-header-confirm" @tap="onMaterialConfirm">确认</text>
        </view>

        <view class="material-tabs-scroll">
          <view class="material-tabs">
            <view class="material-tab" :class="{ 'material-tab--active': activeFolderId === 0 }" @tap="onFolderTap(null)">
              <text class="material-tab-text" :class="{ 'material-tab-text--active': activeFolderId === 0 }">全部</text>
            </view>
            <view
              v-for="folder in folders"
              :key="folder.id"
              class="material-tab"
              :class="{ 'material-tab--active': activeFolderId === folder.id }"
              @tap="onFolderTap(folder)"
            >
              <text class="material-tab-text" :class="{ 'material-tab-text--active': activeFolderId === folder.id }">{{ folder.name }}</text>
            </view>
          </view>
        </view>

        <view v-if="currentChildFolders.length > 0" class="material-cats">
          <view
            v-for="child in currentChildFolders"
            :key="child.id"
            class="material-cat"
            :class="{ 'material-cat--active': activeChildFolderId === child.id }"
            @tap="onChildFolderTap(child)"
          >
            <text class="material-cat-text" :class="{ 'material-cat-text--active': activeChildFolderId === child.id }">{{ child.name }}</text>
          </view>
        </view>

        <scroll-view class="material-list" scroll-y="true" :enhanced="true" :show-scrollbar="false" @scrolltolower="onMaterialLoadMore">
          <view v-for="item in materialList" :key="item.id" class="material-card">
            <view class="material-card-body">
              <image class="material-thumb" :src="item.coverUrl" mode="aspectFill" />
              <view class="material-texts">
                <text class="material-title">{{ item.name }}</text>
                <text class="material-desc">{{ item.summary || '-' }}</text>
              </view>
            </view>
            <view
              class="material-action"
              :class="{ 'material-action--selected': selectedMaterialIds.includes(item.id) }"
              @tap="toggleMaterial(item)"
            >
              <text
                class="material-action-text"
                :class="{ 'material-action-text--selected': selectedMaterialIds.includes(item.id) }"
              >{{ selectedMaterialIds.includes(item.id) ? '已选' : '选择' }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </nut-popup>

    <!-- 渠道选择弹窗 -->
    <nut-popup v-model:visible="showChannelPopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }" :z-index="2000" safe-area-inset-bottom>
      <view class="channel-popup">
        <view class="channel-popup-header">
          <text class="channel-popup-header-btn" @tap="showChannelPopup = false">取消</text>
          <text class="channel-popup-header-title">选择营销渠道</text>
          <text class="channel-popup-header-btn channel-popup-header-confirm" @tap="onChannelConfirm">确认</text>
        </view>
        <scroll-view class="channel-popup-list" scroll-y="true" :enhanced="true" :show-scrollbar="false">
          <view class="org-tag-row">
            <view
              v-for="channel in channelList"
              :key="channel.id"
              class="org-tag"
              :class="{ 'org-tag--active': selectedChannelIds.includes(channel.id) }"
              @tap="toggleChannel(channel)"
            >
              <text class="org-tag-text" :class="{ 'org-tag-text--active': selectedChannelIds.includes(channel.id) }">{{ channel.name }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </nut-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import rightArrowIcon from '@/assets/dev/rightArror.png'
import navBar from '@/components/NavBar.vue'
import { createTask } from '@/api/automation'
import { getUserInfo } from '@/utils/storage'
import { getChannelList, type ChannelItem } from '@/api/platform'
import { getFolderTree, getMaterialList, type FolderNode, type MaterialItem } from '@/api/material'

const form = reactive({
  name: '',
  audienceType: '',
  audienceLabel: '',
  channelIds: [] as number[],
  channelLabel: '',
  loop: false,
  interval: '',
  startTime: '',
  contentHtml: '',
})

const audienceOptions = [
  { label: '所有客户', value: 'all_customers' },
  { label: '一个月以上未联系客户', value: 'inactive_over_30_days' },
]

let editorCtx: any = null

const onEditorReady = () => {
  Taro.createSelectorQuery().select('#editor').context((res) => {
    editorCtx = res.context
  }).exec()
}

/** 读取编辑器 HTML 内容 */
function getEditorHtml(): Promise<string> {
  return new Promise((resolve) => {
    if (!editorCtx) {
      resolve(form.contentHtml || '')
      return
    }
    editorCtx.getContents({
      success: (res: { html?: string; text?: string }) => {
        resolve(res.html || '')
      },
      fail: () => {
        resolve(form.contentHtml || '')
      },
    })
  })
}

const onSelectCustomer = () => {
  Taro.showActionSheet({
    itemList: audienceOptions.map(o => o.label),
    success: (res) => {
      const opt = audienceOptions[res.tapIndex]
      form.audienceType = opt.value
      form.audienceLabel = opt.label
    },
  })
}

// 渠道多选
const channelList = ref<any>([])
const showChannelPopup = ref(false)
const selectedChannelIds = ref<number[]>([])

async function fetchChannels() {
  try {
    const res = await getChannelList()
    channelList.value = res || []
  } catch {
    // ignore
  }
}

const onSelectChannel = () => {
  selectedChannelIds.value = [...form.channelIds]
  showChannelPopup.value = true
}

const toggleChannel = (channel: ChannelItem) => {
  const idx = selectedChannelIds.value.indexOf(channel.id)
  if (idx >= 0) {
    selectedChannelIds.value.splice(idx, 1)
  } else {
    selectedChannelIds.value.push(channel.id)
  }
}

const onChannelConfirm = () => {
  form.channelIds = [...selectedChannelIds.value]
  form.channelLabel = channelList.value
    .filter(c => form.channelIds.includes(c.id))
    .map(c => c.name)
    .join('、')
  showChannelPopup.value = false
}
const onToggleLoop = () => { form.loop = !form.loop }

const onDateChange = (e: { detail: { value: string } }) => {
  form.startTime = e.detail.value
}

// 素材相关
const showMaterialPopup = ref(false)
const folders = ref<FolderNode[]>([])
const activeFolderId = ref<number>(0)
const activeChildFolderId = ref<number>(0)
const currentChildFolders = ref<FolderNode[]>([])

function updateChildFolders() {
  if (activeFolderId.value === 0) {
    currentChildFolders.value = []
  } else {
    const parent = folders.value.find(f => f.id === activeFolderId.value)
    currentChildFolders.value = parent?.children || []
  }
}

const materialList = ref<MaterialItem[]>([])
const materialLoading = ref(false)
const materialPage = ref(1)
const materialHasMore = ref(true)
const materialPageSize = 10

const selectedMaterialIds = ref<number[]>([])

async function fetchFolders() {
  try {
    const data = await getFolderTree()
    
    folders.value = data || []
    updateChildFolders()
  } catch {
    // ignore
  }
}

async function fetchMaterialList(reset = false) {
  if (materialLoading.value) return
  if (reset) {
    materialPage.value = 1
    materialList.value = []
    materialHasMore.value = true
  }
  if (!materialHasMore.value && !reset) return
  materialLoading.value = true
  try {
    const userInfo = getUserInfo<{ companyId: number }>()
    const params: Record<string, unknown> = {
      page: materialPage.value,
      pageSize: materialPageSize,
      companyId: userInfo?.companyId,
    }
    if (activeChildFolderId.value > 0) {
      params.folderId = activeChildFolderId.value
    } else if (activeFolderId.value > 0) {
      params.folderId = activeFolderId.value
    }
    const res = await getMaterialList(params)
    if (reset) {
      materialList.value = res.items || []
    } else {
      materialList.value = [...materialList.value, ...(res.items || [])]
    }
    materialHasMore.value = materialList.value.length < res.total
  } catch {
    // ignore
  } finally {
    materialLoading.value = false
  }
}

function onFolderTap(folder: FolderNode | null) {
  activeFolderId.value = folder ? folder.id : 0
  activeChildFolderId.value = 0
  updateChildFolders()
  fetchMaterialList(true)
}

function onChildFolderTap(child: FolderNode) {
  activeChildFolderId.value = child.id
  fetchMaterialList(true)
}

function toggleMaterial(item: MaterialItem) {
  const idx = selectedMaterialIds.value.indexOf(item.id)
  if (idx >= 0) {
    selectedMaterialIds.value.splice(idx, 1)
  } else {
    selectedMaterialIds.value.push(item.id)
  }
}

function onMaterialConfirm() {
  showMaterialPopup.value = false
}

function onSelectMaterial() {
  showMaterialPopup.value = true
    if (folders.value.length === 0) {
      fetchFolders().then(() => fetchMaterialList(true))
      fetchFolders()
    } else {
      fetchMaterialList(true)
    }
}

function onMaterialLoadMore() {
  if (materialLoading.value || !materialHasMore.value) return
  materialPage.value++
  fetchMaterialList(false)
}

const goBack = () => {
  Taro.navigateBack()
}

onMounted(() => {
  fetchChannels()
})

const onSave = async () => {
  if (!form.name) {
    Taro.showToast({ title: '请输入任务名称', icon: 'none' })
    return
  }
  if (!form.startTime) {
    Taro.showToast({ title: '请选择任务开始时间', icon: 'none' })
    return
  }

  const userInfo = getUserInfo<{ companyId: number; departmentId: number }>()
  const companyId = userInfo?.companyId || 0
  const departmentId = userInfo?.departmentId || 0

  // 读取编辑器 HTML 内容
  const contentHtml = await getEditorHtml()

  try {
    await createTask({
      name: form.name,
      audienceType: form.audienceType,
      channelIds: form.channelIds,
      companyId,
      departmentId,
      contentHtml,
      isRecurring: form.loop,
      recurrenceIntervalDays: Number(form.interval) || 0,
      materialIds: selectedMaterialIds.value,
      startAt: form.startTime,
    })
    Taro.showToast({ title: '创建成功', icon: 'success' })
    setTimeout(() => Taro.navigateBack(), 1500)
  } catch {
    // 错误已在 request 层统一处理
  }
}
</script>

<style>
.add-page {
  min-height: 100vh;
  background: #F5F7F9;
}
.page-scroll {
  padding: 20rpx 0 40rpx;
}

.form-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 32rpx;
  margin: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 0;
}
.form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 0;
}
.form-label {
  font-size: 30rpx;
  color: #62687D;
  flex-shrink: 0;
}
.form-value {
  font-size: 30rpx;
  color: #BBBEC2;
  text-align: right;
}
.form-value--set {
  color: #1A1D24;
}
.form-value--disabled {
  color: #BBBEC2;
}
.form-value-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  max-width: 60%;
}
.form-value-row01 {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.form-input {
  font-size: 30rpx;
  color: #1A1D24;
  text-align: right;
  flex: 1;
  max-width: 60%;
}
.form-arrow {
  width: 28rpx;
  height: 28rpx;
  flex-shrink: 0;
}
.form-divider {
  height: 1rpx;
  background: #F4F4F4;
}

.editor-card {
  background: #FFFFFF;
  border-radius: 16rpx 16rpx 0 0;
  margin: 0 20rpx;
  overflow: hidden;
}
.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 32rpx 0;
}
.editor-title {
  font-size: 30rpx;
  color: #62687D;
}
.editor-select-btn {
  padding: 8rpx 20rpx;
}
.editor-select-text {
  font-size: 30rpx;
  color: #37AE7E;
}
.editor-wrap {
  margin: 20rpx 32rpx 32rpx;
  border: 1rpx solid #E4E9EF;
  border-radius: 8rpx;
  min-height: 300rpx;
}
.editor-body {
  min-height: 300rpx;
  padding: 16rpx;
  font-size: 28rpx;
  color: #1A1D24;
}

.btn-row {
  display: flex;
  gap: 24rpx;
  padding: 60rpx 40rpx;
}
.btn-cancel {
  flex: 1;
  height: 80rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFFFFF;
  border: 2rpx solid #5CC79C;
}
.btn-cancel-text {
  font-size: 32rpx;
  color: #5CC79C;
}
.btn-save {
  flex: 1;
  height: 80rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(270deg, #66DCA6 0%, #58BC96 100%);
}
.btn-save-text {
  font-size: 32rpx;
  color: #FFFFFF;
}

.material-popup {
  display: flex;
  flex-direction: column;
  max-height: 75vh;
  overflow: hidden;
}
.material-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 40rpx;
}
.material-header-btn {
  font-size: 32rpx;
  color: #828593;
}
.material-header-title {
  font-size: 34rpx;
  font-weight: 500;
  color: #333333;
}
.material-header-confirm {
  color: #37AE7E;
}
.material-tabs-scroll {
  border-bottom: 1rpx solid #E6EBF0;
  overflow-x: auto;
  white-space: nowrap;
}
.material-tabs {
  display: inline-flex;
  gap: 0;
  padding: 0 40rpx;
}
.material-tab {
  display: inline-flex;
  flex-shrink: 0;
  padding: 0 0 30rpx;
  margin-right: 40rpx;
  border-bottom: 4rpx solid transparent;
}
.material-tab--active {
  border-bottom-color: #37AE7E;
}
.material-tab-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #9292A5;
}
.material-tab-text--active {
  color: #1A1D24;
}
.material-cats {
  display: flex;
  gap: 12rpx;
  padding: 32rpx 40rpx;
  overflow-x: auto;
}
.material-cat {
  flex-shrink: 0;
  padding: 10rpx 24rpx;
  border-radius: 6rpx;
  background: #FFFFFF;
  border: 2rpx solid #E8EAF3;
  white-space: nowrap;
  height: 40rpx;
}
.material-cat--active {
  background: #EDFAF5;
  border-color: #B1E9D3;
}
.material-cat-text {
  font-size: 28rpx;
  color: #62687D;
}
.material-cat-text--active {
  color: #37AE7E;
}
.material-list {
  flex: 1;
  min-height: 0;
  padding: 0 40rpx 40rpx;
  box-sizing: border-box;
}
.material-card {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-top: 32rpx;
}
.material-card-body {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 24rpx;
  background: #F9FAFB;
  border: 1rpx solid #E6EBF0;
  border-radius: 6rpx;
}
.material-thumb {
  width: 90rpx;
  height: 90rpx;
  background: #FFFFFF;
  border-radius: 6rpx;
  flex-shrink: 0;
}
.material-texts {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-self: stretch;
}
.material-title {
  font-size: 28rpx;
  color: #1A1D24;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.material-desc {
  width: 380rpx;
  font-size: 26rpx;
  color: #62687D;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.material-action {
  width: 80rpx;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  align-self: stretch;
  background: #EDFAF5;
  border: 1rpx solid #B1E9D3;
}
.material-action--selected {
  background: #EDFAF5;
  border: 1rpx solid #B1E9D3;
}
.material-action--cancel {
  background: #FFEAEA;
  border: 1rpx solid #FFD8D8;
}
.material-action-text {
  font-size: 26rpx;
  color: #37AE7E;
}
.material-action-text--selected {
  color: #37AE7E;
}
.material-action-text--cancel {
  color: #F53F3F;
}

.channel-popup {
  display: flex;
  flex-direction: column;
  max-height: 800rpx;
}
.channel-popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 40rpx;
  flex-shrink: 0;
}
.channel-popup-header-btn {
  font-size: 32rpx;
  color: #828593;
}
.channel-popup-header-title {
  font-size: 34rpx;
  font-weight: 500;
  color: #333333;
}
.channel-popup-header-confirm {
  color: #37AE7E;
}
.channel-popup-list {
  max-height: 600rpx;
  padding: 0 40rpx 40rpx;
}
.org-tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
}
.org-tag {
  width: calc(50% - 12rpx);
  padding: 12rpx 10rpx;
  background: #F6F7FB;
  border-radius: 6rpx;
  text-align: center;
  box-sizing: border-box;
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
</style>
