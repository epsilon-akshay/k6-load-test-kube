export const configurations = {
    scene1: {
        scenarios: {
            executor: 'constant-vus',
            vus: 50,
            duration: '10s',
            gracefulStop: '0s', // do not wait for iterations to finish in the end
            exec: 'scene1',
        },
        url: "http://url",
        method: "post",
    },
    scene2: {
        scenarios: {
            executor: 'constant-arrival-rate',
            rate: 10,
            timeUnit: '1s',
            duration: '1m',
            preAllocatedVUs: 5,
            exec: 'scene2',
        },
        url: "http://localhost:8082/",
        method: "post",
    }
};

export const thresholds =
    {
        'http_req_duration{scenario:payment}':
            ['p(99)<300'],
        'http_req_failed{scenario:payment}':
            [`rate<0.01`],
        'http_req_duration{scenario:inquiry}':
            ['p(99)<300'],
        'http_req_failed{scenario:inquiry}':
            [`rate<0.01`]
    }