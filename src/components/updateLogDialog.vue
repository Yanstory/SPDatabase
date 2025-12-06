<script setup>
import { ref } from 'vue';
import { getIsMobile } from '../util/display.js';

const show = ref(false);

const mobile = getIsMobile();

function switchDialog() {
  show.value = !show.value;
}

const items = [
  {
    current: true,
    color: 'primary',
    icon: 'mdi-play',
    title: 'ver 0.01_dev',
    content: [
      {
        type: 'param',
        text: '开发版本',
      },
      {
        type: 'list',
        text: ['基础UI、功能、框架建设', '适配数据库读取', '适配活动期：盟约'],
      },
    ],
  },
  {
    color: 'primary',
    icon: 'mdi-autorenew mdi-spin',
    title: '持续更新中……',
    content: null,
  },
];

defineExpose({
  switchDialog,
});
</script>

<template>
  <v-dialog v-model="show" width="850" scrollable :fullscreen="mobile">
    <v-card width="100%">
      <v-card-title class="bg-primary d-flex align-center">
        <v-icon icon="mdi-timeline-clock mr-2" size="small"/> 更新履历
      </v-card-title>
      <v-card-text class="d-flex flex-column ga-2" style="height: 100%;">
        <v-timeline align="start" truncate-line="start" class="justify-left" side="end">
          <v-timeline-item
            v-for="(item, index) in items"
            :key="index"
            :dot-color="item.current ? 'primary-light' : item.color"
            size="small"
            :icon="item.current ? 'mdi-map-marker' : item.icon"
            :icon-color="item.current ? 'primary' : ''"
            fill-dot
            width='100%'
            hide-opposite
            :class="[item.current ? 'current' : '']"
          >
            <v-card>
              <v-card-title :class="[`bg-${item.current ? 'primary-light' : item.color}`, `text-${item.current ? 'primary' : ''}`]">
                <v-chip v-if="item.current" label color="primary" variant="elevated">
                  当前
                </v-chip>
                {{ item.title }}
              </v-card-title>
              <v-card-text class="pa-5" v-if="!!item.content">
                <p v-for="log in item.content">
                  <span v-if="log.type === 'param'">{{ log.text }}</span>
                  <ul v-if="log.type === 'list'" class="ml-5">
                    <li v-for="text in log.text" density="compact">
                      {{ text }}
                    </li>
                  </ul>
                </p>
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-card-text>
      <v-card-actions class="bg-surface-light">
        <v-btn
          prepend-icon="mdi-check-circle"
          text="确定"
          @click="switchDialog"
        >
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.justify-left {
  grid-template-columns: 0px min-content auto !important;
}

.current :deep(.v-timeline-divider__dot)  {
  animation: shine-ripple infinite ease-out 2s;
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
