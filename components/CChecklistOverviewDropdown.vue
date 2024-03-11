<template>
  <CDropdownMenu minimal class="c-checklist-overview-dropdown">
    <CCheckButtonNext :active="checklist.visibleToCustomer" @update:active="ChecklistService.toggleVisibleToCustomer(checklist)" @click.stop>
      {{ $t('dossier_v3.notVisible') }}
      <SvgIcon :name="checklist.visibleToCustomer ? 'eye' : 'eye-off'"/>
    </CCheckButtonNext>

    <CButton theme="normal-danger" :disabled="!!checklist.finishedOn" @click="deleteChecklist">
      <SvgIcon name="delete-trash"/>
      {{ $t('checklists_v3.delete') }}
    </CButton>
  </CDropdownMenu>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import { useRoute } from 'vue-router';
  import Dossier from '@/dossierV3/models/Dossier';
  import { goto } from '@/general/router/util';
  import Modals from '@/general/services/Modals';
  import CCheckButtonNext from '@/shared/components/CCheckButtonNext.vue';
  import SvgIcon from '@/shared/components/SvgIcon.vue';
  import CButton from '@/shared/components/buttons/CButton.vue';
  import CDropdownMenu from '@/shared/components/dropdown/CDropdownMenu.vue';
  import { present } from '@/shared/utils/typescript';
  import Checklist from '../models/Checklist';
  import ChecklistService from '../services/ChecklistService';

  const i18n = useI18n();

  const route = useRoute();

  const props = defineProps<{
    checklist: Checklist,
    dossier: Dossier,
  }>();

  async function deleteChecklist() {
    await Modals.confirmDelete(i18n.t('checklists_v3.deleteInfo'), i18n.t('checklists_v3.delete'));
    await ChecklistService.delete(present(props.checklist.id), props.dossier.id);
    await goto({ name: 'dossier-detail', query: route.query });
  }
</script>