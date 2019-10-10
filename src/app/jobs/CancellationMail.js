import { format, parseISO } from 'date-fns';
import Mail from '../../lib/Mail';

class CancellationMail {
	get key() {
		return 'CancellationMail';
	}

	async handle({ data }) {
		const { appointment } = data;

		await Mail.sendMail({
			to: `${appointment.provider.name} <${appointment.provider.email}>`,
			subject: 'Schedule canceled',
			template: 'cancellation',
			context: {
				provider: appointment.provider.name,
				client: appointment.client,
				appointment: {
					date: format(parseISO(appointment.date), "MMMM do 'at' p"),
					canceled_at: format(
						parseISO(appointment.canceled_at),
						"MMMM do 'at' p"
					),
				},
			},
			// text: `The user '${appointment.client.name}' has canceled an appointment.`,
		});
	}
}

export default new CancellationMail();
