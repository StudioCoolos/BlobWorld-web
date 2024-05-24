// src/hooks/useFormattedTime.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useHour() {
	const time = ref(formatTime(new Date()))

	let interval

	onMounted(() => {
		interval = setInterval(() => {
			time.value = formatTime(new Date())
		}, 1000)
	})

	onUnmounted(() => {
		clearInterval(interval)
	})

	function formatTime(date) {
		const hours = String(date.getHours()).padStart(2, '0')
		const minutes = String(date.getMinutes()).padStart(2, '0')
		return `${hours}H${minutes}`
	}

	return { time }
}
