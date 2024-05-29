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
	} catch (error) {
		console.log(`error: ${e}`)
	}
}

async function addStatus(url, newStatus) {
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
		if (response.ok) {
			const responseData = await response.json()
			return responseData
		} else {
			return response.status
		}
	} catch (e) {
		console.log(`error: ${e}`)
	}
}

async function editStatus(url, status) {
	try {
		const respone = await fetch(`${url}/${status.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: status.id,
				name: status.name?.trim(),
				description:
					status.description !== "" ? status.description.trim() : null,
				statusColor: status.statusColor,
			}),
		})
		if (respone.ok) {
			const responseData = await respone.json()
			return responseData
		} else return respone.status
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
