import { Moment } from 'moment';
import Comment from 'src/shared/models/Comment';
import AbstractJob from '../../jobs/models/AbstractJob';
import ChecklistItemStatus from '../constants/ChecklistItemStatus';
import ChecklistItemType from '../constants/ChecklistItemType';
import ChecklistScore from '../constants/ChecklistScore';
import ExteriorItemType from '../constants/ExteriorItemType';
import ChecklistDamagePoint from './ChecklistDamagePoint';
import ChecklistItemUpdateResult from './ChecklistItemUpdateResult';
import { ChecklistSectionId } from './ChecklistSection';

export type ChecklistResult = number | ExteriorItemType | ChecklistScore | Moment | null;

export default class ChecklistItem extends AbstractJob {
  result: ChecklistResult = null;
  status = ChecklistItemStatus.DISABLED;
  position = 0;
  shortDescription = '';
  type!: ChecklistItemType;
  sectionId!: ChecklistSectionId;
  comments: Array<Comment> = [];
  damagePoints: Array<ChecklistDamagePoint> = [];
  isExcluded = false;

  update(updateResult: ChecklistItemUpdateResult): void {
    this.result = updateResult.result;
    this.status = updateResult.status;
  }
}
