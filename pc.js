console.log("pc");

const url = new URL(window.location.href);
if (url.protocol == "http") {
  url.protocol = "ws"
} else {
  url.protocol = "wss"
}
url.pathname = "/pc/ws";
ws = new WebSocket(url);

ws.addEventListener("message", (m) => {
  console.log("Image");
  const image = URL.createObjectURL(m.data);
  const main = document.getElementById("main");

  const elem = document.createElement("img");
  elem.src = image;
  elem.width = 300;
  // elem.onload = () => URL.revokeObjectURL(image);

  main.prepend(elem);
});
