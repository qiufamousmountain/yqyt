import axios from 'axios'



axios.defaults.baseURL = `/`;
axios.interceptors.response.use(function (response) {
    // Do something with response data
    // console.log(response);
    // console.log('--------------',response)
    if (response.data.code == 302) {
        if (response.data.hasOwnProperty('data')) {
            window.location.href = '/';
        }
        return
    }
    if (response.data.code == 402) {
        if (response.data.hasOwnProperty('data')) {
            alert('您的账号刚刚在别的地方登陆了了，被挤下线了')
            window.location.href = '/';
        }
        return
    }
    return response;
}, function (error) {
    // Do something with response error

    // console.dir(error.response,'----error----');
    //  status
    console.dir(error);
    console.dir(JSON.stringify(error));
    // console.dir (error);



    return Promise.reject(error);
});


export { axios };