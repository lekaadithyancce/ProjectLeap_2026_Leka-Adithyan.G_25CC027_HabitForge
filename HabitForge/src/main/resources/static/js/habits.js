/* ============================================================
   habits.js  —  page logic for habit.html
   ============================================================ */

async function loadHabits() {

    const list = $("habits");
    if (!list) return;

    list.innerHTML = `<div class="empty">Loading habits…</div>`;

    try {
        const [habits, logs] = await Promise.all([
            Api.getHabits(),
            Api.getLogs()
        ]);

        renderHabits(habits, buildLogIndex(logs));

    } catch (error) {
        list.innerHTML =
            `<div class="empty">Could not load habits. Is the backend running?</div>`;
        showToast(error.message || "Could not load habits.", "error");
    }
}


function renderHabits(habits, logIndex) {

    const list = $("habits");

    if (!habits.length) {
        list.innerHTML =
            `<div class="empty">No habits yet. Create your first one above.</div>`;
        return;
    }

    list.innerHTML = habits.map((habit) => {

        const streak = computeCurrentStreak(logIndex.get(habit.id) || new Set());

        return `
            <div class="habit-row">

                <div class="habit-left">
                    <div class="habit-icon">${habitIcon(habit.name)}</div>
                    <div>
                        <div class="habit-name">${escapeHtml(habit.name)}</div>
                        <div class="habit-meta">
                            ${escapeHtml(habit.frequency)} • 🔥 ${streak} day streak
                        </div>
                    </div>
                </div>

                <button class="delete-btn" data-id="${habit.id}">
                    Delete
                </button>

            </div>`;
    }).join("");
}


async function addHabit() {

    const nameInput = $("name");
    const frequencyInput = $("frequency");
    const button = $("addBtn");

    const name = nameInput.value.trim();
    const frequency = frequencyInput.value;

    if (!name) {
        showToast("Please enter a habit name.", "error");
        nameInput.focus();
        return;
    }

    button.disabled = true;

    try {
        await Api.createHabit(name, frequency);
        nameInput.value = "";
        showToast("Habit added.");
        await loadHabits();
    } catch (error) {
        showToast(error.message || "Unable to create habit.", "error");
    } finally {
        button.disabled = false;
    }
}


async function removeHabit(id, button) {

    if (!confirm("Delete this habit?")) return;

    button.disabled = true;

    try {
        await Api.deleteHabit(id);
        showToast("Habit deleted.");
        await loadHabits();
    } catch (error) {
        button.disabled = false;
        showToast(error.message || "Unable to delete habit.", "error");
    }
}


/* ---------- wiring ---------- */

$("addBtn").addEventListener("click", addHabit);

$("name").addEventListener("keydown", (event) => {
    if (event.key === "Enter") addHabit();
});

// event delegation: works for rows rendered later
$("habits").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-id]");
    if (button && !button.disabled) {
        removeHabit(Number(button.dataset.id), button);
    }
});

loadHabits();
