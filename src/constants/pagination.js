export default ({ page, perPage: limit }) => {
	if (Number.isNaN(Number(page)) || Number(page) === 0) {
		page = 1;
	}

	if (Number.isNaN(Number(limit)) || Number(limit) === 0) {
		limit = 10;
	}

	return {
		limit,
		offset: (page - 1) * limit,
	};
};
