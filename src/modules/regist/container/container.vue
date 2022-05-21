<template>
  <div>
    <v-img src="@/assets/images/regist/banner.png">
      <v-sheet width="1090" class="transparent--bg mx-auto fill-height d-flex flex-column justify-center text-center">
        <div class="font-64 font-weight-bold mb-2">Apply your project</div>
        <div class="neutral10--text text-h6 font-weight-400 text-center">
          The GloDAO investor will evaluate based on objective merits and vote on your application for launch on GloDAO.
          Each GloDAO investor has the right to vote based on their stake, will cast their vote, and projects having
          greater than 50% of the vote YES are approved for launch. The project will launch according to your setting in
          the application.
        </div>
      </v-sheet>
    </v-img>
    <v-container>
      <router-view></router-view>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class RegistContainer extends Vue {}
</script>

<style lang="scss" scoped>
.font-64 {
  font-size: 64px;
  line-height: 84px;
}
</style>
