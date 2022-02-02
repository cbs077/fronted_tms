import dayjs from "dayjs";

export const dateFormat = (input: Date | string) => {
  return dayjs(input).format("YYYY-MM-DD HH:mm:ss.SSS");
};

export const dateYYYYMMDD = (input: Date): string => {
  return dayjs(input).format("YYYY-MM-DD");
};

export const duplicateMockData = <T>(data: T, loop = 20) => {
  const result: T[] = [];

  for (let index = 0; index < loop; index += 1) {
    result.push(data);
  }

  return result;
};
