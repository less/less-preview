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
    </body>
    <footer class="footer">
      <slot name="footer"></slot>
    </footer>
    <Loading v-show="loadingLessJS"></Loading>
  </section>
</template>
<style lang="less">
.container {
  position: relative;
  height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 6px 0;
}
.body {
  overflow: hidden;
  display: flex;
  justify-content: space-evenly;
  align-items: stretch;
  flex: 1;
}

.editor {
  width: calc(50vw - 12px);
  border: 1px solid hsl(190, 10%, 50%);
}

.footer {
  width: 100%;
}
.loading {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #f2efef;
  @keyframes identifier {
    0%{
      transform: rotate(0deg) ;
    }
    100%{
      transform: rotate(360deg);
    }
  }
  .loadingCircle{
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -5rem;
    margin-top: -5rem;
    width: 10rem;
    height: 10rem;
    border: 1px solid #91abe3;
    border-left: 2px solid #91abe3;
    border-radius: 50%;
    animation: identifier 0.6s linear infinite forwards;
  }
}
</style>