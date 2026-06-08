<template>
  <view class="cd-page">
    <NavBar title="客户详情" />

    <!-- 加载/空状态 -->
    <view v-if="!customer && !loading" class="empty-page">
      <text class="empty-text">客户不存在</text>
    </view>
    <view v-if="loading" class="empty-page">
      <text class="empty-text">加载中...</text>
    </view>

    <scroll-view v-if="customer" class="cd-scroll" scroll-y="true" :enhanced="true" :show-scrollbar="false">
      <view class="cd-card">
        <view class="cd-header-row">
          <text class="cd-company-name">{{ customer.name }}</text>
          <view class="cd-header-actions">
            <view class="cd-header-action" @tap="showTransferPopup = true">
              <text class="cd-header-action-text">转移</text>
            </view>
            <view class="cd-header-sep" />
            <view class="cd-header-action" @tap="onEdit">
              <image class="cd-edit-sm-icon" :src="iconEdit" mode="aspectFit" />
              <text class="cd-header-action-text">编辑</text>
            </view>
          </view>
        </view>
        <view class="cd-divider" />
        <view class="cd-field">
          <text class="cd-label">负责人</text>
          <text class="cd-value">{{ customer.ownerUserName || '-' }}</text>
        </view>
        <view class="cd-field">
          <text class="cd-label">协作人</text>
          <text class="cd-value">{{ (customer.ownedUserNames || []).join(' | ') || '-' }}</text>
          <image class="cd-edit-icon" :src="iconEdit" mode="aspectFit" />
        </view>
        <view class="cd-field">
          <text class="cd-label">客户创建时间</text>
          <text class="cd-value">{{ formatTime((customer as any).createdAt) }}</text>
        </view>
        <view class="cd-field">
          <text class="cd-label">关联线索</text>
          <text class="cd-value">{{ (customer as any).leadNo || '-' }}</text>
        </view>
      </view>

      <nut-popup v-model:visible="showTransferPopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }" :z-index="2000">
        <view class="transfer-popup">
          <view class="transfer-item" @tap="onTransferToPerson">
            <text class="transfer-item-text">转移客户给他人</text>
          </view>
          <view class="transfer-divider" />
          <view class="transfer-item" @tap="onTransferToPublic">
            <text class="transfer-item-text">转移至客户公海</text>
          </view>
        </view>
      </nut-popup>

      <nut-popup v-model:visible="showPublicSeaPopup" position="bottom" :style="{ borderRadius: '24rpx 24rpx 0 0' }" :z-index="2000">
        <view class="ps-popup">
          <view class="ps-header">
            <text class="ps-cancel" @tap="showPublicSeaPopup = false">取消</text>
            <text class="ps-title">选择客户公海</text>
            <text class="ps-confirm" @tap="confirmPublicSea">确认</text>
          </view>
          <view class="ps-body">
            <template v-for="(item, idx) in publicSeaOptions" :key="item">
              <view class="ps-row" @tap="selectPublicSea(item)">
                <text class="ps-row-text">{{ item }}</text>
                <view class="ps-checkbox" :class="{ 'ps-checkbox--checked': publicSeaSelected === item }">
                  <view v-if="publicSeaSelected === item" class="ps-checkbox-dot" />
                </view>
              </view>
              <view v-if="idx < publicSeaOptions.length - 1" class="ps-divider" />
            </template>
          </view>
        </view>
      </nut-popup>

      <nut-popup v-model:visible="showTransferDetailPopup" position="center" :style="{ borderRadius: '24rpx' }" :z-index="2100">
        <view class="tp-card">
          <text class="tp-title">{{ transferTitle }}</text>
          <view class="tp-select" @tap="onSelectPerson">
            <text class="tp-select-text">{{ transferPlaceholder }}</text>
            <image class="tp-arrow" :src="rightArrow" mode="aspectFit" />
          </view>
          <view class="tp-btns">
            <view class="tp-btn tp-btn--cancel" @tap="showTransferDetailPopup = false">
              <text class="tp-btn-text tp-btn-text--cancel">取消</text>
            </view>
            <view class="tp-btn tp-btn--confirm" @tap="onTransferConfirm">
              <text class="tp-btn-text tp-btn-text--confirm">确认</text>
            </view>
          </view>
        </view>
      </nut-popup>

      <view class="cd-card">
        <view class="cd-tab-row">
          <text class="cd-tab" :class="{ 'cd-tab--active': infoTab === 'basic' }" @tap="infoTab = 'basic'">基础信息</text>
          <text class="cd-tab" :class="{ 'cd-tab--active': infoTab === 'opportunity' }" @tap="infoTab = 'opportunity'">商机</text>
          <text class="cd-tab" :class="{ 'cd-tab--active': infoTab === 'quote' }" @tap="infoTab = 'quote'">报价</text>
          <text class="cd-tab" :class="{ 'cd-tab--active': infoTab === 'contract' }" @tap="infoTab = 'contract'">合同</text>
          <text class="cd-tab" :class="{ 'cd-tab--active': infoTab === 'expense' }" @tap="infoTab = 'expense'">关联费用</text>
          <!-- <text class="cd-tab" :class="{ 'cd-tab--active': infoTab === 'product' }" @tap="infoTab = 'product'">物流记录</text> -->
          <text class="cd-tab" :class="{ 'cd-tab--active': infoTab === 'record' }" @tap="infoTab = 'record'">业绩分配</text>
        </view>
        <view class="cd-divider" />
        <view v-if="infoTab === 'basic'" class="cd-subtag-row">
          <view class="cd-subtag" :class="{ 'cd-subtag--active': basicSubTab === 'basic' }" @tap="basicSubTab = 'basic'">
            <text class="cd-subtag-text" :class="{ 'cd-subtag-text--active': basicSubTab === 'basic' }">基础信息</text>
          </view>
          <view class="cd-subtag" :class="{ 'cd-subtag--active': basicSubTab === 'contact' }" @tap="basicSubTab = 'contact'">
            <text class="cd-subtag-text" :class="{ 'cd-subtag-text--active': basicSubTab === 'contact' }">联系方式</text>
          </view>
          <view class="cd-subtag" :class="{ 'cd-subtag--active': basicSubTab === 'system' }" @tap="basicSubTab = 'system'">
            <text class="cd-subtag-text" :class="{ 'cd-subtag-text--active': basicSubTab === 'system' }">系统信息</text>
          </view>
        </view>
        <view v-if="infoTab === 'basic' && basicSubTab === 'basic'" class="cd-info-card">
          <view class="cd-info-row">
            <text class="cd-info-label">客户名称</text>
            <text class="cd-info-value">{{ customer.name || '-' }}</text>
          </view>
          <view class="cd-info-divider" />
          <view class="cd-info-row">
            <text class="cd-info-label">联系人</text>
            <text class="cd-info-value">{{ customer.contactName || '-' }}</text>
          </view>
          <view class="cd-info-divider" />
          <view class="cd-info-row">
            <text class="cd-info-label">联系人职位</text>
            <text class="cd-info-value">{{ customer.contactPosition || '-' }}</text>
          </view>
          <view class="cd-info-divider" />
          <view class="cd-info-row">
            <text class="cd-info-label">客户行业</text>
            <text class="cd-info-value">{{ customer.industryLabel || '-' }}</text>
          </view>
          <view class="cd-info-divider" />
          <view class="cd-info-row">
            <text class="cd-info-label">客户工件</text>
            <text class="cd-info-value">-</text>
          </view>
          <view class="cd-info-divider" />
          <view class="cd-info-row">
            <text class="cd-info-label">项目类型</text>
            <text class="cd-info-value">{{ customer.projectType || '-' }}</text>
          </view>
          <view class="cd-info-divider" />
          <view class="cd-info-row">
            <text class="cd-info-label">客户类别</text>
            <text class="cd-info-value">{{ customer.categoryLabel || '-' }}</text>
          </view>
          <view class="cd-info-divider" />
          <view class="cd-info-row">
            <text class="cd-info-label">客户等级</text>
            <text class="cd-info-value">{{ customer.levelLabel || '-' }}</text>
          </view>
          <view class="cd-info-divider" />
          <view class="cd-info-row">
            <text class="cd-info-label">是否使用其他品牌喷粉枪</text>
            <text class="cd-info-value">-</text>
          </view>
          <view class="cd-info-divider" />
          <view class="cd-info-row">
            <text class="cd-info-label">品牌</text>
            <text class="cd-info-value">-</text>
          </view>
          <view class="cd-info-divider" />
          <view class="cd-info-row">
            <text class="cd-info-label">数量</text>
            <text class="cd-info-value">-</text>
          </view>
          <view class="cd-info-divider" />
          <view class="cd-info-row">
            <text class="cd-info-label">类型</text>
            <text class="cd-info-value">-</text>
          </view>
        </view>
        <view v-if="infoTab === 'basic' && basicSubTab === 'contact'" class="cd-info-card">
          <view class="cd-info-row">
            <text class="cd-info-label">联系电话</text>
            <text class="cd-info-value">{{ customer.phone || '-' }}</text>
          </view>
          <view class="cd-info-divider" />
          <view class="cd-info-row">
            <text class="cd-info-label">微信号</text>
            <text class="cd-info-value">-</text>
          </view>
          <view class="cd-info-divider" />
          <view class="cd-info-row">
            <text class="cd-info-label">WhatsApp</text>
            <text class="cd-info-value">-</text>
          </view>
          <view class="cd-info-divider" />
          <view class="cd-info-row">
            <text class="cd-info-label">省/市/区</text>
            <text class="cd-info-value">{{ [customer.provinceName, customer.cityName, customer.districtName].filter(Boolean).join('') || '-' }}</text>
          </view>
          <view class="cd-info-divider" />
          <view class="cd-info-row">
            <text class="cd-info-label">地址</text>
            <text class="cd-info-value">{{ customer.address || '-' }}</text>
          </view>
        </view>
        <view v-if="infoTab === 'basic' && basicSubTab === 'system'" class="cd-info-card">
          <view class="cd-info-row">
            <text class="cd-info-label">公司</text>
            <text class="cd-info-value">{{ customer.companyName || '-' }}</text>
          </view>
          <view class="cd-info-divider" />
          <view class="cd-info-row">
            <text class="cd-info-label">来源部门</text>
            <text class="cd-info-value">{{ customer.channelName || '-' }}</text>
          </view>
          <view class="cd-info-divider" />
          <view class="cd-info-row">
            <text class="cd-info-label">负责人</text>
            <text class="cd-info-value">{{ customer.ownerUserName || '-' }}</text>
          </view>
          <view class="cd-info-divider" />
          <view class="cd-info-row">
            <text class="cd-info-label">协作人</text>
            <text class="cd-info-value">{{ (customer.ownedUserNames || []).join(' | ') || '-' }}</text>
          </view>
        </view>
        <view v-if="infoTab === 'opportunity'" class="cd-opp-list">
          <view v-for="card in oppCards" :key="card.name" class="cd-opp-card" @tap="goOppDetail(card)">
            <view class="cd-opp-card-head">
              <text class="cd-opp-card-name">{{ card.name }}</text>
              <view class="cd-opp-badge" :class="'cd-opp-badge--' + card.badgeStyle">
                <text class="cd-opp-badge-text">{{ card.badge }}</text>
              </view>
            </view>
            <view class="cd-opp-card-info">
              <view class="cd-opp-info-row">
                <view class="cd-opp-info-col">
                  <text class="cd-opp-info-label">商机编号</text>
                  <text class="cd-opp-info-value">{{ card.oppNo }}</text>
                </view>
                <view class="cd-opp-info-col">
                  <text class="cd-opp-info-label">需求产品</text>
                  <text class="cd-opp-info-value">{{ card.product }}</text>
                </view>
              </view>
              <view class="cd-opp-info-row">
                <view class="cd-opp-info-col">
                  <text class="cd-opp-info-label">预计销售金额</text>
                  <text class="cd-opp-info-value cd-opp-info-value--price">￥{{ card.amount }}</text>
                </view>
                <view class="cd-opp-info-col">
                  <text class="cd-opp-info-label">预计签单日期</text>
                  <text class="cd-opp-info-value">{{ card.signDate }}</text>
                </view>
              </view>
            </view>
            <view class="cd-opp-note">
              <text class="cd-opp-note-label">最新跟进：</text>
              <text class="cd-opp-note-text">{{ card.note }}</text>
            </view>
          </view>
        </view>
        <view v-if="infoTab === 'quote'" class="cd-quote-list">
          <view v-for="card in quoteCards" :key="card.id" class="cd-quote-card" @tap="goQuotationDetail(card)">
            <view class="cd-quote-card-head">
              <text class="cd-quote-card-name">{{ card.name }}</text>
              <view class="cd-quote-badge" :class="'cd-quote-badge--' + quotBadgeStyle(card)">
                <text class="cd-quote-badge-text">{{ quotBadgeText(card) }}</text>
              </view>
            </view>
            <view class="cd-quote-card-info">
              <view class="cd-quote-info-col">
                <text class="cd-quote-info-label">报价单号</text>
                <text class="cd-quote-info-value">{{ card.quotationNo }}</text>
              </view>
              <view class="cd-quote-info-col">
                <text class="cd-quote-info-label">金额</text>
                <text class="cd-quote-info-value cd-quote-info-value--price">{{ formatAmount(card.totalAmount) }}</text>
              </view>
            </view>
            <view class="cd-quote-time">
              <text class="cd-quote-time-label">发起时间：</text>
              <text class="cd-quote-time-value">{{ formatTime(card.quotedAt) }}</text>
            </view>
          </view>
          <view class="cd-quote-add-btn" @tap="onAddQuote">
            <text class="cd-quote-add-text">新建报价</text>
          </view>
        </view>
        <view v-if="infoTab === 'contract'" class="cd-quote-list">
          <view v-for="card in contractCards" :key="card.id" class="cd-quote-card" @tap="goContractDetail(card)">
            <view class="cd-quote-card-head">
              <text class="cd-quote-card-name">{{ card.name || '-' }}</text>
              <view class="cd-quote-badge" :class="'cd-quote-badge--' + (CONTRACT_STATUS_BADGE_MAP[card.displayStatus] || 'gray')">
                <text class="cd-quote-badge-text">{{ CONTRACT_STATUS_MAP[card.displayStatus] || card.displayStatus || '-' }}</text>
              </view>
            </view>
            <view class="cd-quote-card-info">
              <view class="cd-quote-info-col">
                <text class="cd-quote-info-label">合同编号</text>
                <text class="cd-quote-info-value">{{ card.contractNo || '-' }}</text>
              </view>
              <view class="cd-quote-info-col">
                <text class="cd-quote-info-label">合同金额</text>
                <text class="cd-quote-info-value cd-quote-info-value--price">{{ formatAmount(card.totalAmount) }}</text>
              </view>
            </view>
            <view class="cd-quote-time">
              <text class="cd-quote-time-label">发起时间：</text>
              <text class="cd-quote-time-value">{{ formatTime(card.submittedAt || card.submittedAt) }}</text>
            </view>
          </view>
          <view class="cd-quote-add-btn" @tap="onAddContract">
            <text class="cd-quote-add-text">新建合同</text>
          </view>
        </view>
        <view v-if="infoTab === 'expense'" class="cd-quote-list">
           <view v-for="card in expenseCards" :key="card.id" class="cd-quote-card" @tap="goExpenseDetail(card)">
            <view class="cd-ex-head">
              <view class="cd-ex-type-badge">{{ EXPENSE_ITEM_MAP[card.expenseItem] || card.expenseItem || '-' }}</view>
              <text class="cd-ex-number">{{ card.expenseNo }}</text>
              <view class="cd-quote-badge" :class="'cd-quote-badge--' + expBadgeStyle(card)">
                <text class="cd-quote-badge-text">{{ EXPENSE_STATUS_MAP[card.status] || card.status || '-' }}</text>
              </view>
            </view>
            <view class="cd-ex-info">
              <view class="cd-ex-info-col">
                <text class="cd-ex-info-label">金额</text>
                <text class="cd-ex-info-value">{{ formatAmount(card.amount) }}</text>
              </view>
              <view class="cd-ex-info-col">
                <text class="cd-ex-info-label">部门</text>
                <text class="cd-ex-info-value">{{ card.expenseDepartmentName || '-' }}</text>
              </view>
            </view>
            <view class="cd-ex-time">
              <text class="cd-ex-time-label">发起时间：</text>
              <text class="cd-ex-time-value">{{ formatTime(card.submittedAt || card.createdAt) }}</text>
            </view>
          </view>
        </view>
        <view v-if="infoTab === 'product'" class="cd-quote-list">
          <view v-for="card in logisticsCards" :key="card.orderNo" class="cd-quote-card" @tap="goLogistics(card.orderNo)">
            <view class="cd-lg-head">
              <text class="cd-lg-name">{{ card.name }}</text>
              <view class="cd-lg-badge">{{ card.status }}</view>
            </view>
            <view class="cd-lg-info">
              <view class="cd-lg-info-col">
                <text class="cd-lg-info-label">订单号</text>
                <text class="cd-lg-info-value">{{ card.orderNo }}</text>
              </view>
              <view class="cd-lg-info-col">
                <text class="cd-lg-info-label">关联合同</text>
                <text class="cd-lg-info-value">{{ card.contract }}</text>
              </view>
               <view class="cd-lg-info-col">
                <text class="cd-lg-info-label">物流单号</text>
                <text class="cd-lg-info-value">{{ card.logisticsNo }}</text>
              </view>
              <view class="cd-lg-info-col">
                <text class="cd-lg-info-label">物流公司</text>
                <text class="cd-lg-info-value">{{ card.logisticsCompany }}</text>
              </view>
            </view>

          </view>
        </view>
        <view v-if="infoTab === 'record'" class="cd-quote-list">
          <view v-for="card in perfCards" :key="card.name" class="cd-quote-card" @tap="goPerfDetail(card)">
            <view class="cd-lg-head">
              <text class="cd-lg-name">{{ card.name }}</text>
              <view class="cd-lg-badge">{{ card.status }}</view>
            </view>
            <view class="cd-lg-info">
              <view class="cd-lg-info-col">
                <text class="cd-lg-info-label">关联商机</text>
                <text class="cd-lg-info-value">{{ card.opportunity }}</text>
              </view>
              <view class="cd-lg-info-col">
                <text class="cd-lg-info-label">关联合同</text>
                <text class="cd-lg-info-value">{{ card.contract }}</text>
              </view>
               <view class="cd-lg-info-col">
                <text class="cd-lg-info-label">合同总金额</text>
                <text class="cd-lg-info-value">{{ card.totalAmount }}</text>
              </view>
              <view class="cd-lg-info-col">
                <text class="cd-lg-info-label">本次回款金额</text>
                <text class="cd-lg-info-value">{{ card.paidAmount }}</text>
              </view>
            </view>

          </view>
        </view>
      </view>


      <view class="cd-card cd-card--dynamic">
        <view class="cd-dynamic-body">
        <view class="cd-dynamic-head">
          <text class="cd-dynamic-title">客户动态</text>
          <view class="cd-dynamic-tabs">
            <text class="cd-dynamic-tab" :class="{ 'cd-dynamic-tab--active': followTab === 'follow' }" @tap="followTab = 'follow'">跟进</text>
            <view class="cd-dynamic-sep" />
            <text class="cd-dynamic-tab" :class="{ 'cd-dynamic-tab--active': followTab === 'visit' }" @tap="followTab = 'visit'">拜访</text>
          </view>
        </view>
        <view class="cd-divider" />
        <view v-if="oppCards.length > 0" class="cd-opp-tag-row">
          <view
            v-for="(card, idx) in oppCards"
            :key="card.id"
            class="cd-opp-tag"
            :class="{ 'cd-opp-tag--active': activeOppIdx === idx }"
            @tap="activeOppIdx = idx"
          >
            <text class="cd-opp-tag-text">{{ card.name }}</text>
          </view>
        </view>
        <view v-if="activeOpp" class="cd-opp-detail-card">
          <view class="cd-opp-detail-head">
            <text class="cd-opp-detail-name">{{ activeOpp.name }}</text>
            <view class="cd-opp-detail-edit" @tap="goOppDetail(activeOpp)">
              <image class="cd-opp-detail-edit-icon" :src="iconEdit" mode="aspectFit" />
              <text class="cd-opp-detail-edit-text">编辑</text>
            </view>
          </view>
          <view class="cd-divider" />
          <view class="cd-opp-detail-row">
            <text class="cd-opp-detail-label">商机编号</text>
            <text class="cd-opp-detail-value">{{ activeOpp.oppNo }}</text>
          </view>
          <view class="cd-divider" />
          <view class="cd-opp-detail-row">
            <text class="cd-opp-detail-label">预计销售金额</text>
            <text class="cd-opp-detail-value">{{ activeOpp.amount }}</text>
          </view>
          <view class="cd-divider" />
          <view class="cd-opp-detail-row">
            <text class="cd-opp-detail-label">预计成交日期</text>
            <text class="cd-opp-detail-value">{{ activeOpp.signDate }}</text>
          </view>
          <view class="cd-divider" />
          <view class="cd-opp-detail-row">
            <text class="cd-opp-detail-label">商机状态</text>
            <text class="cd-opp-detail-value">{{ activeOpp.badge }}</text>
          </view>
          <view class="cd-divider" />
          <view class="cd-opp-detail-row">
            <text class="cd-opp-detail-label">需求产品</text>
            <text class="cd-opp-detail-value">{{ activeOpp.product }}</text>
          </view>
          <view class="cd-divider" />
          <view class="cd-opp-detail-row">
            <text class="cd-opp-detail-label">负责人</text>
            <text class="cd-opp-detail-value">{{ (activeOpp as any).owner || '-' }}</text>
          </view>
          <view class="cd-divider" />
          <view class="cd-opp-detail-row">
            <text class="cd-opp-detail-label">协作人</text>
            <text class="cd-opp-detail-value">{{ (activeOpp as any).collaborator || '-' }}</text>
          </view>
        </view>
        <view v-if="followTab === 'follow'" class="cd-timeline">
          <view v-for="(item, idx) in followRecords" :key="idx" class="cd-timeline-item">
            <view class="cd-timeline-left">
              <view class="cd-timeline-dot" />
              <view v-if="idx < followRecords.length - 1" class="cd-timeline-line" />
            </view>
            <view class="cd-timeline-content">
              <view class="cd-timeline-head">
                <view class="cd-timeline-head-left">
                  <text class="cd-timeline-date">{{ item.time }}</text>
                  <text class="cd-timeline-tag">({{ item.tag }})</text>
                </view>
                <view class="cd-timeline-actions">
                  <image class="cd-timeline-action-icon" :src="iconEdit" mode="aspectFit" @tap="editRecord(idx)" />
                  <image class="cd-timeline-action-icon" :src="iconDelete" mode="aspectFit" @tap="deleteRecord(idx)" />
                </view>
              </view>
              <view class="cd-timeline-info">
                <text class="cd-timeline-info-label">跟进人：</text>
                <text class="cd-timeline-info-text">{{ item.follower }}</text>
              </view>
              <view class="cd-timeline-info">
                <text class="cd-timeline-info-label">跟进方式：</text>
                <text class="cd-timeline-info-text">{{ item.method }}</text>
              </view>
              <view class="cd-timeline-info">
                <text class="cd-timeline-info-label">跟进内容：</text>
                <text class="cd-timeline-info-text">{{ item.content }}</text>
              </view>
            </view>
          </view>
        </view>
        <view v-if="followTab === 'visit'" class="cd-timeline">
          <view v-for="(item, idx) in visitRecords" :key="idx" class="cd-timeline-item">
            <view class="cd-timeline-left">
              <view class="cd-timeline-dot" />
              <view v-if="idx < visitRecords.length - 1" class="cd-timeline-line" />
            </view>
            <view class="cd-visit-content">
              <view class="cd-visit-field">
                <text class="cd-visit-label">签到时间：</text>
                <text class="cd-visit-value">{{ item.checkInTime }}</text>
              </view>
              <view v-if="item.checkOutTime" class="cd-visit-field">
                <text class="cd-visit-label">签退时间：</text>
                <text class="cd-visit-value">{{ item.checkOutTime }}</text>
              </view>
              <view class="cd-visit-field">
                <text class="cd-visit-label">定位地点：</text>
                <text class="cd-visit-value">{{ item.location }}</text>
              </view>
              <view class="cd-visit-field">
                <text class="cd-visit-label">拜访目的：</text>
                <text class="cd-visit-value">{{ item.purpose }}</text>
              </view>
              <view v-if="item.images && item.images.length" class="cd-visit-field">
                <text class="cd-visit-label">签到图片：</text>
                <view class="cd-visit-images">
                  <image v-for="(img, i) in item.images" :key="i" class="cd-visit-img" :src="img" mode="aspectFill" />
                </view>
              </view>
              <view class="cd-visit-field">
                <text class="cd-visit-label">拜访结果：</text>
                <text class="cd-visit-value">{{ item.result }}</text>
              </view>
            </view>
          </view>
        </view>
        </view>
      </view>

      <view class="cd-bottom-spacer" />
    </scroll-view>

    <view class="cd-bottom-bar">
      <view class="cd-bottom-btn cd-bottom-btn--danger" @tap="onFail">
        <text class="cd-bottom-btn-text cd-bottom-btn-text--danger">转化失败</text>
      </view>
      <view class="cd-bottom-btn cd-bottom-btn--primary" @tap="onAddFollow">
        <text class="cd-bottom-btn-text cd-bottom-btn-text--primary">新增跟进记录</text>
      </view>
    </view>

  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import Taro from '@tarojs/taro'
