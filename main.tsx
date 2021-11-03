/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
import { h, renderSSR } from "https://deno.land/x/nano_jsx@v0.0.20/mod.ts";

import {
  WEATHER_OVERVIEW,
  WEATHER,
  replyMessage,
  CHANNEL_ACCESS_TOKEN,
} from "./api.ts";
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
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
  //Getリクエスト
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

  //Postリクエスト
  if (req.method == "POST") {
    //コンテンツタイプ
    const contentType = req.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const json = await req.json();
      console.log(json);

      if (json.events.length > 0) {
        //入力した文字が天気に関係なかったらランダムにメッセージを返信する
        const inputMessage: string = json.events[0]?.message?.text;
        if (!inputMessage.includes("天気")) {
          const randomMessage = [
            "ふぁあ〜今日も眠たいね😪",
            "僕わかんない😂",
            "質問の意味がわからないぞ（இ﹏இ`｡)",
          ];
          const messageNo = Math.floor(Math.random() * randomMessage.length);
          await replyMessage(
            randomMessage[messageNo],
            json.events[0]?.replyToken,
            CHANNEL_ACCESS_TOKEN
          );
        }

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

        //天気に関係ある場合は、天気情報を送信する。
        const replyForecast = [
          `今日の天気を教えるよ〜〜`,
          `${targetArea}の情報だよ！`,
          headlineText,
          text,
          ...forecasts,
        ];

        await replyMessage(
          replyForecast.join("\n"),
          json.events[0]?.replyToken,
          CHANNEL_ACCESS_TOKEN
        );
      }
      return new Response();
    }
  }
  return new Response("送信に失敗しました。");
};

console.log("Listening on http://localhost:80");
await listenAndServe(":80", handler);
