<script setup>
import { ref, computed, onMounted } from 'vue';

/*
Rule format:
{
  name: "filter-name",
  items: [
    {key:"xxx", name:"xxx"},
  ],
  opList: {
    char_key: {
      id: "",
      rarity: 0,
      name: "",
      chess: [
        chess1，
        chess2,
      ]
    }
  }
}
*/

const props = defineProps({
  filters: Array,
});

const filterOptions = ref({
  selectRule: [],
  selectItems: [],
  opDisplay: 'list', // list, half, avatar
});

const showPanel = ref(true);

const ruleSetIcon = ref([
  'mdi-radiobox-marked', //single
  'mdi-checkbox-marked-outline', //multi-any
  'mdi-check-decagram', //multi-all
]);

function switchPanel() {
  showPanel.value = !showPanel.value;
}

function getCurrentRule(ruleSetIndex) {
  return filterOptions.value.selectRule[ruleSetIndex];
}

function selectItem(ruleSetIndex, itemKey) {
  let rule = getCurrentRule(ruleSetIndex);

  if (rule == 0) {
    if (filterOptions.value.selectItems[ruleSetIndex][0] != itemKey) {
      filterOptions.value.selectItems[ruleSetIndex][0] = itemKey;
    } else {
      filterOptions.value.selectItems[ruleSetIndex].pop();
    }
  } else if (rule == 1 || rule == 2) {
    if (!filterOptions.value.selectItems[ruleSetIndex].includes(itemKey)) {
      filterOptions.value.selectItems[ruleSetIndex].push(itemKey);
    } else {
      filterOptions.value.selectItems[ruleSetIndex] =
        filterOptions.value.selectItems[ruleSetIndex].filter((i) => {
          return i != itemKey;
        });
    }
  }
}

function selectedPlainPrint(ruleSetIndex) {
  let rule = getCurrentRule(ruleSetIndex);

  let plain = props.filters[ruleSetIndex].getItemTexts(
    filterOptions.value.selectItems[ruleSetIndex] || []
  );

  if (rule == 0) {
    return plain[0] || '';
  } else if (rule == 1) {
    return plain.join(' / ');
  } else if (rule == 2) {
    return plain.join(' & ');
  }

  return '';
}

function removeItems(ruleSetIndex) {
  filterOptions.value.selectItems[ruleSetIndex] = [];
}

function getRuleIcon(ruleSetIndex) {
  return ruleSetIcon.value[filterOptions.value.selectRule[ruleSetIndex]];
}

function changeRule(ruleSetIndex) {
  filterOptions.value.selectRule[ruleSetIndex] =
    (filterOptions.value.selectRule[ruleSetIndex] + 1) % 3;

  let rule = getCurrentRule(ruleSetIndex);
  if (rule == 0 && filterOptions.value.selectItems[ruleSetIndex].length > 1) {
    filterOptions.value.selectItems[ruleSetIndex].splice(
      0,
      filterOptions.value.selectItems[ruleSetIndex].length - 1
    );
  }
}

onMounted(() => {
  filterOptions.value.selectItems = [];
  props.filters.forEach((_) => filterOptions.value.selectItems.push([]));
  filterOptions.value.selectRule = [];
  props.filters.forEach((_) => filterOptions.value.selectRule.push(0));
});

defineExpose({
  showPanel,
  switchPanel,
  filterOptions,
});
</script>

<template>
  <v-expand-transition group>
    <v-sheet key="filterSelector" v-show="showPanel">
      <v-sheet class="">
        <v-sheet
          v-for="(rule, index) in filters"
          class="py-2 px-4 d-flex align-center"
        >
          <!--过滤器名-->
          <v-sheet
            class="mr-2 d-flex align-center flex-column flex-md-row"
            min-width="5em"
          >
            <div
              class="font-weight-bold mr-0 mr-md-2"
              style="width: 4em; text-align: right"
            >
              {{ rule.name }}
            </div>
            <div>
              <v-btn-group style="height: 1.5em">
                <v-btn
                  color="primary"
                  size="x-small"
                  :icon="getRuleIcon(index)"
                  @click="changeRule(index)"
                >
                </v-btn>
                <v-btn
                  color="error"
                  size="x-small"
                  icon="mdi-delete"
                  @click="removeItems(index)"
                >
                </v-btn>
              </v-btn-group>
            </div>
          </v-sheet>
          <!--过滤器内容-->
          <div class="d-flex flex-wrap ga-2">
            <v-chip
              v-for="item in rule.items"
              label
              :variant="
                filterOptions.selectItems[index]?.includes(item.key)
                  ? 'elevated'
                  : 'tonal'
              "
              :color="
                filterOptions.selectItems[index]?.includes(item.key)
                  ? 'primary-light'
                  : ''
              "
              @click="selectItem(index, item.key)"
            >
              {{ item.name }}
            </v-chip>
          </div>
        </v-sheet>
      </v-sheet>
    </v-sheet>
  </v-expand-transition>
  <v-expand-transition group>
    <v-sheet key="filterSelector2" v-show="!showPanel">
      <v-sheet class="px-4 py-2 d-flex flex-wrap text-caption text-md-body-2">
        <v-sheet v-for="(rule, index) in filters">
          <div v-if="selectedPlainPrint(index) != ''">
            <span class="mr-1">{{ rule.name }}</span>
            <span class="font-weight-thin">{{
              selectedPlainPrint(index)
            }}</span>
            <v-divider
              v-if="index != filters.length - 1"
              vertical
              class="mx-2"
              length="1.3em"
            ></v-divider>
          </div>
        </v-sheet>
      </v-sheet>
    </v-sheet>
  </v-expand-transition>
  <v-sheet class="px-5 d-flex"> </v-sheet>
</template>

<style scoped></style>
