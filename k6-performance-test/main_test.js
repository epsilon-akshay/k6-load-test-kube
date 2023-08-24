import http from 'k6/http';
import { check, group } from 'k6';

export let options = {
   stages: [
       { duration: '0.5m', target: 50 }
     ],
};

export default function () {
   group('API uptime check', () => {
       const response = http.get('http://localhost:8081/');
       check(response, {
           "status code should be 200": res => res.status === 200,
       });
   });
};
