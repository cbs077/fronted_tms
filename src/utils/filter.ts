import dayjs from "dayjs";

export const dateFormat = (input: Date | string) => {
  return dayjs(input).format("YYYY-MM-DD HH:mm:ss.SSS");
};
