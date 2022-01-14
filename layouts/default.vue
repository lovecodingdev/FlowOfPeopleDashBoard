<template>
  <div class="default-nuxt-layout">
    <Nuxt />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  components: {},
  setup() {}
})
</script>

<style>
html {
  font-size: var(--FONT-SIZE-BODY);
  font-weight: var(--FONT-WEIGHT-REGULAR);
  box-sizing: border-box;
  min-width: 240px;
  background-color: #fff;
}
html,
body,
#__nuxt,
#__layout {
  width: 100%;
  padding: 0;
  margin: 0;
}
.default-nuxt-layout {
  display: flex;
  width: 100%;

  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  background-color: #fff;
}
</style>
