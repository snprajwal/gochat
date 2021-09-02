window.onload = () => {
	let msg = document.getElementById("msg")
	let log = document.getElementById("log")
	let conn = new WebSocket("ws://" + document.location.host + "/ws")
	conn.onclose = (e) => {
		let item = document.createElement("div")
		item.innerHTML = "<b>Connection closed.</b>"
		log.appendChild(item)
	}
	conn.onmessage = (e) => {
		let msgs = e.data.split('\n')
		for (let i = 0; i < msgs.length; i++) {
			let item = document.createElement("div")
			item.innerText = msgs[i]
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
		conn.send(msg.value)
		msg.value = ""
		return false
	}
}
