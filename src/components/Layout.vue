<script lang="ts" setup>
  import Loading from '@components/Loading.vue'
  import {toRefs} from 'vue';
  const props = defineProps(["loadingLessJS"]);
  let { loadingLessJS } = toRefs(props);
</script>
<template>
  <section class="container">
    <body class="body">      
      <div class="editor">
        <slot name="edit"></slot>
      </div>
      <div class="editor">
        <slot name="preview"></slot>
      </div>
      <section class="options">
        <slot name="options"></slot>
      </section>
    </body>
    <footer class="footer">
      <slot name="footer"></slot>
    </footer>
    <Loading v-show="loadingLessJS"></Loading>
  </section>
</template>
<style lang="less">
@import (reference) '../theme.less';

.container {
  position: relative;
  height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
}
.body {
  overflow: hidden;
  display: flex;
  align-items: stretch;
  gap: 6px;
  padding: 6px;
  flex: 1;
}

.editor {
  flex: 5;
  min-width: 0;
  border: 1px solid @border;
  border-radius: @radius;
  overflow: hidden;
}

.options {
  border: 1px solid @border;
  border-radius: @radius;
  background: @panel;
  flex: 2;
  display: none;
  padding: 12px;
  flex-direction: column;
  gap: 16px;
  > * {
    margin: 0;
  }
  @media (min-width: 1024px) {
    display: flex;
  }
}

.footer {
  width: 100%;
}
</style>
