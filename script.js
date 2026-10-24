let events = [
    {
        id: "E1",
        title: "Coding Competition",
        date: "2026-11-10",
        venue: "Computer Lab",
        description: "Show your programming skills.",
        category: "Technical",
        capacity: 2,
        cancelAllowed: true
    },
    {
        id: "E2",
        title: "Dance Competition",
        date: "2026-11-12",
        venue: "College Auditorium",
        description: "Show your dancing talent.",
        category: "Cultural",
        capacity: 3,
        cancelAllowed: true
    },
    {
        id: "E3",
        title: "Sports Meet",
        date: "2026-11-15",
        venue: "College Ground",
        description: "Participate in sports events.",
        category: "Sports",
        capacity: 2,
        cancelAllowed: false
    }
];

let registrations = JSON.parse(
    localStorage.getItem("registrations") || "[]"
);

function save() {
    localStorage.setItem(
        "registrations",
        JSON.stringify(registrations)
    );
}

function showEvents() {
    let search = document.getElementById("search").value.toLowerCase();
    let category = document.getElementById("category").value;
    let date = document.getElementById("dateFilter").value;
    let box = document.getElementById("events");

    box.innerHTML = "";

    events.filter(e =>
        e.title.toLowerCase().includes(search) &&
        (!category || e.category === category) &&
        (!date || e.date === date)
    ).forEach(e => {
        let count = registrations.filter(r => r.eventId === e.id).length;

        box.innerHTML += `
            <div class="event">
                <h3>${e.title}</h3>
                <p><b>Date:</b> ${e.date}</p>
                <p><b>Venue:</b> ${e.venue}</p>
                <p><b>Description:</b> ${e.description}</p>
                <p><b>Category:</b> ${e.category}</p>
                <p><b>Registrations:</b> ${count}/${e.capacity}</p>
                <button onclick="details('${e.id}')">View Details</button>
            </div>`;
    });
}

function details(id) {
    let e = events.find(e => e.id === id);

    alert(
        "Event: " + e.title +
        "\nDate: " + e.date +
        "\nVenue: " + e.venue +
        "\nDescription: " + e.description +
        "\nCategory: " + e.category +
        "\nCapacity: " + e.capacity
    );

    document.getElementById("eventId").value = id;
}

document.getElementById("regForm").onsubmit = function(event) {
    event.preventDefault();

    let student = document.getElementById("student").value.trim();
    let roll = document.getElementById("roll").value.trim();
    let email = document.getElementById("email").value.trim();
    let eventId = document.getElementById("eventId").value.trim();

    if (!student || !roll || !email || !eventId) {
        alert("Please fill all mandatory fields.");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Enter a valid email address.");
        return;
    }

    let selected = events.find(e => e.id === eventId);

    if (!selected) {
        alert("Invalid Event ID. Select an event using View Details.");
        return;
    }

    if (registrations.some(r =>
        r.eventId === eventId &&
        r.roll.toLowerCase() === roll.toLowerCase()
    )) {
        alert("You have already registered for this event.");
        return;
    }

    let count = registrations.filter(r => r.eventId === eventId).length;

    if (count >= selected.capacity) {
        alert("Sorry, this event is full.");
        return;
    }

    registrations.push({
        student, roll, email, eventId
    });

    save();
    this.reset();
    showEvents();
    showMyEvents();

    alert("Registration successful!");
};

function showMyEvents() {
    let roll = document.getElementById("roll").value.trim();
    let box = document.getElementById("myEvents");

    box.innerHTML = "";

    registrations.filter(r =>
        r.roll.toLowerCase() === roll.toLowerCase()
    ).forEach(r => {
        let e = events.find(e => e.id === r.eventId);

        if (!e) return;

        box.innerHTML += `
            <div class="event">
                <h3>${e.title}</h3>
                <p>${e.date} - ${e.venue}</p>
                ${e.cancelAllowed ?
                    `<button class="cancel"
                    onclick="cancelEvent('${r.eventId}','${r.roll}')">
                    Cancel Registration</button>` :
                    "<p>Cancellation not allowed</p>"}
            </div>`;
    });
}

function cancelEvent(eventId, roll) {
    let e = events.find(e => e.id === eventId);

    if (!e.cancelAllowed) {
        alert("Cancellation is not allowed.");
        return;
    }

    if (confirm("Cancel your registration?")) {
        registrations = registrations.filter(r =>
            !(r.eventId === eventId &&
              r.roll.toLowerCase() === roll.toLowerCase())
        );

        save();
        showEvents();
        showMyEvents();

        alert("Registration cancelled.");
    }
}

document.getElementById("search").addEventListener("input", showEvents);
document.getElementById("category").addEventListener("change", showEvents);
document.getElementById("dateFilter").addEventListener("change", showEvents);
document.getElementById("roll").addEventListener("input", showMyEvents);

showEvents();
showMyEvents();
