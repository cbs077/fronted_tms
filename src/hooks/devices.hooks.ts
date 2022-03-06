import { reactive } from "vue";

import { IDataTableHeader } from "~/interfaces/data.interface";
import { dateFormat } from "~/utils/filter";


export interface IDevice {
  van: string;
  vanCode: string;
  modelCode: string;
  deviceNumber: string;
  swGroupCode: string;
  swGroupNm: string;
  swVersion: string;
  swFileNm: string;
  swFileSize: number;
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
  address: string;
  contact: string;
  manager: string;
  regDt: Date | string;
  regUser: string;
  userId: string;
  userNm: string;
  squad: string;
  request: string;
}

export const useDevice = () => {
  const devices = reactive<IDevice[]>([]);
  const registrationHeaders: IDataTableHeader[] = [
    { key: "van", value: "VAN사명", align: "center" },
    { key: "modelCode", value: "단말기 모델 코드", align: "center" },
    { key: "modelName", value: "단말기 모델 코드", align: "center" },
    { key: "deviceNumber", value: "단말기 번호", align: "center" },
    { key: "swGroupCode", value: "S/W Group 코드", align: "center" },
    { key: "swGroupNm", value: "S/W Group 명", align: "center" },
    { key: "swVersion", value: "S/W Version", align: "center" },
    { key: "status", value: "상태", align: "center" },
    { key: "description", value: "상태", align: "center" },
    { key: "applicationDate", value: "등록일", align: "center" },
    { key: "lastAccessDate", value: "최종 접속일", align: "center" },
  ];

  const registrationHeaders_a: IDataTableHeader[] = [
    //{ key: "van", value: "VAN사명", align: "center" },
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
      deviceNumberFrom: object.SERIAL_NO_FROM,
      deviceNumberTo: object.SERIAL_NO_TO,
      modelName: object.CAT_MODEL_NM,
      swVersion: object.SW_VERSION,
      swFileNm: object.UPLOAD_FILE_NM,
      swFileSize: object.DATA_SIZE,
      description: object.DESCRIPTION,
      applicationDate:  object.REG_DT,
      deviceNumber:  object.CAT_SERIAL_NO,
      lastAccessDate: object.UPDATE_DT,
      modelCode: object.CAT_MODEL_ID,
      status: object.STATUS,
      swGroupCode: object.SW_GROUP_ID,
      swGroupNm: object.SW_GROUP_NM,
      vanCode: object.VAN_ID,
      van: object.VAN_NM,
      applicationUser: "SK TMS",
      deviceCount: 10,
      init: 3,
      running: 8,
      idle: 10,
      swDownload: 20,
      address: object.ADDR1,
      contact: object.PHONE,
      manager: object.MANAGER_NM,
      regDt: object.REG_DT,
      regUser: object.REG_USER,
      userId: object.USER_ID,
      userNm: object.USER_NM,
      squad: object.USER_RIGHTS_NM,
      request: object.GUBUN
    };

    return temporary
  };

  return {
    registrationHeaders,
    registrationHeaders_a,
    logHeaders,
    devices,
    update,
    renmeObjectKey    
  };
};
