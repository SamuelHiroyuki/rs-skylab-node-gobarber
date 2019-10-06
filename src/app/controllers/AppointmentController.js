import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, isValid } from 'date-fns';
// Localização pra pt_BR
// import pt from 'date-fns/locale'

import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';

import validateError from '../../validations/yupErrors';
import Pagination from '../../constants/Pagination';

class AppointmentController {
	async index(req, res) {
		const { limit, offset, response } = Pagination(req.query);

		const appointments = await Appointment.findAndCountAll({
			where: {
				user_id: req.userId,
				canceled_at: null,
			},
			attributes: ['id', 'date', 'created_at'],
			order: ['date'],
			limit,
			offset,
			include: [
				{
					model: User,
					as: 'provider',
					attributes: ['id', 'name', 'email'],
					include: [
						{
							model: File,
							as: 'avatar',
							attributes: ['path', 'url'],
						},
					],
				},
			],
		});

		return res.json(response(appointments));
	}

	async store(req, res) {
		const schema = Yup.object().shape({
			provider_id: Yup.number().required(),
			date: Yup.date().required(),
		});

		try {
			await schema.validate(req.body);
		} catch (error) {
			validateError(error, res);
		}

		const { provider_id, date } = req.body;

		const provider = await User.findByPk(provider_id);

		if (!provider) {
			return res.status(400).json({
				error: {
					type: 'UserNotFound',
					message: `There is no user with ID '${provider_id}'.`,
				},
			});
		}

		if (!provider.provider) {
			return res.status(400).json({
				error: {
					type: 'NotAProvider',
					message: `The user with ID '${provider_id}' is not a provider.`,
				},
			});
		}

		if (provider_id === req.userId) {
			return res.status(400).json({
				error: {
					type: 'InvalidProvider',
					message: 'You cannot create an appointment with yourself.',
				},
			});
		}

		const appointmentDate = startOfHour(parseISO(date));

		if (!isValid(appointmentDate)) {
			return res.status(400).json({
				error: {
					type: 'InvalidDate',
					message: `The date ${date} is not valid.`,
				},
			});
		}

		if (isBefore(appointmentDate, new Date())) {
			return res.status(400).json({
				error: {
					type: 'PastDate',
					message: 'Past dates are not allowed.',
				},
			});
		}

		const checkAvailability = await Appointment.findOne({
			where: {
				provider_id,
				canceled_at: null,
				date,
			},
		});

		if (checkAvailability) {
			return res.status(400).json({
				error: {
					type: 'DateNotAvailable',
					message: 'Appointment date is not available.',
				},
			});
		}

		const appointment = await Appointment.create({
			user_id: req.userId,
			provider_id,
			date,
		});

		// Notify appointment provider
		const user = await User.findByPk(req.userId);
		const formattedDate = format(
			appointmentDate,
			"MMMM do 'at' p"
			// { locale: pt, } => aplica a localização
		);

		await Notification.create({
			content: `New appointment: ${user.name} has scheduled a time for ${formattedDate}`,
			user: provider_id,
		});

		return res.json(appointment);
	}
}

export default new AppointmentController();
