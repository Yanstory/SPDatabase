<script setup>
import { ref } from 'vue';
import { getIsMobile } from '../util/display.js';
import { setSetting } from '../util/setting.js'
import { getNews, getYears } from '../util/bulletin.js'
import { groupNewsByYear } from '../util/bulletinGroup.js'
import dynDom from './core/dynDom.vue'

const TAB_LATEST = 'latest';
const TAB_ARCHIVE = 'archive';

// 折叠板的容量基准：并入后超出该条数时，该年份仍留在本板，从下一年开始另起一板
const PANEL_CAPACITY = 5;

const show = ref(false);

const mobile = getIsMobile();

// 公告数据以年份为键：{ '2026年': [{ date, message }, ...], '2025年': [...] }
const newsData = getNews();

// 年份降序，第一个即最新年份
const years = getYears();

const tab = ref(TAB_LATEST);

const curpanel = ref(undefined);

// 第一个分页：最新一年的公告
const latestYear = years[0] ?? null;

const latestNews = latestYear ? newsData[latestYear] : [];

// 第二个分页：往期公告，跳过最新一年，其余年份按“超出容量即断板（该年仍并入）”的规则合并
const pastPanels = groupNewsByYear(years.slice(1), newsData, PANEL_CAPACITY);

// 年份键形如“2026年”；若数据里写成纯数字，显示时补上“年”
function yearLabel(year) {
  return String(year).endsWith('年') ? String(year) : `${year}年`;
}

// 一个折叠板内合并了多个年份时，标题显示年份区间
function panelTitle(panel) {
  const newest = panel.years[0];
  const oldest = panel.years[panel.years.length - 1];
  return panel.years.length > 1 ? `${yearLabel(newest)} - ${yearLabel(oldest)}` : yearLabel(newest);
}

function switchDialog() {
  show.value = !show.value;
  if (show.value) {
    setSetting('lastNewsViewTime', Date.now())
  } else {
    tab.value = TAB_LATEST;
    curpanel.value = undefined;
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
  <v-dialog v-model="show" width="800" scrollable :fullscreen="mobile">
    <v-card width="100%" border="white sm">
      <v-card-title class="d-flex align-center" style="background:linear-gradient(#08090c, #2e2c29);">
        <v-icon icon="mdi-message-alert mr-1" size="small"/>公告板
      </v-card-title>
      <v-card-text class="d-flex flex-column ga-2 pa-0" style="min-height: 0;">
        <v-tabs v-model="tab" bg-color="grey-darken-4" color="white" fixed-tabs density='comfortable' class="flex-shrink-0">
          <v-tab :value="TAB_LATEST" prepend-icon="mdi-bullhorn-variant">最新公告</v-tab>
          <v-tab :value="TAB_ARCHIVE" prepend-icon="mdi-history">历史公告</v-tab>
        </v-tabs>
        <!-- 滚动容器：v-tabs-window 自带 overflow:hidden、又会被 flex 收缩，
             直接放在 column flex 里会把内容裁掉而不产生滚动条，故单独交给这一层滚动 -->
        <div class="flex-grow-1" style="min-height: 0; overflow-y: auto;">
          <v-tabs-window v-model="tab">
            <!-- 最新一年 -->
            <v-tabs-window-item :value="TAB_LATEST">
              <v-sheet class="pa-2 d-flex align-center flex-column">
                <div class="d-flex flex-column ga-2">
                  <v-card v-for="(news, index) in latestNews" :key="index" variant="tonal">
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
                </div>
              </v-sheet>
            </v-tabs-window-item>
            <!-- 往期公告：按年份折叠 -->
            <v-tabs-window-item :value="TAB_ARCHIVE">
              <v-sheet class="d-flex align-center flex-column">
                <v-expansion-panels v-if="pastPanels.length" variant="accordion" v-model="curpanel">
                  <v-expansion-panel
                    v-for="(panel, index) in pastPanels"
                    :key="index"
                    :value="index"
                  >
                    <v-expansion-panel-title :color="curpanel === index ? 'primary' : ''">
                      <div class="d-flex align-center ga-2 flex-grow-1">
                        <span>{{ panelTitle(panel) }}</span>
                        <v-spacer />
                        <span class="text-caption">{{ panel.count }} 条</span>
                      </div>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <div class="d-flex flex-column ga-2">
                        <template v-for="group in panel.groups" :key="group.year">
                          <v-card
                            v-for="(news, index) in group.list"
                            :key="`${group.year}-${index}`"
                            variant="tonal"
                          >
                            <v-card-title class="bg-primary pa-0 d-flex align-center flex-wrap">
                              <v-chip
                                v-if="panel.years.length > 1"
                                label
                                class="mr-0"
                                color="grey-lighten-2"
                                variant="text"
                              >
                                {{ yearLabel(group.year) }}
                              </v-chip>
                              <v-chip label class="ma-2 ml-0" color="white" prepend-icon="mdi-bullhorn-variant">
                                {{ news.date }}
                              </v-chip>
                            </v-card-title>
                            <v-card-text class="pa-5">
                              <p v-for="line in news.message">
                                <dynDom :content="line" />
                              </p>
                            </v-card-text>
                          </v-card>
                        </template>
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
                <div v-else class="d-flex flex-column align-center justify-center pa-8 text-medium-emphasis">
                  <v-icon icon="mdi-vanish" size="48" class="mb-2" />
                  <span>这里还没有记录</span>
                  <span class="text-caption">你该去卫了</span>
                </div>
              </v-sheet>
            </v-tabs-window-item>
          </v-tabs-window>
        </div>
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
