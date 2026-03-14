import { CONFIG } from './config.js';
function showSection(id) {
        document.querySelectorAll('.content-section').forEach(s => s.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
    }

    // THAY API KEY THẬT CỦA M VÀO ĐÂY
    const API_KEY = "CONFIG.API_KEY"; 
    const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    async function aiReply() {
        const inputElement = document.getElementById('user-input');
        const box = document.getElementById('chat-box');
        const userMsg = inputElement.value.trim();
        if (!userMsg) return;

        box.innerHTML += `<div class="msg user-msg"><b>M:</b> ${userMsg}</div>`;
        inputElement.value = "";
        box.scrollTop = box.scrollHeight;

        const loadingId = "loading-" + Date.now();
        box.innerHTML += `<div class="msg ai-msg" id="${loadingId}"><b>AI:</b> Đợi t tí...</div>`;
        box.scrollTop = box.scrollHeight;

        try {
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ 
                            text: `M là thủ thư tên Hiên. Danh sách sách hiện có: Đắc Nhân Tâm, Nhà Giả Kim, Súng Vi Trùng và Thép. Hãy tư vấn sách cho người dùng dựa trên yêu cầu của họ bằng giọng văn thân mật (xưng t, gọi m): ${userMsg}` 
                        }]
                    }]
                })
            });

            const data = await response.json();
            
            if (data.candidates && data.candidates[0].content) {
                const aiText = data.candidates[0].content.parts[0].text;
                document.getElementById(loadingId).innerHTML = `<b>AI:</b> ${aiText}`;
            } else {
                document.getElementById(loadingId).innerHTML = `<b>AI:</b> API từ chối rồi m ơi, check lại Key đi!`;
            }
        } catch (error) {
            document.getElementById(loadingId).innerHTML = `<b>AI:</b> Lỗi mạng rồi m ơi!`;
        }
        box.scrollTop = box.scrollHeight;
    }
async function goiAI() {
    const response = await fetch(CONFIG.API_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${CONFIG.API_KEY}`, // Dùng biến từ file config
            "Content-Type": "application/json"
        },
        body: JSON.stringify({contents: [
                    {
                        parts: [
                            { text: cauHoiCuaToi } // Nội dung câu hỏi của bạn
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.9,
                    topK: 1,
                    topP: 1,
                    maxOutputTokens: 2048,
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Lỗi Google API:", error);
            return "Lỗi rồi, kiểm tra Console để xem chi tiết.";
        }

        const data = await response.json();

        const cauTraLoi = data.candidates[0].content.parts[0].text;

        return cauTraLoi;

    } catch (error) {
        console.error("Lỗi kết nối:", error);
        return "Không thể kết nối tới Google AI.";
    }
}
