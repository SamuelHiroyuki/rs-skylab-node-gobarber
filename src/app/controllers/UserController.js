import User from '../models/User';

class UserController {
	async post(req, res) {
		const { email } = req.body;
		const userExists = await User.findOne({
			where: { email },
		});

		if (userExists) {
			return res.status(400).json({
				error: 'Duplicate email.',
				errorMessage: `The is already a user with the email '${email}'`,
			});
		}

		const { id, name, provider } = await User.create(req.body);

		return res.json({ id, name, email, provider });
	}
}

export default new UserController();
