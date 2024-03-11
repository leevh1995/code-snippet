import { parseEntities, parseEntity } from '@/shared/converters/baseConverters';
import ChecklistTemplate from '../models/ChecklistTemplate';

const SCHEMA = {
  id: 'id',
  description: 'description',
  countTotal: 'countTotal',
};

export function parseChecklistTemplate(data: any): ChecklistTemplate | null {
  return parseEntity(data, SCHEMA, ChecklistTemplate);
}

export function parseChecklistTemplates(data: any): Array<ChecklistTemplate> {
  return parseEntities(data, SCHEMA, ChecklistTemplate);
}
