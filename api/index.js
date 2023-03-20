import express from 'express';
import cors from 'cors';
import axios from 'axios';
import qs from 'qs';

const app = express();

app.use(cors());
app.use(express.urlencoded());

app.get('/api', (req, res) => {
  res.send('Hello World!');
});

app.post('/oauth2/:auth_server_id/v1/token', async (req, res) => {
  const { body, params } = req;

  const options = {
    method: 'POST',
    url: `https://identity.atko.rocks/oauth2/${params.auth_server_id}/v1/token`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(body),
    validateStatus: () => true
  };

  try {
    const { data, status } = await axios(options);

    console.log(data);

    res.status(status).json(data);
  } catch (error) {

    throw error

  }

});

export default app;
