import { ButtonView, Plugin } from 'ckeditor5';

export default class MediaEmbedUI extends Plugin {
	init() {
		// eslint-disable-next-line no-undef
		console.log('MediaEmbedUI#init() got called');
		const editor = this.editor;

		editor.ui.componentFactory.add('EPPmediaEmbedButton', () => {
			const button = new ButtonView();

			button.label = 'Media embed';
			button.tooltip = true;
			button.withText = true;

			this.listenTo(button, 'execute', () => {
				// const selection = editor.model.document.selection;
				const title = 'What You See Is What You Get';
				// const abbr = 'WYSIWYG';

				// Change the model to insert the abbreviation.
				editor.model.change(writer => {
					const container = writer.createElement('mediaEmbed', {
						title,
						class: 'epp-ckeditor-iframe'
					});
					const text = writer.createText(title);
					writer.append(text, container);
					// console.log('container', container);
					editor.model.insertContent(container);
				});
			});

			return button;
		});
	}
}
