import {
	ButtonView,
	ContextualBalloon,
	Plugin,
	clickOutsideHandler
} from 'ckeditor5';
import FormView from './mediaEmbedView.js';
import './styles.css';

export default class MediaEmbedUI extends Plugin {
	static get requires() {
		return [ContextualBalloon];
	}

	init() {
		// eslint-disable-next-line no-undef
		console.log('MediaEmbedUI#init() got called');
		const editor = this.editor;

		// Create the balloon and the form view.
		this._balloon = this.editor.plugins.get(ContextualBalloon);
		this.formView = this._createFormView();

		editor.ui.componentFactory.add('EPPmediaEmbedButton', () => {
			const button = new ButtonView();

			button.label = 'Media embed';
			button.tooltip = true;
			button.withText = true;

			// this.listenTo(button, 'execute', () => {
			// 	// const selection = editor.model.document.selection;
			// 	const title = 'What You See Is What You Get';
			// 	// const abbr = 'WYSIWYG';

			// 	// Change the model to insert the abbreviation.
			// 	editor.model.change((writer) => {
			// 		const container = writer.createElement('mediaEmbed', {
			// 			title,
			// 			class: 'epp-ckeditor-iframe'
			// 		});
			// 		const text = writer.createText(title);
			// 		writer.append(text, container);
			// 		// console.log('container', container);
			// 		editor.model.insertContent(container);
			// 	});
			// });

			this.listenTo(button, 'execute', () => {
				this._showUI();
			});

			return button;
		});
	}

	_createFormView() {
		// console.log('MediaEmbedUI#_createFormView() got called');
		const editor = this.editor;
		const formView = new FormView(editor.locale);

		this.listenTo(formView, 'submit', () => {
			const title = formView.titleInputView.fieldView.element.value;
			const link = formView.linkInputView.fieldView.element.value;

			editor.model.change(writer => {
				const container = writer.createElement('mediaEmbed', {
					title,
					class: 'epp-ckeditor-iframe ' + link
				});
				const text = writer.createText(title);
				writer.append(text, container);
				// console.log('container', container);
				editor.model.insertContent(container);
				// editor.model.insertContent(
				// 	writer.createText(abbr, { abbreviation: title })
				// );
			});

			this._hideUI();
		});

		// Hide the form view after clicking the "Cancel" button.
		this.listenTo(formView, 'cancel', () => {
			this._hideUI();
		});

		// Hide the form view when clicking outside the balloon.
		clickOutsideHandler({
			emitter: formView,
			activator: () => this._balloon.visibleView === formView,
			contextElements: [this._balloon.view.element],
			callback: () => this._hideUI()
		});

		return formView;
	}

	_getBalloonPositionData() {
		// console.log('MediaEmbedUI#_getBalloonPositionData() got called');
		const view = this.editor.editing.view;
		const viewDocument = view.document;
		let target = null;

		// Set a target position by converting view selection range to DOM.
		target = () =>
			view.domConverter.viewRangeToDom(viewDocument.selection.getFirstRange());

		return {
			target
		};
	}

	_showUI() {
		// console.log('MediaEmbedUI#_showUI() got called');
		this._balloon.add({
			view: this.formView,
			position: this._getBalloonPositionData()
		});

		this.formView.focus();
	}

	_hideUI() {
		this.formView.linkInputView.fieldView.value = '';
		this.formView.titleInputView.fieldView.value = '';
		this.formView.element.reset();

		this._balloon.remove(this.formView);

		// Focus the editing view after closing the form view.
		this.editor.editing.view.focus();
	}
}
