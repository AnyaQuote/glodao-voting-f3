<template>
  <v-dialog :value="dialog" max-width="625" persistent>
    <v-sheet class="pa-6 neutral-100">
      <!-- header -->
      <div class="d-flex justify-space-between mb-6">
        <div class="neutral0--text font-weight-bold" style="font-size: 18px">Edit pool information</div>
        <v-icon size="17" @click="close()">mdi-close</v-icon>
      </div>

      <!-- project name -->
      <div class="mb-0">
        <div class="neutral0--text font-weight-bold" style="font-size: 18px">Project name</div>
        <app-text-field
          :rules="[$rules.required]"
          :value="vm.projectNameTemp"
          @input="vm.onProjectNameChange"
        ></app-text-field>
      </div>

      <!-- short description -->
      <div class="mb-0">
        <div class="neutral0--text font-weight-bold" style="font-size: 18px">Short description</div>
        <app-textarea
          :rules="[$rules.required]"
          :value="vm.shortDescriptionTemp"
          @input="vm.onShortDescriptionChange"
        ></app-textarea>
      </div>

      <!-- project avatar -->
      <div class="mb-4">
        <div class="neutral0--text font-weight-bold" style="font-size: 18px">Project avatar</div>
        <image-upload-file dense :value="vm.projectLogoTemp" @change="vm.onProjectLogoChange" />
      </div>

      <!-- project cover -->
      <div class="mb-4">
        <div class="neutral0--text font-weight-bold" style="font-size: 18px">Project cover</div>
        <image-upload-file dense :value="vm.projectCoverTemp" @change="vm.onProjectCoverChange" />
      </div>

      <!-- project fields -->
      <div class="mb-5">
        <div class="neutral0--text font-weight-bold" style="font-size: 18px">Field of project</div>
        <div class="neutral-10--text">Sellect some keyword about your project</div>
        <v-chip-group multiple> </v-chip-group>
        <div class="d-flex flex-wrap">
          <v-sheet
            v-for="(field, index) in fields"
            :key="index"
            color="text-uppercase text-caption rounded-pill mr-2  pa-2 cursor-pointer"
            height="32"
            style="line-height: 130%"
            :class="activeIndex.includes(index) ? 'blue white--text ' : 'neutral20 neutral10--text'"
            @click="addActive(index)"
          >
            {{ field }}
          </v-sheet>
        </div>
      </div>

      <!-- social links -->
      <div class="mb-0">
        <div class="neutral0--text font-weight-bold" style="font-size: 18px">Website and social link</div>
        <div
          v-for="(key, i) in $_keys(vm.socialLinksTemp)"
          :key="i"
          class="py-3 px-4 rounded d-flex"
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
            :value="vm.socialLinksTemp[key]"
            @input="vm.onSocialLinkChange(key, $event)"
          ></v-text-field>
          <v-icon size="20" color="neutral10"> mdi-link</v-icon>
        </div>
      </div>

      <v-btn
        class="linear-blue--bg text-none text-subtitle-1 neutral100--text"
        height="40"
        elevation="0"
        block
        :loading="vm.saving"
        @click="save()"
      >
        Save
      </v-btn>
    </v-sheet>
  </v-dialog>
</template>

<script lang="ts">
import { ProjectDetailViewModel } from '@/modules/project/viewmodels/project-detail-viewmodel'
import { Observer } from 'mobx-vue'
import { Component, Inject, Ref, Vue } from 'vue-property-decorator'

@Observer
@Component({
  components: {
    'image-upload-file': () => import('@/components/image-upload-field.vue'),
  },
})
export default class extends Vue {
  @Inject() vm!: ProjectDetailViewModel
  dialog = false

  fields: string[] = ['finance', 'gaming', 'NFT', 'finance', 'finance', 'gaming']
  activeIndex: number[] = []

  open() {
    this.vm.setDefaultValue()
    this.setFieldActived()
    this.dialog = true
  }

  setFieldActived() {
    this.activeIndex = []
    this.vm.fieldsTemp?.forEach((field) => {
      const index = this.fields.indexOf(field)
      if (this.fields.indexOf(field) > -1) {
        this.activeIndex = [...this.activeIndex, index]
      }
    })
  }

  close() {
    if (this.vm.saving) return
    this.dialog = false
  }

  async save() {
    await this.vm.save()
    this.close()
  }

  addActive(index: number) {
    const include = this.activeIndex.includes(index)
    if (include) {
      this.activeIndex = this.activeIndex.filter((val) => val !== index)
    } else {
      this.activeIndex = [...this.activeIndex, index]
    }
    let fields: string[] = []
    this.activeIndex.forEach((index) => {
      fields = [...fields, this.fields[index]]
    })
    this.vm.onFieldChange(fields)
  }
}
</script>

<style scoped></style>
