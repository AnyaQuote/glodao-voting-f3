<template>
  <div class="mb-10 mt-4">
    <div class="d-flex align-center font-weight-medium">
      <div v-for="(crumb, index) in data" :key="index" class="text-truncate">
        <span
          :class="{ 'blue-diversity--text mr-5 cursor-pointer ': crumb.active, 'neutral10--text': !crumb.active }"
          @click="crumb.active ? crumb.onCallback : null"
        >
          {{ crumb.name }}
          <v-icon v-if="crumb.active" class="ml-2 ml-sm-5" size="2">mdi-chevron-right</v-icon>
        </span>
      </div>
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
}

interface Breadcrumb {
  name?: string
  onCallback?: () => void
  active?: boolean
}
</script>

<style scoped></style>
