<template>
  <Graph title="Test" v-bind:data="data"/>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import dummy from './dummy.json';
import Graph from '~/components/Graph.vue'

export default {
  name: 'HelloWorld',
  components: {Graph},
  data() {
    return {
      data: dummy
    }
  },
}
</script>

<style scoped>
</style>
