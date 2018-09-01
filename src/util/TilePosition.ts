export function getTileId(x: number, y: number, z: number) {
	return x + y * 512 + z * 512 * 512;
}

export function getTilePosition(id: number): [number, number, number] {
	return [id % 512, Math.floor(id / 512) % 512, Math.floor(id / 512 / 512)];
}
