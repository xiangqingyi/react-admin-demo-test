import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK, AUTH_GET_PERMISSIONS } from 'react-admin';
import Axios from 'axios';

export default  (type, params) => {
    // called when the user attempts to log in
    Axios.defaults.withCredentials = true;
    if (type === AUTH_LOGIN) {
        return new Promise((resolve, reject) => {
            const { username, password } = params;
            Axios.post('/civetadmin/api/users/login',{
                username: username,
                password: password
            }).then(response => {
                if (response.status !== 200) {
                    reject(response.statusText);
                } 
                if (response.data.error !== 0) {
                    reject(response.data.message);
                } 
            }).then(function() {
                Axios.get('/civetadmin/api/gettoken').then(function(result){
                    if (result.status !== 200) {
                        reject(result.statusText);
                    } 
                    if (result.data.error !== 0) {
                        reject(result.data.message);
                    } else {
                        Axios.defaults.headers.Authorization = result.data.token;
                        localStorage.setItem('token', result.data.token);
                        resolve('登錄成功');
                    }
                })
            })
        })
    }
    // called when the user clicks on the logout button
    if (type === AUTH_LOGOUT) {
        return new Promise((resolve, reject) => {
            Axios.get('/civetadmin/api/logout').then(response => {
                if (response.status !== 200) {
                    // throw new Error('登出失敗,status!=200')
                    reject(response.statusText);
                } else {
                    if (response.data.error !== 0) {
                        // throw new Error('登出失敗, error!=0');
                        reject('失敗');
                    } else {
                        // return Promise.resolve();
                        localStorage.removeItem('token');
                        resolve('成功');
                    }
                }
            })
        })

    }
    // called when the API returns an error
    if (type === AUTH_ERROR) {
        const { status } = params;
        if (status === 401 || status === 403) {
            localStorage.removeItem('username');
            return Promise.reject();
        }
        return Promise.resolve();
    }
    // called when the user navigates to a new location
    if (type === AUTH_CHECK) {
        console.log('check_auth');
        return new Promise((resolve, reject) => {
            Axios.get('/civetadmin/api/checkuser').then(response => {
                if (response.status !== 200) {
                    reject(response.statusText);
                } else {
                    if (response.data.error !== 0) {
                        reject(response.data.message)
                    } else {
                        // resolve('驗證成功');
                        if (localStorage.getItem('token')) {
                            resolve('驗證成功');
                        } else {
                            reject('token失效')
                        }
        
                    }
                }
            })
        })
    }
    if (type === AUTH_GET_PERMISSIONS) {
        return new Promise((resolve, reject) => {
            Axios.get('/civetadmin/api/getuseractions').then(response => {
                if (response.status !== 200) {
                    reject(response.statusText);
                } else {
                     if (response.data.error === 0) {
                         const role = response.data.data.role;
                         resolve(role);
                     } else {
                         reject('獲取role信息失敗')
                     }
                }
            })
        })
    }
    return Promise.reject('Unknown method');
};
