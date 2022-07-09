<template>
<div class="loading">
      <div class="loadingCircle"></div>
</div>
</template>
<style lang="less">
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