import NavBar from '@/components/NavBar.vue'
import { getCustomerDetail, getCustomerOpportunities, type CustomerItem } from '@/api/customer'
import { getOpportunityFollowRecords, getOpportunityVisitRecords, type VisitRecordItem } from '@/api/opportunity'
import { getCustomerQuotations, type CustomerQuotationItem } from '@/api/quote'
import { getExpenseList, EXPENSE_STATUS_MAP, EXPENSE_STATUS_BADGE_MAP, EXPENSE_ITEM_MAP, type ExpenseListItem } from '@/api/expense'
import { getContractList, CONTRACT_STATUS_MAP, CONTRACT_STATUS_BADGE_MAP, type ContractListItem } from '@/api/contract'
import iconEdit from '@/assets/dev/edit.png'
import iconDelete from '@/assets/dev/delete.png'
import iconClose from '@/assets/dev/icon-close.png'
import rightArrow from '@/assets/dev/rightArror.png'

function formatTime(val?: string) {
  if (!val) return '-'
  return val.replace('T', ' ').slice(0, 19)
}

function formatAmount(cent: number): string {
  if (cent === undefined || cent === null) return '-'
  return '￥' + (cent / 100).toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

function quotBadgeStyle(item: CustomerQuotationItem): string {
  const s = item.approvalStatus || ''
  if (s === 'rejected') return 'red'
  if (s === 'approved' || s === 'approved_finished' || s === 'no_approval') return 'green'
  return 'yellow'
}

const QUOTATION_STATUS_MAP: Record<string, string> = {
  no_approval: '无需审批',
  pending: '待审批',
  pending_approval: '待审批',
  approved: '审批通过',
  approved_finished: '审批通过',
  rejected: '已驳回',
}

function quotBadgeText(item: CustomerQuotationItem): string {
  if (item.approvalStatus) {
    return QUOTATION_STATUS_MAP[item.approvalStatus] || item.approvalStatus
  }
  return item.bizStatus || '-'
}

const customerId = ref(0)
const customer = ref<CustomerItem | null>(null)
const loading = ref(true)

const showTransferPopup = ref(false)
const showTransferDetailPopup = ref(false)
const showPublicSeaPopup = ref(false)
const transferTitle = ref('')
const transferPlaceholder = ref('')
const publicSeaSelected = ref('运营客户公海')

const publicSeaOptions = ['运营客户公海', '开发客户公海', '销售客户公海', '客户大公海']

const oppCards = ref<{ name: string; badge: string; badgeStyle: string; oppNo: string; product: string; amount: string; signDate: string; note: string; id: number }[]>([])
const oppLoading = ref(false)

const statusBadgeMap: Record<string, string> = {
  contacting: 'yellow',
  won: 'green',
  conversion_failed: 'red',
}

async function fetchOpportunities() {
  if (oppLoading.value || oppCards.value.length > 0) return
  oppLoading.value = true
  try {
    const list = await getCustomerOpportunities(customerId.value)
    oppCards.value = list.map(item => ({
      id: item.id,
      name: item.requiredProductLabel || '-',
      badge: item.statusLabel || '-',
      badgeStyle: statusBadgeMap[item.status] || 'yellow',
      oppNo: `XJ-${item.id}`,
      product: item.requiredProductLabel || '-',
      amount: item.expectedSalesAmountBandLabel || '-',
      signDate: item.expectedDealPeriodLabel || '-',
      note: item.latestFollowRecord || '-',
    }))
  } catch {
    oppCards.value = []
  } finally {
    oppLoading.value = false
  }
}

const quoteCards = ref<CustomerQuotationItem[]>([])
const canCreateQuote = ref(false)

/** 获取报价列表 */
async function fetchQuotations() {
  if (!customerId.value) return
  try {
    const res = await getCustomerQuotations(customerId.value)
    quoteCards.value = res.items || []
    canCreateQuote.value = res.canCreate
  } catch {
    quoteCards.value = []
  }
}

const contractCards = ref<any>([])

/** 获取合同列表 */
async function fetchContracts() {
  if (!customerId.value) return
  try {
    const res = await getContractList({ customerId: customerId.value, page: 1, pageSize: 50 })
    contractCards.value = res.items || []
  } catch {
    contractCards.value = []
  }
}

const expenseCards = ref<ExpenseListItem[]>([])

function expBadgeStyle(item: ExpenseListItem): string {
  return EXPENSE_STATUS_BADGE_MAP[item.status] || 'gray'
}


/** 获取关联费用列表 */
async function fetchExpenses() {
  if (!customerId.value) return
  try {
    const res = await getExpenseList({ customerId: customerId.value, page: 1, pageSize: 50 } as any)
    expenseCards.value = res.items || []
  } catch {
    expenseCards.value = []
  }
}

const logisticsCards = ref([])

const perfCards = ref([])

async function fetchDetail() {
  loading.value = true
  try {
    customer.value = await getCustomerDetail(customerId.value)
  } catch {
    customer.value = null
  } finally {
    loading.value = false
  }
}

const onTransferToPerson = () => {
  showTransferPopup.value = false
  transferTitle.value = '转移客户给他人'
  transferPlaceholder.value = '请选择新负责人'
  showTransferDetailPopup.value = true
}

const onTransferToPublic = () => {
  showTransferPopup.value = false
  showPublicSeaPopup.value = true
}

const onSelectPerson = () => {
  Taro.showToast({ title: '选择', icon: 'none' })
}

const onTransferConfirm = () => {
  showTransferDetailPopup.value = false
  Taro.showToast({ title: '转移成功', icon: 'none' })
}

const selectPublicSea = (name) => {
  publicSeaSelected.value = name
}

const confirmPublicSea = () => {
  showPublicSeaPopup.value = false
  Taro.showToast({ title: '转移成功', icon: 'none' })
}

const onEdit = () => {
  Taro.showToast({ title: '编辑', icon: 'none' })
}

const goOppDetail = (card) => {
  Taro.navigateTo({ url: `/subpackages/dev/opportunity/detail/index?id=${card.id}` })
}

const onAddQuote = () => {
  Taro.navigateTo({ url: '/subpackages/dev/quote/index' })
}

const goQuotationDetail = (card) => {
  Taro.navigateTo({ url: '/subpackages/dev/quote/detail/index?id=' + card.id })
}

const onAddContract = () => {
  Taro.navigateTo({ url: '/subpackages/dev/contract/index?customerId=' + customerId.value })
}

const goExpenseDetail = (card: ExpenseListItem) => {
  Taro.navigateTo({ url: '/subpackages/dev/mine/expense/detail/index?id=' + card.id })
}

const goContractDetail = (card: ContractListItem) => {
  Taro.navigateTo({ url: '/subpackages/dev/contract/detail/index?id=' + card.id })
}

const showLogisticsPopup = ref(false)

const goLogistics = (orderNo) => {
  showLogisticsPopup.value = true
}

const goPerfDetail = (card) => {
  Taro.navigateTo({ url: '/subpackages/dev/customer/perf-detail/index' })
}

const infoTab = ref('basic')
const basicSubTab = ref('basic')
const followTab = ref('follow')
const activeOppIdx = ref(0)
const activeOpp = computed(() => oppCards.value[activeOppIdx.value] || null)

watch(infoTab, (tab) => {
  if (tab === 'opportunity') {
    fetchOpportunities()
  } else if (tab === 'quote') {
    fetchQuotations()
  } else if (tab === 'contract') {
    fetchContracts()
  } else if (tab === 'expense') {
    fetchExpenses()
  }
})

const followTypeEnToCn = {
  phone: '电话', wechat: '微信', visit: '公司面谈', email: '邮件', other: '其他',
}

const followRecords = ref<{ time: string; tag: string; follower: string; method: string; content: string }[]>([])
const followLoading = ref(false)

async function fetchFollowRecords() {
  if (!activeOpp.value || followLoading.value) return
  followLoading.value = true
  try {
    const list = await getOpportunityFollowRecords(activeOpp.value.id)
    followRecords.value = list.map(item => ({
      time: formatTime(item.followedAt),
      tag: followTypeEnToCn[item.followType] || item.followType || '-',
      follower: item.followerUserName || '-',
      method: followTypeEnToCn[item.followType] || item.followType || '-',
      content: item.content || '-',
    }))
  } catch {
    followRecords.value = []
  } finally {
    followLoading.value = false
  }
}

const visitRecords = ref<{ checkInTime: string; checkOutTime: string; location: string; purpose: string; images: string[]; result: string }[]>([])
const rawVisitRecords = ref<VisitRecordItem[]>([])
const visitLoading = ref(false)

async function fetchVisitRecords() {
  if (!activeOpp.value || visitLoading.value) return
  visitLoading.value = true
  try {
    const list = await getOpportunityVisitRecords(activeOpp.value.id)
    rawVisitRecords.value = list
    visitRecords.value = list.map(item => ({
      checkInTime: formatTime(item.checkInAt),
      checkOutTime: formatTime(item.checkOutAt),
      location: item.checkInAddress || '-',
      purpose: item.checkInPurpose || '-',
      images: (item.photos || []).map(p => p.fileUrl),
      result: item.checkOutSummary || '-',
    }))
  } catch {
    visitRecords.value = []
  } finally {
    visitLoading.value = false
  }
}

watch(activeOpp, (opp) => {
  followRecords.value = []
  visitRecords.value = []
  if (opp) {
    if (followTab.value === 'follow') fetchFollowRecords()
    else fetchVisitRecords()
  }
})

watch(followTab, (tab) => {
  if (!activeOpp.value) return
  if (tab === 'follow' && followRecords.value.length === 0) fetchFollowRecords()
  else if (tab === 'visit' && visitRecords.value.length === 0) fetchVisitRecords()
})

const editRecord = (idx) => {
  Taro.showToast({ title: '编辑跟进记录', icon: 'none' })
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

const onFail = () => {
  Taro.showToast({ title: '转化失败', icon: 'none' })
}

const onAddFollow = () => {
  Taro.showToast({ title: '新增跟进记录', icon: 'none' })
}

onMounted(() => {
  const pages = Taro.getCurrentPages()
  const current = pages[pages.length - 1]
  const id = current?.options?.id
  if (id) {
    customerId.value = Number(id)
    fetchDetail()
    fetchOpportunities()
  } else {
    loading.value = false
  }
})
</script>

<style>
.cd-page {
  min-height: 100vh;
  background: #F5F7F9;
  display: flex;
  flex-direction: column;
}

.empty-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.empty-text {
  font-size: 28rpx;
  color: #9292A5;
}

.cd-scroll {
  flex: 1;
  padding: 24rpx 40rpx;
  box-sizing: border-box;
}

.cd-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 32rpx;
}

.cd-dynamic-body {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.cd-divider {
  height: 1rpx;
  background: #F4F4F4;
}

.cd-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding:0 0 28rpx;
}

.cd-company-name {
  font-size: 32rpx;
  font-weight: 500;
  color: #1A1D24;
}

.cd-header-actions {
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.cd-header-action {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.cd-edit-sm-icon {
  width: 32rpx;
  height: 32rpx;
  flex-shrink: 0;
}

.cd-header-action-text {
  font-size: 28rpx;
  color: #37AE7E;
}

.cd-header-sep {
  width: 2rpx;
  height: 24rpx;
  background: #D9D9D9;
}

.ps-popup {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48rpx;
  padding: 40rpx 0 0;
  background: #FFFFFF;
  border-radius: 24rpx 24rpx 0 0;
}

.ps-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40rpx;
  width: 670rpx;
}

.ps-cancel {
  font-size: 34rpx;
  color: #828593;
  flex-shrink: 0;
}

.ps-title {
  flex: 1;
  font-size: 34rpx;
  font-weight: 500;
  color: #333333;
  text-align: center;
}

.ps-confirm {
  font-size: 34rpx;
  color: #37AE7E;
  flex-shrink: 0;
}

.ps-body {
  display: flex;
  flex-direction: column;
  align-self: stretch;
  gap: 0;
  padding: 0 40rpx;
}

.ps-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-self: stretch;
  padding: 24rpx 0;
}

.ps-row-text {
  font-size: 30rpx;
  color: #1A1D24;
}

.ps-checkbox {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  border: 2rpx solid #E5E6EB;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  flex-shrink: 0;
}

.ps-checkbox--checked {
  background: #37AE7E;
  border-color: #37AE7E;
}

.ps-checkbox-dot {
  width: 18rpx;
  height: 14rpx;
  border-left: 4rpx solid #FFFFFF;
  border-bottom: 4rpx solid #FFFFFF;
  transform: rotate(-45deg);
  margin-top: -4rpx;
}

.ps-divider {
  height: 1rpx;
  background: #F4F4F4;
}

.tp-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 32rpx;
  padding: 40rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  width: 582rpx;
  box-sizing: border-box;
}

