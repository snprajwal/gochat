window.onload = () => {
	let user = prompt("Please enter your username")
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
			console.log(data)
			let item = document.createElement("div")
			item.innerHTML = `<b>${data.user}</b>: ${data.msg}`
			log.appendChild(item)
		}
	}
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
