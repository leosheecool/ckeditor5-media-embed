// abbreviation/abbreviation.js

import EPPCopyCitationEditing from './EPPCopyCitationEditing.js';
import EPPCopyCitationUI from './EPPCopyCitationUI.js';
import { Plugin } from 'ckeditor5';

export default class CustomMediaEmbed extends Plugin {
	static get requires() {
		return [EPPCopyCitationEditing, EPPCopyCitationUI];
	}
}
