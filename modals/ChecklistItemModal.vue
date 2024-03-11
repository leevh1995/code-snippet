<template>
  <CModal @close="close">
    <template #header>
      <CJob :job="job" display="statuses" class="u-mr-2">
        <template #right>
          <CJobExecutionStatusButton :job="job" :context="Contexts.job"/>
        </template>
      </CJob>
    </template>

    <template #toolbar>
      <CFlex justify="between">
        <CJobTags :job="job"/>
        <CJobMenu :context="Contexts.job" :job="job" inChecklist/>
      </CFlex>
    </template>

    <template #body>
      <CDiagnosticSection :job="job" :dossier="dossier" :canAddMedia="canAddMedia" class="u-mb-4"/>
      <CMediaSection :context="mediaContext"/>
    </template>

    <template #footer>
      <CButton @click="close" class="c-modal-cancel">{{ $t('general.close_button') }}</CButton>
    </template>
  </CModal>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import Dossier from '@/dossierV3/models/Dossier';
  import CModal from '@/general/components/CModal.vue';
  import { JobMediaContext } from '@/general/models/MediaContext';
  import Contexts from '@/general/utils/Contexts';
  import CFlex from '@/shared/components/CFlex.vue';
  import CButton from '@/shared/components/buttons/CButton.vue';
  import CJob from '../../jobs/components/CJob.vue';
  import CJobExecutionStatusButton from '../../jobs/components/CJobExecutionStatusButton.vue';
  import CJobTags from '../../jobs/components/CJobTags.vue';
  import Job from '../../jobs/models/Job';
  import CDiagnosticSection from '../../jobs/modules/diagnosis/components/CDiagnosticSection.vue';
  import CJobMenu from '../../jobs/modules/diagnosis/components/CJobMenu.vue';
  import CMediaSection from '../../media/components/CMediaSection.vue';

  const emit = defineEmits<{ (e: 'close'): void }>();

  const props = defineProps<{
    job: Job,
    dossier: Dossier,
    canAddMedia: boolean,
  }>();

  const mediaContext = computed(() => new JobMediaContext(props.job, props.dossier.id, undefined, props.canAddMedia));

  function close() {
    emit('close');
  }
</script>