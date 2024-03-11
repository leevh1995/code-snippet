import ChecklistItem from './ChecklistItem';

export interface ChecklistSectionId {__checklistSectionId: number}

export default class ChecklistSection {
  id!: ChecklistSectionId;
  position = 0;
  description = '';
  isExpanded = false;
  items: Array<ChecklistItem> = [];
}
