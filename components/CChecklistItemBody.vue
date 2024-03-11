<template>
  <CItem :title="item.shortDescription">
    {{ item.description }}

    <CChecklistItemMedia :item="item"/>
    <CTag v-if="showJobTag" theme="outline">
      <SvgIcon name="wrench" :size="16"/>
      {{ $t('jobs_v3.number', { number: item.sequenceNumber }) }}
    </CTag>

    <CNarrator v-for="comment in item.comments" :key="comment.id" :content="comment.content" :user="comment.createdBy" class="u-mt-2"/>
  </CItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import CItem from '@/shared/components/CItem.vue';
  import CNarrator from '@/shared/components/CNarrator.vue';
  import CTag from '@/shared/components/CTag.vue';
  import SvgIcon from '@/shared/components/SvgIcon.vue';
  import ChecklistItemStatus from '../constants/ChecklistItemStatus';
  import ChecklistItem from '../models/ChecklistItem';
  import CChecklistItemMedia from './CChecklistItemMedia.vue';

  const props = defineProps<{
    item: ChecklistItem;
  }>();

  const showJobTag = computed(() => {
    const validStatuses = [ChecklistItemStatus.CAUTION, ChecklistItemStatus.BAD];
    return !props.item.isExcluded && validStatuses.includes(props.item.status);
  });
</script>