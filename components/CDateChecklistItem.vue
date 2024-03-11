<template>
  <CForm :data="formData">
    <CShelf>
      <template #left>
        <CChecklistItemBody :item="context.item"/>
      </template>

      <template #right>
        <CField path="isNotApplicable" v-slot="{value, onInput}">
          <CChecklistItemNotApplicableButton :value="value" @input="onInput"/>
        </CField>
      </template>
    </CShelf>

    <CField type="date" path="date" :disabled="formData.isNotApplicable" class="u-mt-2"/>
  </CForm>
</template>

<script setup lang="ts">
  import { reactive, watch } from 'vue';
  import CShelf from '@/shared/components/CShelf.vue';
  import CField from '@/shared/components/form/CField.vue';
  import CForm from '@/shared/components/form/CForm.vue';
  import ChecklistItemStatus from '../constants/ChecklistItemStatus';
  import ChecklistItemContext from '../models/ChecklistItemContext';
  import { ChecklistItemData } from '../models/ChecklistItemData';
  import ChecklistService from '../services/ChecklistService';
  import CChecklistItemBody from './CChecklistItemBody.vue';
  import CChecklistItemNotApplicableButton from './CChecklistItemNotApplicableButton.vue';

  const props = defineProps<{
    context: ChecklistItemContext;
  }>();

  const formData = reactive({
    date: props.context.item.result,
    isNotApplicable: props.context.item.status === ChecklistItemStatus.DISABLED,
  }) as ChecklistItemData;

  watch(() => formData.date, () => {
    ChecklistService.updateItem(props.context, formData);
  });

  watch(() => formData.isNotApplicable, () => {
    if (formData.isNotApplicable) formData.date = null;
    ChecklistService.updateItem(props.context, formData);
  });
</script>