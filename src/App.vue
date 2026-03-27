<script setup>
import { ref, computed, onMounted, mergeProps } from 'vue';
import { useUrlSearchParams } from '@vueuse/core'

import { getSetting } from './util/setting.js'
import { getNewsTime } from './util/bulletin.js'

import aboutDialog from './components/aboutDialog.vue';
import bulletinDialog from './components/bulletinDialog.vue';
import updateLogDialog from './components/updateLogDialog.vue';
import helpDialog from './components/helpDialog.vue';

import { SP_SEASON, getSPDatabase, findSeasonNo } from './util/SPData.js';
import filterSelector from './components/core/filter.vue';
import charPanel from './components/charPanel.vue';

import { getIsMobile } from './util/display.js';
import { useGoTo } from 'vuetify';

const route = useUrlSearchParams('history')

const goTo = useGoTo();

const mobile = getIsMobile();

const abD = ref();
const blD = ref();
const uLD = ref();
const hlD = ref();
const flS = ref();

const appbarMenu = ref([
  {
    icon: 'mdi-view-grid',
    text: '切换列表布局',
    action: () => switchOpDisplayMode(),
  },
  {
    icon: 'mdi-help-box',
    text: '帮助',
    action: () => hlD.value?.switchDialog(),
  },
  {
    icon: 'mdi-timeline-clock',
    text: '更新履历',
    action: () => uLD.value?.switchDialog(),
    dynamic: {
      type: 'red-dot',
      condition: () => getSetting('curVersion') != getSetting('lastVisitedVersion')
    }
  },
  {
    icon: 'mdi-message-alert',
    text: '公告板',
    action: () => blD.value?.switchDialog(),
    dynamic: {
      type: 'red-dot',
      condition: () => !getSetting('lastNewsViewTime') || getSetting('lastNewsViewTime') < getNewsTime()
    }
  },
  {
    icon: 'mdi-information-box-outline',
    text: '关于',
    action: () => abD.value?.switchDialog(),
  },
]);
const checkMenuUnread = function() {
  let isUnread = false
  appbarMenu.value.forEach((item) => {
    if (item.dynamic) {
      isUnread = isUnread || item.dynamic.condition()
    }
  })
  return isUnread
}

//Database
const seasonNo = ref(1);
const rawDatabase = ref({});
const seasonDropDown = computed(() => {
  return Object.values(SP_SEASON).map((s) => {
    return {
      title: s.menuitem.text,
      icon: s.menuitem.icon,
      subtext: s.menuitem.subtext,
      routeName: s.routeName
    };
  });
});
const getSeasonMenuItem = function () {
  return SP_SEASON[seasonNo.value.toString()].menuitem;
};
const opDisplayModeIsGrid = ref(false);

const filtedOpList = computed(() => {
  let res = [];

  let selectRule = flS.value?.filterOptions?.selectRule || [];
  let selectItems = flS.value?.filterOptions?.selectItems || [];
  let result = rawDatabase.value;
  let opList = result?.opList;

  //console.log('selectRule', selectRule);
  //console.log('selectItems', selectItems);
  //console.log('result', result);
  //console.log('opList', opList);

  if (opList) {
    Object.keys(opList).forEach((oid) => {
    let charChess = opList[oid].chess;
    let acc = [true, true];

    selectRule.forEach((rule, index) => {
      let SI = selectItems[index] || [];
      if (SI.length > 0) {
        if (rule == 0 || rule == 2) {
          charChess.forEach((c, i) => {
            let valueToVerify = result.filterRuleSet[index].valueToVerify(c);
            acc[i] = acc[i] && SI.every((e) => valueToVerify.includes(e));
            //console.log(oid, i, SI, valueToVerify);
          });
        } else if (rule == 1) {
          charChess.forEach((c, i) => {
            let valueToVerify = result.filterRuleSet[index].valueToVerify(c);
            acc[i] = acc[i] && SI.some((e) => valueToVerify.includes(e));
          });
        }
      }
    });

    if (acc[0] || acc[1]) {
      res.push(oid);
    }
  });
  }

  //console.log(res);
  return res;
});

