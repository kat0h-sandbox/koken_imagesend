/** @jsx jsx */
/** @jsxFrag Fragment */

// PCでuuid付きの使い捨てのURLを生成→QRに
// スマホからアップロード
// PCの画面にはBASIC認証を書ける
//

import { Hono } from "https://deno.land/x/hono@v3.10.2/mod.ts";
import {
  basicAuth,
  Fragment,
  jsx,
  serveStatic,
} from "https://deno.land/x/hono@v3.10.2/middleware.ts";
import { logger } from "https://deno.land/x/hono@v3.10.2/middleware.ts";

const app = new Hono();
let sock: undefined | WebSocket = undefined;

app.use("*", logger());
const password = Deno.env.get("USER_PASS");
if (password == undefined) {
  console.error("Environment Variable => USER_PASS");
  Deno.exit(2);
}
app.use(
  "/pc",
  basicAuth({
    username: "koken",
    password: password,
  }),
);
app.get("/favicon.ico", serveStatic({ path: "./favicon.ico" }));

app.get("/upload", (c) => {
  return c.html(
    <>
      <html>
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </head>
        <body>
          <p1>アップローダー</p1>
          <form action="/upload" method="POST" enctype="multipart/form-data">
            <input type="file" name="image" accept="image/jpeg" />
            <button type="submit">送信</button>
          </form>
        </body>
      </html>
    </>,
  );
});
app.post("/upload", async (c) => {
  console.log(await c.req.parseBody());
  const { image } = await c.req.parseBody();
  console.log(image);
  if (sock !== undefined && image instanceof File) {
    sock.send(image);
  }
  return c.redirect("/upload");
});

app.get("/pc", (c) => {
  // https://cdn.tailwindcss.com
  return c.html(
    <>
      <html>
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <script src="/pc/js"></script>
        </head>
        <body>
          <p1>画像取得</p1>
          <div id="main">
          </div>
        </body>
      </html>
    </>,
  );
});
app.get("/pc/js", serveStatic({ path: "./pc.js" }));
app.get("/pc/ws", (c) => {
  const { response, socket } = Deno.upgradeWebSocket(c.req.raw);
  sock = socket;
  return response;
});

Deno.serve(app.fetch);
