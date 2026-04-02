export interface TreeModel {
  id: string;
  label: string;
  children?: TreeModel[];
  count: number;
  isDefaultExpanded?: boolean;
}
