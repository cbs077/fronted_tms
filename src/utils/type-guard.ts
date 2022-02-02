import { INavMenuItem } from "~/interfaces/menu.interface";

export const isNavMenu = (value: any): value is INavMenuItem => {
  return "text" in value && "to" in value;
};
