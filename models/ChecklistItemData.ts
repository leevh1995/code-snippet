import { Moment } from 'moment';
import ChecklistScore from '../constants/ChecklistScore';
import exteriorItemType from '../constants/ExteriorItemType';

export interface ChecklistItemData {
  date?: Moment | null;
  score?: ChecklistScore | null;
  exteriorType?: exteriorItemType | null;
  numeric?: number | null;
  isNotApplicable: boolean;
}