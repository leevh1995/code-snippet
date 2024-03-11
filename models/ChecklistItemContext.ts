import Dossier from '@/dossierV3/models/Dossier';
import Checklist from './Checklist';
import ChecklistItem from './ChecklistItem';

export default class ChecklistItemContext {
  checklist: Checklist;
  item: ChecklistItem;
  dossier: Dossier;

  constructor(checklist: Checklist, item: ChecklistItem, dossier: Dossier) {
    this.checklist = checklist;
    this.item = item;
    this.dossier = dossier;
  }
}