/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
import { h, renderSSR } from "https://deno.land/x/nano_jsx@v0.0.20/mod.ts";
import {
  replyMessage,
  LINE_MESSAGES,
  getForeCastInfo,
  nowSeason,
} from "./api.ts";
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
  try {
    //気象庁APIから佐賀県の情報を取得
    const { targetArea, headlineText, text, forecasts } =
      await getForeCastInfo();
    //Getリクエストの場合はHTMLを返却
    if (req.method == "GET") {
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
          console.log(inputMessage);
          console.log(!inputMessage.includes("天気"));
          if (!inputMessage.includes("天気")) {
            //現在の日付に応じて返す配列の中身を返す。
            const replyMessages = [...LINE_MESSAGES, ...nowSeason().season];
            await replyMessage(
              replyMessages[Math.floor(Math.random() * replyMessages.length)],
              json.events[0]?.replyToken
            );
            return new Response();
          }

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
            json.events[0]?.replyToken
          );
          return new Response();
        }
        return new Response();
      }
    }
    return new Response();
  } catch (error) {
    console.log(error);
    return new Response("送信に失敗しました。");
  }
};

await listenAndServe(": ", handler);
console.log("TEST!!!!");
