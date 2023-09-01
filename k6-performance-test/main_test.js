import {configurations, thresholds} from "./config.js";
import {get, post} from "../utils/api.js";
import { SharedArray } from 'k6/data';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';
import { Trend } from 'k6/metrics';
export function setup() {
}

const responseTime = new Trend('responseTime', true);


export let options = {
    scenarios: {},
    thresholds: thresholds
}
console.log(`env : ${__ENV.scenario}`)

if (__ENV.scenario) {
    options.scenarios[__ENV.scenario] = configurations[__ENV.scenario].scenarios;
} else {
    throw new Error('Pass a scenario to run');
}

export function scene1() {
    const randomData = data[Math.floor(Math.random() * data.length)]
    const header = randomData.header
    const body = randomData.body
    const conf = configurations[__ENV.scenario];
    let resp
    if (conf.method === post) {
        resp = post(conf.url, header, body, __VU)
    } else {
        resp= get(conf.url, header, __VU)
    }
    responseTime.add(resp.timings.waiting)
}

export function scene2() {
    const randomData = data[Math.floor(Math.random() * data.length)]
    const header = randomData.header
    const body = randomData.body
    const conf = configurations[__ENV.scenario];
    let resp
    if (conf.method === post) {
        resp = post(conf.url, header, body, __VU)
    } else {
        resp = get(conf.url, header, __VU)
    }
    responseTime.add(resp.timings.waiting)
}

export function handleSummary(data) {
    return {
        'stdout': textSummary(data, { indent: ' ', enableColors: true }), //the default data object
    };
}

let data;
data = new SharedArray('my data', function () {
    return JSON.parse(open('./requests.json')).requests;
});
