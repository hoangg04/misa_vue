<script lang="ts" setup>
import type { CandidateType } from '@/types/candicates'
import ValidateBuilder from '@/utils/validateBuilder'
import FormGroup from '@/components/ms-form-control/FormGroup.vue'
import { ref } from 'vue'
import {
  AREAS,
  EDUCATION_DEGREES,
  EDUCATION_PLACES,
  EDUCATION_MAJORS,
  RECRUITMENT_CHANNELS,
} from '@/common/constanst'
import { v4 as uuidv4 } from 'uuid'
import { convertISOToParts, partsToISO } from '@/utils/format'
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
// Đảm bảo IsTalentPoolDetail luôn là boolean (tránh trường hợp dữ liệu từ bảng/API là 0/1)
const currentCandidate = ref<CandidateType>(
  props.candidate
    ? ({
        ...props.candidate,
        IsTalentPoolDetail: Boolean(props.candidate.IsTalentPoolDetail),
        Dob: partsToISO(
          (props.candidate.YearOfBirthday ?? '') as number | string,
          (props.candidate.MonthOfBirthday ?? '') as number | string,
          (props.candidate.BirthdayFormat ?? '') as number | string,
        ),
        ApplyDate: props.candidate.ApplyDate
          ? new Date(props.candidate.ApplyDate as string).toISOString().split('T')[0]
          : '',
      } as CandidateType)
    : ({
        id: uuidv4(),
        CandidateName: '',
        Dob: new Date().toISOString().split('T')[0],
        Gender: '',
        AreaName: '',
        Mobile: '',
        Email: '',
        EducationDegreeName: '',
        EducationPlaceName: '',
        EducationMajorName: '',
        ApplyDate: new Date().toISOString().split('T')[0],
        ChannelName: '',
        AttractivePersonnel: '',
        PresenterName: '',
        IsTalentPoolDetail: false,
        WorkPlaceRecent: '',
        ExperienceWorkPlace: '',
        ExperienceFrom: '',
        ExperienceTo: '',
        ExperiencePosition: '',
        ExperienceDescription: '',
      } as CandidateType),
)
const candicateSchema = {
  CandidateName: new ValidateBuilder()
    .required('Họ và tên không được để trống')
    .string()
    .min(3, 'Họ và tên phải có ít nhất 3 ký tự')
    .max(100, 'Họ và tên không được vượt quá 100 ký tự'),
  Dob: new ValidateBuilder()
    .date('Ngày sinh không được để trống')
    .optional(currentCandidate.value.Dob ?? ''),
  Gender: new ValidateBuilder().optional(currentCandidate.value.Gender ?? ''),
  AreaName: new ValidateBuilder().optional(currentCandidate.value.AreaName ?? ''),
  Mobile: new ValidateBuilder().phone('Số điện thoại không hợp lệ').optional(),
  Email: new ValidateBuilder().email('Email không hợp lệ').optional(),
  EducationDegreeName: new ValidateBuilder().optional(
    currentCandidate.value.EducationDegreeName ?? '',
  ),
  EducationPlaceName: new ValidateBuilder().optional(
    currentCandidate.value.EducationPlaceName ?? '',
  ),
  EducationMajorName: new ValidateBuilder().optional(
    currentCandidate.value.EducationMajorName ?? '',
  ),
  ApplyDate: new ValidateBuilder()
    .required('Ngày ứng tuyển không được để trống')
    .date('Ngày ứng tuyển không được để trống'),
}
function submit() {
  const { isValid, errors, values } = ValidateBuilder.checkAll(
    currentCandidate.value as Record<string, unknown>,
    candicateSchema,
  )
  if (!isValid) {
    formErrors.value = errors
    return
  }
  const { year, month, birthday } = convertISOToParts(values.Dob as string)
  console.log('currentCandidate.value', JSON.parse(JSON.stringify(currentCandidate.value)))
  emit('submit', {
    ...currentCandidate.value,
    ...values,
    CandidateID: currentCandidate.value.CandidateID ?? currentCandidate.value.id,
    IsTalentPoolDetail: currentCandidate.value.IsTalentPoolDetail ? 1 : 0,
    YearOfBirthday: year,
    MonthOfBirthday: month,
    BirthdayFormat: birthday,
  } as CandidateType)
}

// Cho phép component cha (CandidateView) gọi submit() qua template ref
defineExpose({
  submit,
})
</script>

