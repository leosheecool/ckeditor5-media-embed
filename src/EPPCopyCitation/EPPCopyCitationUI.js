import {
	ButtonView,
	clickOutsideHandler,
	ContextualBalloon,
	Plugin
} from 'ckeditor5';
import './styles/styles.css';
import FormView from './EPPCopyCitationView.js';

export default class EPPCopyCitationUI extends Plugin {
	static get requires() {
		return [ContextualBalloon];
	}

	init() {
		const editor = this.editor;

		this._balloon = this.editor.plugins.get(ContextualBalloon);
		this.formView = this._createFormView();

		editor.ui.componentFactory.add('EPPCopyCitation', () => {
			const button = new ButtonView();

			button.label = 'Citation';
			button.tooltip = true;
			button.withText = true;

			// if no selection, disable the button but keep the cursor

			editor.editing.view.document.on('selectionChange', () => {
				this.selection = editor.model.document.selection;
				if (this.selection.isCollapsed) {
					button.isEnabled = false;
				} else {
					button.isEnabled = true;
				}
			});

			this.listenTo(button, 'execute', () => {
				this._showUI();
			});

			return button;
		});
	}

	_createFormView() {
		const editor = this.editor;
		const formView = new FormView(editor.locale);

		this.listenTo(formView, 'submit', () => {
			const sourceUrl = formView.sourceUrl.fieldView.element.value?.trim();
			const sourceName = formView.sourceName.fieldView.element.value?.trim();
			const showURLSource = formView.showURLSourceView.buttonView.element.value?.trim();
			let isSourceUrlShown = false;

			if (showURLSource === 'EPPCopyCitationForm_show') {
				isSourceUrlShown = true;
			}

			const selection = editor.model.document.selection;
			const range = selection.getFirstRange();

			editor.model.change(writer => {
				const container = writer.createElement('EPPQuote', {
					sourceName,
					sourceUrl,
					isSourceUrlShown,
					citation: Array.from(range.getItems()).reduce((acc, item) => acc + (item.data ? item.data : ''), '')
				});
				editor.model.insertContent(container);
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
		this._balloon.add({
			view: this.formView,
			position: this._getBalloonPositionData()
		});

		this.formView.focus();
	}

	_hideUI() {
		this.formView.sourceUrl.fieldView.value = '';
		this.formView.sourceName.fieldView.value = '';
		this.formView.element.reset();

		this._balloon.remove(this.formView);

		// Focus the editing view after closing the form view.
		this.editor.editing.view.focus();
	}
}
