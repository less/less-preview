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
  </section>
</template>
<style lang="less">
.container {
  height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 6px 0;
}
.body {
  overflow: hidden;
  height: inherit;
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
</style>