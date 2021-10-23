// @deno-types="https://deno.land/x/servest@v1.3.1/types/react/index.d.ts"
import React from "https://dev.jspm.io/react/index.js";
// @deno-types="https://deno.land/x/servest@v1.3.1/types/react-dom/server/index.d.ts"
import ReactDOMServer from "https://dev.jspm.io/react-dom/server.js";
import { createApp } from "https://deno.land/x/servest@v1.3.1/mod.ts";
import {
  cron,
  daily,
  monthly,
  weekly,
} from "https://deno.land/x/deno_cron/cron.ts";
import { WEATHER_OVERVIEW_TYPE } from "./type.ts";
import { WEATHER_OVERVIEW, WEATHER } from "./api.ts";

const app = createApp();

app.get("/", async (req) => {
  //気象庁APIから佐賀県の情報を取得
  const { targetArea, headlineText, text }: WEATHER_OVERVIEW_TYPE = await fetch(
    WEATHER_OVERVIEW
  ).then((res) => res.json());
  const weathers = await fetch(WEATHER).then((res) => res.json());
  //今日の天気
  const todayArea = weathers[0].timeSeries[0].areas[0];
  const forecasts: string[] = todayArea.weathers;

  await req.respond({
    status: 200,
    headers: new Headers({
      "content-type": "text/html; charset=UTF-8",
    }),
    body: ReactDOMServer.renderToString(
      <html lang="en">
        <head>
          <title>Document</title>
        </head>
        <body>
          <h1>
            <div>{targetArea}</div>
            <div>{headlineText}</div>
            <div>{text}</div>
          </h1>
          <ul>
            {forecasts.map((m) => (
              <li>{m}</li>
            ))}
          </ul>
        </body>
      </html>
    ),
  });
});

app.listen({ port: 80 });

daily(async () => await fetch("http://localhost:80"));
