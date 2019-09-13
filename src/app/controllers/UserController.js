import User from '../models/User';

class UserController {
	async create(req, res) {
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
		const { name, email } = req.body;

		const user = await User.findByPk(req.userId);

		if (email !== user.email) {
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
		// const { oldPassword, password } = req.body;
		// if (oldPassword) {
		// }
		// if (password) {
		// }
		// const user = await User.findByPk(req.userId);
		// if (!(await user.checkPassword(oldPassword))) {
		// 	return res.status(401).json({
		// 		error: {
		// 			type: 'PasswordDoesNotMatch',
		// 			message: 'The password does not match your old password.',
		// 		},
		// 	});
		// }
		// return res.json({ ok: true });
	}
}

export default new UserController();
