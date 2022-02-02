import { reactive } from "vue";

import { IDataTableHeader } from "~/interfaces/data.interface";
import { dateFormat } from "~/utils/filter";

export interface IDevice {
  van: string;
  modelCode: string;
  deviceNumber: string;
  swGroupCode: string;
  swVersion: string;
  status: string;
  applicationDate: Date | string;
  lastAccessDate: Date | string;
  applicationUser: string;
  modelName: string;
  deviceNumberFrom?: string;
  deviceNumberTo?: string;
  checked?: boolean;
  deviceCount: number;
  init: number;
  running: number;
  idle: number;
  swDownload: number;
}

export const useDevice = () => {
  const devices = reactive<IDevice[]>([]);
  const registrationHeaders: IDataTableHeader[] = [
    { key: "van", value: "VAN사명", align: "center" },
    { key: "modelCode", value: "단말기 모델 코드", align: "center" },
    { key: "deviceNumber", value: "단말기 번호", align: "center" },
    { key: "swGroupCode", value: "S/W Group 코드", align: "center" },
    { key: "swVersion", value: "S/W Version", align: "center" },
    { key: "status", value: "상태", align: "center" },
    { key: "applicationDate", value: "등록일", align: "center" },
    { key: "lastAccessDate", value: "최종 접속일", align: "center" },
  ];
  const logHeaders: IDataTableHeader[] = [
    { key: "van", value: "VAN사명", align: "center" },
    { key: "modelName", value: "단말기 모델명", align: "center" },
    { key: "deviceNumberFrom", value: "단말기 번호 (From)", align: "center" },
    { key: "deviceNumberTo", value: "단말기 번호 (To)", align: "center" },
    { key: "applicationDate", value: "등록일", align: "center" },
    { key: "applicationUser", value: "등록자", align: "center" },
  ];

  const update = (newDevices: IDevice[]) => {
    devices.length = 0;
    devices.push(
      ...newDevices.map((device) => {
        return {
          ...device,
          applicationDate: dateFormat(device.applicationDate),
          lastAccessDate: dateFormat(device.lastAccessDate),
        };
      })
    );
  };

  // TODO: 이 아래 코드는 더미 데이터 입니다. 프로덕션 개발시 삭제 해주세요.
  const temporary: IDevice = {
    deviceNumberFrom: "Z118120500",
    deviceNumberTo: "Z118120600",
    modelName: "MPOS",
    swVersion: "1.0",
    applicationDate: new Date(),
    deviceNumber: "Z118120500",
    lastAccessDate: new Date(),
    modelCode: "3001",
    status: "초기1111상태",
    swGroupCode: "9998",
    van: "퍼스트데이터",
    applicationUser: "SK TMS",
    deviceCount: 10,
    init: 3,
    running: 8,
    idle: 10,
    swDownload: 20,
  };

  const temporaryData = [
    temporary,
    temporary,
    temporary,
    temporary,
    temporary,
    temporary,
    temporary,
    temporary,
    temporary,
    temporary,
    temporary,
    temporary,
    temporary,
    temporary,
    temporary,
    temporary,
    temporary,
    temporary,
  ];

  update(temporaryData);

  return {
    registrationHeaders,
    logHeaders,
    devices,
    update,
  };
};
