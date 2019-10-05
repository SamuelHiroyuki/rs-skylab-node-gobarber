import User from '../models/User';
import File from '../models/File';

class ProviderController {
	async index(req, res) {
		const providers = await User.findAll({
			where: { provider: true },
			// attributes: ['id', 'name', 'email', 'createdAt', 'avatar_id'],
			attributes: {
				exclude: ['password_hash', 'avatar_id'],
			},
			include: [
				{
					model: File,
					as: 'avatar',
					attributes: ['path', 'url'],
				},
			],
		});
		return res.json(providers);
	}
}

export default new ProviderController();
