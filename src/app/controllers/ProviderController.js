import User from '../models/User';
import File from '../models/File';
import Pagination from '../../constants/Pagination';

class ProviderController {
	async index(req, res) {
		const { limit, offset, response } = Pagination(req.query);

		const providers = await User.findAndCountAll({
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
			limit,
			offset,
		});

		return res.json(response(providers));
	}
}

export default new ProviderController();
