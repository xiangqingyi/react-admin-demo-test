import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
    DELETE,
    fetchUtils,
    DELETE_MANY
} from 'react-admin';
import { stringify } from 'query-string';
const API_URL = 'http://localhost:8787/civetadmin/api';

/**
 * @param {String} type One of the constants appearing at the top of this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The Data Provider request params, depending on the type
 * @returns {Object} { url, options } The HTTP request parameters
 */

const convertDataProviderRequestToHTTP = (type, resource, params) => {
    switch (type) {
    case GET_LIST: {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify(params.filter),
            type: 'GET_LIST',
        };
        return { url: `${API_URL}/${resource}?${stringify(query)}` };
    }
    case GET_ONE:
        return { url: `${API_URL}/${resource}/${params.id}` };
    case GET_MANY: {
        const query = {
            filter: JSON.stringify({ ids: params.ids }),
            type: 'GET_MANY'
        };
        return { url: `${API_URL}/${resource}?${stringify(query)}` };
    }
    case GET_MANY_REFERENCE: {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, (page * perPage) - 1]),
            filter: JSON.stringify({ ...params.filter, [params.target]: params.id }),
        };
        return { url: `${API_URL}/${resource}?${stringify(query)}` };
    }
    case UPDATE:
    if (resource === 'users') {
        try {
            let reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;
            if (!params.data.name) {
                throw new Error('缺少name參數');
            } else if (!params.data.username) {
                throw new Error('缺少username參數');
            } else if (!params.data.email) {
                throw new Error('缺少email參數');
            } else if (!reg.test(params.data.email)){
                throw new Error('email格式錯誤');
            } else if (!params.data.role) {
                throw new Error('缺少role參數');
            }
            return {
                url: `${API_URL}/${resource}/${params.id}`,
                options: { method: 'PUT', body: JSON.stringify(params.data) },
            };
        } catch (error) {
            throw new Error(error);
        }
    } else if (resource === 'roles') {
        try {
            if (!params.data.name) {
                throw new Error('缺少name參數');
            } else if (!params.data.description) {
                throw new Error('缺少description參數');
            }
            return {
                url: `${API_URL}/${resource}/${params.id}`,
                options: { method: 'PUT', body: JSON.stringify(params.data) },
            };
        } catch (error) {
            throw new Error(error)
        }
    }

    case CREATE:
        if (resource === 'users') {
            try {
                let reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;
                if (!params.data.name) {
                    throw new Error('缺少name參數');
                } else if (!params.data.username) {
                    throw new Error('缺少username參數');
                } else if (!params.data.email) {
                    throw new Error('缺少email參數');
                } else if (!reg.test(params.data.email)){
                    throw new Error('email格式錯誤');
                } else if (!params.data.password) {
                    throw new Error('缺少password參數');
                } else if (!params.data.role) {
                    throw new Error('缺少role參數');
                }
                return {
                    url: `${API_URL}/${resource}`,
                    options: { method: 'POST', body: JSON.stringify(params.data) },
                };
            } catch (error) {
                throw new Error(error);
            }
        } else if (resource === 'roles') {
            try {
                if (!params.data.name) {
                    throw new Error('缺少name參數');
                } else if (!params.data.description) {
                    throw new Error('缺少description參數');
                }
                return {
                    url: `${API_URL}/${resource}`,
                    options: { method: 'POST', body: JSON.stringify(params.data) },
                };
            } catch (error) {
                throw new Error(error)
            }
        }
    case DELETE:
        return {
            url: `${API_URL}/${resource}/${params.id}`,
            options: { method: 'DELETE' },
        };
    case DELETE_MANY:
        let ids = params.ids;
        const query = {
            filter: JSON.stringify({ ids: params.ids }),
            type: 'DELETE_MANY'
        };

        return { 
            url: `${API_URL}/${resource}?${stringify(query)}`,
            options: { method: 'DELETE' }
        };

    default:
        throw new Error(`Unsupported fetch action type ${type}`);
    }
};

/**
 * @param {Object} response HTTP response from fetch()
 * @param {String} type One of the constants appearing at the top of this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The Data Provider request params, depending on the type
 * @returns {Object} Data Provider response
 */


const convertHTTPResponseToDataProvider = (response, type, resource, params) => {
    const { headers, json } = response;
    if (response.json.error) {
        // token jwt expired 驗證過期 重新登錄
        // return Promise.reject();
        // window.location.href = 'http://localhost:3000/login';
        localStorage.removeItem('token');
        return Promise.reject(response.json.message);   
        

    } else {
        switch (type) {
            case GET_LIST:
                if (!headers.has('content-range')) {
                    throw new Error(
                        'The Content-Range header is missing in the HTTP Response. The simple REST data provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare Content-Range in the Access-Control-Expose-Headers header?'
                    )
                }
                return {
                    data: json.map(x => x),
                    total: parseInt(headers.get('content-range').split('/').pop(), 10),
                };
            case CREATE:
                // return { data: { ...params.data, id: json.id } };
                window.location.href = '/'+resource
            default:
                return { data: json };
            }
    }

};

/**
 * @param {string} type Request type, e.g GET_LIST
 * @param {string} resource Resource name, e.g. "posts"
 * @param {Object} payload Request parameters. Depends on the request type
 * @returns {Promise} the Promise for response
 */

export default (type, resource, params) => {
    const { fetchJson } = fetchUtils;
    const { url,options={}} = convertDataProviderRequestToHTTP(type, resource, params);
    options.user ={
        authenticated: true,
        token: localStorage.getItem('token')
    }
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    options.credentials = "include";
    return fetchJson(url, options)
        .then(response => convertHTTPResponseToDataProvider(response, type, resource, params));
};