<template>
  <CCard class="c-damage-point-canvas">
    <p class="u-title">{{ $t('checklists_v3.damagePointExplanation') }}</p>
    <div class="c-damage-point-canvas-card">
      <div id="canvas" ref="canvas" @click="updateCoordinates" class="c-damage-point-canvas-card-background">
        <CDamagePointActionsDropdown v-for="(damagePoint, index) in damagePoints" :key="index" :context="context" :damagePoint="damagePoint"/>
      </div>
      <CDamagePointsDropdown v-show="showDropdown" :x="x" :y="y" @assign="addPoint"/>
    </div>
  </CCard>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import CCard from '@/shared/components/CCard.vue';
  import { elementRef } from '@/shared/utils/component';
  import { present } from '@/shared/utils/typescript';
  import ChecklistClient from '../client/ChecklistClient';
  import ChecklistDamagePointType from '../constants/ChecklistDamagePointType';
  import ChecklistDamagePoint from '../models/ChecklistDamagePoint';
  import ChecklistItemContext from '../models/ChecklistItemContext';
  import CDamagePointActionsDropdown from './CDamagePointActionsDropdown.vue';
  import CDamagePointsDropdown from './CDamagePointsDropdown.vue';

  const props = defineProps<{
    context: ChecklistItemContext;
  }>();

  const canvas = elementRef();
  const x = ref<number | null>(null);
  const y = ref<number | null>(null);
  const showDropdown = ref(false);

  const damagePoints = computed(() => props.context.item.damagePoints);

  onMounted(() => {
    damagePoints.value.forEach((damagePoint) => {
      damagePoint.x *= present(canvas.value).clientWidth;
      damagePoint.y *= present(canvas.value).clientHeight;
    });
  });

  async function updateCoordinates($event: MouseEvent) {
    const rect = present(canvas.value).getBoundingClientRect();
    x.value = $event.clientX - rect.left;
    y.value = $event.clientY - rect.top;
    showDropdown.value = true;
  }

  async function addPoint(damagePointType: string) {
    const iconSize = 32;
    const damagePoint = new ChecklistDamagePoint();
    damagePoint.x = (present(x.value) - (iconSize / 2)) / present(canvas.value).clientWidth;
    damagePoint.y = (present(y.value) - (iconSize / 2)) / present(canvas.value).clientHeight;
    damagePoint.type = ChecklistDamagePointType[damagePointType.toUpperCase() as keyof typeof ChecklistDamagePointType];

    showDropdown.value = false;
    await ChecklistClient.addDamagePoint(props.context, damagePoint);
    damagePoint.x *= present(canvas.value).clientWidth;
    damagePoint.y *= present(canvas.value).clientHeight;

    damagePoints.value.push(damagePoint);
  }
</script>

<style lang="scss">
  .c-damage-point-canvas {
    margin-top: .75rem;

    &-card {
      position: relative;

      &-background {
        width: 100%;
        height: 25rem;
        background-image: url('@/shared/assets/images/car-overview.svg');
        background-size: contain;
        background-repeat: no-repeat;
        position: relative;
      }
    }
  }
</style>