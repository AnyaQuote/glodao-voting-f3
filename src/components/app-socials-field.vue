<template>
  <div>
    <!-- --------------------------------------------- SOCIAL LINK INPUTS --------------------------------------------- -->
    <v-sheet v-for="(prop, index) in data" :key="index" class="d-flex rounded">
      <!-- ==== Type select ==== -->
      <app-select
        class="rounded-r-0 min-width-200"
        :items="platforms"
        :value="prop.type"
        :rules="[$rules.required]"
        :disabled="prop.required"
        :append-icon="!prop.required ? '$dropdown' : ''"
        @change="onChange(index, 'type', $event)"
        placeholder="Choose platform"
      >
        <template v-slot:selection="{ item }">
          <v-icon color="blue-diversity" class="mr-3">{{ $_get(referrenceIcons, `${item}`) }}</v-icon>
          <span class="text-truncate text-subtitle-1 neutral-10--text text-capitalize">{{ item }}</span>
        </template>
        <template v-slot:item="{ item }">
          <v-icon color="blue-diversity" class="mr-3">{{ $_get(referrenceIcons, `${item}`) }}</v-icon>
          <span class="text-subtitle-1 neutral10--text text-capitalize">{{ item }}</span>
        </template>
      </app-select>
      <!-- ==== Link input ==== -->
      <app-text-field
        class="rounded-l-0 w-90"
        :value="prop.link"
        @change="onChange(index, 'link', $event)"
        :rules="[$rules.required, $rules.url]"
        placeholder="Enter link (https://yourdomain)"
      >
        <template v-slot:append>
          <v-hover v-slot="{ hover }">
            <v-icon v-if="!prop.required && hover" color="error" @click="remove(index)">mdi-close</v-icon>
            <v-icon v-else>mdi-link</v-icon>
          </v-hover>
        </template>
        <template v-slot:message="{ message }">
          <div class="mt-1">{{ message }}</div>
        </template>
      </app-text-field>
    </v-sheet>
    <!-- --------------------------------------------- ADD MORE LINK BUTTON ------------------------------------------- -->
    <v-sheet v-ripple class="d-flex align-center pa-3 rounded" outlined @click="add">
      <v-icon>mdi-plus-circle</v-icon>
      <div class="neutral-10--text text-subtitle-2 font-weight-600 line-height-1 ml-3">Add more link</div>
    </v-sheet>
  </div>
</template>

<script lang="ts">
import { Observer } from 'mobx-vue'
import { Component, Vue, Prop } from 'vue-property-decorator'
import { set, toNumber } from 'lodash-es'
import { EMPTY_ARRAY, EMPTY_OBJECT, INPUT_MODE, OUTPUT_MODE, SOCIAL_ICONS } from '@/constants'

interface LinkInput {
  type?: string
  link?: string
  required?: boolean
  id?: number
}

const defaultLinks = {
  website: '',
}

@Observer
@Component
export default class SocialLinkFields extends Vue {
  @Prop({ required: true }) value!: any
  readonly referrenceIcons = SOCIAL_ICONS
  readonly platforms = Object.keys(this.referrenceIcons)
  data: LinkInput[] = []
  id = {
    website: 0,
    reddit: 0,
    facebook: 0,
    twitter: 0,
    discord: 0,
    telegram: 0,
    youtube: 0,
    github: 0,
    whitepaper: 0,
    others: 0,
  }

  mapSocialLinks(mode: string, obj: LinkInput[], requiredType = ['website']) {
    let result
    if (mode === INPUT_MODE) {
      result = Object.entries(obj).reduce((acc: any, current) => {
        // For `website-1`, `website-2`, isRequired will evaluate to false
        // Until type is exactly as `website`, than isRequired will evaluate to true
        // In short, only the first `website` without numbered is accepted as required
        const isRequired = requiredType.includes(current[0])
        const [type, strTypeId] = current[0].split('-')
        const typeId = toNumber(strTypeId || 0)
        const link = current[1]
        this.id[type] = Math.max(this.id[type], typeId)
        return [...acc, { type, link, id: typeId, required: isRequired }]
      }, EMPTY_ARRAY)
    } else {
      result = obj.reduce((acc: any, current: LinkInput) => {
        const typeName = current.id ? `${current.type}-${current.id}` : `${current.type}`
        return current.type ? { ...acc, [typeName]: current.link } : acc
      }, EMPTY_OBJECT)
    }
    return result
  }

  mounted() {
    this.data = this.mapSocialLinks(INPUT_MODE, this.value || defaultLinks)
  }

  onChange(position: number, property: string, value: string) {
    if (property === 'type') {
      this.data[position].id = ++this.id[value]
    }
    set(this.data[position], property, value)
    this.$emit('change', this.mapSocialLinks(OUTPUT_MODE, this.data))
  }

  add() {
    if (this.data.length < 10) {
      this.data = [...this.data, { type: '', link: '', required: false, id: 0 }]
    }
  }

  remove(position: number) {
    if (!this.data[position].required) {
      this.data = this.data.filter((_, index) => index !== position)
    }
  }
}
</script>

<style lang="scss" scoped>
.w-90 {
  width: 110%;
}
.min-width-200 {
  min-width: 200px;
}
</style>