.tp-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333333;
  text-align: center;
}

.tp-select {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
  padding: 12rpx 20rpx;
  background: #FBFBFB;
  border: 1rpx solid #E4E9EF;
  border-radius: 6rpx;
}

.tp-select-text {
  font-size: 26rpx;
  color: #9292A5;
}

.tp-arrow {
  width: 28rpx;
  height: 28rpx;
  flex-shrink: 0;
}

.tp-btns {
  display: flex;
  align-items: stretch;
  gap: 32rpx;
}

.tp-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16rpx 0rpx;
  border-radius: 8rpx;
}

.tp-btn--cancel {
  background: #EDFAF5;
  border: 2rpx solid #37AE7E;
}

.tp-btn--confirm {
  background: #37AE7E;
}

.tp-btn-text {
  font-size: 32rpx;
  line-height: 44rpx;
}

.tp-btn-text--cancel {
  color: #37AE7E;
}

.tp-btn-text--confirm {
  color: #FFFFFF;
}

.transfer-popup {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 28rpx 0;
  background: #FFFFFF;
  border-radius: 24rpx 24rpx 0 0;
}

.transfer-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28rpx 24rpx;
}

.transfer-item-text {
  font-size: 32rpx;
  color: #1A1D24;
}

.transfer-divider {
  height: 1rpx;
  background: #F4F4F4;
  margin: 0 40rpx;
}

