<script setup lang="ts">
import { computed, onBeforeMount } from 'vue'
import IconStar from '../icons/IconStar.vue'

defineOptions({
  name: 'BaseRating',
})
interface Props {
  score: string | number | null | undefined
  countStar: number
  activeColor: string
  inactiveColor: string
  starSize: number
  starGap?: number
}
const props = withDefaults(defineProps<Props>(), {
  score: 0,
  countStar: 5,
  activeColor: '#f5a623',
  inactiveColor: '#e1e4ea',
  starSize: 16,
  starGap: 2,
})
const cloneProps: Props = { ...props }
onBeforeMount(() => {
  if (props.score === null || props.score === undefined || props.score === '') {
    cloneProps.score = 0
  } else {
    cloneProps.score = Number(props.score)
  }
  if (cloneProps.score > cloneProps.countStar) {
    cloneProps.score = cloneProps.countStar
  }
})
const starsWidth = computed(() => {
  // width start + gap + margin left + margin right
  return cloneProps.countStar * props.starSize + (cloneProps.countStar - 1) * props.starGap + 10 + 'px'
})
</script>

<template>
  <div class="stars" :style="{ width: starsWidth }">
    <div class="stars__bg">
      <span v-for="i in cloneProps.countStar" :key="i"
        ><IconStar :size="props.starSize" :color="cloneProps.inactiveColor"></IconStar>
      </span>
    </div>
    <div
      class="stars__fill"
      :style="{ width: `${(Number(props.score) / props.countStar) * 100}%` }"
    >
      <span v-for="i in Math.floor(Number(props.score))" :key="i">
        <IconStar :size="props.starSize" :color="cloneProps.activeColor"></IconStar>
      </span>
    </div>
  </div>
</template>
<style scoped lang="scss">
/* Table rating stars */
.stars {
  position: relative;
  display: inline-block;
  line-height: 1;
  height: calc(v-bind(starSize) * 1px);

  &__bg,
  &__fill {
    position: absolute;
    top: 0;
    left: 0;
    display: inline-flex;
    gap: calc(v-bind(starGap) * 1px);
    span {
      display: inline-block;
      width: calc(v-bind(starSize) * 1px);
      height: calc(v-bind(starSize) * 1px);
    }
  }
  &__fill {
    white-space: nowrap;
  }
}
</style>
