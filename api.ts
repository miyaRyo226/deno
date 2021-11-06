export const WEATHER_OVERVIEW = "https://www.jma.go.jp/bosai/forecast/data/overview_forecast/410000.json";
export const WEATHER = "https://www.jma.go.jp/bosai/forecast/data/forecast/410000.json";

//LINE
export const LINEAPI = "https://api.line.me/v2/bot/message/reply";
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
    token: string,
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

    return fetch(LINEAPI, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    })
}