<template>
  <div>
    <nuxt/>
    <!-- load latest version asap -->
    <script data-less-latest src="https://cdn.jsdelivr.net/npm/less@latest"></script>
  </div>
</template>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  box-sizing: border-box;
}
*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
}
</style>
