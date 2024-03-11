<template>
  <CDropdownNext ref="dropdown" theme="naked" class="c-checklist-item-damage-points-dropdown">
    <template #toggle>
      <SvgIcon name="plus-circle"/>
    </template>

    <CButton v-for="(option, index) in options" :key="index" @click="select(option)">
      <SvgIcon :name="`car-${option}`"/>
      {{ $t(`checklists_v3.${option}`) }}
    </CButton>
  </CDropdownNext>
</template>

<script setup lang="ts">
  import { computed, watch } from 'vue';
  import SvgIcon from '@/shared/components/SvgIcon.vue';
  import CButton from '@/shared/components/buttons/CButton.vue';
  import CDropdownNext from '@/shared/components/dropdown/CDropdownNext.vue';
  import { elementRef } from '@/shared/utils/component';
  import { enumKeys } from '@/shared/utils/typescript';
  import ChecklistDamagePointType from '../constants/ChecklistDamagePointType';

  const dropdown = elementRef();

  const emit = defineEmits<{
    (e: 'assign', option: string): void,
  }>();

  const props = defineProps<{
    x: number;
    y: number;
  }>();

  const options = computed(() => enumKeys(ChecklistDamagePointType).map(type => type.toLowerCase()));

  watch(() => props.x, () => {
    const toggleSize = 12;
    dropdown.value.style.left = `${props.x - toggleSize}px`;
    dropdown.value.style.top = `${props.y - toggleSize}px`;
  });

  function select(option: string) {
    emit('assign', option);
  }
</script>

<style lang="scss">
  .c-checklist-item-damage-points-dropdown {
    position: absolute;

    .c-dropdown-toggle {
      padding: 0;
    }
  }
</style>