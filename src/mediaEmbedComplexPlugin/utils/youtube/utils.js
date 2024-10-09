/**
 * JavaScript function to match (and return) the video Id
 * of any valid Youtube Url, given as input string.
 * @author: Stephan Schmitz <eyecatchup@gmail.com>
 * @url: http://stackoverflow.com/a/10315969/624466
 */
export const ytVidId = url => {
	const p = RegExp([
		/^(?:https?:\/\/)?(?:(?:www|m).)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/|shorts\/))/
			.source + /((\w|-){11})(?:\S+)?$/.source
	]);
	return url.match(p) ? RegExp.$1 : false;
};

/**
 * Matches and returns time param in YouTube Urls.
 */
export const ytVidTime = url => {
	const p = /t=([0-9hms]+)/;
	return url.match(p) ? RegExp.$1 : false;
};

/**
 * Converts time in hms format to seconds only
 */
export const hmsToSeconds = time => {
	const arr = time.split(':');
	let s = 0;
	let m = 1;

	while (arr.length > 0) {
		s += m * parseInt(arr.pop(), 10);
		m *= 60;
	}

	return s;
};

/**
 * Converts seconds to hms format
 */
export const secondsToHms = seconds => {
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds / 60) % 60);
	const s = seconds % 60;

	const pad = function (n) {
		n = String(n);
		return n.length >= 2 ? n : '0' + n;
	};

	return h > 0 ? pad(h) + ':' + pad(m) + ':' + pad(s) : pad(m) + ':' + pad(s);
};

/**
 * Converts seconds into youtube t-param value, e.g. 1h4m30s
 */
export const secondsToTimeParam = seconds => {
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds / 60) % 60);
	const s = seconds % 60;
	let param = '';

	if (h > 0) {
		param += h + 'h';
	}

	if (m > 0) {
		param += m + 'm';
	}

	if (s > 0) {
		param += s + 's';
	}

	return param;
};
