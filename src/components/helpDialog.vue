<script setup>
import { ref } from 'vue';
import { getIsMobile } from '../util/display.js';

const show = ref(false);

const mobile = getIsMobile();

function switchDialog() {
  show.value = !show.value;
  if (!show.value) {
    curpanel.value = undefined;
  }
}

function openPRTSlink(link) {
  window.open('https://prts.wiki/w/' + link, '_blank');
}

function openLink(link) {
  window.open(link, '_blank');
}

const items = [
  {
    title: '这是什么？',
    content: [
      {
        type: 'param',
        text: '这是一个便于查询【卫戍协议】中干员的盟约、特质等相关数据的系统。',
      },
    ],
    actions: [
      {
        icon: 'mdi-chess-rook',
        text: '关于 卫戍协议',
        action: () => openPRTSlink('卫戍协议'),
      },
    ],
  },
  {
    title: '如何使用？',
    content: [
    {
      type: 'param',
      text: '在右上角选择要查询的活动期后，再进行您所需要的查询。',
    },
    ],
    actions: null,
  },
  {
    title: '过滤器右侧的小图标按钮是什么？',
    content: [
    {
      type: 'param',
      text: '第一个绿色的是“并选规则”按钮，它会决定这个过滤器是否允许多选及处理多选的策略：',
    },
    {
      type: 'list',
      text: [
        '<b><span class="mdi mdi-radiobox-marked"></span> 单选</b><br>仅可同时选择其中一项；选择另一个目标时，之前选择的会自动取消选择。<br>从可多选的模式切换到这个模式时，保留最后选择的。',
        '<b><span class="mdi mdi-checkbox-marked-outline"></span> 并选</b><br>可以选择多项；最终过滤结果为符合选择项目之一或更多的。',
        '<b><span class="mdi mdi-check-decagram"></span> 同时</b><br>可以选择多项；最终过滤结果为符合所有选择项目的。',
      ],
    },
    {
      type: 'param',
      text: '※注意：请根据游戏内表现按需选用并选规则。<br><br>',
    },
    {
      type: 'param',
      text: '第二个红色的是“清空”按钮，可以一键清空选择。',
    },
    ],
    actions: null,
  },
  {
    title: '为什么不将这个系统嵌入到PRTS本身，就像其它的一样？',
    content: [
    {
      type: 'param',
      text: '有这么几个考虑：',
    },
    {
      type: 'list',
      text: [
        '这些能力是【卫戍协议】模式限定，而卫戍协议不是一个常驻或者核心玩法，因此不适合将这些能力放在干员的个人页面中（与之相反的例子可参考基建的“后勤技能”）。',
        '以现有的Widget框架搭建一个嵌入于MediaWiki的查询系统观感较差。'
      ],
    },
    ],
    actions: null,
  },
  {
    title: '我发现了Bug！/ 我有一些意见或者建议。',
    content: [
    {
      type: 'param',
      text: '在PRTS主站的“反馈与建议”发布讨论话题，或是前往Github仓库发布Issue。',
    },
    {
      type: 'param',
      text: '由于本人也是个小白，有写得很差的地方还请多多包涵。',
    },
    ],
    actions: [
      {
        icon: 'mdi-message-text',
        text: '前往 PRTS:反馈与建议',
        action: () => openPRTSlink('PRTS:反馈与建议'),
      },
      {
        icon: 'mdi-record-circle-outline',
        text: '前往 GitHub Issue',
        action: () => openLink(''),
      },
    ],
  },
  {
    title: '我想参与这个页面（项目）的开发。',
    content: [
    {
      type: 'param',
      text: '访问本项目的GitHub仓库然后Pull Request。',
    },
    {
      type: 'param',
      text: '由于本人也是个小白，有写得很差的地方还请多多包涵。',
    },
    ],
    actions: [
      {
        icon: 'mdi-xml',
        text: '前往 GitHub 仓库',
        action: () => openLink(''),
      },
    ],
  },
];

const curpanel = ref(undefined)

defineExpose({
  switchDialog,
});
</script>

<template>
  <v-dialog v-model="show" width="auto" scrollable :fullscreen="mobile">
    <v-card max-width="800">
      <v-card-title class="bg-primary d-flex align-center">
        <v-icon icon="mdi-help-box mr-1" size="small"/>帮助
      </v-card-title>
      <v-card-text class="d-flex flex-column ga-2" style="height: 100%;">
        <v-expansion-panels variant="accordion" v-model="curpanel">
          <v-expansion-panel
            v-for="(item, index) in items"
            :key="index"
            :value="index"
          >
            <v-expansion-panel-title :color="curpanel == index ? 'primary' : ''">
              {{ item.title }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <p v-for="(log, logi) in item.content">
                <span v-if="log.type === 'param'" v-html="log.text"></span>
                <ul v-if="log.type === 'list'" class="ml-5">
                  <li v-for="text in log.text" density="compact" v-html="text">
                  </li>
                </ul>
                <p v-if="!!item.actions && logi==item.content.length-1" class="mt-5">
                  <v-btn
                    v-for="act in item.actions"
                    variant="tonal"
                    size="small"
                    :prepend-icon="act.icon"
                    :text="act.text"
                    @click="act.action"
                    class="mr-2"
                  >
                  </v-btn>
                </p>
              </p>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
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

<style scoped></style>
