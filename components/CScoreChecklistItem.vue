<template>
  <CForm :data="formData" class="c-score-checklist-item-form">
    <CField path="score" v-slot="{value, onInput}">
      <CChecklistScore :value="value" :options="options" @input="onInput"/>
    </CField>

    <CField path="isNotApplicable" v-slot="{value, onInput}">
      <CChecklistItemNotApplicableButton :value="value" @input="onInput"/>
    </CField>
  </CForm>
</template>

<script setup lang="ts">
  import { computed, reactive, watch } from 'vue';
  import CField from '@/shared/components/form/CField.vue';
  import CForm from '@/shared/components/form/CForm.vue';
  import ChecklistItemStatus from '../constants/ChecklistItemStatus';
  import { CHECKLIST_SCORE_OPTIONS } from '../constants/ChecklistScore';
  import ChecklistItemContext from '../models/ChecklistItemContext';
  import { ChecklistItemData } from '../models/ChecklistItemData';
  import ChecklistService from '../services/ChecklistService';
  import CChecklistItemNotApplicableButton from './CChecklistItemNotApplicableButton.vue';
  import CChecklistScore from './CChecklistScore.vue';

  const props = defineProps<{
    context: ChecklistItemContext;
  }>();

  const formData = reactive({
    score: props.context.item.result,
    isNotApplicable: props.context.item.status === ChecklistItemStatus.DISABLED,
  }) as ChecklistItemData;

  const options = computed(() => CHECKLIST_SCORE_OPTIONS[props.context.item.type]);


  watch(() => formData.score, () => {
    if (formData.score) formData.isNotApplicable = false;
    if (!formData.isNotApplicable) ChecklistService.updateItem(props.context, formData);
  });

  watch(() => formData.isNotApplicable, () => {
    if (formData.isNotApplicable) formData.score = null;
    ChecklistService.updateItem(props.context, formData);
  });
</script>

<style lang="scss">
  .c-score-checklist-item {
    &-form {
      display: flex;

      .c-field {
        margin-bottom: 0;
      }
    }
  }
</style>