<template>
  <div class="upload-area" id="upload-area" v-if="props.mode === 'add'">
    <div class="upload-text">
      <span class="upload-link">Kéo thả hoặc bấm vào đây để tải CV lên</span>
    </div>
    <div class="upload-text" style="font-size: 12px; margin-top: 4px">
      Chấp nhận file .doc, .docx, .pdf, .jpg, .jpeg, .png (Dung lượng &lt; 15 Mb)
    </div>
  </div>
  <div class="flex" :class="{ 'mt-4': props.mode === 'add' }">
    <!-- Avatar -->
    <div class="avatar-upload">
      <div class="avatar-preview">Ảnh</div>
    </div>
    <form class="candidate-form flex-1" @submit.prevent="submit">
      <div class="flex-1">
        <!-- Họ và tên -->
        <FormGroup
          v-model="currentCandidate.CandidateName"
          label="Họ và tên"
          fieldKey="CandidateName"
          type="text"
          :wrapper-attribute="{ class: 'my-2' }"
          placeholder="Nhập họ và tên"
          :required="candicateSchema['CandidateName'].isRequired"
          :error="formErrors.find((error) => error.key === 'CandidateName')?.errors[0]"
        />

        <!-- Ngày sinh & Giới tính -->
        <div class="flex gap-4 my-2">
          <div class="form-col">
            <FormGroup
              v-model="currentCandidate.Dob"
              label="Ngày sinh"
              fieldKey="Dob"
              type="date"
              :error="formErrors.find((error) => error.key === 'Dob')?.errors[0]"
            />
          </div>

          <div class="form-col">
            <FormGroup
              v-model="currentCandidate.Gender"
              label="Giới tính"
              fieldKey="Gender"
              :error="formErrors.find((error) => error.key === 'Gender')?.errors[0]"
            >
              <template #select></template>
              <template #select-options>
                <option value="">Chọn giới tính</option>
                <option
                  v-for="[key, value] in Object.entries({ 1: 'Nam', 2: 'Nữ', 3: 'Khác' })"
                  :key="key"
                  :value="key"
                >
                  {{ value }}
                </option>
              </template>
            </FormGroup>
          </div>
        </div>

        <!-- Khu vực -->
        <FormGroup
          v-model="currentCandidate.AreaName"
          label="Khu vực"
          fieldKey="AreaName"
          :wrapper-attribute="{ class: 'my-2' }"
          :error="formErrors.find((error) => error.key === 'AreaName')?.errors[0]"
        >
          <template #select></template>
          <template #select-options>
            <option value="">Chọn khu vực</option>
            <option v-for="[key, value] in Object.entries(AREAS)" :key="key" :value="key">
              {{ value }}
            </option>
          </template>
        </FormGroup>

        <!-- Số điện thoại & Email -->
        <div class="flex gap-4 my-2">
          <div class="form-col">
            <FormGroup
              v-model="currentCandidate.Mobile"
              label="Số điện thoại"
              fieldKey="Mobile"
              type="tel"
              placeholder="Nhập số điện thoại"
              :error="formErrors.find((error) => error.key === 'Mobile')?.errors[0]"
            />
          </div>
          <div class="form-col">
            <FormGroup
              v-model="currentCandidate.Email"
              label="Email"
              fieldKey="Email"
              type="email"
              placeholder="Nhập Email"
              :error="formErrors.find((error) => error.key === 'Email')?.errors[0]"
            />
          </div>
        </div>

        <!-- Địa chỉ -->
        <FormGroup
          v-model="currentCandidate.Address"
          label="Địa chỉ"
          fieldKey="Address"
          :wrapper-attribute="{ class: 'my-2' }"
          type="text"
          placeholder="Nhập địa chỉ"
          :error="formErrors.find((error) => error.key === 'Address')?.errors[0]"
        />

        <!-- HỌC VẤN -->
        <div>
          <section class="section-education">
            <div class="section-title">HỌC VẤN</div>

            <FormGroup
              v-model="currentCandidate.EducationDegreeName"
              label="Trình độ đào tạo"
              fieldKey="EducationDegreeName"
              layout="horizontal"
              :control-attribute="{ class: 'my-2 w-full' }"
              :wrapper-attribute="{ class: 'items-center' }"
              :labelAttribute="{
                style: 'width: 200px;',
              }"
              :error="formErrors.find((error) => error.key === 'EducationDegreeName')?.errors[0]"
            >
              <template #label>
                <div class="icon-default icon-dot-import"></div>
              </template>
              <template #select></template>
              <template #select-options>
                <option value="">Chọn trình độ đào tạo</option>
                <option
                  v-for="[key, value] in Object.entries(EDUCATION_DEGREES)"
                  :key="key"
                  :value="key"
                >
                  {{ value }}
                </option>
              </template>
            </FormGroup>

            <FormGroup
              v-model="currentCandidate.EducationPlaceName"
              label="Nơi đào tạo"
              layout="horizontal"
              :control-attribute="{ class: 'my-2 w-full' }"
              :wrapper-attribute="{ class: 'items-center' }"
              :labelAttribute="{
                style: 'width: 200px;',
              }"
              fieldKey="EducationPlaceName"
              :error="formErrors.find((error) => error.key === 'EducationPlaceName')?.errors[0]"
            >
              <template #label>
                <div class="icon-default icon-dot-import"></div>
              </template>
              <template #select></template>
              <template #select-options>
                <option value="">Chọn nơi đào tạo</option>
                <option
                  v-for="[key, value] in Object.entries(EDUCATION_PLACES)"
                  :key="key"
                  :value="key"
                >
                  {{ value }}
                </option>
              </template>
            </FormGroup>

            <FormGroup
              v-model="currentCandidate.EducationMajorName"
              label="Chuyên ngành"
              layout="horizontal"
              :control-attribute="{ class: 'my-2 w-full' }"
              :wrapper-attribute="{ class: 'items-center' }"
              :labelAttribute="{
                style: 'width: 200px;',
              }"
              fieldKey="EducationMajorName"
              :error="formErrors.find((error) => error.key === 'EducationMajorName')?.errors[0]"
            >
              <template #label>
                <div class="icon-default icon-dot-import"></div>
              </template>

              <template #select></template>
              <template #select-options>
                <option value="">Chọn chuyên ngành</option>
                <option
                  v-for="[key, value] in Object.entries(EDUCATION_MAJORS)"
                  :key="key"
                  :value="key"
                >
                  {{ value }}
                </option>
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
              :required="candicateSchema['ApplyDate'].isRequired"
              :error="formErrors.find((error) => error.key === 'ApplyDate')?.errors[0]"
            />
          </div>
          <div class="form-col">
            <FormGroup
              v-model="currentCandidate.ChannelName"
              label="Nguồn ứng viên"
              fieldKey="ChannelName"
              :error="formErrors.find((error) => error.key === 'ChannelName')?.errors[0]"
            >
              <template #select></template>
              <template #select-options>
                <option value="">Chọn nguồn ứng viên</option>
                <option
                  v-for="[key, value] in Object.entries(RECRUITMENT_CHANNELS)"
                  :key="key"
                  :value="key"
                >
                  {{ value }}
                </option>
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
              :error="formErrors.find((error) => error.key === 'AttractivePersonnel')?.errors[0]"
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
              :error="formErrors.find((error) => error.key === 'PresenterName')?.errors[0]"
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
          reverse
          :wrapper-attribute="{ class: 'w-full my-4 justify-end items-center gap-3' }"
          :error="formErrors.find((error) => error.key === 'IsTalentPoolDetail')?.errors[0]"
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
          :wrapper-attribute="{ class: 'my-2 w-full' }"
          :error="formErrors.find((error) => error.key === 'WorkPlaceRecent')?.errors[0]"
        />
        <div class="work-experience-line-break"></div>

        <!-- Kinh nghiệm làm việc (demo, chưa map vào schema) -->
        <div class="experience-section">
          <div class="action-link">+ Thêm kinh nghiệm làm việc</div>
          <FormGroup
            v-model="currentCandidate.ExperienceWorkPlace"
            label="Nơi làm việc"
            fieldKey="ExperienceWorkPlace"
            type="text"
            placeholder="Nhập nơi làm việc"
            :wrapper-attribute="{ class: 'my-2 w-full' }"
            :error="formErrors.find((error) => error.key === 'ExperienceWorkPlace')?.errors[0]"
          />

          <div class="form-row">
            <div class="form-col">
              <FormGroup
                v-model="currentCandidate.ExperienceFrom"
                label="Từ tháng/năm"
                fieldKey="ExperienceFrom"
                type="month"
                :error="formErrors.find((error) => error.key === 'ExperienceFrom')?.errors[0]"
              />
            </div>
            <div class="form-col">
              <FormGroup
                v-model="currentCandidate.ExperienceTo"
                label="Đến tháng/năm"
                fieldKey="ExperienceTo"
                type="month"
                :error="formErrors.find((error) => error.key === 'ExperienceTo')?.errors[0]"
              />
            </div>
          </div>

          <FormGroup
            v-model="currentCandidate.ExperiencePosition"
            label="Vị trí công việc"
            fieldKey="ExperiencePosition"
            type="text"
            placeholder="Nhập vị trí công việc"
            :error="formErrors.find((error) => error.key === 'ExperiencePosition')?.errors[0]"
          />

          <FormGroup
            v-model="currentCandidate.ExperienceDescription"
            label="Mô tả công việc"
            fieldKey="ExperienceDescription"
            :error="formErrors.find((error) => error.key === 'ExperienceDescription')?.errors[0]"
          >
            <template #textarea></template>
          </FormGroup>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.section-education {
  border-bottom: 1px solid #dee2e6 !important;
  margin-bottom: 16px;
  padding-bottom: 16px;
}

.form-row {
  display: flex;
  gap: 15px;
  margin: 8px 0 !important;
}

.form-col {
  flex: 1;
}

/* Upload Area */
.upload-area {
  border: 1px dashed #d1d5db;
  border-radius: 4px;
  padding: 24px;
  height: 100px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-text {
  font-size: 13px;
  color: #6b7280;
}

.upload-link {
  color: #3b82f6;
}

/* Specific Field Styles */
.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-right: 24px;
}

.avatar-preview {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #6b7280;
  border: 1px dashed #d1d5db;
  overflow: hidden;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-divider {
  flex: 1;
  height: 1px;
  background-color: #e5e7eb;
}

.action-link {
  color: #3b82f6;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.action-link:hover {
  text-decoration: underline;
}
.work-experience-line-break {
  background-color: #e0e0e0;
  width: 100%;
  height: 1px;
  margin: 16px 0;
}
</style>
