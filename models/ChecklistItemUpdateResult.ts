import { JobId } from '../../jobs/models/AbstractJob';
import ChecklistItemStatus from '../constants/ChecklistItemStatus';
import { ChecklistResult } from './ChecklistItem';

export default interface ChecklistItemUpdateResult {
  itemId: JobId;
  result: ChecklistResult;
  status: ChecklistItemStatus;
}