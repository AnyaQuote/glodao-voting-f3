<template>
  <div class="mb-10 mt-4">
    <div class="d-flex align-center font-weight-medium">
      <template v-for="(crumb, index) in data">
        <span
          v-if="crumb.active"
          class="text-truncate"
          :class="{ 'blue-diversity--text mr-5 cursor-pointer ': crumb.active, 'neutral10--text': !crumb.active }"
          @click="crumb.active ? crumb.onCallback : null"
          :key="index"
        >
          {{ crumb.name }}
          <v-icon v-if="crumb.active" class="mx-5" size="22">mdi-chevron-right</v-icon>
        </span>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

const defaultProp = () => ({})

@Observer
@Component
export default class MissionBreadcrumb extends Vue {
  @Prop({ default: defaultProp }) data!: Breadcrumb[]
  id = 0
}

interface Breadcrumb {
  name?: string
  onCallback?: () => void
  active?: boolean
}
</script>

<style scoped></style>
