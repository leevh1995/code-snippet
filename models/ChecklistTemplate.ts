export interface ChecklistTemplateId {__checklistTemplateId: number}

export default class ChecklistTemplate {
  id: ChecklistTemplateId | null = null;
  description = '';
  countTotal!: number;
}
