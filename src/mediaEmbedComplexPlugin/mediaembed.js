import MediaEmbedEditing from './mediaEmbedEditing.js';
import MediaEmbedUI from './mediaEmbedUI.js';
import MediaEmbedView from './mediaEmbedView.js';
import YoutubeEmbedView from './youtubeEmbedView.js';
import { Plugin } from 'ckeditor5';

export default class CustomMediaEmbed extends Plugin {
	static get requires() {
		return [MediaEmbedEditing, MediaEmbedUI, MediaEmbedView, YoutubeEmbedView];
	}
}
