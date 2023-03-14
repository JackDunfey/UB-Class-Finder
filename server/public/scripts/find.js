const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = "/static/images/academic_map_1_1.png";
img.onload = () => {
    ctx.drawImage(img, 0, 0, 800, 800);
};

console.log("find.js loaded");

document.getElementById("building").addEventListener("change", (event) => {
    const building = event.target.value;
    console.log(building);
    const url = `/api/${location.pathname.split("/").pop()}`;
    // TODO: Add building API
    fetch(url).then((response) => response.json()).then((rooms) => {
        let container = document.getElementById("room-container");
        container.innerHTML = "";
        rooms.forEach((room) => {
            if(room.Room.includes(building)) {
                let roomElement = document.createElement("div");
                roomElement.textContent = room.Room;
                container.appendChild(roomElement);
            }
        });
    });
});