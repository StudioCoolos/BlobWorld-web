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
    port: 8000,
  },
};

const datagramPlugin = new OSC.DatagramPlugin(datagramOptions);
const oscDatagramServer = new OSC({ plugin: datagramPlugin });
oscDatagramServer.open();

oscDatagramServer.on("open", () => {
  console.log("✅ OSC Datagram server is opened");
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

  socket.on("vehicleControl", (event) => {
    console.log("vehicleControl", event);
    oscDatagramServer.send(
      new OSC.Message("/vehicleControl", event.throttle, event.steering),
    );
  });
});

console.log(`Server running on http://localhost:${PORT}`);
