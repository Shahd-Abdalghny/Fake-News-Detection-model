const BASE_URL = "http://127.0.0.1:8000";

export async function predictSingle(text, model) {
    const res = await fetch(`${BASE_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, model }),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
}

export async function predictAll(text) {
    const res = await fetch(`${BASE_URL}/predict/all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
}