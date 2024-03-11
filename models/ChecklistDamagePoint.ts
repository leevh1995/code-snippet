import ChecklistDamagePointType from '../constants/ChecklistDamagePointType';

export interface ChecklistDamagePointId {__checklistDamagePointId: number}

export default class ChecklistDamagePoint{
  id: ChecklistDamagePointId | null = null;
  type: ChecklistDamagePointType | null = null;
  x: number | null = null;
  y: number | null = null;
}
