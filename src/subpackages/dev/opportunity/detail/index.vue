<template>
  <view class="detail-page">
    <NavBar title="商机详情" />
    <scroll-view class="detail-scroll" scroll-y :enhanced="true" :show-scrollbar="false">
      <view class="detail-card">
        <view class="detail-card-head">
          <input v-if="isEditing" class="detail-card-title-input" v-model="detail.name" />
          <text v-else class="detail-card-title">{{ detail.name }}</text>
          <view class="detail-edit-btn" @tap="toggleEdit">
            <image class="detail-edit-icon" :src="iconEdit" mode="aspectFit" />
            <text class="detail-edit-text">{{ isEditing ? '完成' : '编辑' }}</text>
          </view>
        </view>
        <view class="detail-divider" />

        <view class="detail-row">
          <text class="detail-label">商机编号</text>
          <text v-if="!isEditing" class="detail-value">{{ detail.oppNo }}</text>
          <input v-else class="detail-input" v-model="detail.oppNo" />
        </view>
        <view class="detail-divider" />

        <view class="detail-row">
          <text class="detail-label">关联客户</text>
          <text v-if="!isEditing" class="detail-value">{{ detail.customer }}</text>
          <input v-else class="detail-input" v-model="detail.customer" />
        </view>
        <view class="detail-divider" />

        <view class="detail-row">
          <text class="detail-label">预计销售金额</text>
          <text v-if="!isEditing" class="detail-value">¥{{ detail.amount }}</text>
          <input v-else class="detail-input" v-model="detail.amount" />
        </view>
        <view class="detail-divider" />

        <view class="detail-row">
          <text class="detail-label">预计成交日期</text>
          <text v-if="!isEditing" class="detail-value">{{ detail.signDate }}</text>
          <input v-else class="detail-input" v-model="detail.signDate" />
        </view>
        <view class="detail-divider" />

        <view class="detail-row">
          <text class="detail-label">商机状态</text>
          <text v-if="!isEditing" class="detail-value">{{ detail.status }}</text>
          <input v-else class="detail-input" v-model="detail.status" />
        </view>
        <view class="detail-divider" />

        <view class="detail-row">
          <text class="detail-label">需求产品</text>
          <text v-if="!isEditing" class="detail-value">{{ detail.product }}</text>
          <input v-else class="detail-input" v-model="detail.product" />
        </view>
        <view class="detail-divider" />

        <view class="detail-row">
          <text class="detail-label">负责人</text>
          <text v-if="!isEditing" class="detail-value">{{ detail.owner }}</text>
          <input v-else class="detail-input" v-model="detail.owner" />
        </view>
      </view>

      <view class="detail-card">
        <view class="detail-card-head">
          <text class="detail-card-title">客户动态</text>
          <view class="detail-tabs">
            <text class="detail-tab" :class="{ 'detail-tab--active': followTab === 'follow' }"
              @tap="followTab = 'follow'">跟进</text>
            <view class="detail-tab-sep" />
            <text class="detail-tab" :class="{ 'detail-tab--active': followTab === 'visit' }"
              @tap="followTab = 'visit'">拜访</text>
          </view>
        </view>
        <view class="detail-divider" />

        <view v-if="followTab === 'follow'" class="timeline">
          <view v-for="(item, idx) in followRecords" :key="idx" class="timeline-item">
            <view class="timeline-left">
              <view class="timeline-dot" />
              <view v-if="idx < followRecords.length - 1" class="timeline-line" />
            </view>
            <view class="timeline-content">
              <view class="timeline-head">
                <view class="timeline-head-left">
                  <text class="timeline-date">{{ item.time }}</text>
                  <text class="timeline-tag">({{ item.tag }})</text>
                </view>
                <view class="timeline-actions">
                  <image class="timeline-action-icon" :src="iconEdit" mode="aspectFit" @tap="editRecord(idx)" />
                  <image class="timeline-action-icon" :src="iconDelete" mode="aspectFit" @tap="deleteRecord(idx)" />
                </view>
              </view>
              <view class="timeline-info">
                <text class="timeline-info-label">跟进人：</text>
                <text class="timeline-info-text">{{ item.follower }}</text>
              </view>
              <view class="timeline-info">
                <text class="timeline-info-label">跟进方式：</text>
                <text class="timeline-info-text">{{ item.method }}</text>
              </view>
              <view class="timeline-info">
                <text class="timeline-info-label">跟进内容：</text>
                <text class="timeline-info-text">{{ item.content }}</text>
              </view>
            </view>
          </view>
        </view>

        <view v-if="followTab === 'visit'" class="timeline">
          <view v-for="(item, idx) in visitRecords" :key="idx" class="visit-item">
            <view class="timeline-left">
              <view class="timeline-dot" />
              <view v-if="idx < visitRecords.length - 1" class="timeline-line" />
            </view>
            <view class="visit-content">
              <view class="visit-field">
                <text class="visit-label">签到时间：</text>
                <text class="visit-value">{{ item.checkInTime }}</text>
              </view>
              <view v-if="item.checkOutTime" class="visit-field">
                <text class="visit-label">签退时间：</text>
                <text class="visit-value">{{ item.checkOutTime }}</text>
              </view>
              <view class="visit-field">
                <text class="visit-label">定位地点：</text>
                <text class="visit-value">{{ item.location }}</text>
              </view>
              <view class="visit-field">
                <text class="visit-label">拜访目的：</text>
                <text class="visit-value">{{ item.purpose }}</text>
              </view>
              <view v-if="item.images && item.images.length" class="visit-field">
                <text class="visit-label">签到图片：</text>
                <view class="visit-images">
                  <image v-for="(img, i) in item.images" :key="i" class="visit-img" :src="img" mode="aspectFill" />
                </view>
              </view>
              <view class="visit-field">
                <text class="visit-label">拜访结果：</text>
                <text class="visit-value">{{ item.result }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="detail-bottom-spacer" />
    </scroll-view>

    <view class="detail-bottom-bar">
      <view class="detail-bottom-btn detail-bottom-btn--danger" @tap="onFail">
        <text class="detail-bottom-btn-text detail-bottom-btn-text--danger">转化失败</text>
      </view>
      <view class="detail-bottom-btn detail-bottom-btn--primary" @tap="onAddFollow">
        <text class="detail-bottom-btn-text detail-bottom-btn-text--primary">新增跟进记录</text>
      </view>
      <view class="detail-bottom-btn detail-bottom-btn--primary" @tap="onCheckIn">
        <text class="detail-bottom-btn-text detail-bottom-btn-text--primary">签到打卡</text>
      </view>
    </view>

    <nut-popup v-model:visible="showEditOppPopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }" :z-index="2100" safe-area-inset-bottom>
      <view class="edit-opp-popup">
        <view class="edit-opp-header">
          <text class="edit-opp-cancel" @tap="showEditOppPopup = false">取消</text>
          <text class="edit-opp-title">编辑商机</text>
          <text class="edit-opp-confirm" @tap="onEditOppConfirm">确认</text>
        </view>
        <view class="edit-opp-body">
          <view class="edit-opp-row">
            <text class="edit-opp-label">预计销售金额</text>
            <view class="edit-opp-value-row">
              <input class="edit-opp-input" v-model="editForm.amount" />
              <text class="edit-opp-suffix">元</text>
            </view>
          </view>
          <view class="edit-opp-divider" />
          <view class="edit-opp-row" @tap="onSelectDate">
            <text class="edit-opp-label">预计成交日期</text>
            <view class="edit-opp-value-row">
              <text class="edit-opp-value" :class="{ 'edit-opp-value--placeholder': !editForm.signDate }">{{ editForm.signDate || '请选择' }}</text>
              <image class="edit-opp-arrow" :src="rightArrowIcon" mode="aspectFit" />
            </view>
          </view>
          <view class="edit-opp-divider" />
          <view class="edit-opp-row" @tap="onSelectStatus">
            <text class="edit-opp-label">商机状态</text>
            <view class="edit-opp-value-row">
              <text class="edit-opp-value" :class="{ 'edit-opp-value--placeholder': !editForm.status }">{{ editForm.status || '请选择' }}</text>
              <image class="edit-opp-arrow" :src="rightArrowIcon" mode="aspectFit" />
            </view>
          </view>
          <view class="edit-opp-divider" />
          <view class="edit-opp-row" @tap="onSelectProduct">
            <text class="edit-opp-label">需求产品</text>
            <view class="edit-opp-value-row">
              <text class="edit-opp-value" :class="{ 'edit-opp-value--placeholder': !editForm.product }">{{ editForm.product || '请选择' }}</text>
              <image class="edit-opp-arrow" :src="rightArrowIcon" mode="aspectFit" />
            </view>
          </view>
        </view>
      </view>
    </nut-popup>

    <nut-popup v-model:visible="showFailPopup" position="center" :style="{ borderRadius: '24rpx' }" :z-index="2100">
      <view class="fail-card">
        <text class="fail-title">转化失败</text>
        <view class="fail-textarea">
          <input class="fail-input" v-model="failReason" placeholder="请输入失败原因" placeholder-style="color:#9292A5;font-size:26rpx" />
        </view>
        <view class="fail-btns">
          <view class="fail-btn fail-btn--cancel" @tap="showFailPopup = false">
            <text class="fail-btn-text fail-btn-text--cancel">取消</text>
          </view>
          <view class="fail-btn fail-btn--confirm" @tap="onFailConfirm">
            <text class="fail-btn-text fail-btn-text--confirm">确认</text>
          </view>
        </view>
      </view>
    </nut-popup>

    <nut-popup v-model:visible="showAddFollowPopup" position="center" :style="{ borderRadius: '24rpx' }" :z-index="2100">
      <view class="add-follow-card">
        <text class="add-follow-title">添加跟进记录</text>
        <view class="add-follow-select" @tap="showFollowMethodPopup = true">
          <text class="add-follow-select-text" :class="{ 'add-follow-select-text--set': followForm.method }">{{ followForm.method || '请选择跟进方式' }}</text>
          <image class="add-follow-arrow" :src="rightArrowIcon" mode="aspectFit" />
        </view>
        <view class="add-follow-textarea">
          <input class="add-follow-input" v-model="followForm.content" placeholder="请输入跟进内容" placeholder-style="color:#9292A5;font-size:26rpx" />
        </view>
        <view class="add-follow-btns">
          <view class="add-follow-btn add-follow-btn--cancel" @tap="showAddFollowPopup = false">
            <text class="add-follow-btn-text add-follow-btn-text--cancel">取消</text>
          </view>
          <view class="add-follow-btn add-follow-btn--confirm" @tap="onAddFollowConfirm">
            <text class="add-follow-btn-text add-follow-btn-text--confirm">确认</text>
          </view>
        </view>
      </view>
    </nut-popup>

    <nut-popup v-model:visible="showFollowMethodPopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }" :z-index="2200" safe-area-inset-bottom>
      <view class="method-popup">
        <view class="method-header">
          <text class="method-cancel" @tap="showFollowMethodPopup = false">取消</text>
          <text class="method-title">选择跟进方式</text>
          <text class="method-confirm" @tap="showFollowMethodPopup = false">确认</text>
        </view>
        <view class="method-body">
          <template v-for="(opt, i) in followMethods" :key="opt">
            <view class="method-item" @tap="selectFollowMethod(opt)">
              <text class="method-item-text">{{ opt }}</text>
              <text class="method-radio" :class="{ 'method-radio--checked': followForm.method === opt }">{{ followForm.method === opt ? '◉' : '○' }}</text>
            </view>
            <view v-if="i < followMethods.length - 1" class="method-divider" />
          </template>
        </view>
      </view>
    </nut-popup>

    <nut-popup v-model:visible="showCheckinPopup" position="center" :style="{ borderRadius: '24rpx' }" :z-index="2100">
      <view class="checkin-card">
        <text class="checkin-title">签到打卡</text>
        <view class="checkin-addr-box" @tap="onCheckinAddrTap">
          <image class="checkin-loc-icon" :src="iconCheckinLocation" mode="aspectFit" />
          <text class="checkin-addr">广东省深圳市南山区晟成智慧制造有限公司</text>
        </view>
      <!-- <view v-if="checkinDistance !== null" class="checkin-distance-row">
          <view class="checkin-dist-col">
            <image class="checkin-route-icon" :src="iconCheckinRoute" mode="aspectFit" />
            <text class="checkin-dist-label">相距约：</text>
            <text class="checkin-dist-value" :class="{ 'checkin-dist-value--danger': checkinDistance > 10 }">{{ checkinDistance }}km</text>
          </view>
          <view class="checkin-current-col">
            <image class="checkin-current-icon" :src="iconCheckinLocation" mode="aspectFit" />
            <text class="checkin-current-addr">广东省深圳市南山区科技大厦119号（当前位置）</text>
          </view>
        </view> -->
        <view class="checkin-purpose" @tap="showPurposePopup = true">
          <text class="checkin-purpose-text" :class="{ 'checkin-purpose-text--set': checkinPurpose }">{{ checkinPurpose || '请选择拜访目的' }}</text>
          <image class="checkin-purpose-arrow" :src="rightArrowIcon" mode="aspectFit" />
        </view>
        <view class="checkin-upload" @tap="onCheckinUpload">
          <image class="checkin-plus-icon" :src="iconCheckinPlus" mode="aspectFit" />
          <text class="checkin-upload-text">拍摄</text>
        </view>
        <view class="checkin-btns">
          <view class="checkin-btn checkin-btn--cancel" @tap="showCheckinPopup = false">
            <text class="checkin-btn-text checkin-btn-text--cancel">取消</text>
          </view>
          <view class="checkin-btn" :class="{ 'checkin-btn--confirm': checkinPurpose, 'checkin-btn--disabled': !checkinPurpose }" @tap="onCheckinConfirm">
            <text class="checkin-btn-text" :class="{ 'checkin-btn-text--confirm': checkinPurpose, 'checkin-btn-text--disabled': !checkinPurpose }">确认</text>
          </view>
        </view>
      </view>
    </nut-popup>

    <nut-popup v-model:visible="showDistanceWarnPopup" position="center" :style="{ borderRadius: '24rpx' }" :z-index="2200">
      <view class="warn-card">
        <image class="warn-icon" :src="iconWarning" mode="aspectFit" />
        <text class="warn-text">您与该客户的打卡距离偏差过大是否要更新客户具体地址?</text>
        <view class="warn-btns">
          <view class="warn-btn warn-btn--cancel" @tap="showDistanceWarnPopup = false">
            <text class="warn-btn-text warn-btn-text--cancel">暂不更新</text>
          </view>
          <view class="warn-btn warn-btn--confirm" @tap="onWarnConfirm">
            <text class="warn-btn-text warn-btn-text--confirm">确认更新</text>
          </view>
        </view>
      </view>
    </nut-popup>

    <nut-popup v-model:visible="showPurposePopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }" :z-index="2300" safe-area-inset-bottom>
      <view class="method-popup">
        <view class="method-header">
          <text class="method-cancel" @tap="showPurposePopup = false">取消</text>
          <text class="method-title">选择拜访目的</text>
          <text class="method-confirm" @tap="showPurposePopup = false">确认</text>
        </view>
        <view class="method-body">
          <template v-for="(opt, i) in purposeList" :key="opt">
            <view class="method-item" @tap="selectPurpose(opt)">
              <text class="method-item-text">{{ opt }}</text>
              <text class="method-radio" :class="{ 'method-radio--checked': checkinPurpose === opt }">{{ checkinPurpose === opt ? '◉' : '○' }}</text>
            </view>
            <view v-if="i < purposeList.length - 1" class="method-divider" />
          </template>
        </view>
      </view>
    </nut-popup>
  </view>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import { ref, reactive } from 'vue'
import Taro from '@tarojs/taro'
import iconEdit from '@/assets/dev/edit.png'
import iconDelete from '@/assets/dev/delete.png'
import rightArrowIcon from '@/assets/dev/rightArror.png'
import iconCheckinLocation from '@/assets/dev/icon-checkin-location.svg'
import iconCheckinArrowDown from '@/assets/dev/icon-checkin-arrow-down.svg'
import iconCheckinPlus from '@/assets/dev/icon-checkin-plus.svg'
import iconCheckinRoute from '@/assets/dev/icon-checkin-route.svg'
import iconWarning from '@/assets/dev/icon-warning.svg'

const isEditing = ref(false)
const followTab = ref('follow')
const showEditOppPopup = ref(false)

const editForm = reactive({
  amount: '128102.91',
  signDate: '2024/01/23',
  status: '接触中',
  product: '自动喷粉枪',
})

const detail = reactive({
  name: '金石科技高端机采购书',
  oppNo: 'XJ-281782',
  customer: '金石科技',
  amount: '128102.91',
  signDate: '2024/01/23',
  status: '接触中',
  product: '自动喷粉枪',
  owner: '张文',
})

const followRecords = ref([
  { time: '2025.01.23 12:00:59', tag: '签约中', follower: '孙大星', method: '电话', content: '客户有意向，但未表明哪款产品' },
  { time: '2025.01.21 12:00:59', tag: '商务谈判', follower: '孙大星', method: '电话', content: '客户有意向，但未表明哪款产品' },
  { time: '2025.01.15 12:00:59', tag: '方案/报价', follower: '孙大星', method: '电话', content: '客户有意向，但未表明哪款产品' },
])

const visitRecords = ref([
  {
    checkInTime: '2025.01.22 12:00:59',
    checkOutTime: '2025.01.22 18:00:59',
    location: '广东省深圳市南山区晟成智慧制造有限公司',
    purpose: '生意洽谈',
    images: [],
    result: '洽谈很成功，客户很满意，进入下一步流程',
  },
  {
    checkInTime: '2025.01.20 10:30:00',
    checkOutTime: '',
    location: '广东省深圳市南山区晟成智慧制造有限公司',
    purpose: '生意洽谈',
    images: [],
    result: '洽谈很成功，客户很满意，进入下一步流程',
  },
])

const toggleEdit = () => {
  isEditing.value = !isEditing.value
}

const editRecord = (idx) => {
  editForm.amount = detail.amount
  editForm.signDate = detail.signDate
  editForm.status = detail.status
  editForm.product = detail.product
  showEditOppPopup.value = true
}

const onEditOppConfirm = () => {
  detail.amount = editForm.amount
  detail.signDate = editForm.signDate
  detail.status = editForm.status
  detail.product = editForm.product
  showEditOppPopup.value = false
}

const onSelectDate = () => {
  Taro.showToast({ title: '选择日期', icon: 'none' })
}

const onSelectStatus = () => {
  Taro.showToast({ title: '选择商机状态', icon: 'none' })
}

const onSelectProduct = () => {
  Taro.showToast({ title: '选择需求产品', icon: 'none' })
}

const showAddFollowPopup = ref(false)
const showFollowMethodPopup = ref(false)
const followMethods = ['电话', '微信', '公司面谈', '其他']

const followForm = reactive({
  method: '',
  content: '',
})

const selectFollowMethod = (method) => {
  followForm.method = method
  showFollowMethodPopup.value = false
}

const onAddFollowConfirm = () => {
  if (!followForm.method) {
    Taro.showToast({ title: '请选择跟进方式', icon: 'none' })
    return
  }
  followRecords.value.unshift({
    time: new Date().toISOString().replace('T', ' ').slice(0, 19),
    tag: followForm.method,
    follower: '当前用户',
    method: followForm.method,
    content: followForm.content || '暂无内容',
  })
  showAddFollowPopup.value = false
  followForm.method = ''
  followForm.content = ''
  Taro.showToast({ title: '添加成功', icon: 'none' })
}

const deleteRecord = (idx) => {
  Taro.showModal({
    title: '提示',
    content: '确定删除该跟进记录吗？',
    success: (res) => {
      if (res.confirm) {
        followRecords.value.splice(idx, 1)
      }
    },
  })
}

const editVisitRecord = (idx) => {
  Taro.showToast({ title: '编辑拜访记录', icon: 'none' })
}

const deleteVisitRecord = (idx) => {
  Taro.showModal({
    title: '提示',
    content: '确定删除该拜访记录吗？',
    success: (res) => {
      if (res.confirm) {
        visitRecords.value.splice(idx, 1)
      }
    },
  })
}

const showFailPopup = ref(false)
const failReason = ref('')

const showCheckinPopup = ref(false)
const showDistanceWarnPopup = ref(false)
const showPurposePopup = ref(false)
const checkinDistance = ref(89)
const checkinPurpose = ref('')
const purposeList = ['打样试枪', '合同签订', '面谈沟通', '售后处理', '日常回访', '调试试机', '其他']

const onCheckinAddrTap = () => {
  Taro.showToast({ title: '查看地址', icon: 'none' })
}

const selectPurpose = (purpose) => {
  checkinPurpose.value = purpose
  showPurposePopup.value = false
}

const onCheckinUpload = () => {
  Taro.showToast({ title: '拍照上传', icon: 'none' })
}

const onCheckinConfirm = () => {
  if (!checkinPurpose.value) {
    Taro.showToast({ title: '请选择拜访目的', icon: 'none' })
    return
  }
  if (checkinDistance.value > 10) {
    showCheckinPopup.value = false
    showDistanceWarnPopup.value = true
    return
  }
  Taro.showToast({ title: '签到成功', icon: 'none' })
  showCheckinPopup.value = false
}

const onWarnConfirm = () => {
  Taro.showToast({ title: '地址已更新', icon: 'none' })
  showDistanceWarnPopup.value = false
}

const onFail = () => {
  showFailPopup.value = true
  failReason.value = ''
}

const onFailConfirm = () => {
  Taro.showToast({ title: '已标记为转化失败', icon: 'none' })
  showFailPopup.value = false
}

const onAddFollow = () => {
  showAddFollowPopup.value = true
}

const onCheckIn = () => {
  checkinPurpose.value = ''
  checkinDistance.value = 89
  showCheckinPopup.value = true
}
</script>

<style>
.detail-page {
  min-height: 100vh;
  background: #F5F7F9;
  display: flex;
  flex-direction: column;
}

.detail-scroll {
  flex: 1;
  padding: 24rpx 40rpx;
  box-sizing: border-box;
}

.detail-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
}

