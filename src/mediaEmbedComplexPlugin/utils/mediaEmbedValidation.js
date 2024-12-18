import { ALLOWED_SOCIAL_MEDIAS } from './constants.js';

const mediaEmbedValidation = embedCode => {
	const socialMedia = ALLOWED_SOCIAL_MEDIAS.find(regex => {
		return regex.regex.test(embedCode);
	});

	if (!socialMedia) {
		return false;
	}
	return socialMedia;
};

export default mediaEmbedValidation;
