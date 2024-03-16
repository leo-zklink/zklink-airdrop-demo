import axios from "axios";
// import _ from 'lodash';
// import qs from 'qs';
// import toast from "react-hot-toast";

const http = axios.create({
  baseURL: "https://test3-api.app.zklink.io",
});
// http.defaults.transformRequest = data => {
//     // if (_.isPlainObject(data)) data = qs.stringify(data);
//     return data;
// };
http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (reason) => {
    // toast.error(reason.message);
    if (reason.response && reason.response.data) {
      return Promise.reject(reason.response.data);
    }
    return Promise.reject(reason);
  }
);
export default http;
