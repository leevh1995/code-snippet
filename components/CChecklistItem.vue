<template>
  <CSectionButton @click="showDetails" class="c-checklist-item">
    <CSectionItem>
      <CItem :icon="icon">
        <template #body>
          <CChecklistItemBody v-if="SCORE_TYPES.includes(item.type)" :item="item"/>

          <CNumericChecklistItem v-if="NUMERIC_TYPES.includes(item.type)" :context="context"/>

          <CDateChecklistItem v-if="item.type === ChecklistItemType.DATE" :context="context"/>

          <CDamagePointsChecklistItem v-if="item.type === ChecklistItemType.EXTERIOR" :context="context"/>
        </template>

        <template #right>
          <CScoreChecklistItem v-if="SCORE_TYPES.includes(item.type)" :context="context"/>
        </template>
      </CItem>
    </CSectionItem>
  </CSectionButton>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import Dossier from '@/dossierV3/models/Dossier';
  import ModalService from '@/general/services/ModalService';
  import CItem from '@/shared/components/CItem.vue';
  import CSectionButton from '@/shared/components/section/CSectionButton.vue';
  import CSectionItem from '@/shared/components/section/CSectionItem.vue';
  import JobService from '../../jobs/services/JobService';
  import ChecklistItemStatus from '../constants/ChecklistItemStatus';
  import ChecklistItemType, { NUMERIC_TYPES, SCORE_TYPES } from '../constants/ChecklistItemType';
  import ChecklistItemModal from '../modals/ChecklistItemModal.vue';
  import Checklist from '../models/Checklist';
  import ChecklistItem from '../models/ChecklistItem';
  import ChecklistItemContext from '../models/ChecklistItemContext';
  import CChecklistItemBody from './CChecklistItemBody.vue';
  import CDamagePointsChecklistItem from './CDamagePointsChecklistItem.vue';
  import CDateChecklistItem from './CDateChecklistItem.vue';
  import CNumericChecklistItem from './CNumericChecklistItem.vue';
  import CScoreChecklistItem from './CScoreChecklistItem.vue';

  const props = defineProps<{
    checklist: Checklist;
    item: ChecklistItem;
    dossier: Dossier;
  }>();

  const icon = computed(() => props.item.status > ChecklistItemStatus.EMPTY ? 'check-circle' : 'empty');

  const context = computed(() => new ChecklistItemContext(props.checklist, props.item, props.dossier));

  async function showDetails() {
    const job = reactive(await JobService.getJobById(props.dossier.id, props.item.id));
    await JobService.loadDiagnosis(props.dossier, job);
    const canAddMediaStatuses = [ChecklistItemStatus.GOOD, ChecklistItemStatus.CAUTION, ChecklistItemStatus.BAD];
    const canAddMedia = canAddMediaStatuses.includes(props.item.status);
    await ModalService.open({ component: ChecklistItemModal }, { job, dossier: props.dossier, canAddMedia });
  }
</script>

<style lang="scss">
  .c-checklist-item {
    .c-item-icon {
      color: $info;
    }
  }
</style>