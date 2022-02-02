export interface INavMenuItem {
  text: string;
  to: string;
  href?: string;
}

export interface ILnbMenuItemSub {
  text: string;
  to: string;
}

export interface ILnbMenuItem {
  text: string;
  to?: string;
  open?: boolean;
  childs?: ILnbMenuItemSub[];
}
