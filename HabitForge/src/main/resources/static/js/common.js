/* ============================================================
   common.js  —  shared helpers used by every page
   ============================================================ */

function $(id) {
    return document.getElementById(id);
}


/* ---------- toast ---------- */

let toastTimer = null;

function showToast(message, type = "success") {

    let toast = $("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.className = "toast show" + (type === "error" ? " error" : "");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// kept so older code that called showMessage() still works
const showMessage = showToast;


/* ---------- escaping ---------- */

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}


/* ---------- dates ---------- */

function toDateString(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function todayString() {
    return toDateString(new Date());
}

function addDays(date, amount) {
    const copy = new Date(date.getTime());
    copy.setDate(copy.getDate() + amount);
    return copy;
}


/* ---------- completion logs ---------- */

/** Map<habitId, Set<"YYYY-MM-DD">> */
function buildLogIndex(logs) {

    const index = new Map();

    (logs || []).forEach((log) => {

        const habitId = Number(log.habitId);
        if (!habitId || !log.completionDate) return;

        // backend sends LocalDate as "YYYY-MM-DD"
        const date = String(log.completionDate).slice(0, 10);

        if (!index.has(habitId)) index.set(habitId, new Set());
        index.get(habitId).add(date);
    });

    return index;
}

/** Consecutive days ending today (or yesterday, so today isn't "lost" yet). */
function computeCurrentStreak(dates) {

    if (!dates || dates.size === 0) return 0;

    let cursor = new Date();

    if (!dates.has(toDateString(cursor))) {
        cursor = addDays(cursor, -1);
        if (!dates.has(toDateString(cursor))) return 0;
    }

    let streak = 0;
    while (dates.has(toDateString(cursor))) {
        streak++;
        cursor = addDays(cursor, -1);
    }

    return streak;
}


/* ---------- misc ---------- */

function habitIcon(name) {

    const text = String(name || "").toLowerCase();

    if (/read|book/.test(text))            return "📚";
    if (/run|walk|jog|gym|workout|exercise/.test(text)) return "🏃";
    if (/water|drink|hydrat/.test(text))   return "💧";
    if (/meditat|breath|yoga/.test(text))  return "🧘";
    if (/sleep|bed/.test(text))            return "😴";
    if (/code|study|learn/.test(text))     return "💻";
    if (/write|journal/.test(text))        return "✍️";

    return "✓";
}
