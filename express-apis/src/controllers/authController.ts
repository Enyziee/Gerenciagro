import bcrypt from 'bcrypt';
import DataSource from '../db/DataSource';

import { Request, Response } from 'express';

import { JwtPayload } from 'jsonwebtoken';
import { RefreshToken } from '../entity/refreshToken';
import { User } from '../entity/User';
import { createJWT, createRefreshToken, validadeJWT } from '../modules/authentication';

const userRepository = DataSource.getRepository(User);
const refreshTokenRepo = DataSource.getRepository(RefreshToken);

export async function login(req: Request, res: Response) {
	try {
		const user = await userRepository.findOneBy({
			email: req.body.email,
		});

		if (!user) {
			return res.status(401).json();
		}

		const validPassword = await bcrypt.compare(req.body.password, user.password);

		if (!validPassword) {
			return res.status(401).json({ errors: 'Invalid Credentials' });
		}

		const accessToken = await createJWT(user);
		const accessTokenData = (await validadeJWT(accessToken)) as JwtPayload;
		const refreshData = createRefreshToken();

		const refreshTokenEntity = refreshTokenRepo.create();
		refreshTokenEntity.token = refreshData.token;
		refreshTokenEntity.issuedAt = new Date(refreshData.issuedAt);
		refreshTokenEntity.expiresAt = new Date(refreshData.expiresAt);
		refreshTokenEntity.user = user;
		refreshTokenRepo.save;

		return res.status(200).json({
			access_token: { token: accessToken, expireAt: accessTokenData.exp },
			refresh_token: { token: refreshData.token, expireAt: refreshData.expiresAt },
		});
	} catch (error) {
		console.error('Something go wrong\n', error);
		return res.status(500).json({ errors: 'Internal Error' });
	}
}

export async function register(req: Request, res: Response) {
	const { name, email, password, address } = req.body;

	// TODO Adionar verificações extras para email;

	const userExists = await userRepository.findOneBy({
		email: email,
	});

	if (userExists) {
		console.warn('User already created');
		return res.status(409).json({ message: 'User already exists' });
	}

	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = new User();
		user.name = name;
		user.email = email;
		user.address = address;
		user.password = hashedPassword;

		const userSaved = await userRepository.save(user);
		const token = await createJWT(userSaved);

		return res.status(201).json({ access_token: token, refresh_token: 'refresh_token' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Internal Error' });
	}
}

export async function refreshJWT(req: Request, res: Response) {
	const authHeader = req.headers.authorization;

	const bearer = req.headers.authorization;

	if (!bearer) {
		res.status(401);
		res.json({ message: 'Authorization Header not provided' });
		return;
	}

	const [, token] = bearer.split(' ');

	if (!token) {
		res.status(401);
		res.json({ message: 'Access token not provided' });
		return;
	}
	
	const tokenPayload = validadeJWT(token);

	res.send(200);
}
