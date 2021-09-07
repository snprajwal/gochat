window.onload = () => {
	// handling multiple tabs from same client
	localStorage.open = Date.now()
	window.addEventListener('storage', (e) => {
		if (e.key == "open") {
			localStorage.duplicate = Date.now()
		}
		if (e.key == "duplicate")
		{
			alert("This page is already open in another tab/window")
			window.close()
		}
	})

	// obtaining username
	let user = prompt("Please enter your username")
	while (user == "") {
		user = prompt("Username cannot be empty! Please enter a valid username")
	}

	// handling websocket connection
	let msg = document.getElementById("msg")
	let log = document.getElementById("log")
	let conn = new WebSocket("ws://" + document.location.host + "/ws")
	conn.onclose = (e) => {
		let item = document.createElement("div")
		item.innerHTML = "<b>Connection closed.</b>"
		log.appendChild(item)
	}
	conn.onmessage = (e) => {
		let raw = e.data.split('\n')
		for (let i = 0; i < raw.length; i++) {
			let data = JSON.parse(raw[i])
			let item = document.createElement("div")
			if (data.user === user) {
				item.innerHTML = `<b><font color='blue'>${data.user}</font></b>: ${data.msg}`
			} else {
				item.innerHTML = `<b><font color='red'>${data.user}</font></b>: ${data.msg}`
			}
			log.appendChild(item)
		}
	}

	// handling messages
	document.getElementById("form").onsubmit = () => {
		if (!conn) {
			return false
		}
		if (!msg.value) {
			return false
		}
		data = JSON.stringify({user, msg: msg.value})
		conn.send(data)
		msg.value = ""
		return false
	}
}
