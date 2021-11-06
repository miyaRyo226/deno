import { WEATHER_OVERVIEW_TYPE } from './type.ts';
export const WEATHER_OVERVIEW = "https://www.jma.go.jp/bosai/forecast/data/overview_forecast/410000.json";
export const WEATHER = "https://www.jma.go.jp/bosai/forecast/data/forecast/410000.json";

//LINE
export const LINE_REPLY_URL_API = "https://api.line.me/v2/bot/message/reply";
export const LINE_PUSH_URL_API = "https://api.line.me/v2/bot/message/push";
export const CHANNEL_ACCESS_TOKEN = Deno.env.get("CHANNEL_ACCESS_TOKEN") || '';
export const USER_ID = Deno.env.get("USER_ID") || "";

//LINE 定型分メッセージ
export const LINE_MESSAGES = ["ふぁあ〜今日も眠たいね😪",
    "僕わかんない😂",
    "質問の意味がわからないぞ（இ﹏இ`｡)",
    "今日も一日頑張ろうね！",
    "疲れた時は、無理せず休憩しよ😉"
];

/**
 * Lineに返信メッセージを送信する関数
 * @param message 返信メッセージ
 * @param replyToken 返信時に発行されるトークン
 * @param token チャンネルアクセストークン
 * @returns Promise<Response>
 */
export const replyMessage = async (message: string,
    replyToken: string,
): Promise<Response> => {
    const body = {
        replyToken,
        messages: [
            {
                type: "text",
                text: message,
            },
        ],
    };

    return fetch(LINE_REPLY_URL_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json charset=UTF-8",
            Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(body),
    })
}
/**
 * Lineにプッシュメッセージを送信する関数
 * @param message 返信メッセージ
 * @param replyToken 返信時に発行されるトークン
 * @param token チャンネルアクセストークン
 * @returns Promise<Response>
 */
export const pushMessage = async (message: string
): Promise<Response> => {
    const body = {
        //指定したユーザID
        to: USER_ID,
        messages: [
            {
                type: "text",
                text: message,
            },
        ],
    };

    return fetch(LINE_REPLY_URL_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(body),
    })
}

/**
 * 気象庁APIからの情報を返す関数
 * @returns object
 */
export const getForeCastInfo = async () => {
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

    return { targetArea, headlineText, text, forecasts }
}