<script setup>
defineProps({
  dev: Object,
  mode: {
    type: String,
    default: 'dev',
  }, //dev, donate
});

function openLink(link) {
  window.open(link, '_blank');
}
</script>

<template>
  <v-card
    class="mx-auto"
    :prepend-avatar="!dev.spAvatar ? dev.avatar : ''"
    :subtitle="dev.desc"
    :title="dev.name"
    density="compact"
    @click="openLink(`${mode == 'donate' ? dev.donate : dev.homepage}`)"
    width="100%"
    color="#333"
  >
    <template v-slot:prepend v-if="dev.spAvatar">
      <v-avatar size="40" rounded color="transparent">
        <v-img :src="dev.avatar"></v-img>
      </v-avatar>
    </template>
  </v-card>
</template>
