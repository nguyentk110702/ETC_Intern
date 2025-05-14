<template>
  <div style="text-align: left; margin-top: 16px;">
    <a-button style="margin-right: 8px; margin-bottom: 10px" @click="goBack">Quay lại</a-button>
  </div>
  <div class="order-form">
    <a-form layout="vertical">
      <a-row :gutter="24">
        <!-- Cột trái: sản phẩm và thanh toán -->
        <a-col :span="16">
          <!-- Tìm kiếm và thêm sản phẩm -->
          <a-form-item label="Sản phẩm" style="margin-bottom: 16px;">
            <a-row :gutter="8">
              <a-col :span="14">
                <a-cascader
                    v-model:value="selectedProductPath"
                    :options="productOptions"
                    :show-search="{ filter: productFilter, matchInputWidth: false }"
                    placeholder="Chọn sản phẩm"
                    style="width: 100%"
                    @change="handleProductSelect"
                    @search="onCascaderSearch"
                />
              </a-col>
              <a-col :span="6">
                <a-input-number v-model:value="quantity" :min="1" style="width: 100%" />
              </a-col>
              <a-col :span="4">
                <a-button type="primary" @click="addProduct">Thêm</a-button>
              </a-col>
            </a-row>
          </a-form-item>

          <!-- Danh sách sản phẩm đã chọn -->
          <a-table
              :columns="columns"
              :data-source="orderItems"
              :pagination="false"
              row-key="variantId"
              size="small"
              bordered
              class="mb-2"
          />

          <!-- Tổng tiền -->
          <div style="text-align: right; font-weight: bold; margin-bottom: 16px;">
            Tổng tiền: {{ totalAmount.toLocaleString() }} VND
          </div>

          <!-- Thanh toán -->
          <a-divider orientation="left">Thanh toán</a-divider>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="Hình thức thanh toán">
                <a-select v-model:value="paymentMethod" placeholder="Chọn phương thức">
                  <a-select-option value=1>Tiền mặt</a-select-option>
                  <a-select-option value=2>Chuyển khoản</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="Trạng thái thanh toán">
                <a-radio-group v-model:value="paymentStatus">
                  <a-radio value="0">Chưa thanh toán</a-radio>
                  <a-radio value="1">Đã thanh toán</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Số tiền">
                <a-input-number  v-model:value="totalAmount" :min="0" style="width: 100%" disabled  />
              </a-form-item>
            </a-col>
          </a-row>

          <!-- Ghi chú -->
          <a-form-item label="Ghi chú">
            <a-textarea v-model:value="note" rows="3" />
          </a-form-item>

          <!-- Giao hàng -->
          <a-divider orientation="left">Giao hàng</a-divider>
          <a-radio-group v-model:value="deliveryType">
            <a-radio value="PENDING">Giao Hàng Sau</a-radio>
            <a-radio value="DELIVERED">Đẩy qua hãng vận chuyển</a-radio>
            <a-radio value="SHIPPED">Đã giao hàng</a-radio>
          </a-radio-group>
        </a-col>

        <!-- Cột phải: thông tin đơn hàng -->
        <a-col :span="8">
          <a-card title="Thông tin đơn hàng">
            <a-form-item label="Tên khách hàng">
              <a-input v-model:value="customerName" />
            </a-form-item>
            <a-form-item label="Địa chỉ giao hàng">
              <a-textarea v-model:value="customerAddress" rows="2" />
            </a-form-item>
            <a-form-item label="Ngày tạo đơn">
              <a-date-picker v-model:value="createdDate" disabled style="width: 100%" />
            </a-form-item>

          </a-card>

          <!-- Nút tạo đơn -->
          <div style="text-align: right; margin-top: 16px;">
            <a-button type="primary" @click="submitOrder">Tạo đơn hàng</a-button>
          </div>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, h} from 'vue';
import dayjs from 'dayjs';
import axios from "../../../axios.js";
import {message} from "ant-design-vue";
import router from "@/router/router.js";

// Thông tin form
const customerName = ref('');
const customerAddress = ref('');
const createdDate = ref(dayjs());

const note = ref('');
const paymentMethod = ref();
const deliveryType = ref('pickup');