.cd-status-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rpx 24rpx;
  height: 40rpx;
  border-radius: 12rpx;
}

.cd-status-badge--active {
  background: #EDFAF5;
}

.cd-status-badge--inactive {
  background: #F2F3F5;
}

.cd-status-text {
  font-size: 24rpx;
  color: #37AE7E;
}

.cd-field {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding-top:28rpx;
}

.cd-label {
  font-size: 28rpx;
  color: #62687D;
  flex-shrink: 0;
}

.cd-value {
  font-size: 28rpx;
  color: #1A1D24;
  text-align: right;
  flex: 1;
}

.cd-edit-icon {
  width: 32rpx;
  height: 32rpx;
  flex-shrink: 0;
}

.cd-tab-row {
  display: flex;
  align-items: center;
  gap: 40rpx;
  padding-bottom: 28rpx;
  border-bottom: 1rpx solid #E5E6EB;
  overflow-x: auto;
  white-space: nowrap;
}

.cd-tab {
  font-size: 30rpx;
  font-weight: 500;
  color: #62687D;
  flex-shrink: 0;
  padding-bottom: 28rpx;
  border-bottom: 4rpx solid transparent;
  margin-bottom: -29rpx;
}

.cd-tab--active {
  color: #37AE7E;
  border-bottom-color: #37AE7E;
}

