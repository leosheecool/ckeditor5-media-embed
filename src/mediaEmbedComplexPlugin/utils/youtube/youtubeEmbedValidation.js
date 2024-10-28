import { ALLOWED_SOCIAL_MEDIAS } from '../constants.js';

export const youtubeEmbedValidation = embedCode => {
	const socialMedia = ALLOWED_SOCIAL_MEDIAS.find(regex => {
		return regex.regex.test(embedCode);
	});

	if (!socialMedia) {
		return false;
	}
	return socialMedia;
};

const validateYoutubeUrl = url => {
	const p = new RegExp([
		/^(?:https?:\/\/)?(?:(?:www|m).)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/|shorts\/))/
			.source + /((\w|-){11})(?:\S+)?$/.source
	]);

	if (!url) {
		throw new Error('URL is required');
	}
	if (!url.match(p)) {
		throw new Error('Invalid URL');
	}
};

const validateYoutubeInt = (string, propertyName) => {
	if (!string) {
		throw new Error(`${propertyName} is required`);
	}
	if (!string.match(/^[0-9]+$/)) {
		throw new Error(`${propertyName} must be a number`);
	}
};

const validateYoutubeStartAt = string => {
	const regex = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/i;

	if (!string) {
		return;
	}
	if (!string.match(regex)) {
		throw new Error('Invalid time format');
	}
};

export const validateYoutubeFormFields = fields => {
	let isValid = true;

	const validators = [
		{
			field: fields.youtubeUrl,
			validator: validateYoutubeUrl
		},
		{
			field: fields.youtubeUrlHeight,
			validator: validateYoutubeInt,
			propertyName: 'Height'
		},
		{
			field: fields.youtubeUrlWidth,
			validator: validateYoutubeInt,
			propertyName: 'Width'
		},
		{
			field: fields.youtubeVideoStartAt,
			validator: validateYoutubeStartAt
		}
	];

	validators.forEach(({ field, validator, propertyName }) => {
		try {
			validator(field.fieldView.element.value?.trim(), propertyName);
		} catch (error) {
			isValid = false;
			field.errorText = error.message;
		}
	});
	return isValid;
};

export default youtubeEmbedValidation;
