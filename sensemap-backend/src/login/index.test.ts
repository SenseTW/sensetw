import * as axios from 'axios';

const clientId = '00e468bc-c948-11e7-9ada-33c411fb1c8a';
const endpoint = 'http://localhost:8000';

test('authorization code grant', async () => {
  const authResponse = await axios.post(`${endpoint}/login`, {
    username: 'hychen',
    password: '3ense',
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  console.log(authResponse.data);
});

// https://h.sense.tw/login?for_oauth=True&next=https://h.sense.tw/oauth/authorize?client_id=00e468bc-c948-11e7-9ada-33c411fb1c8a&origin=https%3A%2F%2Fh.sense.tw&response_mode=web_message&response_type=code&state=cdce0db95c40d7e5
// https://h.sense.tw/oauth/authorize?client_id=00e468bc-c948-11e7-9ada-33c411fb1c8a&origin=https%3A%2F%2Fh.sense.tw&response_mode=web_message&response_type=code&state=cdce0db95c40d7e5
test.skip('authorization code grant', async () => {
  const authResponse = await axios.post(`${endpoint}/login?next=https://h.sense.tw/oauth/authorize?client_id=00e468bc-c948-11e7-9ada-33c411fb1c8a&response_type=code&state=cdce0db95c40d7e5`, {
    username: 'hychen',
    password: '3ense',
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  console.log(authResponse.data);
});
