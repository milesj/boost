import { Commandable, CommandMetadataMap } from '../types';

export default function mapCommandMetadata(commands: Record<string, Commandable>) {
	const map: CommandMetadataMap = {};

	Object.entries(commands).forEach(([path, config]) => {
		map[path] = config.getMetadata();
	});

	return map;
}
