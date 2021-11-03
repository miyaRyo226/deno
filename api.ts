export const WEATHER_OVERVIEW = "https://www.jma.go.jp/bosai/forecast/data/overview_forecast/410000.json";
export const WEATHER = "https://www.jma.go.jp/bosai/forecast/data/forecast/410000.json";

//LINE
export const LINEAPI = "https://api.line.me/v2/bot/message/reply";
export const CHANNEL_ACCESS_TOKEN = Deno.env.get("CHANNEL_ACCESS_TOKEN") || '';

//Lineに返信メッセージを送信する関数
export const replyMessage = async (message: string,
    replyToken: string,
    token: string,
) => {
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