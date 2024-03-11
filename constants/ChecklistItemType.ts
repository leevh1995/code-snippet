enum ChecklistItemType {
  TRIPLE_SCORE = 10,
  DOUBLE_SCORE = 11,
  SINGLE_SCORE = 12,
  EXTERIOR = 20,
  DATE = 50,
  MILEAGE = 60,
  INTEGER = 70,
}

export const SCORE_TYPES =  [
  ChecklistItemType.SINGLE_SCORE,
  ChecklistItemType.DOUBLE_SCORE,
  ChecklistItemType.TRIPLE_SCORE,
];

export const NUMERIC_TYPES =  [
  ChecklistItemType.MILEAGE,
  ChecklistItemType.INTEGER,
];

export default ChecklistItemType;