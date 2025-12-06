<script setup>
import { getImagePath } from '../../util/general.js';

const props = defineProps({
  bond: {
    type: Object,
    default: {},
  },
});
</script>

<template>
  <div class="d-flex align-center flex-column">
    <div
      class="position-relative"
      :style="{
        width: '40px',
        height: '40px',
        'border-radius': '50px',
        border: `${bond.id ? '2px' : '1px'} solid ${
          bond.id ? '#4aebb5' : '#fff1'
        }`,
        background: bond.id ? 'radial-gradient(#25be97, #0000 80%)' : '#0000',
      }"
    >
      <v-img
        v-if="bond.id"
        class="position-absolute"
        style="left: 50%; top: 50%; transform: translate(-50%, -50%);"
        width="22"
        :src="getImagePath(`卫戍协议：盟约_icon_${bond.id}.png`)"
      />
      <div
        class="position-absolute"
        style="
          font-size: 0.6em;
          text-shadow: 0 0 5px #000, 0 0 5px #000, 0 0 5px #000, 0 0 5px #000,
            0 0 5px #000;
          left: 50%;
          bottom: -0.6em;
          transform: translateX(-50%);
          width: 4em;
          text-align: center;
          cursor: default;
        "
      >
        {{ bond.name }}
      </div>
    </div>
  </div>
</template>

<style scoped></style>
