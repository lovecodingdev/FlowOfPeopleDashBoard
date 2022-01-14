<template>
  <div>
    <div>Hello World!</div>
    <Card>
      <PercentageTable />
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import Card from '~/components/Card.vue'
import PercentageTable from '~/components/PercentageTable.vue'

export default defineComponent({
  components: { Card, PercentageTable },
  setup() {}
})
</script>

<style scoped></style>
