import axios from 'axios';
import { DossierId } from '@/dossier/models/AbstractDossier';
import ChecklistTemplateType from '@/dossierV3/constants/ChecklistTemplateType';
import { formatMoment } from '@/shared/converters/baseConverters';
import { Lookup, present } from '@/shared/utils/typescript';
import { JobId } from '../../jobs/models/AbstractJob';
import ChecklistItemType from '../constants/ChecklistItemType';
import { parseSignatureSummaries } from '../converters/SignatureSummaryConverters';
import { parseChecklist, parseChecklistItemResults, parseChecklistItemUpdateResult, parseChecklists } from '../converters/checklistConverters';
import { parseChecklistTemplates } from '../converters/checklistTemplateConverters';
import Checklist, { ChecklistId } from '../models/Checklist';
import ChecklistDamagePoint, { ChecklistDamagePointId } from '../models/ChecklistDamagePoint';
import ChecklistItem from '../models/ChecklistItem';
import ChecklistItemContext from '../models/ChecklistItemContext';
import { ChecklistItemData } from '../models/ChecklistItemData';
import ChecklistItemUpdateResult from '../models/ChecklistItemUpdateResult';
import { ChecklistSectionId } from '../models/ChecklistSection';
import ChecklistTemplate, { ChecklistTemplateId } from '../models/ChecklistTemplate';
import SignatureSummary, { SignatureData } from '../models/SignatureSummary';

export default class ChecklistClient {
  static async loadAllTemplates(dossierId: DossierId): Promise<Array<ChecklistTemplate>> {
    const response = await axios.get('/api/mobopro/v1/checklistTemplates', {
      params: { dossierId, type: ChecklistTemplateType.NON_CHECKIN, autosuggest: 'false' },
    });
    return parseChecklistTemplates(response.data);
  }

  static async loadAll(dossierId: DossierId): Promise<Array<Checklist>> {
    const response = await axios.get(`/api/mobopro/v1/dossiers/${dossierId}/checklists`);
    return parseChecklists(response.data);
  }

  static async loadDetail(id: ChecklistId, dossierId: DossierId): Promise<Checklist> {
    const response = await axios.get(`/api/mobopro/v1/dossiers/${dossierId}/checklists/${id}`);
    return present(parseChecklist(response.data));
  }

  static async add(id: ChecklistTemplateId, dossierId: DossierId): Promise<Checklist> {
    const response = await axios.post('/api/mobopro/v2/checklisttemplatetodossier', null, {
      params: { dossierId, checklistTemplateId: id },
    });
    return present(parseChecklist(response.data));
  }

  static async delete(id: ChecklistId, dossierId: DossierId): Promise<void> {
    await axios.delete(`/api/mobopro/v1/dossiers/${dossierId}/checklists/${id}`);
  }

  static async sign(id: ChecklistId, signatureData: SignatureData): Promise<Array<SignatureSummary>> {
    const response = await axios.put(`/api/mobopro/v1/checklists/${id}/signature`, [{
      roleId: signatureData.role.id,
      isSigned: signatureData.isSigned,
    }]);
    return parseSignatureSummaries(response.data.signatureInfo);
  }

  static async updateVisibleToCustomer(id: ChecklistId, visibleToCustomer: boolean): Promise<void> {
    await axios.patch(`/api/mobopro/v1/checklists/${id}`, { isB2CVisible: visibleToCustomer });
  }

  static async checkAllSectionItems(sectionId: ChecklistSectionId, dossierId: DossierId, getType: Lookup<JobId, ChecklistItemType>): Promise<Array<ChecklistItemUpdateResult>> {
    const response = await axios.put(`/api/mobopro/v1/dossiers/${dossierId}/checklistsectionresult/${sectionId}`);
    return parseChecklistItemResults(response.data, getType);
  }

  static async updateItem(item: ChecklistItem, checklistItemData: ChecklistItemData, dossierId: DossierId): Promise<ChecklistItemUpdateResult> {
    const response = await axios.put(`/api/mobopro/v1/dossiers/${dossierId}/jobs/${item.id}/checklistresult`, {
      result: formatMoment(checklistItemData.date)
        || checklistItemData.score?.toString()
        || checklistItemData.exteriorType?.toString()
        || checklistItemData.numeric?.toString()
        || null,
      isNotApplicable: checklistItemData.isNotApplicable,
    });
    return present(parseChecklistItemUpdateResult(response.data, item.type));
  }

  static async addDamagePoint(context: ChecklistItemContext, damagePoint: ChecklistDamagePoint): Promise<void> {
    await axios.post(`/api/mobopro/v1/dossiers/${context.dossier.id}/jobs/${context.item.id}/damagepoints`, {
      coordinateX: damagePoint.x,
      coordinateY: damagePoint.y,
      type: damagePoint.type,
    });
  }

  static async deleteDamagePoint(damagePointId: ChecklistDamagePointId, itemId: JobId, dossierId: DossierId): Promise<void> {
    await axios.delete(`/api/mobopro/v1/dossiers/${dossierId}/jobs/${itemId}/damagepoints/${damagePointId}`);
  }
}