.cd-subtag-row {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 24rpx 0;
}

.cd-subtag {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10rpx 16rpx;
  background: #FBFBFB;
  border: 1rpx solid #E8EAF3;
  border-radius: 6rpx;
  width: 33%;
}

.cd-subtag--active {
  background: #EDFAF5;
  border-color: #B1E9D3;
}

.cd-subtag-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #9292A5;
}

.cd-subtag-text--active {
  color: #37AE7E;
}

.cd-info-card {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  background: #FBFBFB;
  border: 1rpx solid #ECEBEB;
  border-radius: 8rpx;
  padding: 24rpx;
}

.cd-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cd-info-label {
  font-size: 28rpx;
  color: #62687D;
}

.cd-info-value {
  font-size: 28rpx;
  color: #1A1D24;
  text-align: right;
}

.cd-info-divider {
  height: 1rpx;
  background: #ECEBEB;
}

.cd-opp-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding: 24rpx 0;
}

.cd-opp-card {
  background: #FBFBFB;
  border: 1rpx solid #ECEBEB;
  border-radius: 16rpx;
  padding: 28rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.cd-opp-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cd-opp-card-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #1A1D24;
}

.cd-opp-badge {
  border-radius: 6rpx;
  padding: 2rpx 12rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
}

.cd-opp-badge--yellow {
  background: #FFEFD8;
}

