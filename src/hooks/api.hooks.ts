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
  description: string;
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
    { key: "modelName", value: "단말기 모델 코드", align: "center" },
    { key: "deviceNumber", value: "단말기 번호", align: "center" },
    { key: "swGroupCode", value: "S/W Group 코드", align: "center" },
    { key: "swVersion", value: "S/W Version", align: "center" },
    { key: "status", value: "상태", align: "center" },
    { key: "description", value: "상태", align: "center" },
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
    devices.length = 30;
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

  let renmeObjectKey = (object: any) => {
    const temporary: IDevice = {   
      deviceNumberFrom: "Z118120500",
      deviceNumberTo: "Z118120600",
      modelName: object.CAT_MODEL_NM,
      swVersion: object.SW_VERSION,
      description: object.DESCRIPTION,
      applicationDate:  object.REG_DT,
      deviceNumber:  object.CAT_SERIAL_NO,
      lastAccessDate: object.UPDATE_DT,
      modelCode: object.CAT_MODEL_ID,
      status: object.STATUS,
      swGroupCode: object.SW_GROUP_ID,
      van: object.VAN_ID,
      applicationUser: "SK TMS",
      deviceCount: 10,
      init: 3,
      running: 8,
      idle: 10,
      swDownload: 20,
    };

    //console.log("temporary", temporary)
    //delete object.CAT_SERIAL_NO;
    return temporary
  };

  return {
    registrationHeaders,
    logHeaders,
    devices,
    update,
    renmeObjectKey    
  };
};
