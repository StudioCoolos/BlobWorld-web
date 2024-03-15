import { io } from "socket.io-client";

const socket = io("https://giant-games-peel.loca.lt");

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
    console.log("deviceorientation", event);
    const steering =
      Math.round(clamp(event.beta / 30, -0.99, 0.99) * 100) / 100;
    const throttle =
      Math.round(clamp(event.gamma / 30, -0.99, 0.99) * 100) / 100;
    if (
      steering === 1 ||
      steering === -1 ||
      throttle === 1 ||
      throttle === -1
    ) {
      // window.navigator.vibrate(200);
    }
    socket.emit("vehicleControl", {
      steering,
      throttle,
    });
  }).then((result) => {
    console.log(result);
  });
});

// ARM JOYSTICK
const armJoystick = document.querySelector(".arm-joystick");
const knob = document.querySelector(".arm-joystick-knob");

// touch events
armJoystick.addEventListener("touchstart", (e) => {
    const x = e.touches[0].clientX - armJoystick.getBoundingClientRect().left;
    const y = e.touches[0].clientY - armJoystick.getBoundingClientRect().top;
    //remove transition
    knob.style.transition = "0s";
    e.preventDefault();
    socket.emit("armJoystick", { x, y });
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
    socket.emit("armJoystick", { x: Math.cos(angle), y: Math.cos(angle) });
    knob.style.transition = "0s";
});

armJoystick.addEventListener("touchend", (e) => {
    e.preventDefault();
    knob.style.transform = `translate(0%, 0%) scale(1)`;
    socket.emit("armJoystick", { x: 0, y: 0 });
    knob.style.transition = "all 0.1s ease-in-out";
});
