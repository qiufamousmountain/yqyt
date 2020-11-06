import axios from 'axios'

axios.defaults.baseURL = `/`;
axios.interceptors.response.use(function (response) {
    // Do something with response data
    // console.log(response);
    // console.log('--------------',response)
    if (response.data.code === 302) {
        if (response.data.data.hasOwnProperty('redirectUrl')) {
            window.location.href = '/';
        }
        return
    }
    return response;
}, function (error) {
    // Do something with response error

    // console.dir(error.response,'----error----');
    //  status
    console.dir (error);
    console.dir (JSON.stringify(error));
    // console.dir (error);



    return Promise.reject(error);
});


export {axios};