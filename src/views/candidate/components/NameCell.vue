<script setup lang="ts">
import getInitials from '@/utils/getInitials'

defineOptions({
  name: 'NameCell',
})
interface Props {
  name: string
  unreadEmailQuantity: number
  avatarColor: string
}
const props = withDefaults(defineProps<Props>(), {
  name: '--',
  unreadEmailQuantity: 0,
  avatarColor: '',
})
// const renderName = (name: string, unreadEmailQuantity: number = 0): VNode => {
//   const children = [
//     h(
//       'span',
//       {
//         class: 'table__name-avatar',
//         style: { backgroundColor: getAvatarColor(name) },
//       },
//       getInitials(name),
//     ),
//     h('span', { class: 'table__name-text' }, name || '--'),
//   ]

//   if (unreadEmailQuantity > 0) {
//     children.push(
//       h('div', { class: 'relative' }, [
//         h('div', { class: 'icon-default icon-base-20 icon-email' }),
//         h('span', { class: 'unread-email-quantity' }, unreadEmailQuantity || 0),
//       ]),
//     )
//   }

//   return h('div', { class: 'table__name' }, children)
// }
</script>
<template>
  <div class="table__name">
    <div class="table__name-avatar" :style="{ backgroundColor: props.avatarColor }">
      {{ getInitials(props.name) }}
    </div>
    <span class="table__name-text">{{ props.name }}</span>
    <div class="relative" v-if="props.unreadEmailQuantity > 0">
      <div class="icon-default icon-base-20 icon-email"></div>
      <span class="unread-email-quantity">{{ props.unreadEmailQuantity }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.table__name {
  display: flex;
  align-items: center;
  gap: 8px;

  &-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    flex-shrink: 0;
  }

  &-text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #1e2633;
    font-family: Inter;
    font-weight: 400;
  }

  &-badge {
    font-size: 12px;
    color: #059669;
    font-weight: 500;
  }
}
.unread-email-quantity {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #f00;
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -5px;
  right: -5px;
  z-index: 10;
}
</style>
