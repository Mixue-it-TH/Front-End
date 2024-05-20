async function getStatusList(url) {
	try {
		const data = await fetch(url)
		const items = await data.json()
		return items
	} catch (error) {
		console.log(`error: ${error}`)
	}
}
async function getStatusById(url, id) {
	try {
		const data = await fetch(`${url}/${id}`)
		const item = await data.json()
		if (data.status === 200) {
			return item
		} else {
			return data.status
		}
	} catch (error) { }
}

async function addStatus(url, newStatus) {
	console.log(newStatus)
	try {
		const response = await fetch(`${url}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: newStatus.name?.trim(),
				description: newStatus.description
					? newStatus.description.trim()
					: null,
				statusColor: newStatus.statusColor,
			}),
		})
		console.log(response)
		if (response.ok) {
			const responseData = await response.json()
			console.log(responseData)
			return responseData
		} else {
			throw new Error("Failed to add status")
		}
	} catch (e) {
		console.log(`error: ${e}`)
	}
}

async function editStatus(url, status) {
	console.log(status.description !== "" ? status.description.trim() : null)
	try {
		const respone = await fetch(`${url}/${status.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: status.id,
				name: status.name?.trim(),
				description: status.description !== "" ? status.description.trim() : null,
				statusColor: status.statusColor,
			}),
		})
		console.log(respone)
		if (respone.ok) {
			const responseData = await respone.json()
			return responseData
		} else if (respone.status === 404) {
			return 404
		}
	} catch (e) {
		console.log(`error: ${e}`)
	}
}
async function deleteStatusById(url, id) {
	try {
		const response = await fetch(`${url}/${id}`, {
			method: "DELETE",
		})
		if (response.ok) {
			return response
		} else return response.status
	} catch (e) {
		console.log(`error: ${e}`)
	}
}
async function deleteTaskAndTranfer(url, id, newId) {
	try {
		const response = await fetch(`${url}/${id}/${newId}`, {
			method: "DELETE",
		})
		console.log(response.status)
		return response
	} catch (e) {
		console.log(`error: ${e}`)
	}
}

async function handelLimitMaximum(url, isLimit, amountMaximum) {
	try {
		const response = await fetch(`${url}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				limitMaximumTask: isLimit,
				number: amountMaximum,
			}),
		})
		if (response.ok) {
			const responseData = await response.json()
			return responseData
		} else {
			throw new Error("Failed to add status")
		}
	} catch (e) {
		console.log(`error: ${e}`)
	}
}
export {
	getStatusList,
	getStatusById,
	addStatus,
	editStatus,
	deleteTaskAndTranfer,
	deleteStatusById,
	handelLimitMaximum,
}
