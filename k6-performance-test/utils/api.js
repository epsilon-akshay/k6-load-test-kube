import * as http from 'k6/http';
import {checkResponseWithResponseCode} from "./checks.js";

export function post(url, header, body, user) {
    const response = requestPOST(url, body, header);
    checkResponseWithResponseCode(response, url, user);
    return response
}
export function get(url, header, user) {
    const response = requestGET(url, header);
    checkResponseWithResponseCode(response, url, user);
    return response
}

function requestGET(url, resourceHeaders) {
    return  http.get(url, {
        headers: resourceHeaders,
    });
}

function requestPOST(url, body, resourceHeaders) {
    return http.post(url, JSON.stringify(body), {
        headers: resourceHeaders,
    });
}


export {requestGET, requestPOST};
