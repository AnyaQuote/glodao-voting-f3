<template>
    <v-row class="mb-120">
        <v-col cols="12">
            <v-img src="@/assets/images/new-project--banner.png" />
        </v-col>
        <v-col cols="12">
            <v-sheet elevation="3" class="d-flex flex-column align-center py-9 rounded neutral100--bg">
                <div class="text-h6 font-weight-bold mb-6">Are you applying your project using connected wallet address?</div>
                <v-sheet class="py-6 px-16 mb-6 rounded d-flex align-center neutral100--bg" outlined>
                    <span class="bluePrimary--text font-weight-bold mr-2 text-h6">0xcA41405fB875753371D0FAf6e18891d87A7139Ce</span>
                    <v-icon large>mdi-cached</v-icon>
                </v-sheet>
                <v-btn class="linear-blue--bg text-none white--text mb-6 px-13" height="48">Confirm</v-btn>
                <div class="neutral10--text">If not, change your connected wallet you want to apply!</div>
            </v-sheet>
            <div class="mt-14">
            <div class="font-weight-bold mb-4">Pool owner address has notes:</div>
            <ul class="mb-4">
                <li>Only pool owner address can update pool.</li>
                <li>Pool owner address will send token and pay fee when creating pool.</li>
            </ul>
            <div>
                <span class="bluePrimary--text">Learn more</span>
                <v-icon>mdi-chevron-right</v-icon>
            </div>
            </div>
        </v-col>
        <v-col cols="12">
            <div class="text-h6 text-center mb-9">What type of project do you want to launch on GLoDAO?</div>
            <div class="row">
                <div class="col-6">
                    <v-sheet class="d-flex flex-column px-6 pb-6 rounded-lg pt-72" elevation="3">
                        <v-avatar>
                            <v-img src="@/assets/icons/bulleyes.svg"/>
                        </v-avatar>
                        <div class="text-h6">Bounty Hunter</div>
                        <div class="text-subtitle-1 font-weight-thin">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.</div>
                    </v-sheet>
                </div>
                <div class="col-6">
                    <v-sheet class="d-flex flex-column px-6 pb-6 rounded-lg pt-72" elevation="3">
                        <v-avatar>
                            <v-img src="@/assets/icons/bulleyes.svg"/>
                        </v-avatar>
                        <div class="text-h6">Bounty Hunter</div>
                        <div class="text-subtitle-1 font-weight-thin">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.</div>
                    </v-sheet>
                </div>
            </div>
        </v-col>
    </v-row>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
    export default class ProjectRegist extends Vue {
        
    }
</script>

<style lang="scss" scoped>
.mb-120 {
    margin-bottom: em(120);
}
.pt-72 {
    padding-top: em(72);
}
</style>