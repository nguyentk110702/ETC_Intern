<template>
  <div style="max-width: 1200px; margin: 0 auto; padding: 24px;">
    <div style="margin-bottom: 16px">
      <a-button type="default" @click="goBack">← Quay lại danh sách sản phẩm</a-button>
    </div>

    <a-form layout="vertical" @submit.prevent="handleSubmit" style="background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
      <a-row :gutter="16">
        <a-col :span="16">
          <!-- Thông tin sản phẩm -->
          <a-card title="Thông tin sản phẩm" :bodyStyle="{ padding: '16px' }">
            <a-form-item label="Tên sản phẩm" required>
              <a-input v-model:value="form.name" placeholder="Nhập tên sản phẩm" />
            </a-form-item>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item label="Mã SKU" required>
                  <a-input v-model:value="form.sku" placeholder="Nhập mã SKU" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="Mã vạch / Barcode">
                  <a-input v-model:value="form.barcode" placeholder="Mã vạch sản phẩm" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item label="Đơn vị tính" required>
              <a-input v-model:value="form.unit" placeholder="Đơn vị tính" />
            </a-form-item>
            <a-form-item label="Mô tả">
              <a-textarea v-model:value="form.description" rows="4" placeholder="Mô tả sản phẩm" />
            </a-form-item>
          </a-card>

          <!-- Giá -->
          <a-card title="Thông tin giá" :bodyStyle="{ padding: '16px' }" style="margin-top: 16px;">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="Giá bán" required>
                  <a-input-number v-model:value="form.price" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="Giá so sánh">
                  <a-input-number v-model:value="form.comparePrice" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="Giá vốn">
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
          </a-card>

          <div style="text-align: right; margin-top: 24px;">
            <a-button type="primary" html-type="submit">Lưu sản phẩm</a-button>
          </div>
        </a-col>

        <!-- Cột phải -->
        <a-col :span="8">
          <a-card title="Ảnh sản phẩm" :bodyStyle="{ padding: '16px' }">
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
import { useRouter } from 'vue-router'
import axios from '../../../axios'
import { PlusOutlined } from '@ant-design/icons-vue'

const router = useRouter()

const form = ref({
  name: '',
  sku: '',
  barcode: '',
  unit: '',
  description: '',
  price: 0,
  comparePrice: 0,
  cost: 0,
  manageInventory: false
})

const fileList = ref([])

const handleBeforeUpload = (file) => {
  fileList.value = [file] // chỉ chọn 1 ảnh
  return false
}

const handleRemove = () => {
  fileList.value = []
}

const handleSubmit = async () => {
  if (!fileList.value.length) {
    alert('Vui lòng chọn ảnh sản phẩm')
    return
  }

  const formData = new FormData()
  formData.append('image', fileList.value[0])
  formData.append('name', form.value.name)
  formData.append('skuCode', form.value.sku)
  formData.append('barCode', form.value.barcode)
  formData.append('unit', form.value.unit)
  formData.append('description', form.value.description)
  formData.append('sellPrice', form.value.price.toString())
  formData.append('comparePrice', form.value.comparePrice.toString())
  formData.append('cost', form.value.cost.toString())
  formData.append('quantity', form.value.manageInventory ? '1' : '0')

  try {
    const res = await axios.post('/product', formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    alert('Tạo sản phẩm thành công!')
    router.push('/home/product')
  } catch (err) {
    console.error(err)
    alert('Tạo sản phẩm thất bại!')
  }
}

const goBack = () => {
  router.push('/home/product')
}
</script>