.detail-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.detail-card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1A1D24;
  flex: 1;
}

.detail-card-title-input {
  font-size: 32rpx;
  font-weight: 600;
  color: #1A1D24;
  flex: 1;
  height: 44rpx;
  line-height: 44rpx;
}

.detail-edit-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.detail-edit-icon {
  width: 28rpx;
  height: 28rpx;
  flex-shrink: 0;
}

.detail-edit-text {
  font-size: 26rpx;
  font-weight: 500;
  color: #37AE7E;
}

.detail-divider {
  height: 1rpx;
  background: #E5E6EB;
  margin: 24rpx 0;
}

.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.detail-label {
  font-size: 26rpx;
  font-weight: 400;
  color: #62687D;
  flex-shrink: 0;
}

.detail-value {
  font-size: 26rpx;
  font-weight: 400;
  color: #1A1D24;
  text-align: right;
}

.detail-input {
  font-size: 26rpx;
  font-weight: 400;
  color: #1A1D24;
  text-align: right;
  height: 44rpx;
  width: 300rpx;
}

.detail-tabs {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.detail-tab {
  font-size: 26rpx;
  font-weight: 500;
  color: #9292A5;
}

.detail-tab--active {
  color: #37AE7E;
}

.detail-tab-sep {
  width: 2rpx;
  height: 24rpx;
  background: #E5E6EB;
}

.timeline {
  display: flex;
  flex-direction: column;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
}

.timeline-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40rpx;
  flex-shrink: 0;
  padding-top: 8rpx;
}