//action
const switchSeasonDatabase = function (i) {
  if (seasonNo.value != i + 1) {
    flS.value?.removeAllItems();
    seasonNo.value = i + 1;
    if (seasonNo.value == 1) {
      route.season = null
    } else {
      route.season = SP_SEASON[seasonNo.value].routeName
    }
    refreshDatabase();
  }
};
const refreshDatabase = async function () {
  rawDatabase.value = await getSPDatabase(seasonNo.value);
};
const goToTop = function () {
  goTo(0, {
    container: 'html',
    duration: 300,
    easing: 'easeInOutCubic',
    offset: 0,
  });
};
const switchOpDisplayMode = function () {
  opDisplayModeIsGrid.value = !opDisplayModeIsGrid.value
  if (opDisplayModeIsGrid.value) {
    route.grid = 'true'
  } else {
    route.grid = null
  }
}

onMounted(async () => {
  const routeName = route.season
  if (routeName && routeName != "") {
    seasonNo.value = findSeasonNo(routeName)
  }
  const grid = route.grid
  if (grid) {
    opDisplayModeIsGrid.value = true
  }
  refreshDatabase();
});
</script>

<template>
  <v-app id="inspire">
    <!--顶栏-->
    <v-app-bar class="bg-primary">
      <v-app-bar-title>
        <span class="hidden-sm-and-down">
          卫戍协议&nbsp;
          <span class="font-weight-thin">盟约·特质查询</span>
        </span>
        <span class="d-flex d-md-none" style="font-size: 0.9em">
          卫戍盟约·特质&nbsp;
          <span class="font-weight-thin">查询</span>
        </span>
      </v-app-bar-title>

      <v-menu location="bottom right" transition="slide-y-transition">
        <template v-slot:activator="{ props: menu }">
          <v-tooltip location="left">
            <template v-slot:activator="{ props: tooltip }">
              <v-btn
                v-bind="mergeProps(menu, tooltip)"
                :prepend-icon="getSeasonMenuItem().icon"
                :text="getSeasonMenuItem().text"
                variant="tonal"
              >
              </v-btn>
            </template>
            <span>选择活动期</span>
          </v-tooltip>
        </template>

        <v-list>
          <v-list-item
            v-for="(item, index) in seasonDropDown"
            :key="index"
            :value="index"
            @click="switchSeasonDatabase(index)"
            density="compact"
            :class="[seasonNo == index + 1 ? 'bg-primary' : '']"
            :lines="seasonNo == index + 1 ? 'two' : false"
          >
            <template #prepend>
              <v-icon v-if="seasonNo == index + 1" icon="mdi-check-circle" />
              <v-icon v-else :icon="item.icon" />
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
            <v-list-item-subtitle class="text-caption" v-if="seasonNo == index + 1">{{ item.subtext }}<br>({{ item.routeName }})</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-sheet class="bg-transparent" v-if="!mobile">
        <v-btn icon v-for="btn in appbarMenu" @click="btn.action">
          <v-icon v-if="!btn.dynamic" :icon="btn.icon" />
          <v-badge v-else-if="btn.dynamic && btn.dynamic.type=='red-dot'"
            :class="btn.dynamic.condition() ? 'red-dot' : ''"
            location="top right" :color="btn.dynamic.condition() ? '#f48686' : 'transparent'"
            floating dot>
            <v-icon :icon="btn.icon" />
          </v-badge>
          <v-tooltip activator="parent" location="bottom">{{
            btn.text
          }}</v-tooltip>
        </v-btn>
      </v-sheet>

      <v-menu v-if="mobile">
        <template v-slot:activator="{ props }">
          <v-btn icon variant="text" v-bind="props">
            <v-badge
              :class="checkMenuUnread() ? 'red-dot' : ''"
              location="top right" :color="checkMenuUnread() ? '#f48686' : 'transparent'"
              floating dot>
              <v-icon icon="mdi-dots-vertical" />
            </v-badge>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="(btn, i) in appbarMenu"
            :key="i"
            :value="i"
            @click="btn.action"
          >
            <template #prepend>
              <v-icon :icon="btn.icon" />
            </template>
            <template #append>
              <v-badge v-if="btn.dynamic && btn.dynamic.type=='red-dot' && btn.dynamic.condition()"
                color="#f48686"
                content="NEW"
                inline
              ></v-badge>
            </template>
            <v-list-item-title>{{ btn.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <aboutDialog ref="abD" />
      <bulletinDialog ref="blD" />
      <updateLogDialog ref="uLD" />
      <helpDialog ref="hlD" />
    </v-app-bar>
    <!--主内容-->
    <v-main class="position-relative">
      <!--过滤器-->
      <v-sheet class="top-1 w-100 bg-transparent">
        <filterSelector
          v-if="rawDatabase.filterRuleSet"
          :filters="rawDatabase.filterRuleSet"
          ref="flS"
        />
        <v-divider />
        <!--
        <v-btn
          :icon="flS?.showPanel ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          color="primary"
          :size="mobile ? 'x-small' : 'small'"
          :class="[
            'float-right mr-5 mr-md-10',
            flS?.showPanel ? '' : 'opacity-70',
          ]"
          style="bottom: -50%; transform: translateY(-50%)"
          @click="flS.switchPanel()"
        >
        </v-btn>
        -->
      </v-sheet>
      <!--干员列表-->
      <v-sheet class="pt-2">
        <v-table
          :hover="opDisplayModeIsGrid ? false : true"
          class="mx-auto"
          density="compact"
          :style="{ width: mobile ? '100%' : '90%' }"
        >
          <tbody v-if="!opDisplayModeIsGrid">
            <charPanel
              v-for="(char, index) in rawDatabase.opList"
              :isShow="filtedOpList.includes(index)"
              :char="char"
              :isGird="false"
            />
            <tr v-if="filtedOpList.length == 0">
              <td>
                <v-sheet class="d-flex flex-column align-center pt-7 pb-7">
                  <v-icon icon="mdi-account-question-outline" size="150px" color="grey-darken-2"/>
                  <i class="pt-4">什么也没有……</i>
                </v-sheet>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-if="filtedOpList.length != 0">
              <td rowspan="2" :style="{ width: mobile ? '100px' : '160px' }" class="pa-0">
                <v-container class="px-0">
                  <v-row no-gutters>
                    <template v-for="(char, index) in rawDatabase.opList" :key="index">
                      <v-col
                        v-if="filtedOpList.includes(index)"
                        :cols="mobile ? 2 : 1"
                        sm="1"
                      >
                        <v-sheet :class="mobile ? 'mt-1 mb-2 text-center' : 'ma-1'">
                          <charPanel
                            :isShow="filtedOpList.includes(index)"
                            :char="char"
                            :isGird="true"
                          />
                        </v-sheet>
                      </v-col>
                    </template>
                  </v-row>
                </v-container>
              </td>
            </tr>
            <tr v-else>
              <td>
                <v-sheet class="d-flex flex-column align-center pt-7 pb-7">
                  <v-icon icon="mdi-account-question-outline" size="150px" color="grey-darken-2"/>
                  <i class="pt-4">什么也没有……</i>
                </v-sheet>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-sheet>
    </v-main>
    <v-footer
      color="surface-light"
      height="48"
      app
      location="bottom"
      class="justify-space-between"
    >
      <div class="text-center">
        {{ new Date().getFullYear() }} — <strong>PRTS.WIKI</strong>
      </div>
      <div v-if="filtedOpList && rawDatabase">
        {{
          `${filtedOpList.length} / ${Object.keys(rawDatabase?.opList || {}).length}`
        }}
        <v-btn
          @click="goToTop"
          density="comfortable"
          color="#fff"
          variant="tonal"
          icon="mdi-download mdi-flip-v"
          class="ml-1"
        >
        </v-btn>
      </div>
    </v-footer>
  </v-app>
</template>

<style scoped>

.red-dot :deep(.v-badge__badge)  {
  animation: shine-ripple infinite ease-out 2s;
}

@keyframes shine-ripple {
  0% {
    outline: 0px solid rgba(255, 255, 255, 0.534);
  }

  50% {
    outline: 20px solid #fff0;
  }

  100% {
    outline: 20px solid #fff0;
  }
}
</style>
