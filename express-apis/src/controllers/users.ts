import { Request, Response } from 'express';
import { UserRepository } from '../models/user';

export async function showUsers(request: Request, response: Response) {
	const users = await UserRepository.findAll();

	console.log(users);

	response.status(200).json({ content: '👌' });
}
