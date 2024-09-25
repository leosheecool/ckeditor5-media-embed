import { ALLOWED_SOCIAL_MEDIAS } from './constants.js';

const mediaEmbedValidation = embedCode => {
	const socialMedia = ALLOWED_SOCIAL_MEDIAS.find(regex => {
		return regex.regex.test(embedCode);
	});

	if (!socialMedia) {
		// alert('Invalid embed code');
		return false;
	}
	return true;
};

export default mediaEmbedValidation;
