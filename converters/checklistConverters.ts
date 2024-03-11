import { BASE_SCHEMA, parseEntities, parseEntity, parseMoment } from '@/shared/converters/baseConverters';
import { parseComments } from '@/shared/converters/commentConverters';
import { parseUser } from '@/shared/converters/userConverters';
import { Lookup, present } from '@/shared/utils/typescript';
import { ABSTRACT_JOB_SCHEMA } from '../../jobs/converters/jobConverters';
import { JobId } from '../../jobs/models/AbstractJob';
import ChecklistItemType, { NUMERIC_TYPES } from '../constants/ChecklistItemType';
import Checklist from '../models/Checklist';
import ChecklistItem, { ChecklistResult } from '../models/ChecklistItem';
import ChecklistItemUpdateResult from '../models/ChecklistItemUpdateResult';
import ChecklistSection from '../models/ChecklistSection';
import { parseSignatureSummaries } from './SignatureSummaryConverters';
import { parseChecklistCounters } from './checklistCountersConverters';
import { parseDamagePoints } from './damagePointsConverters';

const SCHEMA = {
  ...BASE_SCHEMA,
  counters: (data: any) => parseChecklistCounters(data),
  description: 'description',
  visibleToCustomer: 'isB2CVisible',
  finishedBy: (data: any) => parseUser(data.finishedBy),
  finishedOn: (data: any) => parseMoment(data.finishedOn),
  sections: (data: any) => parseChecklistSections(data.sections),
  signatureSummaries: (data: any) => parseSignatureSummaries(data.signatureInfo),
};

const SECTION_SCHEMA = {
  id: 'id',
  position: 'position',
  description: 'description',
};

const ITEM_SCHEMA = {
  ...ABSTRACT_JOB_SCHEMA,
  position: 'position',
  shortDescription: 'shortDescription',
  type: 'responseType',
  result: (data: any) => parseResult(data.result, data.responseType),
  status: 'status',
  sectionId: 'sectionId',
  damagePoints: (data: any) => parseDamagePoints(data.damagePoints),
  comments: (data: any) => parseComments(data.comments),
  isExcluded: 'isExcluded',
};

function parseResult(value: any, type: ChecklistItemType): ChecklistResult {
  if (typeof value !== 'string') return null;
  if (type === ChecklistItemType.DATE) return parseMoment(value);
  if (NUMERIC_TYPES.includes(type)) return Number(value.replace(',', '.'));
  return Number(value);
}

export function parseChecklist(data: any): Checklist | null {
  const checklist = parseEntity(data, SCHEMA, Checklist);
  checklist?.sections.forEach(section => {
    const itemDataList = data.items.filter((itemData: any) => itemData.sectionId === section.id);
    section.items = parseChecklistItems(itemDataList);
  });
  return checklist;
}

export function parseChecklists(data: any): Array<Checklist> {
  return parseEntities(data, parseChecklist);
}

export function parseChecklistSections(data: any): Array<ChecklistSection> {
  return parseEntities(data, SECTION_SCHEMA, ChecklistSection);
}

export function parseChecklistItems(data: any): Array<ChecklistItem> {
  return parseEntities(data, ITEM_SCHEMA, ChecklistItem);
}

export function parseChecklistItemResults(data: any, getType: Lookup<JobId, ChecklistItemType>): Array<ChecklistItemUpdateResult> {
  return parseEntities(data, d => parseChecklistItemUpdateResult(d, present(getType(d.jobId), 'no type found for checklist item')));
}

export function parseChecklistItemUpdateResult(data: any, type: ChecklistItemType): ChecklistItemUpdateResult {
  return {
    itemId: data.jobId,
    result: parseResult(data.result, type),
    status: data.status,
  };
}