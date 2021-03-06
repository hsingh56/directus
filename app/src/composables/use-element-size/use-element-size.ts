import { notEmpty } from '@/utils/is-empty';
import { isRef, onMounted, onUnmounted, Ref, ref } from '@vue/composition-api';
import { ResizeObserver as ResizeObserverPolyfill } from 'resize-observer';

declare global {
	interface Window {
		ResizeObserver: any;
	}
}

export default function useElementSize<T extends Element>(
	target: T | Ref<T> | Ref<undefined>
): Record<string, Ref<number>> {
	const width = ref(0);
	const height = ref(0);

	let RO = ResizeObserverPolyfill;

	if ('ResizeObserver' in window) {
		RO = window.ResizeObserver;
	}

	const resizeObserver = new RO(([entry]) => {
		width.value = entry.contentRect.width;
		height.value = entry.contentRect.height;
	});

	onMounted(() => {
		const t = isRef(target) ? target.value : target;

		if (notEmpty(t)) {
			resizeObserver.observe(t);
		}
	});

	onUnmounted(() => {
		resizeObserver.disconnect();
	});

	return { width, height };
}
