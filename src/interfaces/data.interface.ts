export interface IDataTableHeader {
  key: string;
  value?: string;
  align?: "left" | "right" | "center";
}

export interface IDeviceRegistration {
  van: string;
  modelCode: string;
  deviceNumber: number;
  swGroupCode: string;
  swVersion: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDeviceLog {
  van: string;
  model: string;
  deviceNumberFrom: string;
  deviceNumberTo: string;
  createdAt: string;
  user: string;
}

// VAN사 사용조회
export interface IAdminDeviceVanUsage {
  van: string;
  totalTerminalCount: number;
  printerCutting: number;
  msrReading: number;
  contactIcCardInsert: number;
  rfCardInsert: number;
  hotlineTrade: number;
  cdmaTrade: number;
  lineTrade: number;
}

// 일자별 VAN 사용 조회
export interface IAdminDeviceVanUsageDaily extends IAdminDeviceVanUsage {
  date: string;
}

// 일자별 단말기 사용조회
export interface IAdminDeviceDeviceUsageDaily
  extends Omit<IAdminDeviceVanUsageDaily, "totalTerminalCount"> {
  deviceNumber: string;
  category: string;
}

// VAN사 사용조회 상세내용
export interface IAdminDeviceVanUsageDetail {
  deviceNumber: number;
  printerCuttingCount: number;
  msrReadingCount: number;
  contactIcCardInsertCount: number;
  rfCardInsertCount: number;
  hotlineTradeCount: number;
  cdmaTradeCount: number;
  lineTradeCount: number;
  firstDate: string;
  lastDate: string;
}

// 단말기 모델
export interface IAdminDeviceModel {
  van: string;
  modelId: string;
  model: string;
  date: string;
}

// 사용자
export interface IAdminUser {
  id: string;
  manager: string;
  squad: string;
  date: string;
  user: string;
}

export interface IAdminTransaction {
  van: string;
  swGroup: string;
  swVersion: string;
  deviceNumber: string;
  request: string;
  date: string;
  responseCode: string;
  status: string;
}

// VAN사 관리 조회
export interface IAdminVan {
  vanCode: string;
  van: string;
  address: string;
  contact: string;
  manager: string;
  date: string;
  user: string;
  fax: string;
}
