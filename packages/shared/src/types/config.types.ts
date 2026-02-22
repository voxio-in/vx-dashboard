import { Role } from "../constants/roles";
import { UIComponentId } from "../constants/ui-registry";

export interface ISidebarItem {
  id: UIComponentId;
  label: string;
  path: string;
  icon: string;
  roles: Role[]; // which roles can see this item
  order: number;
  isVisible: boolean;
}

export interface IUIConfig {
  hiddenComponents: UIComponentId[]; // components turned off
  sidebarItems: ISidebarItem[];
}

export interface IGlobalConfig {
  _id: string;
  defaultUIConfig: IUIConfig; // base config for everyone
  roleOverrides: Record<Role, Partial<IUIConfig>>; // per role overrides
  updatedAt: string;
}

export interface IResolvedConfig {
  // final merged config sent to frontend
  hiddenComponents: UIComponentId[];
  sidebarItems: ISidebarItem[];
}
