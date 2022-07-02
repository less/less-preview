<template>
  <section class="container">
    <div class="editor">
      <slot name="edit"></slot>
    </div>
    <div class="editor">
      <slot name="preview"></slot>
    </div>
  </section>
</template>
<style lang="less">
.container {
  height: calc(100vh - 40px);
  display: flex;
  justify-content: space-evenly;
  align-items: stretch;
  padding: 6px 0;
}

.editor {
  width: calc(50vw - 12px);
  border: 1px solid hsl(190, 10%, 50%);
}
</style>