<script lang="ts" setup>
import type { CandidateType } from '@/types/candicates'
import ValidateBuilder from '@/utils/validateBuilder'
import FormGroup from '@/components/ms-form-control/FormGroup.vue'
import { ref } from 'vue'
import { AREAS, EDUCATION_DEGREES, EDUCATION_PLACES, EDUCATION_MAJORS, RECRUITMENT_CHANNELS } from '@/common/constanst'
defineOptions({
  name: 'CandidateForm',
})
type Props = {
  mode: 'add' | 'edit'
  candidate: CandidateType | null
}
const props = withDefaults(defineProps<Props>(), {
  mode: 'add',
  candidate: null,
})
const emit = defineEmits<{
  (e: 'submit', candidate: CandidateType): void
}>()
const formErrors = ref<{ key: string; errors: string[] }[]>([])
// Khởi tạo đối tượng ứng viên, nếu có props.candidate thì dùng, không thì tạo rỗng
const currentCandidate = ref<CandidateType>(props.candidate ?? ({} as CandidateType))
const candicateSchema = {
  CandidateName: new ValidateBuilder()
    .required('Họ và tên không được để trống')
    .string()
    .min(3, 'Họ và tên phải có ít nhất 3 ký tự')
    .max(100, 'Họ và tên không được vượt quá 100 ký tự'),
  Dob: new ValidateBuilder()
    .required('Ngày sinh không được để trống')
    .date('Ngày sinh không được để trống'),
  Gender: new ValidateBuilder().required('Vui lòng chọn giới tính'),
  AreaName: new ValidateBuilder().required('Vui lòng chọn khu vực'),
  Mobile: new ValidateBuilder()
    .required('Số điện thoại không được để trống')
    .phone('Số điện thoại không hợp lệ'),
  Email: new ValidateBuilder().required('Email không được để trống').email('Email không hợp lệ'),
  EducationDegreeName: new ValidateBuilder().required('Vui lòng chọn trình độ đào tạo'),
  EducationPlaceName: new ValidateBuilder().required('Vui lòng chọn nơi đào tạo'),
  EducationMajorName: new ValidateBuilder().required('Vui lòng chọn chuyên ngành'),
  ApplyDate: new ValidateBuilder()
    .required('Ngày ứng tuyển không được để trống')
    .date('Ngày ứng tuyển không được để trống'),
}
function submit() {
  console.log(currentCandidate.value)
  const { isValid, errors, values } = ValidateBuilder.checkAll(
    currentCandidate.value as Record<string, unknown>,
    candicateSchema,
  )
  if (!isValid) {
    console.log(errors)
    formErrors.value = errors
    return
  }
  emit('submit', values as CandidateType)
}

// Cho phép component cha (CandidateView) gọi submit() qua template ref
defineExpose({
  submit,
})
</script>

