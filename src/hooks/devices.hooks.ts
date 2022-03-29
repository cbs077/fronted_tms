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
  swOldVersion: string;
  swFileNm: string;
  swFileSize: number;
  status: string;
  resultCode: string;
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
  firstUseDt: string;
  lastUseDt: string;
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
      swOldVersion: object.OLD_SW_VERSION,
      swFileNm: object.UPLOAD_FILE_NM,
      swFileSize: object.DATA_SIZE,
      description: object.DESCRIPTION,
      applicationDate:  object.REG_DT,
      deviceNumber:  object.CAT_SERIAL_NO,
      lastAccessDate: object.UPDATE_DT,
      modelCode: object.CAT_MODEL_ID,
      status: object.STATUS,
      resultCode: object.RESULT_CODE,
      swGroupCode: object.SW_GROUP_ID,
      swGroupNm: object.SW_GROUP_NM,
      vanCode: object.VAN_ID,
      van: object.VAN_NM,
      applicationUser: "SK TMS",
      deviceCount: object.tw_count,
      init: object.init_count,
      running: object.cur_count,
      idle: object.stop_count,
      swDownload: object.sw_count,
      address: object.ADDR1,
      contact: object.PHONE,
      manager: object.MANAGER_NM,
      regDt: object.REG_DT,
      regUser: object.REG_USER,
      userId: object.USER_ID,
      userNm: object.USER_NM,
      squad: object.USER_RIGHTS_NM,
      request: object.GUBUN,
      firstUseDt: object.FIRST_USE_DT,
      lastUseDt: object.LAST_USE_DT
    };

    return temporary
  };

  const renmeObjectAKey = {
    "SERIAL_NO_FROM": "단말기 시작 번호",
    "SERIAL_NO_TO": "단말기 마지막 번호",
    "CAT_MODEL_NM": "모델이름",
    "SW_VERSION": "버전",
    "OLD_SW_VERSION": "오래된버전",
    "UPLOAD_FILE_NM": "파일이름",
    "DATA_SIZE": "파일크기",
    "DESCRIPTION": "설명",
    "CAT_SERIAL_NO": "단말기번호",
    "UPDATE_DT": "업데이트날짜",
    "CAT_MODEL_ID": "모델코드",
    "STATUS": "상태",
    "RESULT_CODE": "결과상태",
    "SW_GROUP_ID": "S/W그룹코드",
    "SW_GROUP_NM": "S/W그룹이름",
    "VAN_ID": "VAN사",
    "VAN_NM": "VAN사명",
    "ADDR1": "주소",
    "PHONE": "핸드폰",
    "MANAGER_NM": "매니저",
    "REG_DT": "등록일",
    "REG_USER": "등록자",
    "USER_ID": "아이디",
    "USER_NM": "유저이름",
    "USER_RIGHTS_NM": "권한",
    "GUBUN": "구분",
    "FIRST_USE_DT": "첫사용",
    "LAST_USE_DT": "마지막사용",
    "FILE_PATH": "파일위치",
    "FILE_NM": "파일이름",
    "APPL_DT": "어플날짜",
    "FAX": "팩스",
    "USE_YN": "사용유무",
    "sw_count": "S/W 다운로드 수",
    "tw_count": "단말기 수량",
    "reg_dt": "등록일",
    "stop_count": "정지 수량",
    "init_count": "초기 수량",
    "cur_count": "현재 수량"
  }
  
  return {
    registrationHeaders,
    registrationHeaders_a,
    logHeaders,
    devices,
    update,
    renmeObjectKey,
    renmeObjectAKey    
  };
};
