import { Plugin, ButtonView } from 'ckeditor5';

import ckeditor5Icon from '../theme/icons/ckeditor.svg';

export default class MediaEmbed extends Plugin {
	static get pluginName() {
		return 'MediaEmbed';
	}

	init() {
		const editor = this.editor;
		const t = editor.t;
		const model = editor.model;

		// Add the "mediaEmbedButton" to feature components.
		editor.ui.componentFactory.add( 'mediaEmbedButton', locale => {
			const view = new ButtonView( locale );

			view.set( {
				label: t( 'Media embed' ),
				icon: ckeditor5Icon,
				tooltip: true
			} );

			// Insert a text into the editor after clicking the button.
			this.listenTo( view, 'execute', () => {
				model.change( writer => {
					const textNode = writer.createText( 'Hello CKEditor 5!' );

					model.insertContent( textNode );
				} );

				editor.editing.view.focus();
			} );

			return view;
		} );
	}
}
