/* ============================================================
   streaks.js  —  page logic for streak.html
   ============================================================ */

let habits = [];
let logIndex = new Map();
let savedStreaks = new Map(); // habitId -> { currentStreak, bestStreak }


async function loadStreakPage() {

    try {
        const [loadedHabits, logs, streaks] = await Promise.all([
            Api.getHabits(),
            Api.getLogs(),
            Api.getStreaks()
        ]);

        habits = loadedHabits || [];
        logIndex = buildLogIndex(logs);
        savedStreaks = new Map((streaks || []).map((s) => [s.habitId, s]));

        renderStreakPage();

    } catch (error) {
        $("streakList").innerHTML =
            `<p class="empty">Could not load data. Is the backend running?</p>`;
        showToast(error.message || "Could not load data.", "error");
    }
}


function renderStreakPage() {

    const select = $("habitSelect");
    const previous = select.value;

    if (!habits.length) {
        select.innerHTML = `<option value="">No habits yet</option>`;
        select.disabled = true;
        $("updateBtn").disabled = true;
        $("currentStreak").value = "";
        $("currentValue").textContent = "-";
        $("bestValue").textContent = "-";
        $("streakList").innerHTML =
            `<p class="empty"><a href="/habit.html">Create a habit</a> first.</p>`;
        return;
    }

    select.disabled = false;
    $("updateBtn").disabled = false;

    select.innerHTML = habits
        .map((h) => `<option value="${h.id}">${escapeHtml(h.name)}</option>`)
        .join("");

    if (previous && habits.some((h) => String(h.id) === previous)) {
        select.value = previous;
    }

    onHabitChange();

    $("streakList").innerHTML = habits.map((habit) => {

        const saved = savedStreaks.get(habit.id);

        return `
            <div class="habit-row">

                <div class="habit-left">
                    <div class="habit-icon">${habitIcon(habit.name)}</div>
                    <div>
                        <div class="habit-name">${escapeHtml(habit.name)}</div>
                        <div class="habit-meta">${escapeHtml(habit.frequency)}</div>
                    </div>
                </div>

                <span class="badge">
                    🔥 ${saved ? saved.currentStreak : 0} • 🏆 ${saved ? saved.bestStreak : 0}
                </span>

            </div>`;
    }).join("");
}


function onHabitChange() {

    const habitId = Number($("habitSelect").value);
    const saved = savedStreaks.get(habitId);

    // prefill with the streak calculated from the completion logs
    $("currentStreak").value = computeCurrentStreak(logIndex.get(habitId) || new Set());

    $("currentValue").textContent = saved ? saved.currentStreak : "-";
    $("bestValue").textContent = saved ? saved.bestStreak : "-";
}


async function updateStreak() {

    const habitId = Number($("habitSelect").value);
    const currentStreak = parseInt($("currentStreak").value, 10);

    if (!habitId || Number.isNaN(currentStreak) || currentStreak < 0) {
        showToast("Choose a habit and enter a valid streak.", "error");
        return;
    }

    $("updateBtn").disabled = true;

    try {
        const data = await Api.updateStreak({ habitId, currentStreak });

        $("result").innerHTML = `
            <div class="result-card">
                <h3>Streak Updated!</h3>
                <p>Current Streak: <strong>${data.currentStreak}</strong></p>
                <p>Best Streak: <strong>${data.bestStreak}</strong></p>
            </div>`;

        await loadStreakPage();

    } catch (error) {
        $("result").innerHTML = `
            <div class="result-card error">
                <h3>Update Failed</h3>
                <p>${escapeHtml(error.message)}</p>
            </div>`;
    } finally {
        $("updateBtn").disabled = false;
    }
}


/* ---------- wiring ---------- */

$("habitSelect").addEventListener("change", onHabitChange);
$("updateBtn").addEventListener("click", updateStreak);

loadStreakPage();
