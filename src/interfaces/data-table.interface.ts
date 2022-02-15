export interface IDataTableItem {
  key: string;
  value: unknown;
  label?: string;
}

export interface IDataTableHeader {
  key: string;
  value?: string;
  align?: "left" | "right" | "center";
}
