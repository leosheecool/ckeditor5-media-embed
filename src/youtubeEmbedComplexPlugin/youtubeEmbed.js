// abbreviation/abbreviation.js

import YoutubeEmbedEditing from './youtubeEmbedEditing.js';
import YoutubeEmbedUI from './youtubeEmbedUI.js';
import { Plugin } from 'ckeditor5';

export default class CustomYoutubeMediaEmbed extends Plugin {
	static get requires() {
		return [YoutubeEmbedEditing, YoutubeEmbedUI];
	}
}
