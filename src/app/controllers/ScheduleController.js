import { startOfDay, endOfDay, parseISO, isValid } from 'date-fns';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';
import User from '../models/User';
import Pagination from '../../constants/Pagination';

class ScheduleController {
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

		const { limit, offset, response } = Pagination(req.query);
		const { date } = req.query;

		let parsedDate = parseISO(date);

		if (!isValid(parsedDate)) {
			parsedDate = parseISO(new Date().toISOString());
		}

		const appointments = await Appointment.findAndCountAll({
			where: {
				provider_id: req.userId,
				canceled_at: null,
				date: {
					[Op.between]: [
						startOfDay(parsedDate),
						endOfDay(parsedDate),
					],
				},
			},
			order: ['date'],
			limit,
			offset,
		});

		return res.json(response(appointments));
	}
}

export default new ScheduleController();
