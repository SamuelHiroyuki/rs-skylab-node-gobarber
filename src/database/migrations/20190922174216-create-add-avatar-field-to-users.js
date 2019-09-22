module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('users', 'avatar_id', {
			type: Sequelize.INTEGER,
			references: {
				model: 'files',
				key: 'id',
			},
			onUpdate: 'CASCADE', // Faz a alteração tbm ocorrer na tb de users
			onDelete: 'SET NULL', // Caso seja deletado na tabela de files
			allowNull: true,
		});
	},

	down: queryInterface => {
		return queryInterface.removeColumn('users', 'avatar_id');
	},
};
