import { WEATHER_OVERVIEW_TYPE } from './type.ts';
export const WEATHER_OVERVIEW = "https://www.jma.go.jp/bosai/forecast/data/overview_forecast/410000.json";
export const WEATHER = "https://www.jma.go.jp/bosai/forecast/data/forecast/410000.json";

//LINE
export const LINE_REPLY_URL_API = "https://api.line.me/v2/bot/message/reply";
export const LINE_PUSH_URL_API = "https://api.line.me/v2/bot/message/push";
import { datetime } from "https://deno.land/x/ptera/mod.ts";
export const CHANNEL_ACCESS_TOKEN = Deno.env.get("CHANNEL_ACCESS_TOKEN") || '';
export const USER_ID = Deno.env.get("USER_ID") || "";

//LINE 定型分メッセージ
export const LINE_MESSAGES = ["ふぁあ〜今日も眠たいね😪",
    "僕わかんない😂",
    "質問の意味がわからないぞ（இ﹏இ`｡)",
    "今日も一日頑張ろうね！",
    "疲れた時は、無理せず休憩しよ😉"
];
//春用 定型文
export const LINE_SPRING_MESSAGES = ["春ですね〜、眠たいけど頑張りましょう！🌸🌸", "入学シーズンですね！あまり緊張しないで気楽に行こうね😊"]
//夏用 定型文
export const LINE_SUMMER_MESSAGES = ["夏ですね〜、暑いので水分補給を忘れずに！🍼", "夏バテには気をつけて🙂"]
//秋用 定型文
export const LINE_AUTUMN_MESSAGES = ["紅葉の季節ですね！いろんな景色を見てみたいです！", "食欲の秋ですね🍡"]
//冬用 定型文
export const LINE_WINTER_MESSAGES = ["寒いので、風邪には気を付けて😂", "今年もあと少しだね〜、無理しない程度に頑張ろ！"]

/**
 * 現在がどの季節か判断して季節を返す関数
 */
export const nowSeason = (): Readonly<{ season: string[] }> => {
    const { month } = datetime();
    switch (month) {
        case 12 || 1 || 2:
            return { season: LINE_WINTER_MESSAGES }
        case 3 || 4 || 5:
            return { season: LINE_SPRING_MESSAGES }
        case 6 || 7 || 8:
            return { season: LINE_SUMMER_MESSAGES }
        case 9 || 10 || 11:
            return { season: LINE_AUTUMN_MESSAGES }
        default:
            return { season: LINE_SPRING_MESSAGES }
    }
}

/**
 * Lineに返信メッセージを送信する関数
 * @param message 返信メッセージ
 * @param replyToken 返信時に発行されるトークン
 * @param token チャンネルアクセストークン
 * @returns Promise<Response>
 */
export const replyMessage = async (message: string,
    replyToken: string,
): Promise<void> => {
    try {
        const body = {
            replyToken,
            messages: [
                {
                    type: "text",
                    text: message,
                },
            ],
        };

        fetch(LINE_REPLY_URL_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
            },
            body: JSON.stringify(body),
        })
    } catch (error) {
        console.log(error);
    }
}
/**
 * Lineにプッシュメッセージを送信する関数
 * @param message 返信メッセージ
 * @param replyToken 返信時に発行されるトークン
 * @param token チャンネルアクセストークン
 * @returns Promise<Response>
 */
export const pushMessage = async (message: string
): Promise<void> => {
    try {

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

        fetch(LINE_REPLY_URL_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
            },
            body: JSON.stringify(body),
        })
    } catch (error) {
        console.log(error);
    }

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