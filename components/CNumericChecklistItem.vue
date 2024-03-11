<template>
  <CForm :data="formData" :validation="validation" @submit="submit" class="c-numeric-checklist-item">
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

    <CField type="number" path="numeric" :disabled="formData.isNotApplicable" @click.stop>
      <template #addon>
        <CButton type="submit" class="button" @click.stop>
          {{ $t('general.save_button') }}
        </CButton>
      </template>
    </CField>
  </CForm>
</template>

<script setup lang="ts">
  import { maxLength } from '@vuelidate/validators';
  import { reactive, watch } from 'vue';
  import CShelf from '@/shared/components/CShelf.vue';
  import CButton from '@/shared/components/buttons/CButton.vue';
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
    numeric: props.context.item.result,
    isNotApplicable: props.context.item.status === ChecklistItemStatus.DISABLED,
  }) as ChecklistItemData;

  const validation = {
    numeric: {
      maxLength: maxLength(25),
    },
  };

  watch(() => formData.isNotApplicable, () => {
    if (formData.isNotApplicable) {
      formData.numeric = null;
      ChecklistService.updateItem(props.context, formData);
    }
  });

  function submit() {
    ChecklistService.updateItem(props.context, formData);
  }
</script>

<style lang="scss">
  .c-numeric-checklist-item {
    .c-field-addon {
      padding: 0;
    }
  }
</style>