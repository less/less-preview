<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'

interface Option {
  value: string
  label?: string
}
defineProps<{ modelValue?: string | number; options: Option[] }>()
defineEmits<(e: 'update:modelValue', value: string) => void>()
</script>

<template>
  <Listbox
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    as="div"
    class="select"
    v-slot="{ open }"
  >
    <ListboxButton class="control select-button" :class="{ open }">
      <span class="select-label">
        {{ options.find(o => o.value === modelValue)?.label ?? modelValue }}
      </span>
      <span class="select-caret" aria-hidden="true"></span>
    </ListboxButton>
    <ListboxOptions class="select-options">
      <ListboxOption
        v-for="o in options"
        :key="o.value"
        :value="o.value"
        v-slot="{ active, selected }"
      >
        <li class="select-option" :class="{ active, selected }">
          {{ o.label ?? o.value }}
        </li>
      </ListboxOption>
    </ListboxOptions>
  </Listbox>
</template>

<style lang="less">
@import (reference) '../theme.less';

.select {
  position: relative;
  display: inline-block;
  min-width: 10rem;
  width: 100%;
  font-size: 14px;
  text-align: left;
}
.select-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  cursor: pointer;
  &.open {
    border-color: @accent;
  }
}
.select-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.select-caret {
  flex: none;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid @muted;
}
.select-options {
  position: absolute;
  left: 0;
  top: calc(100% + 4px);
  z-index: 200;
  width: 100%;
  max-height: calc(100vh - 80px);
  overflow: auto;
  margin: 0;
  padding: 4px;
  list-style: none;
  background: @panel;
  border: 1px solid @border;
  border-radius: @radius;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  &:focus {
    outline: none;
  }
}
.select-option {
  padding: 6px 10px;
  border-radius: @radius;
  cursor: pointer;
  color: @text;
  white-space: nowrap;
  &.active {
    background: lighten(@base, 12%);
  }
  &.selected {
    color: @accent;
    font-weight: 600;
  }
}
</style>