.cd-opp-badge--blue {
  background: #D8E8FF;
}

.cd-opp-badge--green {
  background: #EDFAF5;
}

.cd-opp-badge-text {
  font-size: 24rpx;
  color: #FF9500;
}

.cd-opp-badge--green .cd-opp-badge-text {
  color: #37AE7E;
}

.cd-opp-badge--yellow .cd-opp-badge-text {
  color: #FF9500;
}

.cd-opp-badge--blue .cd-opp-badge-text {
  color: #4A8FE2;
}

.cd-opp-card-info {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  background: #FFFFFF;
  border-radius: 8rpx;
  padding: 16rpx 20rpx;
}

.cd-opp-info-row {
  display: flex;
  gap: 16rpx;
}

.cd-opp-info-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.cd-opp-info-label {
  font-size: 26rpx;
  color: #62687D;
}

.cd-opp-info-value {
  font-size: 26rpx;
  color: #1A1D24;
}

.cd-opp-info-value--price {
  font-weight: 500;
}

.cd-opp-note {
  display: flex;
  padding: 10rpx 12rpx;
  background: #FFFFFF;
  border: 1rpx solid #ECEBEB;
  border-radius: 6rpx;
}

.cd-opp-note-label {
  font-size: 24rpx;
  color: #62687D;
  flex-shrink: 0;
}

