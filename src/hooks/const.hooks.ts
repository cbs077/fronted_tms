import { reactive } from "vue";
import  axios, { AxiosResponse } from "axios";
import { ILnbMenuItem, INavMenuItem } from "~/interfaces/menu.interface";
import { useStore } from "vuex";

const rawGnb: INavMenuItem[] = [


];

const gnbs = (isVan): INavMenuItem[] => {
  const store = useStore();
  isVan = window.localStorage.getItem("is_van")
  isVan = store.getters.isVan
  //let prefix = isVan ? "/van" : "/admin";
  let prefix = "/van" 
  let temporary = [...rawGnb];

  if (!isVan) { // admin
    temporary.push(
      {
        text: "단말기관리",
        to: `/devices/registrations`,
      },
      {
        text: "사용자관리",
        to: `/accounts/users/my`,
      },
      {
        text: "모니터링",
        to: `/monitors/transactions`,
      },
      {
        text: "S/W 관리",
        to: `/sw-managements/groups/registrations`,
      },
      {
        text: "VAN사 관리",
        to: `/vans`,
      },
    );
  }

  if (isVan) { // admin
    console.log("van~~")
    temporary.push(
      {
        text: "단말기관리",
        to: `/devices/registrations`,
      },
      {
        text: "사용자관리",
        to: `/accounts/users/my`,
      },
      {
        text: "모니터링",
        to: `/monitors/transactions`,
      },
      {
        text: "S/W 관리",
        to: `/sw-managements/groups/registrations`,
      },
    );
  }
  
  return temporary.map((gnb) => {
    return { ...gnb, to: `${prefix}${gnb.to}` };
  });
};

const statusOptions = [
  { id: 1, key: "R", value: "휴면상태" },
  { id: 2, key: "U", value: "사용중" },
  { id: 3, key: "A", value: "초기상태" },
  { id: 4, key: "ST", value: "거래정지" },
];

const searchOptions = [
  { id: 1, key: "sw_group_id", value: "S/W Group 코드" },
  { id: 2, key: "sw_version", value: "S/W Version" },
  { id: 3, key: "cat_serial_no", value: "단말기 번호" },
  { id: 4, key: "cat_model_id", value: "단말기 모델" },
];

const SWsearchOptions = [
  { id: 1, key: "sw_group_id", value: "S/W Group 코드" },
  { id: 2, key: "sw_version", value: "S/W Version" },
];

const lnbs = (isVan: boolean) => {
  //const prefix = isVan ? "/van" : "/admin";
  const prefix = "/van" 
  return {
    devices: (): ILnbMenuItem[] => [
      {
        text: "단말기",
        open: true,
        childs: isVan
          ? [
              { text: "조회 및 등록", to: `${prefix}/devices/registrations` },
              { text: "등록이력", to: `${prefix}/devices/logs` },
              { text: "삭제", to: `${prefix}/devices/un-registrations` },
            ]
          : [{ text: "조회", to: `${prefix}/devices/registrations` }],
      },
      {
        text: "단말기 현황",
        open: true,
        childs: [{ text: "Van사별 현황", to: `${prefix}/devices/vans` }],
      },
      /*
      {
        text: "단말기 사용정보",
        open: true,
        childs: isVan
          ? [{ text: "조회", to: `${prefix}/devices/usages` }]
          : [
              { text: "조회", to: `${prefix}/devices/usages` },
              // { text: "VAN사 사용조회", to: `${prefix}/devices/vans-usage` },
              // {
              //   text: "일자별 VAN사 사용조회",
              //   to: `${prefix}/devices/vans-usage-daily`,
              // },
              // {
              //   text: "일자별 단말기 사용조회",
              //   to: `${prefix}/devices/devices-usage-daily`,
              // },
            ],
      },*/
      {
        text: "단말기 모델",
        open: true,
        childs: [{ text: "조회 및 등록", to: `${prefix}/devices/models` }],
      },
    ],
    accounts: (): ILnbMenuItem[] => {
      return [
        {
          text: "사용자 관리",
          childs: isVan
            ? [
                {
                  text: "개인정보",
                  to: `${prefix}/accounts/users/my`,
                },
              ]
            : [
                {
                  text: "개인정보",
                  to: `${prefix}/accounts/users/my`,
                },/*
                {
                  text: "개인정보 조회",
                  to: `${prefix}/accounts/users`,
                }, */
                {
                  text: "개인정보 등록",
                  to: `${prefix}/accounts/users/registration`,
                },
              ],
        },
      ];
    },
    monitors: (): ILnbMenuItem[] => {
      return [
        {
          text: "모니터링",
          open: true,
          childs: [
            {
              text: "Transaction 조회",
              to: `${prefix}/monitors/transactions`,
            },
          ],
        },
      ];
    },
    swManagements: (): ILnbMenuItem[] => {
      return [
        {
          text: "S/W Group 관리",
          childs: [
            {
              text: isVan ? "S/W Group 조회 및 등록" : "S/W 조회 및 등록",
              to: `${prefix}/sw-managements/groups/registrations`,
            },
          ],
        },
        {
          text: "운영 S/W 관리",
          childs: [
            {
              text: isVan ? "S/W 조회 및 등록" : "S/W 조회 및 등록",
              to: `${prefix}/sw-managements/productions/registrations`,
            },
            /* 임시 제한
            {
              text: "S/W Upgrade 이력",
              to: `${prefix}/sw-managements/productions/sw-upgrades`,
            },
            {
              text: "단말기 Update 이력",
              to: `${prefix}/sw-managements/productions/device-updates`,
            },
            */
          ],
        },
        // {
        //   text: "테스트 S/W 관리",
        //   childs: [
        //     {
        //       text: isVan ? "S/W 조회 및 등록" : "S/W 조회 및 등록",
        //       to: `${prefix}/sw-managements/sandboxes/registrations`,
        //     },
        //     {
        //       text: "S/W Upgrade 이력",
        //       to: `${prefix}/sw-managements/sandboxes/sw-upgrades`,
        //     },
        //     {
        //       text: "단말기 Update 이력",
        //       to: `${prefix}/sw-managements/sandboxes/device-updates`,
        //     },
        //   ],
        // },
      ];
    },
    vans: (): ILnbMenuItem[] => {
      return [
        {
          text: "VAN사 관리",
          open: true,
          childs: [
            {
              text: "VAN사 관리 조회",
              to: `${prefix}/vans`,
            },
            {
              text: "VAN사 관리 등록",
              to: `${prefix}/vans/registrations`,
            },
          ],
        },
      ];
    },
  };
};

const take = reactive({
  select: "20개씩",
  available: [{ key: 20, value: "20개씩" }, { key: 50, value: "50개씩" }, { key: 100, value: "100개씩" }],
});

export const useConst = () => {
  return {
    gnbs,
    lnbs,
    searchOptions,
    statusOptions,
    //SGsearchOptions,
    SWsearchOptions,
    take,
  };
};