.timeline-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #37AE7E;
  flex-shrink: 0;
}

.timeline-line {
  width: 2rpx;
  flex: 1;
  min-height: 150rpx;
  background: #E5E6EB;
  margin-top: 8rpx;
}

.timeline-content {
  flex: 1;
  padding-bottom: 32rpx;
  padding-left: 16rpx;
}

.timeline-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12rpx;
}

.timeline-head-left {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.timeline-date {
  font-size: 24rpx;
  font-weight: 500;
  color: #1A1D24;
}

.timeline-tag {
  font-size: 24rpx;
  font-weight: 400;
  color: #62687D;
}

.timeline-actions {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.timeline-action-icon {
  width: 32rpx;
  height: 32rpx;
  flex-shrink: 0;
}

.visit-item {
  display: flex;
  gap: 12rpx;
}

.visit-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding-bottom: 40rpx;
}

.visit-field {
  display: flex;
  align-items: flex-start;
  gap: 4rpx;
}

.visit-label {
  font-size: 28rpx;
  color: #62687D;
  flex-shrink: 0;
}

.visit-value {
  font-size: 28rpx;
  color: #1A1D24;
  flex: 1;
}

.visit-images {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}

.visit-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
  background: #F6F7FB;
}

.visit-actions {
  display: flex;
  align-items: center;
  gap: 12rpx;
  justify-content: flex-end;
}