.cd-opp-note-text {
  font-size: 24rpx;
  color: #1A1D24;
}

.cd-quote-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding: 24rpx 0;
}

.cd-quote-card {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  background: #FBFBFB;
  border: 1rpx solid #ECEBEB;
  border-radius: 16rpx;
  padding: 28rpx;
}

.cd-quote-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
}

.cd-quote-card-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #1A1D24;
  flex: 1;
}

.cd-quote-badge {
  border-radius: 6rpx;
  padding: 2rpx 12rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.cd-quote-badge--yellow {
  background: #FFF4E5;
}
.cd-quote-badge--red {
  background: #FFE6E6;
}
.cd-quote-badge--green {
  background: #EDFAF5;
}
.cd-quote-badge--gray {
  background: #F2F3F5;
}
.cd-quote-badge--blue {
  background: #D8E8FF;
}

.cd-quote-badge-text {
  font-size: 24rpx;
  color: #FF9500;
}
.cd-quote-badge--red .cd-quote-badge-text {
  color: #F53F3F;
}
.cd-quote-badge--green .cd-quote-badge-text {
  color: #37AE7E;
}
.cd-quote-badge--gray .cd-quote-badge-text {
  color: #9292A5;
}
.cd-quote-badge--blue .cd-quote-badge-text {
  color: #4A8FE2;
}

.cd-quote-card-info {
  display: flex;
  align-items: center;
  gap: 8rpx;
  background: #FFFFFF;
  border: 1rpx solid #ECEBEB;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 10rpx;
}

.cd-quote-info-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.cd-quote-info-label {
  font-size: 26rpx;
  color: #62687D;
}

.cd-quote-info-value {
  font-size: 26rpx;
  color: #1A1D24;
}

.cd-quote-info-value--price {
  font-weight: 500;
}

.cd-quote-time {
  display: flex;
  align-items: center;
  gap: 4rpx;
  background: #FFFFFF;
  border: 1rpx solid #ECEBEB;
  border-radius: 6rpx;
  padding: 12rpx 14rpx;
}

.cd-quote-time-label {
  font-size: 26rpx;
  color: #62687D;
}

.cd-quote-time-value {
  font-size: 26rpx;
  color: #1A1D24;
}

.cd-quote-add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14rpx 8rpx;
  background: #EDFAF5;
  border: 1rpx solid #B1E9D3;
  border-radius: 8rpx;
}

.cd-quote-add-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #37AE7E;
}

.cd-ex-head {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.cd-ex-type-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rpx 12rpx;
  height: 40rpx;
  background: #EEEFF3;
  border-radius: 6rpx;
  font-size: 24rpx;
  color: #62687D;
  flex-shrink: 0;
}

.cd-ex-number {
  font-size: 28rpx;
  font-weight: 600;
  color: #1A1D24;
  flex: 1;
}

.cd-ex-info {
  display: flex;
  align-items: center;
  gap: 8rpx;
  background: #FFFFFF;
  border: 1rpx solid #E6EBF0;
  border-radius: 8rpx;
  padding: 16rpx 20rpx;
}

.cd-ex-info-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.cd-ex-info-label {
  font-size: 26rpx;
  color: #62687D;
}

