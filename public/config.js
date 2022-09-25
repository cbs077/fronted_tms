// const config = (() => {
//     return {
//       "VUE_APP_ENV_MyURL": "...",
//     };
//   })();

//   const value  = 'One'
const value = "One";
const method = (message) => {
  console.log(message);
};

//2. 변수, 함수를 하나의 변수에 담기!
const test = { value, method };

//3. 이 변수 내보내기! (반드시 해야함!)
export default test;