const goBack = () => {
  router.push('/home/order'); // Đường dẫn tới trang danh sách đơn hàng
};
const selectedProductPath = ref([]);
const quantity = ref(1);
const productOptions = ref([]);
const orderItems = ref([]);
const paymentStatus = ref('0'); // hoặc 'PAID'

const columns = [
  { title: 'Tên sản phẩm', dataIndex: 'name' },
  { title: 'Đơn giá', dataIndex: 'price' },
  { title: 'Số lượng', dataIndex: 'quantity' },
  { title: 'Thành tiền', dataIndex: 'total' },
  {
    title: 'Hành động',
    key: 'action',
    customRender: ({ record }) => {
      return h(
          'a',
          {
            onClick: () => removeItem(record.variantId),
            style: { color: 'red' }
          },
          'Xóa'
      );
    }
  }
];

const totalAmount = computed(() =>
    orderItems.value.reduce((sum, item) => sum + item.total, 0)
);
const removeItem = (variantId) => {
  orderItems.value = orderItems.value.filter(item => item.variantId !== variantId);
};
// Tìm sản phẩm khi người dùng tìm kiếm
const productFilter = (inputValue, path) => {
  return path.some(option => option.label?.toLowerCase().includes(inputValue.toLowerCase()));
};

const fetchProducts = async (search = '') => {
  try {
    const response = await axios.get('/product', {
      params: { search, page: 1, limit: 50 }
    });

    const products = response.data?.data || [];

    productOptions.value = products.map(product => ({
      label: product.name,
      value: product.id,
      children: product.productVariants?.map(variant => ({
        label: `${variant.color?.name || 'Màu không xác định'} - ${variant.size?.name || 'Kích cỡ không xác định'}`, // Thêm kiểm tra cho color và size
        value: variant.id,
        price: variant.sellPrice,
        productName: product.name
      })) || []
    }));
  } catch (error) {
    console.error('Lỗi khi load sản phẩm:', error);
  }
};

function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}
const onCascaderSearch = debounce((value) => {
  fetchProducts(value);
}, 300);

onMounted(() => {
  fetchProducts();
});

const handleProductSelect = (value, selectedOptions) => {
  // Không cần xử lý gì thêm ở đây nếu dùng addProduct
};

const addProduct = () => {
  const [productId, variantId] = selectedProductPath.value;
  const product = productOptions.value.find(p => p.value === productId);
  const variant = product?.children?.find(v => v.value === variantId);
  if (!variant) return;

  const existing = orderItems.value.find(item => item.variantId === variantId);
  const qty = Number(quantity.value);
  if (!qty || qty <= 0) {
    window.$message.error('Sản phẩm đã hết');
  }
  if (existing) {
    existing.quantity += quantity.value;
    existing.total = existing.price * existing.quantity;
  } else {
    orderItems.value.push({
      variantId,
      name: `${product.label} - ${variant.label}`,
      price: variant.price,
      quantity: quantity.value,
      total: variant.price * quantity.value
    });
  }

  selectedProductPath.value = [];
  quantity.value = 1;
};

const submitOrder = async () => {
  if (!customerName.value || !customerAddress.value || orderItems.value.length === 0) {
    return window.$message?.error('Vui lòng nhập đủ thông tin khách hàng và sản phẩm');
  }

  const order = {
    orderCode: `ORD-${dayjs().format('YYYYMMDDHHmmss')}`,
    customer: customerName.value,
    addressShipping: customerAddress.value,
    area: 'Khu vực mặc định', // Có thể sửa nếu bạn có select khu vực
    deliveryCost: 15000,
    tax: 5000,
    discount: 0,
    payment: paymentStatus.value,
    paymentMethodId: Number(paymentMethod.value) ,
    orderStatus: '0',
    shippingStatus: deliveryType.value,
    items: orderItems.value.map(item => ({
      variantId: item.variantId,
      quantity: item.quantity
    }))
  };
  console.log("Dữ liệu gửi:", JSON.stringify(order, null, 2));

  try {
    const res = await axios.post('/order', order);
    window.$message?.success('Tạo đơn hàng thành công!');
    console.log('Kết quả:', res.data);
    // Reset lại form nếu muốn
  } catch (error) {
    window.$message?.error('Lỗi khi tạo đơn hàng');
    console.error('Lỗi tạo đơn hàng:', error);
  }
};
</script>

<style scoped>
.order-form {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
}
</style>
