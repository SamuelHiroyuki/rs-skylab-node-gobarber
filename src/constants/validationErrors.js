export default (error, res) => {
	if (!error.type) {
		return res.status(400).json({
			error: {
				type: 'InvalidEmailFormat',
				message: `The 'email' field must be a valid email.`,
			},
		});
	}

	if (error.type === 'required') {
		return res.status(400).json({
			error: {
				type: 'RequiredField',
				message: `The '${error.path}' field is required.`,
			},
		});
	}

	if (error.type === 'typeError') {
		return res.status(400).json({
			error: {
				type: 'TypeError',
				message: `The '${error.path}' field must be a ${error.params.type}.`,
			},
		});
	}

	if (error.type === 'min') {
		return res.status(400).json({
			error: {
				type: 'MinLength',
				message: `The '${error.path}' field must be at least ${error.params.min} characters.`,
			},
		});
	}

	if (error.type === 'oneOf') {
		return res.status(400).json({
			error: {
				type: 'ValueComparisonError',
				message: `The 'oldPassword' field must be the same as 'password'.`,
			},
		});
	}

	return res.status(400).json({
		error: {
			type: 'UndocumentedError',
			message:
				"This error has not been documented. Contat us or open an Issue at 'https://github.com/SamuelHiroyuki/rs-skylab-node-gobarber'.",
			causedBy: error,
		},
	});
};
