import { CONFIG_FOLDER } from '../constants';
import { FileType } from '../types';

export function createFileName(type: FileType, name: string, ext: string, suffix?: string): string {
	// boost.js
	let fileName = name;

	// .boost.js
	if (type === 'branch') {
		fileName = `.${name}`;
	}

	// .config/boost.js
	if (type === 'root-folder') {
		fileName = `${CONFIG_FOLDER}/${name}`;
	}

	// boost.config.js
	if (type === 'root-file') {
		fileName = name + CONFIG_FOLDER;
	}

	if (suffix) {
		fileName += `.${suffix}`;
	}

	fileName += `.${ext}`;

	return fileName;
}
