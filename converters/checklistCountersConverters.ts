import { parseEntity } from '@/shared/converters/baseConverters';
import { present } from '@/shared/utils/typescript';
import ChecklistCounters from '../models/ChecklistCounters';

const SCHEMA = {
  total: 'countTotal',
  caution: 'countAmber',
  good: 'countGreen',
  bad: 'countRed',
  answered: 'countAnswered',
};

export function parseChecklistCounters(data: any): ChecklistCounters {
  return present(parseEntity(data, SCHEMA, ChecklistCounters));
}
