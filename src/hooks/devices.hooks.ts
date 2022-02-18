import { reactive } from "vue";
import  axios, { AxiosResponse } from "axios";

import { IDataTableHeader } from "~/interfaces/data-table.interface";
import { dateFormat } from "~/utils/filter";
import { info } from "console";

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
    console.log("newDevices", newDevices)
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

  const login = (firstName: string) => {
    const response = 
      axios.get('http://tms-test-server.p-e.kr:8081/login?user_id=cbs&password=abc1')
      .then(response => {
          //console.log(response.data);
      });
    console.log(response);
    return firstName;
  };

  let renmeObjectKey = (object: any) => {
    const temporary: IDevice = {   
      deviceNumberFrom: "Z118120500",
      deviceNumberTo: "Z118120600",
      modelName: object.CAT_MODEL_ID,
      swVersion: "1.0",
      applicationDate:  object.REG_DT,
      deviceNumber:  object.CAT_SERIAL_NO,
      lastAccessDate: object.UPDATE_DT,
      modelCode: "3001",
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

    console.log("temporary", temporary)
    //delete object.CAT_SERIAL_NO;
    return temporary
  };

  const getTerminal = (firstName: string) => {
    let data: any[] = [];

    axios.get('http://tms-test-server.p-e.kr:8081/terminal/list?page=1&page_count=2')
    .then(response => {
      var list = response.data.list
      //console.log("list", response.data.list);

      for (var object of list){
        //console.log("object", object);
        var obj = renmeObjectKey(object);
        data.push(obj);
      }     
      //console.log("getTerminal1", data)   
      update(data); 
    });

    //console.log("getTerminal", data)
    //return data;
  };

  // TODO: 이 아래 코드는 더미 데이터 입니다. 프로덕션 개발시 삭제 해주세요.
  // const temporary: IDevice = {
  //   deviceNumberFrom: "Z118120500",
  //   deviceNumberTo: "Z118120600",
  //   modelName: "MPOS",
  //   swVersion: "1.0",
  //   applicationDate: new Date(),
  //   deviceNumber: "Z118120500",
  //   lastAccessDate: new Date(),
  //   modelCode: "3001",
  //   status: "초기1111상태",
  //   swGroupCode: "9998",
  //   van: "퍼스트데이터",
  //   applicationUser: "SK TMS",
  //   deviceCount: 10,
  //   init: 3,
  //   running: 8,
  //   idle: 10,
  //   swDownload: 20,
  // };

  // const temporaryData = [
  //   temporary,
  //   temporary,
  //   temporary,
  //   temporary,
  //   temporary,
  //   temporary,
  //   temporary,
  //   temporary,
  //   temporary,
  //   temporary,
  //   temporary,
  //   temporary,
  //   temporary,
  //   temporary,
  //   temporary,
  //   temporary,
  //   temporary,
  //   temporary,
  // ];

  login("aa");
  getTerminal("aa")

  return {
    registrationHeaders,
    logHeaders,
    devices,
    update,
    login,
    getTerminal
  };
};
