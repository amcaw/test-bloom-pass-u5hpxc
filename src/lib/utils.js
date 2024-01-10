export function generateRingSteps(count, radius) {
	return Array(count)
		.fill('')
		.map((_, idx, self) => {
			const angle = ((0.5 * Math.PI) / self.length) * idx;
			return {
				x: Math.cos(angle) * radius,
				y: 5,
				z: Math.sin(angle) * radius
			};
		});
}
