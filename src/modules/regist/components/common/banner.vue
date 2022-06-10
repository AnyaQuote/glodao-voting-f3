<template>
  <v-img max-height="330" :src="require(`@/assets/images/regist/banner.${$vuetify.theme.dark ? 'dark' : 'light'}.png`)">
    <div class="container-custom mx-auto fill-height text-center py-13 py-md-16 px-4">
      <div class="font-weight-bold mb-2" :class="$vuetify.breakpoint.mobile ? 'text-h5' : 'font-64'">
        Apply your project
      </div>
      <div class="neutral-10--text font-weight-400" :class="$vuetify.breakpoint.mobile ? 'text-subtitle-2' : 'text-h5'">
        The GloDAO investor will evaluate based on objective merits and vote on your application for launch on GloDAO.
        Each GloDAO investor has the right to vote based on their stake, will cast their vote, and projects having
        greater than 50% of the vote YES are approved for launch. The project will launch according to your setting in
        the application.
      </div>
    </div>
  </v-img>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class RegistBanner extends Vue {}
</script>

<style lang="scss" scoped>
.container-custom {
  max-width: 995px;
}
.font-64 {
  font-size: 64px;
  line-height: 84px;
}
</style>
