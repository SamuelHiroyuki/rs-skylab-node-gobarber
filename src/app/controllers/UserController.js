// Yup não export nada por default
import * as Yup from 'yup';

import User from '../models/User';
import validateError from '../../validations/yupErrors';

class UserController {
	async create(req, res) {
		const schema = Yup.object().shape({
			name: Yup.string().required(),
			email: Yup.string()
				.email()
				.required(),
			password: Yup.string()
				.required()
				.min(6),
			provider: Yup.boolean().default(false),
		});

		try {
			await schema.validate(req.body);
		} catch (error) {
			validateError(error, res);
		}

		const { email } = req.body;
		const userExists = await User.findOne({
			where: { email },
		});

		if (userExists) {
			return res.status(400).json({
				error: {
					type: 'DuplicateEmail',
					message: `There is already a user with email '${email}'.`,
				},
			});
		}

		const { id, name, provider } = await User.create(req.body);

		return res.json({ id, name, email, provider });
	}

	async update(req, res) {
		const schema = Yup.object().shape({
			name: Yup.string(),
			email: Yup.string().email(),
		});

		try {
			await schema.validate(req.body);
		} catch (error) {
			validateError(error, res);
		}

		let { name, email } = req.body;

		const user = await User.findByPk(req.userId);

		if (!name) {
			name = user.name;
		}

		if (!email) {
			email = user.email;
		} else if (email !== user.email) {
			const userExists = await User.findOne({
				where: { email },
			});

			if (userExists) {
				return res.status(400).json({
					error: {
						type: 'DuplicateEmail',
						message: `There is already a user with email '${email}'.`,
					},
				});
			}
		}

		const { id, provider } = await user.update({ name, email });

		return res.json({ id, name, email, provider });
	}

	async updatePassword(req, res) {
		// Condicional => Se oldPassword existir o campo (field, AKA password) é required
		// const schema = Yup.object().shape({
		// 	oldPassword: Yup.string().min(6),
		// 	password: Yup.string()
		// 		.min(6)
		// 		.when('oldPassword', (oldPassword, field) =>
		// 			oldPassword ? field.required() : field
		// 		),
		// });
		const schema = Yup.object().shape({
			oldPassword: Yup.string()
				.required()
				.min(6),
			confirmPassword: Yup.string().when(
				'password',
				(password, field) =>
					password
						? field.required().oneOf([Yup.ref('password')])
						: field
				// oneOf recebe um array de possiveis valores q pode ter
				// ref faz referencia ao valor de outro campo
			),
			password: Yup.string()
				.required()
				.min(6),
		});

		try {
			await schema.validate(req.body);
		} catch (error) {
			validateError(error, res);
		}

		const { oldPassword, password } = req.body;

		const user = await User.findByPk(req.userId);

		if (!(await user.checkPassword(oldPassword))) {
			return res.status(401).json({
				error: {
					type: 'PasswordDoesNotMatch',
					message: `The 'oldPassword' provided does not match your old password.`,
				},
			});
		}

		if (oldPassword === password) {
			return res.status(400).json({
				error: {
					type: 'MustBeDifferent',
					message: `Your new password must be different from your old password.`,
				},
			});
		}

		await user.update({ password });

		return res.json({
			message: 'Your password has been changed successfully',
		});
	}
}

export default new UserController();
