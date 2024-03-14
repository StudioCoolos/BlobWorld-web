import { Server } from "socket.io";
import OSC from "osc-js";

const datagramOptions = {
  type: "udp4",
  open: {
    host: "0.0.0.0",
    port: 1111,
  },
  send: {
    host: "0.0.0.0",
    port: 8080,
  },
};

const datagramPlugin = new OSC.DatagramPlugin(datagramOptions);
const oscDatagramServer = new OSC({ plugin: datagramPlugin });
oscDatagramServer.open();

oscDatagramServer.on("open", () => {
  console.log("✅ OSC Datagram server is opened");
  oscDatagramServer.send(new OSC.Message("/rfid", 123, "hello"));
});

oscDatagramServer.on("/rfid", (message) => {
  console.log("Received RFID message:", message.args);
});

oscDatagramServer.on("message", (message) => {
  console.log("Received message:", message);
});

const PORT = process.env.PORT || 3001;
const io = new Server(PORT, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("devicemotion", (event) => {
    console.log("devicemotion", event);

    //send datagram
  });
});

console.log(`Server running on http://localhost:${PORT}`);
