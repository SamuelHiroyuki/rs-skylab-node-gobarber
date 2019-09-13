import jwt from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
	async create(req, res) {
		const { email, password } = req.body;

		const user = await User.findOne({
			where: { email },
		});

		if (!user) {
			return res.status(401).json({
				error: {
					type: 'UserNotFound',
					message: `There is no user with the email '${email}'.`,
				},
			});
		}

		if (!(await user.checkPassword(password))) {
			return res.status(401).json({
				error: {
					type: 'IncorrectPassword',
					message: `Incorrect password for user with email '${email}'.`,
				},
			});
		}

		const { id, name, provider } = user;

		return res.json({
			user: { id, name, email, provider },
			token: jwt.sign({ id }, authConfig.secret, {
				expiresIn: authConfig.expiresIn,
			}),
		});
	}
}

export default new SessionController();
