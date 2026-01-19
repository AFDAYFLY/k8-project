/**
 * Vercel Serverless Function
 * 이 코드는 사용자의 브라우저에서 보이지 않고 Vercel 서버에서만 실행됩니다.
 */
export default async function handler(req, res) {
    // 1. 프론트엔드(index.html)에서 보낸 텍스트를 받습니다.
    const { text } = req.body;

    // 2. Vercel 환경 변수 금고에 저장해둔 API 키를 가져옵니다. (보안의 핵심)
    const API_KEY = process.env.GEMINI_API_KEY; 

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;

    try {
        // 3. 서버 대 서버로 구글 AI에게 요청을 보냅니다.
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ 
                        text: `취업 컨설턴트로서 다음 자소서를 분석해. 맨 첫 줄에 점수 [80, 70, 90] 형식을 지키고 그 다음부터 분석해줘. 내용: ${text}` 
                    }] 
                }]
            })
        });

        const data = await response.json();

        // 4. 구글로부터 받은 결과를 다시 프론트엔드로 안전하게 전달합니다.
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "서버 내부 오류가 발생했습니다." });
    }
}