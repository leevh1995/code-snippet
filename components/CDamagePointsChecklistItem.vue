<template>
  <CShelf>
    <template #left>
      <CChecklistItemBody :item="context.item"/>
    </template>

    <template #right>
      <p class="u-title u-semibold">
        {{ $t('checklists_v3.damagePoints', context.item.damagePoints.length, { count: context.item.damagePoints.length }) }}
      </p>
    </template>
  </CShelf>

  <CForm :data="formData" vertical>
    <CField type="radio" path="exteriorType" :disabled="context.item.damagePoints.length > 0" :options="types" #option="{option}">
      {{ $t(`checklists_v3.exteriorStatus${option}`) }}
    </CField>
  </CForm>

  <CDamagePointCanvas v-if="formData.exteriorType === ExteriorItemType.DAMAGE" :context="context"/>
</template>

<script setup lang="ts">
  import { computed, reactive, watch } from 'vue';
  import CShelf from '@/shared/components/CShelf.vue';
  import CField from '@/shared/components/form/CField.vue';
  import CForm from '@/shared/components/form/CForm.vue';
  import { enumValues } from '@/shared/utils/typescript';
  import ExteriorItemType from '../constants/ExteriorItemType';
  import ChecklistItemContext from '../models/ChecklistItemContext';
  import { ChecklistItemData } from '../models/ChecklistItemData';
  import ChecklistService from '../services/ChecklistService';
  import CChecklistItemBody from './CChecklistItemBody.vue';
  import CDamagePointCanvas from './CDamagePointCanvas.vue';

  const props = defineProps<{
    context: ChecklistItemContext;
  }>();

  const formData = reactive({
    exteriorType: props.context.item.result,
  });

  const types = computed(() => enumValues(ExteriorItemType));

  watch(() => formData.exteriorType, () => {
    const checklistItemData = {
      exteriorType: formData.exteriorType,
      isNotApplicable: false,
    }  as ChecklistItemData;
    ChecklistService.updateItem(props.context, checklistItemData);
  });
</script>