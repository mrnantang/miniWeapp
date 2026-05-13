<template>
  <view class="add-page">
    <navBar title="新增内容素材" />
    <view class="form-card">
      <view class="form-row">
        <text class="form-label">素材类型</text>
        <picker mode="selector" :value="typeIndex" :range="typeOptions" @change="onTypeChange">
          <view class="form-value-row">
            <text class="form-value form-value--set">{{ form.type }}</text>
            <image class="form-arrow" :src="rightArrowIcon" mode="aspectFit" />
          </view>
        </picker>
      </view>
      <view class="form-divider" />

      <view class="form-row">
        <text class="form-label">素材名称</text>
        <input class="form-input" v-model="form.name" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx" />
      </view>
      <view class="form-divider" />

      <view class="form-row">
        <text class="form-label">素材简介</text>
        <input class="form-input" v-model="form.desc" placeholder="请输入" placeholder-style="color:#BBBEC2;font-size:30rpx" />
      </view>
      <view class="form-divider" />

      <view class="form-row">
        <text class="form-label">素材封面</text>
        <view class="cover-upload">
          <image class="cover-plus" :src="iconPlus" mode="aspectFit" />
          <text class="cover-text">点击上传</text>
        </view>
      </view>
      <view class="form-divider" />
      
      <view class="form-row">
        <text class="form-label">海报图片</text>
        <view class="cover-upload">
          <image class="cover-plus" :src="iconPlus" mode="aspectFit" />
          <text class="cover-text">点击上传</text>
        </view>
      </view>
    </view>

    <view class="editor-card">
      <text class="editor-title">内容正文</text>
      <view class="editor-wrap">
          <editor id="editor" @ready="onEditorReady" placeholder="请输入内容" />
      </view>
    </view>

    <view class="btn-row">
      <view class="btn-cancel" @tap="goBack"><text class="btn-cancel-text">取消</text></view>
      <view class="btn-save" @tap="onSave"><text class="btn-save-text">保存</text></view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Taro from '@tarojs/taro'
import rightArrowIcon from '@/assets/dev/rightArror.png'
import iconPlus from '@/assets/dev/plus.png'
import navBar from '@/components/NavBar.vue'
const form = reactive({
  type: '图文',
  name: '',
  desc: '',
})

let editorCtx = null

const typeOptions = ['图文', '海报', '视频', '资料']
const typeIndex = ref(0)

const onTypeChange = (e) => {
  typeIndex.value = e.detail.value
  form.type = typeOptions[e.detail.value]
}

const onEditorReady = () => {
  Taro.createSelectorQuery().select('#editor').context((res) => {
    editorCtx = res.context
  }).exec()
}

const onSelectType = () => {}
const onSave = () => { Taro.navigateBack() }
const goBack = () => { Taro.navigateBack() }
</script>

<style>
.add-page {
  min-height: 100vh;
  background: #F5F7F9;
}

.form-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 32rpx;
  margin: 20rpx;
}
.form-row {
  display: flex;
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
.form-value-row {
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
.cover-upload {
  width: 156rpx;
  height: 156rpx;
  border-radius: 8rpx;
  background: #F9F9F9;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  flex-direction: column;
}
.cover-plus {
  width: 36rpx;
  height: 36rpx;
}
.cover-text {
  font-size: 30rpx;
  color: #1A1D24;
}

.editor-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  margin: 0 20rpx;
  padding: 32rpx;
}
.editor-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #1A1D24;
  margin-bottom: 24rpx;
}
.editor-wrap {
  border: 1rpx solid #EBEBEB;
  border-radius: 8rpx;
  overflow: hidden;
}
.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 12rpx 16rpx;
  border-bottom: 1rpx solid #EBEBEB;
  background: #FFFFFF;
}
.editor-toolbar-item {
  font-size: 28rpx;
  color: #62687D;
}
.editor-body {
  min-height: 300rpx;
  padding: 16rpx;
  font-size: 28rpx;
}

.btn-row {
  display: flex;
  gap: 28rpx;
  padding: 60rpx 40rpx;
}
.btn-cancel {
  flex: 1;
  height: 72rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #EFFDF7;
  border: 2rpx solid #5CC79C;
}
.btn-cancel-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #5CC79C;
}
.btn-save {
  flex: 1;
  height: 72rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(270deg, #66DCA6 0%, #58BC96 100%);
}
.btn-save-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #FFFFFF;
}
</style>
