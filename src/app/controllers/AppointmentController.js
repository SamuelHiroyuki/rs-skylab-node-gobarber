import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import Appointment from '../models/Appointment';
import User from '../models/User';
import validateError from '../../constants/validationErrors';

class AppointmentController {
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

		const appointmentDate = startOfHour(parseISO(date));

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
				date: appointmentDate,
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
			date: appointmentDate,
		});

		return res.json(appointment);
	}
}

export default new AppointmentController();
