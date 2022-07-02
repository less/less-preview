<script lang="ts" setup>
import Codemirror from './codemirror/Codemirror.vue';
interface Props {
  value?: string
  theme?: string
  readOnly?: boolean
}
const { value, theme, readOnly } = defineProps<Props>()
const emit = defineEmits<(e: 'update:value', value: string) => void>()

const inputValue = (localValue: string) => {
  emit('update:value', localValue)
}
</script>
<template>
  <Codemirror
    :value='value'
    :theme='theme'
    :readOnly='readOnly'
    @input="inputValue"/>
</template>