.timeline-info {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8rpx;
}

.timeline-info-label {
  font-size: 24rpx;
  font-weight: 400;
  color: #62687D;
  flex-shrink: 0;
}

.timeline-info-text {
  font-size: 24rpx;
  font-weight: 400;
  color: #62687D;
}

.detail-bottom-spacer {
  height: 140rpx;
}

.fail-card {
  width: 582rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.fail-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333333;
  text-align: center;
}

.fail-textarea {
  padding: 12rpx 20rpx;
  background: #FBFBFB;
  border: 1rpx solid #E4E9EF;
  border-radius: 6rpx;
}

.fail-input {
  font-size: 26rpx;
  color: #1A1D24;
  height: 88rpx;
  line-height: 44rpx;
}

.fail-btns {
  display: flex;
  gap: 32rpx;
}

.fail-btn {
  flex: 1;
  height: 68rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fail-btn--cancel {
  background: #EDFAF5;
  border: 2rpx solid #37AE7E;
}

.fail-btn-text {
  font-size: 32rpx;
  font-weight: 400;
}

.fail-btn-text--cancel {
  color: #37AE7E;
}

.fail-btn--confirm {
  background: #37AE7E;
}

.fail-btn-text--confirm {
  color: #FFFFFF;
}

.add-follow-card {
  width: 582rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.add-follow-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333333;
  text-align: center;
}

.add-follow-select {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12rpx 20rpx;
  background: #FBFBFB;
  border: 1rpx solid #E4E9EF;
  border-radius: 6rpx;
}

.add-follow-select-text {
  font-size: 26rpx;
  color: #9292A5;
}
.add-follow-select-text--set {
  color: #1A1D24;
}

.add-follow-arrow {
  width: 28rpx;
  height: 28rpx;
  flex-shrink: 0;
}

.add-follow-textarea {
  padding: 12rpx 20rpx;
  background: #FBFBFB;
  border: 1rpx solid #E4E9EF;
  border-radius: 6rpx;
}

.add-follow-input {
  font-size: 26rpx;
  color: #1A1D24;
  height: 88rpx;
  line-height: 44rpx;
}

.add-follow-btns {
  display: flex;
  gap: 32rpx;
}

.add-follow-btn {
  flex: 1;
  height: 68rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-follow-btn--cancel {
  background: #EDFAF5;
  border: 2rpx solid #37AE7E;
}

.add-follow-btn-text {
  font-size: 32rpx;
  font-weight: 400;
}

.add-follow-btn-text--cancel {
  color: #37AE7E;
}

.add-follow-btn--confirm {
  background: #37AE7E;
}

.add-follow-btn-text--confirm {
  color: #FFFFFF;
}

.method-popup {
  display: flex;
  flex-direction: column;
  padding: 40rpx 0 0;
}

.method-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40rpx 40rpx;
}

.method-cancel {
  font-size: 34rpx;
  color: #828593;
}

.method-title {
  font-size: 34rpx;
  font-weight: 500;
  color: #333333;
}

.method-confirm {
  font-size: 34rpx;
  color: #37AE7E;
}

.method-body {
  display: flex;
  flex-direction: column;
  padding: 0 40rpx;
}

.method-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
}