.cd-ex-info-value {
  font-size: 26rpx;
  color: #1A1D24;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cd-ex-time {
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: 12rpx 16rpx;
  background: #FFFFFF;
  border: 1rpx solid #ECEBEB;
  border-radius: 6rpx;
}

.cd-ex-time-label {
  font-size: 24rpx;
  color: #62687D;
}

.cd-ex-time-value {
  font-size: 24rpx;
  color: #1A1D24;
}

.cd-lg-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10rpx;
}

.cd-lg-name {
  font-size: 30rpx;
  font-weight: 500;
  color: #1A1D24;
}

.cd-lg-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rpx 12rpx;
  height: 40rpx;
  background: #ECF2F9;
  border-radius: 6rpx;
  font-size: 24rpx;
  color: #8A9FB7;
}

.cd-lg-info {
  display: flex;
  align-items: stretch;
  gap: 18rpx;
  background: #FFFFFF;
  border: 1rpx solid #E6EBF0;
  border-radius: 8rpx;
  padding: 16rpx 20rpx;
  flex-wrap: wrap;
}

.cd-lg-info-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.cd-lg-info-label {
  font-size: 26rpx;
  color: #62687D;
}

.cd-lg-info-value {
  font-size: 26rpx;
  color: #1A1D24;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lg-popup {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #FFFFFF;
  border-radius: 24rpx 24rpx 0 0;
}

.lg-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx 40rpx;
  flex-shrink: 0;
}

.lg-header-side {
  width: 44rpx;
  height: 44rpx;
}

.lg-header-close {
  display: flex;
  align-items: center;
  justify-content: center;
}

.lg-close-icon {
  width: 28rpx;
  height: 28rpx;
}

.lg-header-title {
  flex: 1;
  font-size: 34rpx;
  font-weight: 500;
  color: #333333;
  text-align: center;
}

.lg-body {
  flex: 1;
  padding: 0 40rpx;
}

.lg-body .nut-steps {
  padding: 0;
}

.lg-body .nut-steps .nut-step {
  min-height: auto;
}

.lg-body .nut-steps .nut-step .nut-step-title {
  font-size: 32rpx;
  color: #62687D;
  line-height: 48rpx;
}

.lg-body .nut-steps .nut-step:first-child .nut-step-title {
  color: #37AE7E;
}

.lg-body .nut-steps .nut-step .nut-step-content {
  font-size: 28rpx;
  color: #BBBEC2;
  line-height: 40rpx;
}

.lg-body .nut-steps .nut-step:first-child .nut-step-content {
  color: #62687D;
}

.cd-dynamic-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cd-dynamic-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1A1D24;
}

.cd-dynamic-tabs {
  display: flex;
  align-items: center;
  gap: 28rpx;
}

.cd-dynamic-tab {
  font-size: 28rpx;
  color: #9292A5;
}

.cd-dynamic-tab--active {
  color: #37AE7E;
}

.cd-dynamic-sep {
  width: 2rpx;
  height: 24rpx;
  background: #D9D9D9;
}

.cd-opp-tag-row {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.cd-opp-tag {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10rpx 16rpx;
  background: #FBFBFB;
  border: 1rpx solid #E8EAF3;
  border-radius: 8rpx;
}

.cd-opp-tag--active {
  background: #EDFAF5;
  border-color: #B1E9D3;
}
.cd-opp-tag--active .cd-opp-tag-text {
  color: #37AE7E;
}

.cd-opp-tag-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #9292A5;
}

.cd-opp-detail-card {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding: 24rpx;
  background: #FBFBFB;
  border: 1rpx solid #ECEBEB;
  border-radius: 8rpx;
}

.cd-opp-detail-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cd-opp-detail-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #1A1D24;
}

.cd-opp-detail-edit {
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.cd-opp-detail-edit-icon {
  width: 32rpx;
  height: 32rpx;
}

.cd-opp-detail-edit-text {
  font-size: 28rpx;
  color: #37AE7E;
}

.cd-opp-detail-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  justify-content: space-between;
}

.cd-opp-detail-label {
  font-size: 28rpx;
  color: #62687D;
}

.cd-opp-detail-value {
  font-size: 28rpx;
  color: #1A1D24;
}

.cd-timeline {
  display: flex;
  flex-direction: column;
}

.cd-timeline-item {
  display: flex;
  flex-direction: row;
  gap: 12rpx;
}

.cd-timeline-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 24rpx;
  flex-shrink: 0;
}

.cd-timeline-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #37AE7E;
  flex-shrink: 0;
}

.cd-timeline-line {
  width: 2rpx;
  flex: 1;
  background: #E5E6EB;
  min-height: 20rpx;
}

.cd-timeline-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding-bottom: 40rpx;
}

.cd-timeline-item:last-child .cd-timeline-content {
  padding-bottom: 0;
}

.cd-timeline-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cd-timeline-head-left {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.cd-timeline-date {
  font-size: 30rpx;
  font-weight: 600;
  color: #1A1D24;
}

.cd-timeline-tag {
  font-size: 30rpx;
  color: #62687D;
}

.cd-timeline-actions {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.cd-timeline-action-icon {
  width: 32rpx;
  height: 32rpx;
}

.cd-timeline-info {
  display: flex;
  align-items: center;
}

.cd-timeline-info-label {
  font-size: 28rpx;
  color: #62687D;
  flex-shrink: 0;
}

.cd-timeline-info-text {
  font-size: 28rpx;
  color: #62687D;
}

.cd-visit-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding-bottom: 40rpx;
}

.cd-timeline-item:last-child .cd-visit-content {
  padding-bottom: 0;
}

.cd-visit-field {
  display: flex;
  align-items: flex-start;
}

.cd-visit-label {
  font-size: 28rpx;
  color: #62687D;
  flex-shrink: 0;
}

.cd-visit-value {
  font-size: 28rpx;
  color: #1A1D24;
}

.cd-visit-images {
  display: flex;
  gap: 8rpx;
  flex-wrap: wrap;
}

.cd-visit-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 8rpx;
}

.cd-bottom-spacer {
  height: 40rpx;
}

.cd-bottom-bar {
  display: flex;
  align-items: center;
  gap: 28rpx;
  padding: 16rpx 40rpx 48rpx;
  background: #F5F7F9;
}

.cd-bottom-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10rpx 8rpx;
  border-radius: 8rpx;
  height: 72rpx;
}

.cd-bottom-btn--danger {
  background: #FFE6E6;
  border: 2rpx solid #F53F3F;
}

.cd-bottom-btn--primary {
  background: #EFFDF7;
  border: 2rpx solid #5CC79C;
}

.cd-bottom-btn-text {
  font-size: 30rpx;
  font-weight: 500;
}

.cd-bottom-btn-text--danger {
  color: #F53F3F;
}

.cd-bottom-btn-text--primary {
  color: #5CC79C;
}

</style>
