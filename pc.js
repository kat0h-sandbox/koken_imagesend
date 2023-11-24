const url = new URL(window.location.href);
if (url.protocol == "http:") {
  url.protocol = "ws";
} else {
  url.protocol = "wss";
}
url.pathname = "/pc/ws";
ws = new WebSocket(url);

ws.addEventListener("message", (m) => {
  const blob = m.data;
  blob.type = "image/jpeg";
  const image = URL.createObjectURL(blob);
  const main = document.getElementById("main");

  const elem = document.createElement("img");
  elem.src = image;
  elem.width = 300;

  main.prepend(elem);
});