<template>
  <form class="candidate-form" @submit.prevent="submit">
    <h2 class="candidate-form__title">Thông tin ứng viên</h2>

    <div class="flex-1">
      <!-- Họ và tên -->
      <FormGroup
        v-model="currentCandidate.CandidateName"
        label="Họ và tên"
        fieldKey="CandidateName"
        type="text"
        placeholder="Nhập họ và tên"
        :required="true"
        :error="formErrors.find(error => error.key === 'CandidateName')?.errors[0]"
      />

      <!-- Ngày sinh & Giới tính -->
      <div class="form-row">
        <div class="form-col">
          <FormGroup v-model="currentCandidate.Dob" label="Ngày sinh" fieldKey="Dob" type="date" :error="formErrors.find(error => error.key === 'Dob')?.errors[0]" />
        </div>

        <div class="form-col">
          <FormGroup v-model="currentCandidate.Gender" label="Giới tính" fieldKey="Gender" :error="formErrors.find(error => error.key === 'Gender')?.errors[0]">
            <template #select></template>
            <template #select-options>
              <option value="">Chọn giới tính</option>
              <option v-for="[key,value] in Object.entries({1: 'Nam', 2: 'Nữ', 3: 'Khác'})" :key="key" :value="key">{{ value }}</option>
            </template>
          </FormGroup>
        </div>
      </div>

      <!-- Khu vực -->
      <FormGroup v-model="currentCandidate.AreaName" label="Khu vực" fieldKey="AreaName" :error="formErrors.find(error => error.key === 'AreaName')?.errors[0]">
        <template #select></template>
        <template #select-options>
          <option value="">Chọn khu vực</option>
          <option v-for="[key,value] in Object.entries(AREAS)" :key="key" :value="key">{{ value }}</option>
        </template>
      </FormGroup>

      <!-- Số điện thoại & Email -->
      <div class="form-row">
        <div class="form-col">
          <FormGroup
            v-model="currentCandidate.Mobile"
            label="Số điện thoại"
            fieldKey="Mobile"
            type="tel"
            placeholder="Nhập số điện thoại"
            :error="formErrors.find(error => error.key === 'Mobile')?.errors[0]"
          />
        </div>
        <div class="form-col">
          <FormGroup
            v-model="currentCandidate.Email"
            label="Email"
            fieldKey="Email"
            type="email"
            placeholder="Nhập Email"
            :error="formErrors.find(error => error.key === 'Email')?.errors[0]"
          />
        </div>
      </div>

      <!-- Địa chỉ -->
      <FormGroup
        v-model="currentCandidate.Address"
        label="Địa chỉ"
        fieldKey="Address"
        type="text"
        placeholder="Nhập địa chỉ"
        :error="formErrors.find(error => error.key === 'Address')?.errors[0]"
      />

      <!-- HỌC VẤN -->
      <div>
        <section class="section-education">
          <div class="section-title">HỌC VẤN</div>

          <FormGroup
            v-model="currentCandidate.EducationDegreeName"
            label="Trình độ đào tạo"
            fieldKey="EducationDegreeName"
            :error="formErrors.find(error => error.key === 'EducationDegreeName')?.errors[0]"
          >
            <template #select></template>
            <template #select-options>
              <option value="">Chọn trình độ đào tạo</option>
              <option v-for="[key,value] in Object.entries(EDUCATION_DEGREES)" :key="key" :value="key">{{ value }}</option>
            </template>
          </FormGroup>

          <FormGroup
            v-model="currentCandidate.EducationPlaceName"
            label="Nơi đào tạo"
            fieldKey="EducationPlaceName"
            :error="formErrors.find(error => error.key === 'EducationPlaceName')?.errors[0]"
          >
            <template #select></template>
            <template #select-options>
              <option value="">Chọn nơi đào tạo</option>
              <option v-for="[key,value] in Object.entries(EDUCATION_PLACES)" :key="key" :value="key">{{ value }}</option>
            </template>
          </FormGroup>

          <FormGroup
            v-model="currentCandidate.EducationMajorName"
            label="Chuyên ngành"
            fieldKey="EducationMajorName"
            :error="formErrors.find(error => error.key === 'EducationMajorName')?.errors[0]"
          >
            <template #select></template>
            <template #select-options>
              <option value="">Chọn chuyên ngành</option>
              <option v-for="[key,value] in Object.entries(EDUCATION_MAJORS)" :key="key" :value="key">{{ value }}</option>
            </template>
          </FormGroup>
        </section>
        <div class="action-link text-primary">+ Thêm học vấn</div>
      </div>

      <!-- Ngày ứng tuyển & Nguồn ứng viên -->
      <div class="form-row">
        <div class="form-col">
          <FormGroup
            v-model="currentCandidate.ApplyDate"
            label="Ngày ứng tuyển"
            fieldKey="ApplyDate"
            type="date"
            :error="formErrors.find(error => error.key === 'ApplyDate')?.errors[0]"
          />
        </div>
        <div class="form-col">
          <FormGroup
            v-model="currentCandidate.ChannelName"
            label="Nguồn ứng viên"
            fieldKey="ChannelName"
            :error="formErrors.find(error => error.key === 'ChannelName')?.errors[0]"
          >
            <template #select></template>
            <template #select-options>
              <option value="">Chọn nguồn ứng viên</option>
              <option v-for="[key,value] in Object.entries(RECRUITMENT_CHANNELS)" :key="key" :value="key">{{ value }}</option>
            </template>
          </FormGroup>
        </div>
      </div>

      <!-- Nhân sự khai thác & Cộng tác viên -->
      <div class="form-row">
        <div class="form-col">
          <FormGroup
            v-model="currentCandidate.AttractivePersonnel"
            label="Nhân sự khai thác"
            fieldKey="AttractivePersonnel"
            :error="formErrors.find(error => error.key === 'AttractivePersonnel')?.errors[0]"
          >
            <template #select></template>
            <template #select-options>
              <option value="">Đinh Nga QTHT Nhân sự</option>
            </template>
          </FormGroup>
        </div>
        <div class="form-col">
          <FormGroup
            v-model="currentCandidate.PresenterName"
            label="Cộng tác viên"
            fieldKey="PresenterName"
            :error="formErrors.find(error => error.key === 'PresenterName')?.errors[0]"
          >
            <template #select></template>
            <template #select-options>
              <option value="">Chọn cộng tác viên</option>
            </template>
          </FormGroup>
        </div>
      </div>

      <!-- Checkbox Thêm nhanh người tham chiếu -->
      <FormGroup
        v-model="currentCandidate.IsTalentPoolDetail"
        label="Thêm nhanh người tham chiếu vào kho ứng viên"
        fieldKey="IsTalentPoolDetail"
        layout="horizontal"
        :error="formErrors.find(error => error.key === 'IsTalentPoolDetail')?.errors[0]"
      >
        <template #checkbox></template>
      </FormGroup>

      <div class="action-link">+ Thêm người giới thiệu</div>

      <!-- Nơi làm việc gần đây -->
      <FormGroup
        v-model="currentCandidate.WorkPlaceRecent"
        label="Nơi làm việc gần đây"
        fieldKey="WorkPlaceRecent"
        type="text"
        placeholder="Nhập nơi làm việc gần đây"
        :error="formErrors.find(error => error.key === 'WorkPlaceRecent')?.errors[0]"
      />

      <div class="action-link mt-3">+ Thêm kinh nghiệm làm việc</div>

      <!-- Kinh nghiệm làm việc (demo, chưa map vào schema) -->
      <div class="experience-section mt-4">
        <FormGroup
          v-model="currentCandidate.ExperienceWorkPlace"
          label="Nơi làm việc"
          fieldKey="ExperienceWorkPlace"
          type="text"
          placeholder="Nhập nơi làm việc"
          :error="formErrors.find(error => error.key === 'ExperienceWorkPlace')?.errors[0]"
        />

        <div class="form-row">
          <div class="form-col">
            <FormGroup
              v-model="currentCandidate.ExperienceFrom"
              label="Từ tháng/năm"
              fieldKey="ExperienceFrom"
              type="month"
              :error="formErrors.find(error => error.key === 'ExperienceFrom')?.errors[0]"
            />
          </div>
          <div class="form-col">
            <FormGroup
              v-model="currentCandidate.ExperienceTo"
              label="Đến tháng/năm"
              fieldKey="ExperienceTo"
              type="month"
              :error="formErrors.find(error => error.key === 'ExperienceTo')?.errors[0]"
            />
          </div>
        </div>

        <FormGroup
          v-model="currentCandidate.ExperiencePosition"
          label="Vị trí công việc"
          fieldKey="ExperiencePosition"
          type="text"
          placeholder="Nhập vị trí công việc"
          :error="formErrors.find(error => error.key === 'ExperiencePosition')?.errors[0]"
        />

        <FormGroup
          v-model="currentCandidate.ExperienceDescription"
          label="Mô tả công việc"
          fieldKey="ExperienceDescription"
          :error="formErrors.find(error => error.key === 'ExperienceDescription')?.errors[0]"
        >
          <template #textarea></template>
        </FormGroup>
      </div>
    </div>
  </form>
</template>
