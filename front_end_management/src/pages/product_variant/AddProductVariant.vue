<template>
  <div style="max-width: 1200px; margin: 0 auto; padding: 24px;">
    <div style="margin-bottom: 16px">
      <a-button type="default" @click="goBack">← Quay lại danh sách phiên bản</a-button>
    </div>

    <a-form layout="vertical" @submit="handleSubmit" style="background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
      <a-row :gutter="16">
        <a-col :span="16">
          <!-- Thông tin phiên bản -->
          <a-card title="Thông tin phiên bản" :bodyStyle="{ padding: '16px' }">
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="Mã SKU" required>
                  <a-input v-model:value="form.skuCode" placeholder="Nhập mã SKU" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="Mã vạch / Barcode" required>
                  <a-input v-model:value="form.barCode" placeholder="Mã vạch sản phẩm" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item label="Đơn vị tính" required>
              <a-input v-model:value="form.unit" placeholder="Đơn vị tính" />
            </a-form-item>

            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="Màu sắc" required>
                  <a-input v-model:value="form.color" placeholder="VD: Đỏ, Xanh..." />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="Kích thước" required>
                  <a-input v-model:value="form.size" placeholder="VD: M, L, XL" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="Chất liệu" required>
                  <a-input v-model:value="form.material" placeholder="VD: Cotton, Gỗ, Nhựa..." />
                </a-form-item>
              </a-col>
            </a-row>
          </a-card>

          <!-- Giá -->
          <a-card title="Thông tin giá" :bodyStyle="{ padding: '16px' }" style="margin-top: 16px;">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="Giá bán" required>
                  <a-input-number v-model:value="form.sellPrice" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="Giá so sánh" required>
                  <a-input-number v-model:value="form.comparePrice" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="Giá vốn" required>
                  <a-input-number v-model:value="form.cost" style="width: 100%" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-card>

          <!-- Kho -->
          <a-card title="Thông tin kho" :bodyStyle="{ padding: '16px' }" style="margin-top: 16px;">
            <a-form-item>
              <a-checkbox v-model:checked="form.manageInventory">Quản lý tồn kho</a-checkbox>
            </a-form-item>
            <a-form-item v-if="form.manageInventory" label="Số lượng trong kho" required>
              <a-input-number v-model:value="form.quantity" :min="0" style="width: 100%" />
            </a-form-item>
          </a-card>

          <div style="text-align: right; margin-top: 24px;">
            <a-button type="primary" html-type="submit">Lưu phiên bản</a-button>
          </div>
        </a-col>

        <!-- Cột phải -->
        <a-col :span="8">
          <a-card title="Ảnh phiên bản" :bodyStyle="{ padding: '16px' }">
            <a-upload
              list-type="picture-card"
              :before-upload="handleBeforeUpload"
              :file-list="fileList"
              @remove="handleRemove"
            >
              <div>
                <plus-outlined />
                <div style="margin-top: 8px">Tải ảnh</div>
              </div>
            </a-upload>
            <p style="font-size: 12px; color: gray">Dung lượng ảnh tối đa 2MB</p>
          </a-card>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '../../../axios'
import { PlusOutlined } from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()
const productId = route.params.productId

const form = ref({
  skuCode: '',
  barCode: '',
  unit: '',
  color: '',
  size: '',
  material: '',
  sellPrice: 0,
  comparePrice: 0,
  cost: 0,
  quantity: 1,
  manageInventory: true,
})

const fileList = ref([])

const handleBeforeUpload = (file) => {
  fileList.value = [file]
  return false
}

const handleRemove = () => {
  fileList.value = []
}

const handleSubmit = async () => {
  const formData = new FormData()
  if (fileList.value.length) {
    formData.append('image', fileList.value[0])
  }

  formData.append('skuCode', form.value.skuCode)
  formData.append('barCode', form.value.barCode)
  formData.append('unit', form.value.unit)
  formData.append('color', form.value.color)
  formData.append('size', form.value.size)
  formData.append('material', form.value.material)
  formData.append('sellPrice', form.value.sellPrice.toString())
  formData.append('comparePrice', form.value.comparePrice.toString())
  formData.append('cost', form.value.cost.toString())
  formData.append(
      'quantity',
      form.value.manageInventory ? form.value.quantity.toString() : '0'
  )
  // 🐞 Thêm dòng này để kiểm tra dữ liệu trước khi gửi
  for (const pair of formData.entries()) {
    console.log(pair[0] + ': ' + pair[1])
  }

  try {
    const res = await axios.post(`/product-variant/${productId}`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    alert('Tạo phiên bản thành công!')
    router.push(`/home/product`)
  } catch (err) {
    console.error(err)
    alert('Tạo phiên bản thất bại!')
  }
}


const goBack = () => {
  router.push(`/home/product`)
}
</script>
