<script setup lang="ts">
import { candidateDataStorage } from '@/utils/instances'
import { onMounted, ref } from 'vue'
import { Candidates as candidatesData } from '@/assets/data/candicate.json'
import {
  AREAS,
  EDUCATION_MAJORS,
  EDUCATION_DEGREES,
  EDUCATION_PLACES,
  RECRUITMENT_CHANNELS,
} from '@/common/constanst'
import type { FieldType } from '@/types/baseTable'
import type { CandidateType } from '@/types/candicates'
import BaseTable from '@/components/ms-table/BaseTable.vue'
import NameCell from './components/NameCell.vue'
import randomColor from '@/utils/randomColor'
import BaseRating from '@/components/ms-rating/BaseRating.vue'

const avatarColorCache = new Map<string, string>()
/**
 * Gets or generates a color for a candidate name.
 * @param {string} name - Candidate name.
 * @returns {string} Color hex code.
 */
const getAvatarColor = (name: string): string => {
  if (!name) return randomColor()
  if (!avatarColorCache.has(name)) {
    avatarColorCache.set(name, randomColor())
  }
  return avatarColorCache.get(name)!
}
const fields: FieldType<CandidateType>[] = [
  {
    label: 'Họ và tên',
    key: 'CandidateName',
    type: 'custom',
  },
  {
    label: 'Số điện thoại',
    key: 'Mobile',
    type: 'text',
  },
  {
    label: 'Email',
    key: 'Email',
    type: 'text',
  },
  {
    label: 'Nguồn ứng viên',
    key: 'ChannelName',
    type: 'text',
  },
  {
    label: 'Chiến dịch tuyển dụng',
    key: 'RecruitmentCampaignNames',
    type: 'text',
  },
  {
    label: 'Vị trí tuyển dụng',
    key: 'JobPositionName',
    type: 'text',
  },
  {
    label: 'Tin tuyển dụng',
    key: 'RecruitmentName',
    type: 'text',
  },
  {
    label: 'Vòng tuyển dụng',
    key: 'RecruitmentRoundName',
    type: 'text',
  },
  {
    label: 'Đánh giá',
    key: 'Score',
    type: 'custom',
    cellCustomClass: 'stars',
  },
  {
    label: 'Ngày ứng tuyển',
    key: 'ApplyDate',
    type: 'date',
  },
  {
    label: 'Trình độ đào tạo',
    key: 'EducationDegreeName',
    type: 'text',
  },
  {
    label: 'Nơi đào tạo',
    key: 'EducationPlaceName',
    type: 'text',
  },
  {
    label: 'Chuyên ngành',
    key: 'EducationMajorName',
    type: 'text',
  },
  {
    label: 'Nơi làm việc gần đây',
    key: 'WorkPlaceRecent',
    type: 'text',
  },
  {
    label: 'Nhân sự khai thác',
    key: 'AttractivePersonnel',
    type: 'text',
  },
  {
    label: 'Đơn vị sử dụng',
    key: 'OrganizationUnitName',
    type: 'text',
  },
  {
    label: 'Phù hợp với chân dung',
    key: 'Overall',
    type: 'text',
  },
  {
    label: 'Khu vực',
    key: 'AreaName',
    type: 'text',
  },
  {
    label: 'Người giới thiệu',
    key: 'PresenterName',
    type: 'text',
  },
  {
    label: 'Thông tin tiếp nhận',
    key: 'ProbationInfoStatus',
    type: 'text',
  },
  {
    label: 'Thuộc kho tiềm năng',
    key: 'IsTalentPoolDetail',
    type: 'text',
  },
]
const candidates = ref<CandidateType[]>([])
const emit = defineEmits<{
  (e: 'edit:row', row: CandidateType): void
}>()
onMounted(() => {
  const initialCandidates = candidateDataStorage.get([] as CandidateType[]) as CandidateType[]
  console.log(initialCandidates)
  if (candidates.value.length === 0) {
    candidateDataStorage.set({
      Candidates: candidatesData,
    })
    candidates.value = candidatesData.map((candidate) => ({
      ...candidate,
      id: candidate.CandidateID as number,
      isHighlighted: candidate.IsEmployee || false,
    })) as CandidateType[]
  } else {
    candidates.value = initialCandidates.map((candidate) => ({
      ...candidate,
      id: candidate.CandidateID as number,
      isHighlighted: candidate.IsEmployee || false,
    })) as CandidateType[]
  }
})
const handleEditRow = (row: CandidateType) => {
  emit('edit:row', row)
}
const handleDeleteRow = (id: string | number) => {
  console.log(id)
}
</script>

<template>
  <BaseTable
    :fields="fields"
    :rows="
      candidates.map((candidate) => {
        return {
          ...candidate,
          EducationMajorName:
            EDUCATION_MAJORS[candidate.EducationMajorName as keyof typeof EDUCATION_MAJORS] || '--',
          EducationDegreeName:
            EDUCATION_DEGREES[candidate.EducationDegreeName as keyof typeof EDUCATION_DEGREES] ||
            '--',
          EducationPlaceName:
            EDUCATION_PLACES[candidate.EducationPlaceName as keyof typeof EDUCATION_PLACES] || '--',
          ChannelName:
            RECRUITMENT_CHANNELS[candidate.ChannelName as keyof typeof RECRUITMENT_CHANNELS] ||
            '--',
          AreaName: AREAS[candidate.AreaName as keyof typeof AREAS] || '--',
        }
      }) as CandidateType[]
    "
    @edit:row="handleEditRow"
    @delete:row="handleDeleteRow"
  >
    <template #CandidateName="{ row }">
      <NameCell
        :name="String(row.CandidateName || '--')"
        :unreadEmailQuantity="Number(row.UnreadEmailQuantity) || 0"
        :avatarColor="getAvatarColor(String(row.CandidateName || '--'))"
      ></NameCell>
    </template>
    <template #Score="{ row }">
      <BaseRating
        :score="Number(row.Score) || 0"
        :countStar="5"
        activeColor="#f5a623"
        inactiveColor="#e1e4ea"
        :starSize="16"
      ></BaseRating>
    </template>
  </BaseTable>
</template>
