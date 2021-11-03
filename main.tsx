/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
import { h, renderSSR } from "https://deno.land/x/nano_jsx@v0.0.20/mod.ts";

import { WEATHER_OVERVIEW, WEATHER } from "./api.ts";
import { WEATHER_OVERVIEW_TYPE } from "./type.ts";
import { listenAndServe } from "https://deno.land/std@0.111.0/http/server.ts";

//render引数
type APPTYPE = {
  targetArea: string;
  headlineText: string;
  text: string;
  forecasts: string[];
};
const App = ({
  targetArea,
  headlineText,
  text,
  forecasts,
}: APPTYPE): JSX.ElementClass => (
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
          <li key={m}>{m}</li>
        ))}
      </ul>
    </body>
  </html>
);

const handler = async (req: Request): Promise<Response> => {
  //GETリクエストの時
  if (req.method == "GET") {
    //気象庁APIから佐賀県の情報を取得
    const { targetArea, headlineText, text }: WEATHER_OVERVIEW_TYPE =
      await fetch(WEATHER_OVERVIEW)
        .then((res) => res.json())
        .catch((e) => console.log(e));
    const weathers = await fetch(WEATHER)
      .then((res) => res.json())
      .catch((e) => console.log(e));
    //今日の天気
    const todayArea = weathers[0].timeSeries[0].areas[0];
    const forecasts: string[] = todayArea.weathers;
    const html = renderSSR(
      <App
        targetArea={targetArea}
        headlineText={headlineText}
        text={text}
        forecasts={forecasts}
      />
    );
    return new Response(html, {
      headers: {
        "content-type": "text/html",
      },
    });
  }
  return new Response("Hello world");
};

console.log("Listening on http://localhost:80");
await listenAndServe(":80", handler);
