import { reactive } from "vue";

import { ILnbMenuItem, INavMenuItem } from "~/interfaces/menu.interface";

const rawGnb: INavMenuItem[] = [
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
];

const gnbs = (isVan = true): INavMenuItem[] => {
  const prefix = isVan ? "/van" : "/admin";
  const temporary = [...rawGnb];

  if (!isVan) {
    temporary.push({
      text: "VAN사 관리",
      to: `/vans`,
    });
  }

  return temporary.map((gnb) => {
    return { ...gnb, to: `${prefix}${gnb.to}` };
  });
};

const searchOptions = [
  { id: 1, key: "sw_group_id", value: "S/W Group 코드" },
  { id: 2, key: "sw_version", value: "S/W Version" },
  { id: 3, key: "cat_serial_no", value: "단말기 번호" },
  { id: 4, key: "cat_model_id", value: "단말기 모델" },
];

const swVersions = [{ value: "1.0" }, { value: "1.1" }, { value: "1.2" }];
const swGroupCodes = [{ value: "1111" }, { value: "2222" }, { value: "3333" }];
const deviceModels = [{ value: "3001" }, { value: "3002" }, { value: "3003" }];

const lnbs = (isVan: boolean) => {
  const prefix = isVan ? "/van" : "/admin";
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
      {
        text: "단말기 사용정보",
        open: true,
        childs: isVan
          ? [{ text: "조회", to: `${prefix}/devices/usages` }]
          : [
              { text: "조회", to: `${prefix}/devices/usages` },
              { text: "VAN사 사용조회", to: `${prefix}/devices/vans-usage` },
              {
                text: "일자별 VAN사 사용조회",
                to: `${prefix}/devices/vans-usage-daily`,
              },
              {
                text: "일자별 단말기 사용조회",
                to: `${prefix}/devices/devices-usage-daily`,
              },
            ],
      },
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
                },
                {
                  text: "개인정보 조회",
                  to: `${prefix}/accounts/users`,
                },
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
              text: isVan ? "S/W Group 조회 및 등록" : "S/W 조회",
              to: `${prefix}/sw-managements/groups/registrations`,
            },
          ],
        },
        {
          text: "운영 S/W 관리",
          childs: [
            {
              text: isVan ? "S/W 조회 및 등록" : "S/W 조회",
              to: `${prefix}/sw-managements/productions/registrations`,
            },
            {
              text: "S/W Upgrade 이력",
              to: `${prefix}/sw-managements/productions/sw-upgrades`,
            },
            {
              text: "단말기 Update 이력",
              to: `${prefix}/sw-managements/productions/device-updates`,
            },
          ],
        },
        {
          text: "테스트 S/W 관리",
          childs: [
            {
              text: isVan ? "S/W 조회 및 등록" : "S/W 조회",
              to: `${prefix}/sw-managements/sandboxes/registrations`,
            },
            {
              text: "S/W Upgrade 이력",
              to: `${prefix}/sw-managements/sandboxes/sw-upgrades`,
            },
            {
              text: "단말기 Update 이력",
              to: `${prefix}/sw-managements/sandboxes/device-updates`,
            },
          ],
        },
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
  select: "10개씩",
  available: [{ key: 10, value: "10개씩" }, { key: 20, value: "20개씩" }, { key: 30, value: "30개씩" }],
});

export const useConst = () => {
  return {
    swVersions,
    swGroupCodes,
    deviceModels,
    gnbs,
    lnbs,
    searchOptions,
    take,
  };
};
