import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  vus: 20,            // virtual users
  duration: '30s',    // test duration
  thresholds: {
    http_req_duration: [
      {
        threshold: 'p(95)<1000',  // 95% of RPS under 1 s
        abortOnFail: false,       // keep running on threshold fail
      },
    ],
  },
};

export default function () {
  // This endpoint always returns JSON:
  const res = http.get('https://jsonplaceholder.typicode.com/todos/1');
  const ct = res.headers['Content-Type'] || '';

  // Debug: log if it wasn’t JSON (you shouldn’t see this now)
  if (!ct.includes('application/json')) {
    console.log('Non-JSON response:', ct, res.body.slice(0, 100));
  }

  // Assertions
  check(res, {
    'status is 200': (r) => r.status === 200,
    'body has userId': (r) => {
      // safe JSON.parse
      try {
        const obj = r.json();
        return typeof obj.userId === 'number';
      } catch (e) {
        return false;
      }
    },
    'body has title': (r) => {
      try {
        const obj = r.json();
        return typeof obj.title === 'string';
      } catch (e) {
        return false;
      }
    },
  });

  sleep(1);
}
