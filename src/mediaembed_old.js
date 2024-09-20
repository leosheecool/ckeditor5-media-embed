import { Plugin, ButtonView } from 'ckeditor5';

import ckeditor5Icon from '../theme/icons/ckeditor.svg';

export default class EPPMediaEmbed extends Plugin {
	static get pluginName() {
		return 'EPPMediaEmbed';
	}

	handleDelete( editor ) {
		const selection = editor.getSelection();
		const commonAncestor = selection.getCommonAncestor();
		if ( commonAncestor.hasClass( 'cald_consent_wrapper' ) ) {
			commonAncestor.remove();
		}
	}

	init() {
		const editor = this.editor;
		const t = editor.t;
		const model = editor.model;

		// Add the "EPPmediaEmbedButton" to feature components.
		editor.ui.componentFactory.add( 'EPPmediaEmbedButton', locale => {
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
