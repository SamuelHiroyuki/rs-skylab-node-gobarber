import User from '../models/User';
import File from '../models/File';
import pagination from '../../constants/pagination';

class ProviderController {
	async index(req, res) {
		const { limit, page, offset } = pagination(req.query);

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

		return res.json({
			page,
			perPage: limit,
			total: providers.count,
			rows: providers.rows,
		});
	}
}

export default new ProviderController();
