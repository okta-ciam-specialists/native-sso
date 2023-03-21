import express from 'express';
import cors from 'cors';
import axios from 'axios';
import qs from 'qs';
import { Redis } from '@upstash/redis';
import { createHash } from 'crypto';

const app = express();

const {
	UPSTASH_REDIS_REST_URL: REDIS_URL,
	UPSTASH_REDIS_REST_TOKEN: REDIS_TOKEN,
} = process.env;

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());

app.get('/api', (req, res) => {
	res.send('Hello World!');
});

app.post('/sso', async (req, res) => {
	const redis = new Redis({
		url: REDIS_URL,
		token: REDIS_TOKEN,
	});

	const { code_verifier, code_challenge, device_secret, id_token } = req?.body;
	if (code_verifier && device_secret && id_token) {
		await redis.set(
			generateChallenge(code_verifier),
			Buffer.from([id_token, device_secret].join('|')).toString('base64url')
		);

		return res.sendStatus(204);
	}

	if (code_challenge && id_token) {
		const data = await redis.get(code_challenge);

		if (data) {
			const [idToken, device_secret] = Buffer.from(data, 'base64url')
				.toString('utf-8')
				?.split('|');

			if (id_token === idToken) {
				await redis.del(code_challenge);

				return res.json({ device_secret });
			}
		}
	}

	return res.sendStatus(404);
});

app.post('/oauth2/:auth_server_id/v1/token', async (req, res) => {
	const { body, params } = req;

	const options = {
		method: 'POST',
		url: `https://identity.atko.rocks/oauth2/${params.auth_server_id}/v1/token`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		data: qs.stringify(body),
		validateStatus: () => true,
	};

	try {
		const { data, status } = await axios(options);

		console.log(data);

		res.status(status).json(data);
	} catch (error) {
		throw error;
	}
});

/** Generate a PKCE code challenge from a code verifier
 * @param code_verifier
 * @returns The base64 url encoded code challenge
 */
function generateChallenge(code_verifier) {
	return createHash('SHA256').update(code_verifier).digest('base64url');
}

export default app;
