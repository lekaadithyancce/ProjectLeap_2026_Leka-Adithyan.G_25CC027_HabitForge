/* ============================================================
   dashboard.js  —  page logic for index.html
   ============================================================ */

async function loadDashboard() {

    try {
        const [habits, logs, streaks] = await Promise.all([
            Api.getHabits(),
            Api.getLogs(),
            Api.getStreaks()
        ]);

        renderDashboard(habits, logs, streaks);

    } catch (error) {
        $("habitList").innerHTML =
            `<p class="empty">Could not load data. Is the backend running?</p>`;
        showToast(error.message || "Could not load data.", "error");
    }
}


function renderDashboard(habits, logs, streaks) {

    const index = buildLogIndex(logs);
    const today = todayString();
    const savedBest = new Map((streaks || []).map((s) => [s.habitId, s.bestStreak]));

    const rows = habits.map((habit) => {
        const dates = index.get(habit.id) || new Set();
        return {
            habit,
            doneToday: dates.has(today),
            current: computeCurrentStreak(dates),
            best: savedBest.get(habit.id) || 0,
            dates
        };
    });


    /* ---------- greeting ---------- */

    const hour = new Date().getHours();
    $("greeting").textContent =
        (hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening") + " 👋";


    /* ---------- stats ---------- */

    const topCurrent = rows.reduce((max, r) => Math.max(max, r.current), 0);
    const topBest = rows.reduce((max, r) => Math.max(max, r.best, r.current), 0);

    let weekDone = 0;
    for (const row of rows) {
        for (let i = 0; i < 7; i++) {
            if (row.dates.has(toDateString(addDays(new Date(), -i)))) weekDone++;
        }
    }

    const weekPct = rows.length
        ? Math.round((weekDone / (rows.length * 7)) * 100)
        : 0;

    const doneCount = rows.filter((r) => r.doneToday).length;

    $("statTotal").textContent = habits.length;
    $("statCurrent").textContent = topCurrent;
    $("statBest").textContent = topBest;
    $("statCompletion").textContent = weekPct + "%";
    $("miniProgress").textContent = `${doneCount} of ${habits.length} completed`;


    /* ---------- today's habits ---------- */

    if (!rows.length) {
        $("habitList").innerHTML =
            `<p class="empty">No habits yet. <a href="/habit.html">Create your first habit</a>.</p>`;
    } else {
        $("habitList").innerHTML = rows.map((row) => `
            <div class="habit-row">

                <div class="habit-left">
                    <div class="habit-icon">${habitIcon(row.habit.name)}</div>
                    <div>
                        <div class="habit-name">${escapeHtml(row.habit.name)}</div>
                        <div class="habit-meta">
                            ${escapeHtml(row.habit.frequency)} • 🔥 ${row.current} day streak
                        </div>
                    </div>
                </div>

                <button class="complete-btn ${row.doneToday ? "done" : ""}"
                        data-id="${row.habit.id}"
                        ${row.doneToday ? "disabled" : ""}>
                    ${row.doneToday ? "Completed" : "Complete"}
                </button>

            </div>`).join("");
    }


    /* ---------- streak ring ---------- */

    $("ringValue").textContent = topCurrent;

    const pct = topBest > 0 ? Math.min(100, Math.round((topCurrent / topBest) * 100)) : 0;
    $("ring").style.setProperty("--pct", pct + "%");

    $("streakNote").textContent =
        topBest === 0
            ? "Complete a habit today to start your streak."
            : topCurrent >= topBest
                ? "You're at your personal best. Keep it going!"
                : `Keep going to beat your best of ${topBest} days.`;
}


async function completeHabit(habitId, button) {

    button.disabled = true;

    try {
        await Api.addLog({ habitId, completionDate: todayString() });

        const logs = await Api.getLogs();
        const dates = buildLogIndex(logs).get(habitId) || new Set();

        await Api.updateStreak({
            habitId,
            currentStreak: computeCurrentStreak(dates)
        });

        showToast("Nice work! Habit completed.");
        await loadDashboard();

    } catch (error) {
        button.disabled = false;
        showToast(error.message || "Could not save completion.", "error");
    }
}


/* ---------- wiring ---------- */

$("habitList").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-id]");
    if (button && !button.disabled) {
        completeHabit(Number(button.dataset.id), button);
    }
});

loadDashboard();
