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
            <text class="form-value" :class="{ 'form-value--set': form.customer }">{{ form.customer || '请选择' }}</text>
            <image class="form-arrow" :src="rightArrowIcon" mode="aspectFit" />
          </view>
        </view>
        <view class="form-divider" />

        <view class="form-row" @tap="onSelectChannel">
          <text class="form-label">营销渠道（可多选）</text>
          <view class="form-value-row">
            <text class="form-value" :class="{ 'form-value--set': form.channel }">{{ form.channel || '请选择' }}</text>
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

        <view class="form-row" @tap="onSelectStartTime">
          <text class="form-label">任务开始时间</text>
          <view class="form-value-row">
            <text class="form-value" :class="{ 'form-value--set': form.startTime }">{{ form.startTime || '请选择' }}</text>
            <image class="form-arrow" :src="rightArrowIcon" mode="aspectFit" />
          </view>
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

        <scroll-view class="material-tabs-scroll" scroll-x="true" :enhanced="true" :show-scrollbar="false">
          <view class="material-tabs">
            <view
              v-for="tab in materialTabs"
              :key="tab"
              class="material-tab"
              :class="{ 'material-tab--active': activeMaterialTab === tab }"
              @tap="activeMaterialTab = tab"
            >
              <text class="material-tab-text" :class="{ 'material-tab-text--active': activeMaterialTab === tab }">{{ tab }}</text>
            </view>
          </view>
        </scroll-view>

        <view class="material-cats">
          <view
            v-for="cat in materialCats"
            :key="cat"
            class="material-cat"
            :class="{ 'material-cat--active': selectedCat === cat }"
            @tap="selectedCat = cat"
          >
            <text class="material-cat-text" :class="{ 'material-cat-text--active': selectedCat === cat }">{{ cat }}</text>
          </view>
        </view>

        <scroll-view class="material-list" scroll-y="true" :enhanced="true" :show-scrollbar="false">
          <view v-for="item in materialList" :key="item.name" class="material-card">
            <view class="material-card-body">
              <view class="material-thumb" />
              <view class="material-texts">
                <text class="material-title">{{ item.name }}</text>
                <text class="material-desc">{{ item.desc }}</text>
              </view>
            </view>
            <view
              class="material-action"
              :class="{ 'material-action--selected': selectedMaterials.includes(item.name), 'material-action--cancel': !selectedMaterials.includes(item.name) && item.inactive }"
              @tap="toggleMaterial(item.name)"
            >
              <text
                class="material-action-text"
                :class="{ 'material-action-text--selected': selectedMaterials.includes(item.name), 'material-action-text--cancel': !selectedMaterials.includes(item.name) && item.inactive }"
              >{{ selectedMaterials.includes(item.name) ? '已选' : (item.inactive ? '取消' : '选择') }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </nut-popup>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Taro from '@tarojs/taro'
import rightArrowIcon from '@/assets/dev/rightArror.png'
import navBar from '@/components/NavBar.vue'

const form = reactive({
  name: '',
  customer: '',
  channel: '',
  loop: false,
  interval: '',
  startTime: '',
})

let editorCtx = null

const onEditorReady = () => {
  Taro.createSelectorQuery().select('#editor').context((res) => {
    editorCtx = res.context
  }).exec()
}

const onSelectCustomer = () => {}
const onSelectChannel = () => {}
const onToggleLoop = () => { form.loop = !form.loop }
const onSelectStartTime = () => {}

const showMaterialPopup = ref(false)
const activeMaterialTab = ref('应用案例')
const materialTabs = ['应用案例', '使用说明', '安装说明', '公司简介']
const selectedCat = ref('应用案例1')
const materialCats = ['应用案例1', '应用案例2', '应用案例3', '重点客户跟进情况']
const selectedMaterials = ref([])

const materialList = [
  { name: '这是素材内容的标题', desc: '秋季新品发布海报秋季新', inactive: false },
  { name: '这是素材内容的标题', desc: '秋季新品发布海报秋季新报', inactive: true },
  { name: '这是素材内容的标题', desc: '秋季新品发布海报秋季新品发布海报秋季新品发布海报', inactive: false },
  { name: '这是素材内容的标题', desc: '秋季新品发布海报秋季新品发布海报秋季新品发布海报', inactive: false },
  { name: '这是素材内容的标题', desc: '秋季新品发布海报秋季新品发布海报秋季新品发布海报', inactive: false },
  { name: '这是素材内容的标题', desc: '秋季新品发布海报秋季新品发布海报秋季新品发布海报', inactive: false },
]

const toggleMaterial = (name) => {
  const idx = selectedMaterials.value.indexOf(name)
  if (idx >= 0) {
    selectedMaterials.value.splice(idx, 1)
  } else {
    selectedMaterials.value.push(name)
  }
}

const onMaterialConfirm = () => {
  showMaterialPopup.value = false
}

const onSelectMaterial = () => {
  showMaterialPopup.value = true
}

const goBack = () => {
  Taro.navigateBack()
}

const onSave = () => {
  Taro.navigateBack()
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
}
.material-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 40rpx;
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
  padding: 0 40rpx 40rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
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
</style>
