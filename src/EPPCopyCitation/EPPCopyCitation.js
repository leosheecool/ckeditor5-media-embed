import EPPCopyCitationEditing from './EPPCopyCitationEditing.js';
import EPPCopyCitationUI from './EPPCopyCitationUI.js';
import EPPCopyCitationView from './EPPCopyCitationView.js';
import { Plugin } from 'ckeditor5';

export default class CustomCopyCitation extends Plugin {
	static get requires() {
		return [EPPCopyCitationEditing, EPPCopyCitationUI, EPPCopyCitationView];
	}
}
