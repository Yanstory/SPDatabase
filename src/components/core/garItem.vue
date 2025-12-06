<script setup>
import { getImagePath } from '../../util/general.js';
import { applyRichText } from '../../util/richText.js';

const props = defineProps({
  gar: {
    type: Object,
    default: {},
  },
});
</script>

<template>
  <v-sheet>
    <v-chip
      label
      variant="flat"
      color="#05ddae"
      size="small"
      density="comfortable"
      class="px-1 mr-1"
    >
      <v-img
        v-if="gar.eventTypeDesc"
        width="18"
        style="filter: invert(1)"
        :src="getImagePath(`卫戍协议：盟约_${gar.eventTypeSmallIcon}.png`)"
      />
      &nbsp;{{ gar.eventTypeDesc }}
    </v-chip>
    <span v-html="applyRichText(gar.description).replace('\\n', '<br>')"></span>
  </v-sheet>
</template>
