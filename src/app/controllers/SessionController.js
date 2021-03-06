import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import authConfig from '../../config/auth';
import validateError from '../../validations/yupErrors';

class SessionController {
	async create(req, res) {
		const schema = Yup.object().shape({
			email: Yup.string()
				.email()
				.required(),
			password: Yup.string().required(),
		});

		try {
			await schema.validate(req.body);
		} catch (error) {
			validateError(error, res);
		}

		const { email, password } = req.body;

		const user = await User.findOne({
			where: { email },
		});

		if (!user) {
			return res.status(400).json({
				error: {
					type: 'UserNotFound',
					message: `There is no user with the email '${email}'.`,
				},
			});
		}

		if (!(await user.checkPassword(password))) {
			return res.status(400).json({
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
