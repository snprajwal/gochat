window.onload = () => {
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

  let userName = prompt("Enter your username");
  while (userName == "") {
    userName = prompt("Username cannot be empty! Please enter a valid username")
  }
  let msg = document.getElementById("msg");
  let log = document.getElementById("log");
  let conn = new WebSocket("ws://" + document.location.host + "/ws");
  conn.onclose = (e) => {
    let item = document.createElement("div");
    item.innerHTML = "<b>Connection closed.</b>";
    log.appendChild(item);
    item.classList.add("msgBubble");
  };

  conn.onmessage = (e) => {
    let msgs = e.data.split("\n");
    for (let i = 0; i < msgs.length; i++) {
      let data = JSON.parse(msgs[i])
      console.log(data)
      let item = document.createElement("div");
      if (data.userName === userName) {
        item.innerHTML = `<b><font color='lightgreen'>${data.userName}</font></b>: ${data.msg}`
      } else {
        item.innerHTML = `<b><font color='red'>${data.userName}</font></b>: ${data.msg}`
      }
      log.appendChild(item);
      item.classList.add("msgBubble");
      log.scrollTop = log.scrollHeight;
    }
  };
  document.getElementById("form").onsubmit = () => {
    if (!conn) {
      return false;
    }
    if (!msg.value) {
      return false;
    }
    data = JSON.stringify({userName, msg: msg.value})
    conn.send(data);
    msg.value = "";
    return false;
  };
};
