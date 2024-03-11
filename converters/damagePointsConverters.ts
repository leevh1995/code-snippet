import { parseEntities, parseEntity } from '@/shared/converters/baseConverters';
import ChecklistDamagePoint from '../models/ChecklistDamagePoint';

const SCHEMA = {
  id: 'id',
  type: 'type',
  x: 'coordinateX',
  y: 'coordinateY',
};

export function parseDamagePoint(data: any): ChecklistDamagePoint | null {
  return parseEntity(data, SCHEMA, ChecklistDamagePoint);
}

export function parseDamagePoints(data: any): Array<ChecklistDamagePoint> {
  return parseEntities(data, SCHEMA, ChecklistDamagePoint);
}
