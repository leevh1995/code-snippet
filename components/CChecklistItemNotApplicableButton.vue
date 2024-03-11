<template>
  <!-- TODO: merge with CRadio -->
  <CButton theme="ghost-inverse" @click.stop="update" class="c-checklist-item-not-applicable-button">
    <SvgIcon :name="value ? 'stop-circle' : 'stop-circle-outline'" :size="32"/>
  </CButton>
</template>

<script setup lang="ts">
  import SvgIcon from '@/shared/components/SvgIcon.vue';
  import CButton from '@/shared/components/buttons/CButton.vue';

  const emit = defineEmits<{(e: 'input', value: boolean): void}>();

  const props = defineProps<{
    value: boolean,
  }>();

  function update() {
    const value = !props.value;
    emit('input', value);
  }
</script>

<style lang="scss">
  .c-checklist-item-not-applicable-button {
    color: $neutral;

    &:hover {
      color: $neutral;
    }
  }
</style>
