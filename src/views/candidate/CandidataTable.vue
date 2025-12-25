<script setup lang="ts">
import { candidateDataStorage } from '@/utils/instances'
import { onMounted, reactive, ref } from 'vue'
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
import BaseRating from '@/components/ms-rating/BaseRating.vue'

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
const query = reactive<{
  total: number
  limit: number
  page: number
  searchText: string
}>({
  total: 0,
  limit: 25,
  page: 1,
  searchText: '',
})
const emit = defineEmits<{
  (e: 'edit:row', row: CandidateType): void
}>()

// Hàm reload để đọc lại dữ liệu từ storage
const reload = () => {
  const stored = candidateDataStorage.get({ Candidates: [] } as { Candidates: CandidateType[] })
  if(query.searchText) {
    stored.Candidates = stored.Candidates.filter((candidate) => {
      const searchText = query.searchText.toLowerCase()
      return (
        (typeof candidate.CandidateName === 'string' && candidate.CandidateName.toLowerCase().includes(searchText)) ||
        (typeof candidate.Mobile === 'string' && candidate.Mobile.toLowerCase().includes(searchText)) ||
        (typeof candidate.Email === 'string' && candidate.Email.toLowerCase().includes(searchText)) ||
        (typeof candidate.ChannelName === 'string' && candidate.ChannelName.toLowerCase().includes(searchText)) ||
        (typeof candidate.RecruitmentCampaignNames === 'string' && candidate.RecruitmentCampaignNames.toLowerCase().includes(searchText)) ||
        (typeof candidate.JobPositionName === 'string' && candidate.JobPositionName.toLowerCase().includes(searchText))
      )
    })
  }
  candidates.value = stored.Candidates.slice(
    (query.page - 1) * query.limit,
    query.page * query.limit,
  )
  query.total = stored.Candidates.length
}

onMounted(() => {
  const stored = candidateDataStorage.get({ Candidates: [] } as { Candidates: CandidateType[] })
  // Nếu chưa có dữ liệu trong storage thì seed từ file JSON
  if (!stored.Candidates || !stored.Candidates.length) {
    candidateDataStorage.set({ Candidates: candidatesData } as unknown as {
      Candidates: CandidateType[]
    })
  }
  reload()
})

// Cho phép cha (CandidateView) gọi reload()
defineExpose({
  reload,
})
const handleEditRow = (row: CandidateType) => {
  emit(
    'edit:row',
    candidates.value.find(
      (candidate) => candidate.CandidateID === row.CandidateID,
    ) as CandidateType,
  )
}
const handleDeleteRow = (id: string | number) => {
  console.log(id)
}
const handleSelectRows = (data: unknown) => {
  return data
}
const handleNextPage = () => {
  if (query.page < Math.ceil(query.total / query.limit)) {
    query.page++
  }
  reload()
}
const handlePrevPage = () => {
  if (query.page > 1) {
    query.page--
  }
  reload()
}
const handleChangeLimit = (limit: number) => {
  query.limit = limit
  reload()
}
const handleSearchText = (text: string) => {
  query.searchText = text
  query.page = 1
  reload()
}
</script>

<template>
  <BaseTable
    :fields="fields"
    :rows="
      candidates.map((candidate) => {
        return {
          ...candidate,
          id: candidate.CandidateID as number,
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
    :query="query"
    @edit:row="handleEditRow"
    @delete:row="handleDeleteRow"
    @select:rows="handleSelectRows"
    @next:page="handleNextPage"
    @prev:page="handlePrevPage"
    @change:limit="handleChangeLimit"
    @search:text="handleSearchText"
  >
    <template #CandidateName="{ row }">
      <NameCell
        :name="String(row.CandidateName || '--')"
        :unreadEmailQuantity="Number(row.UnreadEmailQuantity) || 0"
        :avatarColor="(row.AvatarColor as string) || '#39C5AB'"
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
