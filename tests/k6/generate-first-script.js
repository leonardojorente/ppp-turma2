import http from 'k6/http';
import { expect } from 'k6/expect';
import { sleep, check } from 'k6';

export const options = {
  vus: 10, // virtual users
  //duration: '30s', // test duration, the request will be continuously sent during this time
  iterations: 1, // total number of requests, use iterations or duration, not both
};//10 vus, 10 iterations, means the test will be executd 100 times in total, each user will execute 10 iterations

export default function() {//test script
  let res = http.get('https://quickpizza.grafana.com');
  check(res, {//better to use this one dues to the console output messages 
    "status is 200": (res) => res.status === 200,
    "status text must be OK": (res) => res.status_text === "200 OK"
   });
  //or
  expect.soft(res.status).toBe(200);
  expect.soft(res.status_text).toBe("200 OK");

  sleep(1); // user think time of 1 second
}
