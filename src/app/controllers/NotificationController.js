import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
	async index(req, res) {
		const { provider: isProvider } = await User.findByPk(req.userId);

		if (!isProvider) {
			return res.status(400).json({
				error: {
					type: 'NotAProvider',
					message: "You're not a provider.",
				},
			});
		}

		const notifications = await Notification.find({
			user: req.userId,
		}).sort({ createdAt: 'desc' });

		return res.json(notifications);
	}

	async update(req, res) {
		const notification = await Notification.findByIdAndUpdate(
			req.params.id,
			{ read: true },
			{ new: true }
		);

		return res.json(notification);
	}
}

export default new NotificationController();
