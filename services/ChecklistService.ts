import { DossierId } from 'src/dossierV3/models/AbstractDossier';
import { markRaw, reactive } from 'vue';
import Dossier from '@/dossierV3/models/Dossier';
import MediaFileType from '@/shared/constants/MediaFileType';
import MediaTargetType from '@/shared/constants/MediaTargetType';
import serviceEvents, { DiagnosticRemoved, DiagnosticSaved, JobTagsUpdated, MediaRemoved, MediaUploaded } from '@/shared/services/serviceEvents';
import { mergeInto, removeById } from '@/shared/utils';
import { Nullish, present } from '@/shared/utils/typescript';
import { JobId } from '../../jobs/models/AbstractJob';
import ChecklistClient from '../client/ChecklistClient';
import Checklist, { ChecklistId } from '../models/Checklist';
import ChecklistDamagePoint from '../models/ChecklistDamagePoint';
import ChecklistItem from '../models/ChecklistItem';
import ChecklistItemContext from '../models/ChecklistItemContext';
import { ChecklistItemData } from '../models/ChecklistItemData';
import ChecklistSection from '../models/ChecklistSection';
import ChecklistTemplate, { ChecklistTemplateId } from '../models/ChecklistTemplate';
import { SignatureData } from '../models/SignatureSummary';

class ChecklistService {
  private list: Array<Checklist> = [];

  startEventListeners(): this {
    serviceEvents.on(JobTagsUpdated, e => {
      this.list.flatMap(c => c.sections)
        .flatMap(s => s.items).filter(i => i.id === e.job.id)
        .forEach(i => i.tags = e.job.tags);
    });
    serviceEvents.on(MediaUploaded, e => this.updateMediaCounts(e));
    serviceEvents.on(MediaRemoved, e => this.updateMediaCounts(e));
    serviceEvents.on(DiagnosticSaved, e => this.updateDiagnosticCount(e));
    serviceEvents.on(DiagnosticRemoved, e => this.updateDiagnosticCount(e));
    return this;
  }

  getList(): Array<Checklist> {
    return this.list;
  }

  getById(id: ChecklistId): Checklist | null {
    return this.list.find(c => c.id === id) || null;
  }

  async loadAllTemplates(dossierId: DossierId): Promise<Array<ChecklistTemplate>> {
    const checklistTemplates = await ChecklistClient.loadAllTemplates(dossierId);
    return checklistTemplates.map(markRaw);
  }

  async add(id: ChecklistTemplateId, dossier: Dossier): Promise<void> {
    const newChecklist = await ChecklistClient.add(id, dossier.id);
    mergeInto(newChecklist, this.list);
    dossier.hasChecklists = true;
  }

  async loadAll(dossier: Dossier): Promise<void> {
    if (dossier.hasChecklists) {
      this.list = await ChecklistClient.loadAll(dossier.id);
    } else {
      this.list = [];
    }
  }

  async loadDetails(id: ChecklistId, dossierId: DossierId): Promise<void> {
    const checklist = await ChecklistClient.loadDetail(id, dossierId);
    mergeInto(checklist, this.list);
  }

  async delete(id: ChecklistId, dossierId: DossierId): Promise<void> {
    await ChecklistClient.delete(id, dossierId);
    removeById(this.list, id);
  }

  async sign(checklist: Checklist, signatureData: SignatureData): Promise<void> {
    checklist.signatureSummaries = await ChecklistClient.sign(present(checklist.id), signatureData);
  }

  async toggleVisibleToCustomer(checklist: Checklist): Promise<void> {
    const newValue = !checklist.visibleToCustomer;
    await ChecklistClient.updateVisibleToCustomer(present(checklist.id), newValue);
    checklist.visibleToCustomer = newValue;
  }

  async checkAllSectionItems(checklist: Checklist, section: ChecklistSection, dossier: Dossier): Promise<void> {
    const getItemType = (id: Nullish<JobId>) => section.items.find(i => i.id === id)?.type ?? null;
    const results = await ChecklistClient.checkAllSectionItems(section.id, dossier.id, getItemType);
    checklist.counters.answered += results.length;
    results.forEach(result => {
      section.items.find(i => i.id === result.itemId)?.update(result);
    });
  }

  selectItem(checklist: Checklist, item: ChecklistItem): ChecklistItem {
    const items = checklist.sections.flatMap(s => s.items);
    return present(items.find(i => i.id === item.id));
  }

  async updateItem(context: ChecklistItemContext, data: ChecklistItemData): Promise<void> {
    const result = await ChecklistClient.updateItem(context.item, data, context.dossier.id);
    const selectedItem = this.selectItem(context.checklist, context.item);
    if ((result.result === 0 && result.status === 0)) {
      context.checklist.counters.answered--;
    } else if (!context.item.result && result.result) {
      context.checklist.counters.answered++;
    }
    selectedItem.update(result);
  }

  async deleteDamagePoint(context: ChecklistItemContext, damagePoint: ChecklistDamagePoint): Promise<void> {
    await ChecklistClient.deleteDamagePoint(present(damagePoint.id), context.item.id, context.dossier.id);
    const selectedItem = this.selectItem(context.checklist, context.item);
    removeById(selectedItem.damagePoints, damagePoint.id);
  }

  updateMediaCounts(event: MediaUploaded | MediaRemoved): void {
    if (event.target.type !== MediaTargetType.JOB) return;
    const item = this.getItem(event.target.id);
    if (!item) return;
    const amount = event instanceof MediaUploaded ? 1 : -1;
    switch (event.mediaFile.type) {
      case MediaFileType.PDF:
        item.attachmentCount += amount;
        break;
      case MediaFileType.IMAGE:
        item.imageCount += amount;
        break;
      case MediaFileType.VIDEO:
        item.videoCount += amount;
        break;
    }
  }

  updateDiagnosticCount(event: DiagnosticSaved | DiagnosticRemoved): void {
    const item = this.getItem(event.jobId);
    if (!item) return;
    if (event instanceof DiagnosticRemoved) {
      item.diagnosticCount--;
    } else if (event.isCreation()) {
      item.diagnosticCount++;
    }
  }

  private getItem(id: JobId): ChecklistItem | undefined {
    for (const checklist of this.list) {
      for (const section of checklist.sections) {
        for (const item of section.items) {
          if (item.id === id) return item;
        }
      }
    }
  }
}

export default reactive(new ChecklistService()).startEventListeners();