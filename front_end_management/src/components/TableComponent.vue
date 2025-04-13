<template>
  <a-table
      :columns="columns"
      :data-source="data"
      :loading="loading"
      :row-selection="enableSelection ? rowSelection : null"
      rowKey="id"
  >
    <template #bodyCell="{ column, text, record }">
      <slot name="bodyCell" :column="column" :text="text" :record="record">
        <!-- Payment Tag -->
        <template v-if="column.dataIndex === 'payment' && enablePaymentTag">
          <a-tag :color="paymentColor(record.payment)">
            {{ paymentLabel(record.payment) }}
          </a-tag>
        </template>

        <!-- Order Status Tag -->
        <template v-else-if="column.dataIndex === 'orderStatus' && enableOrderStatusTag">
          <a-tag :color="orderStatusColor(record.orderStatus)">
            {{ orderStatusLabel(record.orderStatus) }}
          </a-tag>
        </template>

        <!-- Default -->
        <template v-else>
          {{ text }}
        </template>
      </slot>
    </template>

  </a-table>
</template>

<script setup>

defineProps({
  columns: Array,
  data: Array,
  loading: Boolean,
  enableSelection: Boolean,
  enablePaymentTag: Boolean,
  enableOrderStatusTag: Boolean,
})

const rowSelection = {
  type: 'checkbox',
  onChange: (selectedRowKeys, selectedRows) => {
    console.log('selectedRows', selectedRows)
  },
}

// Mapping status
const paymentColor = (val) => (val == 1 ? 'green' : 'orange')
const paymentLabel = (val) => (val == 1 ? 'Đã thanh toán' : 'Chưa thanh toán')

const orderStatusColor = (val) => {
  switch (val) {
    case 'transaction': return 'green'
    case 'storage': return 'blue'
    case 'cancel': return 'red'
    default: return 'default'
  }
}
const orderStatusLabel = (val) => {
  switch (Number(val)) {
    case 0: return 'Đang giao hàng';
    case 1: return 'Đang lưu kho';
    case 2: return 'Đã hủy';
    default: return 'Không xác định';
  }
}
</script>
