<template>
  <v-dialog :value="dialog" max-width="625" persistent>
    <v-sheet class="pa-6">
      <!-- header -->
      <div class="d-flex justify-space-between mb-7">
        <div class="neutral0--text font-weight-bold mb-2" style="font-size: 18px">Edit pool information</div>
        <v-icon size="17" @click="close()">mdi-close</v-icon>
      </div>

      <!-- project name -->
      <div class="mb-7">
        <div class="neutral0--text font-weight-bold mb-2" style="font-size: 18px">Edit pool information</div>
        <v-text-field
          dense
          solo
          flat
          hide-details
          height="46"
          outlined
          color="red"
          class="font-weight-bold"
          :value="vm.poolDetail.projectName"
          @input="vm.inputProjectName($event)"
        ></v-text-field>
      </div>

      <!-- short description -->
      <div class="mb-7">
        <div class="neutral0--text font-weight-bold mb-2" style="font-size: 18px">Short description</div>
        <v-textarea
          hide-details
          outlined
          no-resize
          row-height="4"
          :value="vm.poolDetail.data.shortDescription"
          @input="vm.inputShortDescription($event)"
        ></v-textarea>
      </div>

      <!-- project avatar -->
      <div class="mb-7">
        <div class="neutral0--text font-weight-bold mb-2" style="font-size: 18px">Project avatar</div>
        <image-upload-file />
      </div>

      <!-- project cover -->
      <div class="mb-7">
        <div class="neutral0--text font-weight-bold mb-2" style="font-size: 18px">Project cover</div>
        <image-upload-file />
      </div>

      <!-- project fields -->
      <div class="mb-5">
        <div class="neutral0--text font-weight-bold mb-2" style="font-size: 18px">Field of project</div>
        <div class="neutral-10--text">Sellect some keyword about your project</div>
        <v-chip-group multiple> </v-chip-group>
        <div class="d-flex flex-wrap">
          <v-sheet
            v-for="(field, index) in fields"
            :key="index"
            color="text-uppercase text-caption rounded-pill mr-2 mb-2 pa-2 cursor-pointer"
            height="32"
            style="line-height: 130%"
            :class="active.includes(index) ? 'blue white--text ' : 'neutral20 neutral10--text'"
            @click="addActive(index)"
          >
            {{ field }}
          </v-sheet>
        </div>
      </div>

      <!-- social links -->
      <div class="mb-7">
        <div class="neutral0--text font-weight-bold mb-2" style="font-size: 18px">Website and social link</div>
        <div
          v-for="(key, i) in $_keys(vm.poolDetail.data.socialLinks)"
          :key="i"
          class="py-3 px-4 rounded d-flex mb-2"
          style="border: 1px solid var(--v-neutral20-base)"
        >
          <v-sheet width="126" class="d-flex align-center">
            <img :src="require(`@/assets/socials/${key}.light.svg`)" width="24" height="24" class="mr-2" />
            <div class="text-subtitle-2 text-capitalize" style="line-height: 150%">{{ key }}</div>
          </v-sheet>
          <v-sheet width="1px" color="mr-4" style="border-left: 1px solid var(--v-neutral20-base)"></v-sheet>
          <v-text-field
            height="30"
            dense
            solo
            flat
            hide-details
            class="text-subtitle-1 spacer input-min-height"
            :value="vm.poolDetail.data.socialLinks[key]"
            @input="vm.inputSocialLinks(key, $event)"
          ></v-text-field>
          <v-icon size="20" color="neutral10"> mdi-link</v-icon>
        </div>
      </div>

      <v-btn class="linear-blue--bg text-none text-subtitle-1 neutral100--text" height="40" elevation="0" block>
        Save
      </v-btn>
    </v-sheet>
  </v-dialog>
</template>

<script lang="ts">
import { ProjectDetailViewModel } from '@/modules/project/viewmodels/project-detail-viewmodel'
import { Observer } from 'mobx-vue'
import { Component, Inject, Vue } from 'vue-property-decorator'

@Observer
@Component({
  components: {
    'image-upload-file': () => import('@/components/image-upload-field.vue'),
  },
})
export default class extends Vue {
  dialog = false
  @Inject() vm!: ProjectDetailViewModel
  fields: string[] = ['finance', 'gaming', 'NFT', 'finance', 'finance', 'gaming']
  active: number[] = []

  open() {
    this.active = []
    const fields = this.vm.poolDetail?.data?.fields
    fields?.forEach((field) => {
      const index = this.fields.indexOf(field)
      if (index > -1) {
        this.active.push(index)
      }
    })
    this.dialog = true
  }

  close() {
    this.dialog = false
  }

  addActive(index: number) {
    const result = this.active.includes(index)
    if (result) {
      this.active = this.active.filter((val) => val !== index)
    } else {
      this.active.push(index)
    }
    let fields: string[] = []
    this.active.forEach((index) => fields.push(this.fields[index]))
    this.vm.updateFields(fields)
  }
}
</script>

<style scoped></style>
