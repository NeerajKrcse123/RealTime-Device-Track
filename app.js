import express from "express";
import http from "http";
import path from "path";
import { Server as socketIOServer } from "socket.io";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new socketIOServer(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    socket.on("location", (data) => {
        io.emit("location", { id: socket.id, ...data });
    });
    socket.on("disconnect", () => {
        io.emit("user_disconnected", { id: socket.id });
    });
})

app.get("/", (req, res) => {
    res.render("index");
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});
