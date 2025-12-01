import http from 'k6/http';
import { sleep, check, group } from 'k6';

export const options = {
  vus: 10, // virtual users, number of users that will be connect at the same time
  //duration: '30s', // test duration, the request will be continuously sent during this time
  iterations: 1, // total number of requests, use iterations or duration, not both
  //10 vus, 10 iterations, means the test will be executd 100 times in total, each user will execute 10 iterations
  thresholds: {
    http_req_duration: ['p(90)<=2', 'p(95)<=3'], // 90% of requests must complete below 2ms
    http_req_failed: ['rate<0.01'] // less than 1% of requests must fail
  }
};
//scenario example: checking the analitics, I could see the highest number of users
//connected at the same time was 2500, so I will set vus to 2500 and it happened for 20 seconsds
//so I will set duration to 20s

export default function() {//test script
  let responseInstructorLogin = '';
  group('Doing login', function() {// group is an scope for better organization of the script
    responseInstructorLogin = http.post(
      'http://localhost:3000/instructors/login',
      JSON.stringify({
        email: 'julio',
        password: '123'
      }),
      { 
        headers: { 
          'Content-Type': 'application/json' 
        } 
    });
  });
  //console.log(responseInstructorLogin.json('token'));
  //console.log(responseInstructorLogin.body);

  group('Creating a lesson', function() {
    const responseLesson = http.post(
      'http://localhost:3000/lessons',
      JSON.stringify({
        title: 'como montar uma flauta',
        description: 'encaixando as pecas e alinhando os furos'
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${responseInstructorLogin.json('token')}`
        } 
    });

    check(responseLesson, { 
        "status is 201": (res) => res.status === 201,
        "status text must be Created": (res) => res.status_text === "201 Created"
    });
  });

  group('Simulate user think time', function() {
    sleep(1); // user think time of 1 second
  });
}
