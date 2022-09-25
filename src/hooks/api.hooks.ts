import  axios, { AxiosResponse } from "axios";

export function getTerminalVan() {
  var token = window.localStorage.getItem("token")
  var param //= "van_id="+ vanId      
  if(token == null) token = "" 

  let response = axios.get( '/api' +  '/van/list',
          {
            headers: {
                Authorization: token
            }
          }
        )
        .then(response => {

          return response.data;   
        });
  return response;    
};
