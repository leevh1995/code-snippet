<template>
  <!-- TODO: merge with CRadio -->
  <CButton v-for="option in options" theme="ghost-inverse" @click.stop="select(option)" :key="option" :class="getScoreClass(option)">
    <SvgIcon :name="getIcon(option)" :size="32"/>
  </CButton>
</template>

<script setup lang="ts">
  import SvgIcon from '@/shared/components/SvgIcon.vue';
  import CButton from '@/shared/components/buttons/CButton.vue';
  import ChecklistScore from '../constants/ChecklistScore';

  const emit = defineEmits<{(e: 'input', value: ChecklistScore | null): void}>();

  const props = defineProps<{
    value: ChecklistScore | null,
    options: Array<ChecklistScore>,
  }>();

  function getIcon(score: ChecklistScore) {
    return props.value === score ? 'checklist-circle-selected' : 'checklist-circle';
  }

  function getScoreClass(score: ChecklistScore) {
    switch (score) {
      case ChecklistScore.GOOD:
        return 'c-checklist-score-good';
      case ChecklistScore.CAUTION:
        return 'c-checklist-score-caution';
      case ChecklistScore.BAD:
        return 'c-checklist-score-bad';
    }
  }

  function select(score: ChecklistScore) {
    emit('input', score === props.value ? null : score);
  }
</script>

<style lang="scss">
  .c-checklist-score {
    &-good {
      color: $success;

      &:hover {
        color: $success;
      }
    }

    &-caution {
      color: $warning;

      &:hover {
        color: $warning;
      }
    }

    &-bad {
      color: $danger;

      &:hover {
        color: $danger;
      }
    }
  }
</style>
