const request = require("supertest");
const { connectdb, disconnectdb } = require("../../database/mongo");
const app = require("../../app");
const { loadPlanets } = require("../../model/planets.model");

describe("Launches API", () => {
	beforeAll(async () => {
		connectdb();
		await loadPlanets();
	});
	afterAll(() => {
		disconnectdb();
	});
	describe("Test GET /launches", () => {
		test("it should return a list of launches", async () => {
			await request(app).get("/v1/launches").expect(200);
		});
	});

	describe("Test POST /launches", () => {
		const validData = {
			mission: "Kepler-exploration X",
			rocket: "Explorer 151",
			launchDate: "December 27,2030",
			target: "Kepler-442 b",
		};

		const incompleteData = {
			mission: "Kepler-exploration X",
			rocket: "Explorer 151",
			// target: "Kepler-442 b",
			launchDate: "December 27,2030",
		};
		const invalidDate = {
			mission: "Kepler-exploration X",
			rocket: "Explorer 151",
			launchDate: "fluyfvhv 27,2030",
			target: "Kepler-442 b",
		};

		test("it should update the list of launches", async () => {
			const response = await request(app)
				.post("/v1/launches")
				.send(validData)
				.expect(201);

			const responseDate = new Date(response.body.launchDate).valueOf();
			const validDate = new Date(validData.launchDate).valueOf();
			expect(responseDate).toBe(validDate);
			expect(response.body).toMatchObject(incompleteData);
		});

		test("it should handle missing required property", async () => {
			const response = await request(app)
				.post("/v1/launches")
				.send(incompleteData)
				.expect(400);
			expect(response.body).toStrictEqual({ error: "Missing required field!" });
		});
		test("it should handle invalid dates", async () => {
			const response = await request(app)
				.post("/v1/launches")
				.send(invalidDate)
				.expect(400);
			expect(response.body).toStrictEqual({ error: "Invalid date" });
		});
	});
});
