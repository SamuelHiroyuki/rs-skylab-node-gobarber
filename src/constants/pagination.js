class Pagination {
	constructor(page, perPage) {
		this.page = 1;
		this.perPage = 10;

		return this.init(page, perPage);
	}

	response({ count, rows }) {
		return {
			page: this.page,
			perPage: this.perPage,
			total: count,
			rows,
		};
	}

	init(page, limit) {
		page = Number(page);
		limit = Number(limit);

		if (!Number.isNaN(page) && page !== 0) {
			this.page = page;
		}

		if (!Number.isNaN(limit)) {
			this.perPage = limit;
		}

		return {
			limit: parseInt(this.perPage, 10),
			offset: parseInt((this.page - 1) * this.perPage, 10),
			response: this.response.bind(this),
		};
	}
}

export default ({ page, perPage }) => new Pagination(page, perPage);

// Outro jeito que eu pensei

// class Pagination {
// 	constructor() {
// 		this.page = 1;
// 		this.perPage = 10;
// 	}

// 	response({ count, rows }) {
// 		return {
// 			page: this.page,
// 			perPage: this.perPage,
// 			total: count,
// 			rows,
// 		};
// 	}

// 	init(page, limit) {
// 		page = Number(page);
// 		limit = Number(limit);

// 		if (!Number.isNaN(page) && page !== 0) {
// 			this.page = page;
// 		}

// 		if (!Number.isNaN(limit)) {
// 			this.perPage = limit;
// 		}

// 		return {
// 			limit: parseInt(this.perPage, 10),
// 			offset: parseInt((this.page - 1) * this.perPage, 10),
// 			response: this.response.bind(this),
// 		};
// 	}
// }

// export default ({ page, perPage }) => new Pagination().init(page, perPage);
