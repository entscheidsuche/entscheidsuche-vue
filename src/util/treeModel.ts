import { BIconTabletLandscape } from 'bootstrap-vue';

export interface TreeModel {
  id: string;
  pid?: string;
  name: string;
  hasChildren: boolean;
}
