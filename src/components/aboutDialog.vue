<script setup>
import { ref } from 'vue';
import { getIsMobile } from '../util/display.js';
import { DEV_LIST } from '../util/const.js';
import { getPublicImg } from "../util/general.js"
import devCard from './core/devCard.vue';

const show = ref(false);

const mobile = getIsMobile();

const showSupport = ref(false);
const supportTab = ref(null);

const showOpenSrc = ref(false);

function switchDialog() {
  show.value = !show.value;
}

function switchSupport() {
  showSupport.value = !showSupport.value;
}

function switchOpenSrc() {
  showOpenSrc.value = !showOpenSrc.value;
}

const openSrcItems = [
  {
    title: 'Vite',
    license: 'MIT License',
    link: 'https://github.com/vitejs/vite',
  },
  {
    title: 'Vue.js',
    license: 'MIT License',
    link: 'https://github.com/vuejs/',
  },
  {
    title: 'Vuetify',
    license: 'MIT License',
    link: 'https://github.com/vuetifyjs/vuetify',
  },
];

function openPRTSLink(link) {
  window.open(`https://prts.wiki${link ? '/w/' + link : ''}`, '_blank');
}

function openLink(link) {
  window.open(link, '_blank');
}

defineExpose({
  switchDialog,
});
</script>

<template>
  <!--about-->
  <v-dialog v-model="show" width="600" scrollable :fullscreen="mobile">
    <v-card max-width="100%">
      <v-card-title class="bg-primary d-flex align-center">
        <v-icon icon="mdi-information-box-outline mr-1" size="small" /> 关于
      </v-card-title>
      <v-card-text class="d-flex flex-column ga-2" style="height: 100%">
        <div>
          <p>卫戍协议 盟约·特质查询</p>
          <p class="text-body-2 text-medium-emphasis">v0.01_dev</p>
        </div>
        <devCard :dev="DEV_LIST.enko" />
        <devCard :dev="DEV_LIST.mcak" />
        <v-card class="mx-auto" width="100%" color="#fff" variant="outlined">
          <template v-slot:text>
            <p>本页面及其源代码为PRTS贡献的一部分。</p>
            <p class="text-body-2 text-medium-emphasis">
              This page (including the source codes) is a part of contributions
              in PRTS.
            </p>
            <p class="mt-3">
              部分内容所使用的游戏图片、动画、音频、文本原文，仅用于更好地表现游戏资料，其版权属于上海鹰角网络科技有限公司及其关联公司。
            </p>
            <p class="text-body-2 text-medium-emphasis">
              Part of used images, animations, audio and original texts, are
              used solely for better presentation of game materials.<br />
              Copyright © HYPERGRYPH and its related companies.
            </p>
          </template>
        </v-card>
        <v-btn
          prepend-icon="mdi-file-code"
          text="许可"
          spaced="end"
          append-icon="$next"
          @click="
            () => {
              switchDialog();
              switchOpenSrc();
            }
          "
          color="blue-darken-4"
        >
        </v-btn>
        <v-btn
          prepend-icon="mdi-heart"
          text="支持我们"
          spaced="end"
          append-icon="$next"
          @click="
            () => {
              switchDialog();
              switchSupport();
            }
          "
          color="pink"
        >
        </v-btn>
      </v-card-text>
      <v-card-actions>
        <div>
          <v-btn
            prepend-icon="mdi-check-circle"
            text="确定"
            @click="switchDialog"
          >
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!--support-->
  <v-dialog v-model="showSupport" width="800" scrollable :fullscreen="mobile">
    <v-card width="100%">
      <v-card-title class="bg-pink-darken-3 d-flex align-center">
        <v-icon icon="mdi-heart mr-1" /> 支持我们
      </v-card-title>
      <v-card-text class="d-flex flex-column ga-2 pa-0" style="height: 100%">
        <v-tabs bg-color="pink-lighten-2" v-model="supportTab" fixed-tabs>
          <v-tab prepend-icon="mdi-hexagon-slice-6" value="0">支持PRTS</v-tab>
          <v-tab prepend-icon="mdi-account-group" value="1">支持开发人员</v-tab>
        </v-tabs>
        <v-tabs-window v-model="supportTab">
          <v-tabs-window-item value="0">
            <v-sheet class="pa-5 d-flex align-center flex-column">
              <v-badge
                location="bottom right"
                color="pink"
                class="mb-5"
                height="35"
                width="35"
                :offset-x="17"
                :offset-y="22"
              >
                <v-img :src="getPublicImg('/staff/mcak.png')" :width="100"></v-img>
                <template v-slot:badge>
                  <v-sheet class="d-flex align-center bg-transparent">
                    <v-icon icon="mdi-heart" size="20"></v-icon>
                  </v-sheet>
                </template>
              </v-badge>

              <div :class="[mobile ? 'd-flex flex-column align-center' : '']">
                前往
                <v-btn
                  prepend-icon="mdi-heart"
                  text="PRTS:如何帮助我们完善网站"
                  @click="openPRTSLink('PRTS:如何帮助我们完善网站')"
                  color="primary"
                  class="mx-2"
                >
                  PRTS:如何帮助我们完善网站
                </v-btn>
                了解如何支持PRTS的运营与开发。
              </div>
            </v-sheet>
          </v-tabs-window-item>
          <v-tabs-window-item value="1">
            <v-sheet class="pa-5">
              <p>
                如果您想要直接感谢本查询系统的开发人员，您也可以通过以下链接访问各开发人员的个人页面，并通过其提供的方式来支持。
              </p>
              <v-card
                class="mx-auto"
                width="100%"
                color="#fff"
                variant="outlined"
              >
                <template v-slot:text>
                  <span class="mdi mdi-information"></span>
                  注意：PRTS的内容建设离不开每位编辑者与开发者的辛勤付出，但这里仅代表其个人，您在此处的支持也仅代表您对个人开发者的支持。
                </template>
              </v-card>
              <v-sheet class="mt-2">
                <devCard :dev="DEV_LIST.enko" mode="donate" />
              </v-sheet>
            </v-sheet>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
      <v-card-actions class="bg-surface-light">
        <v-btn
          prepend-icon="mdi-check-circle"
          text="确定"
          @click="switchSupport"
        >
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!--3rd party-->
  <v-dialog v-model="showOpenSrc" width="600" scrollable :fullscreen="mobile">
    <v-card max-width="100%">
      <v-card-title class="bg-blue-darken-4 d-flex align-center">
        <v-icon icon="mdi-file-code mr-1" size="small" />
        开源许可
      </v-card-title>
      <v-card-text class="d-flex flex-column ga-2" style="height: 100%">
        <v-list lines="two">
          <v-list-item
            v-for="(item, index) in openSrcItems"
            :key="index"
            :title="item.title"
            :subtitle="item.license"
            @click="openLink(item.link)"
          ></v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions class="bg-surface-light">
        <v-btn
          prepend-icon="mdi-check-circle"
          text="确定"
          @click="switchOpenSrc"
        >
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.v-btn {
  text-transform: unset;
}

:deep(.v-badge__badge) {
  animation: shine-ripple infinite ease-out 2s;
  border-radius: 50%;
}

@keyframes shine-ripple {
  0% {
    outline: 0px solid #fff9;
  }

  50% {
    outline: 15px solid #fff0;
  }

  100% {
    outline: 15px solid #fff0;
  }
}
</style>
