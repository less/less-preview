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
.container {
  position: relative;
  height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.body {
  overflow: hidden;
  display: flex;
  justify-content: stretch;
  align-items: stretch;
  gap: 6px;
  padding: 6px;
  flex: 1;
}

.editor {
  flex: 5;
  border: 1px solid hsl(190, 10%, 50%);
}

.options {
  border: 1px solid hsl(190, 10%, 50%);
  background: darken(#35495e, 5%);
  flex: 2;
  display: none;
  color: #ddd;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  > * {
    margin: 0;
  }
  @media (min-width: 1024px) {
    display: flex;
  }
}

label {
  display: flex;
  gap: 4px;
  span {
    flex: 1;
  }
  padding-bottom: 3px;
}

select {
  width: 100%;
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