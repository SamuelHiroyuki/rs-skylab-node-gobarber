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
		console.log(req.userId);
		return res.json({ ok: true });
	}
}

export default new UserController();
