import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 10, // virtual users
  duration: '20s', // test duration, the request will be continuously sent during this time
  //iterations: 10, // total number of requests, use iterations or duration, not both
};//10 vus, 10 iterations, means the test will be executd 100 times in total, each user will execute 10 iterations

export default function() {//test script
  let res = http.get('https://quickpizza.grafana.com');

  check(res, { 
    "status is 200": (res) => res.status === 200,
    "status text must be OK": (res) => res.status_text === "200 OK"
   });

  sleep(1); // user think time of 1 second
}