.method-item-text {
  font-size: 30rpx;
  color: #1A1D24;
}

.method-radio {
  width: 36rpx;
  height: 36rpx;
  flex-shrink: 0;
  font-size: 32rpx;
  color: #D9D9D9;
  display: flex;
  align-items: center;
  justify-content: center;
}
.method-radio--checked {
  color: #37AE7E;
}

.method-divider {
  height: 1rpx;
  background: #F4F4F4;
}

.checkin-card {
  width: 582rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.checkin-title {
  font-size: 34rpx;
  font-weight: 500;
  color: #333333;
  text-align: center;
}

.checkin-addr-box {
  display: flex;
  align-items: flex-start;
  gap: 8rpx;
  padding: 12rpx 20rpx;
  background: #FBFBFB;
  border: 1rpx solid #E4E9EF;
  border-radius: 6rpx;
}

.checkin-loc-icon {
  width: 42rpx;
  height: 42rpx;
  flex-shrink: 0;
  margin-top: 2rpx;
}

.checkin-addr {
  font-size: 28rpx;
  color: #1A1D24;
  flex: 1;
}

.checkin-distance-row {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  padding: 12rpx 20rpx;
  background: #FBFBFB;
  border: 1rpx solid #E4E9EF;
  border-radius: 6rpx;
}

.checkin-dist-col {
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.checkin-route-icon {
  width: 42rpx;
  height: 42rpx;
  flex-shrink: 0;
}

.checkin-dist-label {
  font-size: 28rpx;
  color: #62687D;
}

.checkin-dist-value {
  font-size: 28rpx;
  font-weight: 700;
  color: #F53F3F;
}

.checkin-current-col {
  display: flex;
  align-items: flex-start;
  gap: 4rpx;
}

.checkin-current-icon {
  width: 42rpx;
  height: 42rpx;
  flex-shrink: 0;
}

.checkin-current-addr {
  font-size: 28rpx;
  color: #1A1D24;
  flex: 1;
}

.checkin-purpose {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12rpx 20rpx;
  background: #FBFBFB;
  border: 1rpx solid #E4E9EF;
  border-radius: 6rpx;
}

.checkin-purpose-text {
  font-size: 28rpx;
  color: #9292A5;
}

.checkin-purpose-text--set {
  color: #1A1D24;
}

.checkin-purpose-arrow {
  width: 28rpx;
  height: 28rpx;
  flex-shrink: 0;
}

.checkin-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 24rpx;
  background: #FBFBFB;
  border: 2rpx dashed #ECEBEB;
  border-radius: 8rpx;
}

.checkin-plus-icon {
  width: 36rpx;
  height: 36rpx;
}

.checkin-upload-text {
  font-size: 28rpx;
  color: #62687D;
}

.checkin-btns {
  display: flex;
  gap: 32rpx;
}

.checkin-btn {
  flex: 1;
  height: 68rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkin-btn--cancel {
  background: #EDFAF5;
  border: 2rpx solid #37AE7E;
}

.checkin-btn-text {
  font-size: 32rpx;
  font-weight: 400;
}

.checkin-btn-text--cancel {
  color: #37AE7E;
}

.checkin-btn--confirm {
  background: #37AE7E;
}

.checkin-btn-text--confirm {
  color: #FFFFFF;
}

.checkin-btn--disabled {
  background: #BBBEC2;
}

.checkin-btn-text--disabled {
  color: #FFFFFF;
}

.warn-card {
  width: 510rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
}

.warn-icon {
  width: 56rpx;
  height: 56rpx;
}

.warn-text {
  font-size: 28rpx;
  color: #1A1D24;
  text-align: center;
  line-height: 44rpx;
}

.warn-btns {
  display: flex;
  gap: 32rpx;
  width: 100%;
}

.warn-btn {
  flex: 1;
  height: 68rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.warn-btn--cancel {
  background: #EDFAF5;
  border: 2rpx solid #37AE7E;
}

.warn-btn-text {
  font-size: 32rpx;
  font-weight: 400;
}

.warn-btn-text--cancel {
  color: #37AE7E;
}

.warn-btn--confirm {
  background: #37AE7E;
}

.warn-btn-text--confirm {
  color: #FFFFFF;
}

.edit-opp-popup {
  display: flex;
  flex-direction: column;
  padding: 40rpx 0 0;
}

.edit-opp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40rpx 40rpx;
}

.edit-opp-cancel {
  font-size: 32rpx;
  color: #9292A5;
}

.edit-opp-title {
  font-size: 34rpx;
  font-weight: 500;
  color: #1A1D24;
}

.edit-opp-confirm {
  font-size: 32rpx;
  color: #37AE7E;
}

.edit-opp-body {
  display: flex;
  flex-direction: column;
  padding: 0 40rpx;
  gap: 24rpx;
}

.edit-opp-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.edit-opp-label {
  font-size: 28rpx;
  color: #62687D;
  flex-shrink: 0;
}

.edit-opp-value-row {
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.edit-opp-value {
  font-size: 28rpx;
  color: #1A1D24;
  text-align: right;
}

.edit-opp-value--placeholder {
  color: #BBBEC2;
}

.edit-opp-input {
  font-size: 28rpx;
  color: #1A1D24;
  text-align: right;
  height: 44rpx;
  width: 200rpx;
}

.edit-opp-suffix {
  font-size: 28rpx;
  color: #62687D;
}

.edit-opp-arrow {
  width: 28rpx;
  height: 28rpx;
  flex-shrink: 0;
}

.edit-opp-divider {
  height: 1rpx;
  background: #F4F4F4;
}

.detail-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 28rpx;
  padding: 20rpx 40rpx;
  padding-bottom: calc(env(safe-area-inset-bottom));
  background: #F5F7F9;
}

.detail-bottom-btn {
  flex: 1;
  height: 76rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-bottom-btn--danger {
  background: #FFE6E6;
  border: 2rpx solid #F53F3F;
}

.detail-bottom-btn--primary {
  background: #EFFDF7;
  border: 2rpx solid #5CC79C;
}

.detail-bottom-btn-text {
  font-size: 32rpx;
  font-weight: 500;
}

.detail-bottom-btn-text--danger {
  color: #F53F3F;
}

.detail-bottom-btn-text--primary {
  color: #5CC79C;
}
</style>
