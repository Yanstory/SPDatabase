<script setup>
import { ref } from 'vue';
import { getIsMobile } from '../util/display.js';
import { setSetting } from '../util/setting.js'
import { getNews } from '../util/bulletin.js'
import dynDom from './core/dynDom.vue'

const show = ref(false);

const mobile = getIsMobile();

const newsData = getNews();

function switchDialog() {
  show.value = !show.value;
  if (show.value) {
    setSetting('lastNewsViewTime', Date.now())
  }
}

function openPRTSlink(link) {
  window.open('https://prts.wiki/w/' + link, '_blank');
}

function openLink(link) {
  window.open(link, '_blank');
}

defineExpose({
  switchDialog,
});
</script>

<template>
  <v-dialog v-model="show" width="auto" scrollable :fullscreen="mobile">
    <v-card max-width="800" border="white sm">
      <v-card-title class="d-flex align-center" style="background:linear-gradient(#08090c, #2e2c29);">
        <v-icon icon="mdi-message-alert mr-1" size="small"/>公告板
      </v-card-title>
      <v-card-text class="d-flex flex-column ga-2" style="height: 100%;">
        <v-card v-for="(news, index) in newsData" :key="index" variant="tonal">
          <v-card-title class="bg-primary pa-0">
            <v-chip label class="ma-2" color="white" prepend-icon="mdi-bullhorn-variant">
              {{ news.date }}
            </v-chip>
          </v-card-title>
          <v-card-text class="pa-5">
            <p v-for="line in news.message">
              <dynDom :content="line" />
            </p>
          </v-card-text>
        </v-card>
      </v-card-text>
      <v-card-actions class="bg-surface-light">
        <v-btn
          prepend-icon="mdi-check-circle"
          text="已阅"
          @click="switchDialog"
        >
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
