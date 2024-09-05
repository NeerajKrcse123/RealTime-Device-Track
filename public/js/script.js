document.addEventListener("DOMContentLoaded", function () {

    const map = L.map("map").setView([51.505, -0.09], 13); // 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    const socket = io();

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                socket.emit("location", { latitude, longitude });

            },
            (error) => {
                console.error("Error getting location:", error);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    }

    const markers = {}
    socket.on("location", (data) => {
        const { id, latitude, longitude } = data
        map.setView([latitude, longitude], 13);
        if (!markers[id]) {
            markers[id] = L.marker([latitude, longitude]).addTo(map)
                .bindPopup('You are here')
                .openPopup();
        } else {
            markers[id].setLatLng([latitude, longitude]);
        }
    });

    socket.on("user_disconnected", (data) => {
        const { id } = data
        if (markers[id]) {
            markers[id].remove();
            delete markers[id];
        }
    });
});
