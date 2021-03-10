<template>
  <form>
    <label class="checkbox-label"><input type="checkbox" v-model="autoplay" :disabled="props.length <= 0">Autoplay</label>
    <label>
      <button type="button"  class="btn" @click="modifyVal(-1)" :disabled="val === (startFromZero ? 0 : 1) || autoplay">Prev</button>
      <span>{{ val }} / {{ Math.max(startFromZero ? length - 1 : length, 0) }}</span>
      <button type="button"  class="btn" @click="modifyVal(1)" :disabled="val === props.length - (startFromZero ? 1 : 0) || autoplay">Next</button>
    </label>
  </form>
</template>

<style lang="css" scoped>
  span {
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    margin-left: 1em;
    margin-right: 1em;
  }
  form > * {
    display: block;
  }
  form>*:not(:last-child) {
    margin-bottom: 1em;
  }
</style>

<script setup lang="ts">
import '../assets/common.css'
import { watch, defineEmit, defineProps, ref } from 'vue'

const props = defineProps({
  length: {
    type: Number,
    default: 3
  },
  val: {
    type: Number,
    default: 0
  },
  startFromZero: {
    type: Boolean,
    default: true
  },
  wait: {
    type: Number,
    default: 500
  }
})

const autoplay = ref(false)
let interval: number | null = null

watch(autoplay, () => {
  if (autoplay.value) {
    interval = setInterval(modifyVal.bind(null, 1), props.wait)
  } else {
    if (interval !== null) {
      clearInterval(interval)
    }
    interval = null
  }
})

const emit = defineEmit(['update:val'])

function modifyVal(delta: number) {
  if (props.val + delta < (props.startFromZero ? 0 : 1)
  || props.val + delta >= (props.startFromZero ? props.length : props.length + 1)) {
    if (interval) {
      clearInterval(interval)
    }
    return
  }
  emit('update:val', props.val + delta)
}
</script>