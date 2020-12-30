import { BIconTabletLandscape } from 'bootstrap-vue';

export interface TreeModel {
  id: string;
  label: string;
  children?: TreeModel[];
  count: number;
  isDisabled: boolean;
}
