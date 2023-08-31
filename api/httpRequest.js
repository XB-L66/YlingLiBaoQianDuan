import axios from "axios";
import qs from'qs'

axios.defaults.baseURL="http://localhost:8000/api";
axios.defaults.timeout=50000;

function doGet(url, params) {
    return axios({
        url: url,
        methods: 'get',
        params: params
    });
}

function  doPost(url,params){
    return axios({
        url:url,
        methods:'post',
        data:params
    });
}

function doPostUrl(url,params){
    let reqeustData=qs.stringify(params)
    return axios.post(url,reqeustData)
}
export {doGet,doPost,doPostUrl}