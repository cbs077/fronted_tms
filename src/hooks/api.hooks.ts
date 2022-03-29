import  axios, { AxiosResponse } from "axios";

export function getTerminalVan() {
  var token = window.localStorage.getItem("token")
  var param //= "van_id="+ vanId      
  if(token == null) token = "" 

  let response = axios.get('http://tms-test-server.p-e.kr:8081/van/list',
          {
            headers: {
                Authorization: token
            }
          }
        )
        .then(response => {
          console.log("getTerminalVan", response)

          return response.data;   
        });
  return response;    
};
