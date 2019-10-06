export default ({ page, perPage: limit }) => {
	if (Number.isNaN(Number(page)) || Number(page) === 0) {
		page = 1;
	}

	if (Number.isNaN(Number(limit))) {
		limit = 10;
	}

	return {
		limit: parseInt(limit, 10),
		page: parseInt(page, 10),
		offset: parseInt((page - 1) * limit, 10),
	};
};
