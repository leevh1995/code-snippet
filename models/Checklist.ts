import { Moment } from 'moment';
import BaseModel from '@/shared/models/BaseModel';
import User from '@/shared/models/User';
import ChecklistScore from '../constants/ChecklistScore';
import ChecklistCounters from './ChecklistCounters';
import ChecklistSection from './ChecklistSection';
import SignatureSummary from './SignatureSummary';

export interface ChecklistId {__checklistId: number}

export default class Checklist extends BaseModel<ChecklistId> {
  status: ChecklistScore | null = null;
  description = '';
  counters!: ChecklistCounters;
  finishedOn: Moment | null = null;
  finishedBy: User | null = null;
  sections: Array<ChecklistSection> = [];
  visibleToCustomer = false;
  signatureSummaries: Array<SignatureSummary> = [];
}
