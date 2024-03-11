import ChecklistItemType from './ChecklistItemType';

enum ChecklistScore {
  GOOD = 1,
  CAUTION = 2,
  BAD = 3,
  NOT_APPLICABLE = 99,
}

export default ChecklistScore;

export const CHECKLIST_SCORE_OPTIONS = {
  [ChecklistItemType.TRIPLE_SCORE]: [ChecklistScore.GOOD, ChecklistScore.CAUTION, ChecklistScore.BAD],
  [ChecklistItemType.DOUBLE_SCORE]: [ChecklistScore.GOOD, ChecklistScore.BAD],
  [ChecklistItemType.SINGLE_SCORE]: [ChecklistScore.GOOD],
};