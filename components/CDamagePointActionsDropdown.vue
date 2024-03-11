<template>
  <CDropdownNext theme="naked" :style="position" class="c-checklist-item-damage-point-dropdown">
    <template #toggle>
      <SvgIcon :name="`car-${type}`" :size="32"/>
    </template>

    <template #default>
      <div>
        <SvgIcon :name="`car-${type}`"/>
        {{ $t(`checklists_v3.${type}`) }}
      </div>

      <CButton theme="normal-danger" @click="deletePoint">
        <SvgIcon name="delete-trash"/>
        {{ $t('general.delete_button') }}
      </CButton>
    </template>
  </CDropdownNext>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import DossierStatus from '@/dossier/constants/DossierStatus';
  import SvgIcon from '@/shared/components/SvgIcon.vue';
  import CButton from '@/shared/components/buttons/CButton.vue';
  import CDropdownNext from '@/shared/components/dropdown/CDropdownNext.vue';
  import ChecklistDamagePointType from '../constants/ChecklistDamagePointType';
  import ChecklistDamagePoint from '../models/ChecklistDamagePoint';
  import ChecklistItemContext from '../models/ChecklistItemContext';
  import ChecklistService from '../services/ChecklistService';

  const props = defineProps<{
    context: ChecklistItemContext;
    damagePoint: ChecklistDamagePoint;
  }>();

  const position = computed(() => {
    return {
      top: props.damagePoint.y + 'px',
      left: props.damagePoint.x + 'px',
    };
  });

  const type = computed(() => {
    switch (props.damagePoint.type) {
      case ChecklistDamagePointType.DENT:
        return 'dent';
      case ChecklistDamagePointType.SCRATCH:
        return 'scratch';
      case ChecklistDamagePointType.RUST:
        return 'rust';
      case ChecklistDamagePointType.CRACK:
        return 'crack';
      case ChecklistDamagePointType.OTHER:
        return 'other';
    }
  });

  async function deletePoint() {
    await ChecklistService.deleteDamagePoint(props.context, props.damagePoint);
  }
</script>

<style lang="scss">
  .c-checklist-item-damage-point-dropdown {
    position: absolute;

    .c-dropdown-toggle {
      padding: 0;
    }
  }
</style>