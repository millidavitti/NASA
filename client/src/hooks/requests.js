const url = (endpoint) => `/v1/${endpoint}`;

async function httpGetPlanets() {
	const response = await fetch(url("planets"));
	return await response.json();
}

async function httpGetLaunches() {
	const response = await fetch(url("launches"));
	const data = await response.json();
	return data.sort((a, b) => a.flighter - b.flightNumber);
}

async function httpSubmitLaunch(launch) {
	try {
		return await fetch(url("launches"), {
			method: "POST",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify(launch),
		});
	} catch (error) {
		console.log(error.message);
		return { ok: false };
	}
}

async function httpAbortLaunch(id) {
	try {
		return await fetch(url(`launches/${id}`), {
			method: "delete",
		});
	} catch (error) {
		return { ok: false };
	}
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
