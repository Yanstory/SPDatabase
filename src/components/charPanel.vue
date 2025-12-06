<script setup>
import { ref } from 'vue';
import { TORAPPU_ENDPOINT, MEDIA_ENDPOINT } from '../util/const.js';
import { getIsMobile } from '../util/display.js';
import bondIcon from './core/bondIcon.vue';
import garItem from './core/garItem.vue';

import { getImagePath } from '../util/general.js';

const mobile = getIsMobile();

const getAvatar = function (id) {
  return `${TORAPPU_ENDPOINT}/assets/char_avatar/${id}.png`;
};

const rankText = ref({
  1: 'Ⅰ',
  2: 'Ⅱ',
  3: 'Ⅲ',
  4: 'Ⅳ',
  5: 'Ⅴ',
  6: 'Ⅵ',
});

const goToOpPage = (link) => {
  window.open('https://prts.wiki/w/' + link, '_blank');
};

const props = defineProps({
  char: Object,
  isShow: Boolean,
});
</script>
<template>
  <tr v-if="isShow">
    <td rowspan="2" :style="{ width: mobile ? '100px' : '160px' }" class="pa-0">
      <v-sheet class="d-flex flex-column align-center">
        <div class="position-relative">
          <v-avatar
            :image="getAvatar(char.id)"
            rounded="0"
            :size="mobile ? 45 : 70"
            :color="`rare-${char.rarity}`"
            @click="goToOpPage(char.link || char.name)"
            class="op-icon cursor-pointer"
          ></v-avatar>
          <v-img
            class="position-absolute left-0 top-0 pointer-events-none"
            :width="mobile ? 12 : 20"
            :src="getImagePath(`图标_职业_${char.profession}.png`)"
          />
          <div
            :class="[
              'border-md border-opacity-50 pa-0 pointer-events-none',
              'position-absolute right-0 top-0',
              `border-rank-${char.chess[0].rank} text-rank-${char.chess[0].rank}`,
            ]"
            style="
              width: 1.8em;
              text-align: center;
              font-size: 0.72em;
              font-weight: bold;
              background: #0009;
            "
          >
            {{ rankText[char.chess[0].rank] }}
          </div>
        </div>
        <v-img
          width="100%"
          height="15"
          :src="getImagePath(`稀有度_黄_${char.rarity - 1}.png`)"
        />
        <div class="d-flex align-center">
          {{ char.name }}
        </div>
      </v-sheet>
    </td>
    <!--chess1-->
    <td style="width: 2em" class="pa-0">
      <div>
        <v-chip label> 普通 </v-chip>
      </div>
    </td>
    <td class="px-2 py-1">
      <v-sheet
        class="d-flex flex-column flex-md-row ga-2 ga-md-3 align-left align-md-center"
      >
        <div class="d-flex flex-row align-center ga-1">
          <bondIcon v-for="bon in char.chess[0].bonds" :bond="bon" />
          <bondIcon v-for="n in 3 - char.chess[0].bonds.length" />
        </div>
        <div class="d-flex flex-row align-center ga-1">
          <garItem :gar="char.chess[0].gars[0]" />
        </div>
      </v-sheet>
    </td>
  </tr>
  <tr v-if="isShow">
    <td style="width: 2em" class="pa-0">
      <div>
        <v-chip label color="#ffd533"> 精锐 </v-chip>
      </div>
    </td>
    <td class="px-2 py-1">
      <v-sheet
        class="d-flex flex-column flex-md-row ga-2 ga-md-3 align-left align-md-center"
      >
        <div class="d-flex flex-row align-center ga-1">
          <bondIcon v-for="bon in char.chess[1].bonds" :bond="bon" />
          <bondIcon v-for="n in 3 - char.chess[1].bonds.length" />
        </div>
        <div class="d-flex flex-row align-center ga-1">
          <garItem :gar="char.chess[1].gars[0]" />
        </div>
      </v-sheet>
    </td>
  </tr>
</template>

<style scoped>
.op-icon {
  box-shadow: 0 0 0px 0px #ffffffc7;
  transition-property: width, height, box-shadow;
}
.op-icon:hover {
  border: 1px solid #fff;
  box-shadow: 0 0 7px 0px #ffffffc7;
}
</style>
