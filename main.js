const socket = new WebSocket("wss://blobworld-web-server.onrender.com/");

socket.onopen = () => {
  console.log("[open] Connection established");
};

socket.onmessage = (event) => {
  console.log(event.data);
  console.log(`[message] Data received from server: ${event.data}`);
};

function deviceOrientationPermission(listener) {
  return new Promise((resolve, reject) => {
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      DeviceOrientationEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === "granted") {
            addEventListener("deviceorientation", listener, true);
            resolve("granted");
          }
        })
        .catch(reject);
    } else {
      if (navigator.userAgent.indexOf("Mobile") === -1) {
        reject("Not a mobile device");
      }
      addEventListener("deviceorientation", listener, true);
      resolve("granted");
    }
  });
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

document.querySelector("#play").addEventListener("click", () => {
  deviceOrientationPermission((event) => {
    const steering = Math.round(clamp(event.beta / 30, -1, 1) * 100) / 100;
    const throttle = Math.round(clamp(event.gamma / 30, -1, 1) * 100) / 100;

    const vehicleData = {
      event: "vehicleControl",
      data: {
        steering,
        throttle,
      },
    };

    socket.send(JSON.stringify(vehicleData));
  }).then((result) => {
    console.log(result);
  });
});

// // ARM JOYSTICK
const armJoystick = document.querySelector(".arm-joystick");
const knob = document.querySelector(".arm-joystick-knob");

// touch events
armJoystick.addEventListener("touchstart", (e) => {
  knob.style.transition = "0s";
  e.preventDefault();
});

armJoystick.addEventListener("touchmove", (e) => {
  e.preventDefault();
  const rect = armJoystick.getBoundingClientRect();
  const x = e.touches[0].clientX - rect.left;
  const y = e.touches[0].clientY - rect.top;
  const dx = x - rect.width / 2;
  const dy = y - rect.height / 2;
  const angle = Math.atan2(dy, dx);
  const distance = Math.min(rect.width / 2, Math.hypot(dx, dy));
  const nx = Math.cos(angle) * distance;
  const ny = Math.sin(angle) * distance;
  knob.style.transform = `translate(${nx}px, ${ny}px) scale(1.3)`;
  // send something between 1 and -1
  const armData = {
    event: "armControl",
    data: {
      x: Math.round(Math.cos(angle) * 100) / 100,
      y: Math.round(Math.sin(angle) * 100) / 100,
    },
  };

  socket.send(JSON.stringify(armData));

  knob.style.transition = "0s";
});

armJoystick.addEventListener("touchend", (e) => {
  e.preventDefault();
  knob.style.transform = `translate(0%, 0%) scale(1)`;
  // socket.emit("armJoystick", { x: 0, y: 0 });
  knob.style.transition = "all 0.1s ease-in-out";
});
