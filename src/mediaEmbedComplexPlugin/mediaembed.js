// abbreviation/abbreviation.js

import MediaEmbedEditing from './mediaEmbedEditing2.js';
import MediaEmbedUI from './MediaEmbedUI.js';
import { Plugin } from 'ckeditor5';

export default class CustomMediaEmbed extends Plugin {
	static get requires() {
		return [MediaEmbedEditing, MediaEmbedUI];
	}
}
