/* ============================================================
   api.js  —  single place that talks to the Spring Boot backend
   Exposes ONE global object: Api
   ============================================================ */

const API_BASE_URL = ""; // same origin as the Spring Boot server

async function request(path, options = {}) {

    const response = await fetch(API_BASE_URL + path, {
        headers: {
            "Accept": "application/json",
            ...(options.body ? { "Content-Type": "application/json" } : {})
        },
        ...options
    });

    if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(text || `Request failed (${response.status})`);
    }

    // DELETE /habits/{id} returns plain text, not JSON
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
        return await response.text();
    }

    return await response.json();
}


const Api = {

    /* ---------- HABITS ---------- */

    getHabits() {
        return request("/habits");
    },

    createHabit(name, frequency) {
        return request("/habits", {
            method: "POST",
            body: JSON.stringify({ name, frequency })
        });
    },

    deleteHabit(id) {
        return request(`/habits/${id}`, { method: "DELETE" });
    },


    /* ---------- COMPLETION LOGS ---------- */

    getLogs() {
        return request("/logs");
    },

    addLog({ habitId, completionDate }) {
        return request("/logs", {
            method: "POST",
            body: JSON.stringify({ habitId, completionDate })
        });
    },


    /* ---------- STREAKS ---------- */

    getStreaks() {
        return request("/streaks");
    },

    updateStreak({ habitId, currentStreak }) {
        return request("/streaks", {
            method: "POST",
            body: JSON.stringify({ habitId, currentStreak })
        });
    }
};
