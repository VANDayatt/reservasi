// script.js
class Room {
    constructor(number, capacity) {
        this.number = number;
        this.capacity = capacity;
        this.reservations = [];
    }

    isAvailable(startTime, duration) {
        for (let res of this.reservations) {
            let endTime = res.startTime + res.duration;
            if (
                (startTime >= res.startTime && startTime < endTime) || 
                (startTime + duration > res.startTime && startTime + duration <= endTime)
            ) {
                return false;
            }
        }
        return true;
    }

    addReservation(reservation) {
        this.reservations.push(reservation);
    }
}

class Reservation {
    constructor(name, roomNumber, date, startTime, duration) {
        this.name = name;
        this.roomNumber = roomNumber;
        this.date = date;
        this.startTime = startTime;
        this.duration = duration;
    }
}

// Data Ruangan (Contoh)
const rooms = [
    new Room(101, 30),
    new Room(102, 25),
    new Room(103, 40),
    new Room(104, 20)
];

// Menampilkan daftar ruangan
function renderRooms() {
    const roomsTable = document.getElementById("roomsTable").getElementsByTagName("tbody")[0];
    roomsTable.innerHTML = "";

    rooms.forEach(room => {
        let row = roomsTable.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);

        cell1.innerHTML = room.number;
        cell2.innerHTML = room.capacity;
        cell3.innerHTML = room.reservations.length === 0 ? "Tersedia" : "Tidak Tersedia";
    });
}

// Mengambil data dari formulir
function getFormData() {
    const name = document.getElementById("name").value;
    const roomNumber = parseInt(document.getElementById("roomNumber").value);
    const date = document.getElementById("date").value;
    const startTime = parseInt(document.getElementById("startTime").value.replace(":", ""));
    const duration = parseInt(document.getElementById("duration").value);
    return { name, roomNumber, date, startTime, duration };
}

// Menambahkan reservasi
function handleReservation(event) {
    event.preventDefault();

    const { name, roomNumber, date, startTime, duration } = getFormData();

    const room = rooms.find(r => r.number === roomNumber);

    if (!room) {
        alert("Ruangan tidak ditemukan!");
        return;
    }

    const isAvailable = room.isAvailable(startTime, duration);
    if (!isAvailable) {
        document.getElementById("errorMessage").style.display = "block";
        document.getElementById("errorMessage").innerText = "Ruangan tidak tersedia pada waktu ini.";
        return;
    }

    const reservation = new Reservation(name, roomNumber, date, startTime, duration);
    room.addReservation(reservation);

    document.getElementById("errorMessage").style.display = "none";
    renderRooms();
    renderReservations();
}

// Menampilkan daftar reservasi
function renderReservations() {
    const reservationsList = document.getElementById("reservationsList");
    reservationsList.innerHTML = "";

    rooms.forEach(room => {
        room.reservations.forEach(reservation => {
            const li = document.createElement("li");
            li.innerText = `Ruangan ${reservation.roomNumber} oleh ${reservation.name} pada ${reservation.date} jam ${reservation.startTime} selama ${reservation.duration} jam`;
            reservationsList.appendChild(li);
        });
    });
}

document.getElementById("reservationFormInput").addEventListener("submit", handleReservation);
renderRooms();