import { reactive } from "vue";

import { INavMenuItem } from "~/interfaces/nav-menu.interface";

const userLnbs = [
  {
    text: "단말기",
    open: true,
    childs: [
      { text: "조회 및 등록", to: "/devices/registrations" },
      { text: "등록이력", to: "/devices/logs" },
      { text: "삭제", to: "/devices/un-registrations" },
    ],
  },
  {
    text: "단말기 현황",
    open: true,
    childs: [{ text: "Van사별 현황", to: "/devices-status/vans" }],
  },
  {
    text: "단말기 사용정보",
    open: true,
    childs: [{ text: "조회", to: "/devices-usage" }],
  },
  {
    text: "단말기 모델",
    open: true,
    childs: [{ text: "조회 및 등록", to: "/model" }],
  },
];

const adminLnbs = [
  ...userLnbs,
  {
    text: "Van사 관리",
    header: true,
  },
];

const gnbs: INavMenuItem[] = [
  {
    text: "단말기관리",
    to: "/",
    active: true,
  },
  {
    text: "사용자관리",
    to: "/",
  },
  {
    text: "모니터링",
    to: "/",
  },
  {
    text: "S/W 관리",
    to: "/",
  },
];

const lnbs = (isUser = true) => (isUser ? userLnbs : adminLnbs);

const searchOptions = [
  { id: 1, value: "S/W Group 코드" },
  { id: 2, value: "S/W Version" },
  { id: 3, value: "단말기 번호" },
  { id: 4, value: "단말기 모델" },
];

const deviceModels = [{ value: "3001" }, { value: "3002" }, { value: "3003" }];

const swVersions = [{ value: "1.0" }, { value: "1.1" }, { value: "1.2" }];

const take = reactive({
  select: 10,
  available: [{ value: "10개씩" }, { value: "20개씩" }, { value: "30개씩" }],
});

export const useConst = () => {
  return { lnbs, gnbs, searchOptions, deviceModels, swVersions, take };
};
