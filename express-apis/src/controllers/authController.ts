import bcrypt from 'bcrypt';
import DataSource from '../db/DataSource';

import { Request, Response } from 'express';

import { User } from '../entity/User';
import { decodeJWT } from '../modules/authentication';
import { createAuthData, decodeHeader } from '../modules/utils';

import { RefreshToken } from '../entity/refreshToken';

export async function login(req: Request, res: Response) {
	const userRepo = DataSource.getRepository(User);

	try {
		const user = await userRepo.findOneBy({
			email: req.body.email,
		});

		if (!user) {
			return res.status(401).json({ message: 'Invalid Credentials' });
		}

		const validPassword = await bcrypt.compare(req.body.password, user.password);

		delete (user as { password?: string }).password;

		if (!validPassword) {
			return res.status(401).json({ message: 'Invalid Credentials' });
		}

		const authData = await createAuthData(user);

		res.status(200).json({ data: authData });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Internal Error' });
	}
}

export async function register(req: Request, res: Response) {
	const userRepo = DataSource.getRepository(User);

	const user = await userRepo.findOneBy({
		email: req.body.email,
	});

	if (user) {
		console.warn('User already created');
		return res.status(409).json({ message: 'User already exists' });
	}

	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		const user = new User();
		user.name = req.body.name;
		user.email = req.body.email;
		user.address = req.body.address;
		user.password = hashedPassword;

		const savedUser = await userRepo.save(user);

		res.status(201).json({ data: await createAuthData(savedUser) });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Internal Error' });
	}
}

export async function refreshJWT(req: Request, res: Response) {
	const token = decodeHeader(req, res);

	if (!token) {
		return;
	}

	const userRepo = DataSource.getRepository(User);
	const refreshRepo = DataSource.getRepository(RefreshToken);

	try {
		const tokenPayload = (await decodeJWT(token)) as { userid: string };

		if (!tokenPayload) {
			return res.status(400).json({ message: 'JWT invalid' });
		}

		const userId = tokenPayload.userid;

		if (!userId) {
			return res.status(400).json({ message: 'JWT invalid' });
		}

		const userData = await userRepo.find({
			where: {
				id: userId,
			},

			relations: {
				refreshTokens: true,
			},
		});

		if (userData.length == 0) {
			console.log('User not found in the database');
			return res.status(401).json({ message: 'Unauthorized' });
		}

		const refreshToken = userData[0].refreshTokens.find((token) => {
			if (token.token == req.body.refresh_token) {
				return token;
			}
		});

		if (!refreshToken) {
			console.log('Refresh token not found in the database');
			return res.status(401).json({ message: 'Refresh token invalid' });
		}

		await refreshRepo.delete({
			token: refreshToken.token,
		});

		if (new Date() > refreshToken.expiresAt) {
			console.log('Refresh token expired');
			return res.status(401).json({ message: 'Refresh token already expired' });
		}

		res.status(200).json({ data: await createAuthData(userData[0]) });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Internal error' });
	}
}
