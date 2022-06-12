<template>
  <div>
    <!-- --------------------------------------------- SOCIAL LINK INPUTS --------------------------------------------- -->
    <v-sheet v-for="(prop, index) in data" :key="index" class="row ma-0 pa-0 d-flex rounded">
      <!-- ==== Type select ==== -->
      <app-select
        class="col-3 rounded-r-0"
        :items="platforms"
        :value="prop.type"
        :rules="[$rules.required]"
        @change="onChange(index, 'type', $event)"
        placeholder="Choose platform"
      >
        <template v-slot:selection="{ item }">
          <v-icon color="blue-diversity" class="mr-3">{{ $_get(icons, item) }}</v-icon>
          <span class="text-truncate text-subtitle-1 neutral-10--text text-capitalize">{{ item }}</span>
        </template>
        <template v-slot:item="{ item }">
          <v-icon color="blue-diversity" class="mr-3">{{ $_get(icons, item) }}</v-icon>
          <span class="text-subtitle-1 neutral10--text text-capitalize">{{ item }}</span>
        </template>
      </app-select>
      <!-- ==== Link input ==== -->
      <app-text-field
        class="col-9 rounded-l-0"
        :value="prop.link"
        @change="onChange(index, 'link', $event)"
        :rules="[$rules.required, $rules.url]"
        placeholder="Enter link"
      >
        <template v-slot:append>
          <v-hover v-slot="{ hover }">
            <v-icon v-if="hover" color="error" @click="remove(index)">mdi-close</v-icon>
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
import { set } from 'lodash-es'

interface LinkInput {
  type?: string
  link?: string
  required?: boolean
}

const defaultLinks = {
  website: '',
  telegram: '',
  twitter: '',
  discord: '',
  whitepaper: '',
}

const INPUT_MODE = 'input'
const OUTPUT_MODE = 'output'

@Observer
@Component
export default class SocialLinkFields extends Vue {
  @Prop({ required: true }) value!: any
  readonly platforms = [
    'website',
    'reddit',
    'facebook',
    'twitter',
    'discord',
    'youtube',
    'telegram',
    'whitepaper',
    'others',
  ]
  readonly icons = {
    website: 'fas fa-globe',
    reddit: 'fab fa-reddit',
    facebook: 'fab fa-facebook',
    twitter: 'fab fa-twitter',
    discord: 'fab fa-discord',
    telegram: 'fab fa-telegram',
    youtube: 'fab fa-youtube',
    whitepaper: 'fas fa-file-alt',
    others: 'fas fa-link',
  }

  data: LinkInput[] = []

  mounted() {
    this.data = this.mapping(INPUT_MODE, this.value || defaultLinks, true)
  }

  mapping(mode: string, obj: any, required = false) {
    return mode === INPUT_MODE
      ? Object.entries(obj).reduce(
          (acc: any, current) => [...acc, { type: current[0], link: current[1], required }],
          []
        )
      : obj.reduce((acc: any, current: LinkInput) => {
          return current.type ? { ...acc, [current.type]: current.link } : acc
        }, {})
  }

  onChange(index, property: string, value: string) {
    set(this.data[index], property, value)
    this.$emit('change', this.mapping(OUTPUT_MODE, this.data))
  }

  add() {
    if (this.data.length < 6) {
      this.data = [...this.data, { type: '', link: '', required: false }]
    }
  }

  remove(position: number) {
    if (this.data.length > 1 && !this.data[position].required) {
      this.data = this.data.filter((_, index) => index !== position)
    }
  }
}
</script>

<style lang="scss" scoped></style>
