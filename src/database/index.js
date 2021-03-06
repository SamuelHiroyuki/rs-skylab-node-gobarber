import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import databaseConfig from '../config/database';
import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

const models = [User, File, Appointment];

class Database {
	constructor() {
		this.init();
		this.mongo();
	}

	init() {
		this.connection = new Sequelize(databaseConfig);
		models
			.map(model => model.init(this.connection))
			.map(
				model =>
					model.associate && model.associate(this.connection.models)
			);
	}

	mongo() {
		// mongodb://localhost:27017/gobarber => O mongo n define usuário e
		// senha por padrão então pode só colocar a url de acesso/nome da base
		this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
			useNewUrlParser: true,
			useFindAndModify: true,
			useUnifiedTopology: true,
		});
	}
}

export default new Database();
