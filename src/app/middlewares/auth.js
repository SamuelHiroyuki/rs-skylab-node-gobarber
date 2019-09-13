import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return res.status(401).json({
			error: {
				type: 'TokenNotProvided',
				message: 'You must be logged in to access this route.',
			},
		});
	}

	// const token = authHeader.split(' ')[1];
	// const [bearer, token] = authHeader.split(' ');
	// const a = "Teste para ver como funciona."
	// const b = a.split(" ") => ["Teste", "para", "ver", "como", "funciona."]
	// const [z] = b => "Teste"
	// const [t, p] = b => "Teste", "para"
	// const [, pr] = b => "para"
	// const [,, v] = b => "ver"
	// const [,,,, f] = b => "funciona."

	const [, token] = authHeader.split(' ');

	try {
		const decoded = await promisify(jwt.verify)(token, authConfig.secret);
		req.userId = decoded.id;
		return next();
	} catch (error) {
		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({
				error: {
					type: 'TokenExpired',
					message:
						'Your Token has expired and you will need to log in to access this route.',
				},
			});
		}
		return res.status(401).json({
			error: {
				type: 'InvalidToken',
				message:
					'Your token is not valid and you will need to log in to access this route.',
			},
		});
	}
};
