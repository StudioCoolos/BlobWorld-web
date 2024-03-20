export default function debounce(func, wait = 1000) {
  let isDebounceActive = false;
  return function (...args) {
    if (!isDebounceActive) {
      isDebounceActive = true;
      func.apply(this, args);
      setTimeout(() => {
        isDebounceActive = false;
      }, wait);
    }
  };
}
