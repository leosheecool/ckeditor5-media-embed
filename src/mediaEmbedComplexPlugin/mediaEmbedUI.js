import {
	ButtonView,
	ContextualBalloon,
	Plugin,
	clickOutsideHandler
} from 'ckeditor5';

import FormView from './mediaEmbedView.js';
import YoutubeEmbedFormView from './youtubeEmbedView.js';

import mediaEmbedValidation from './utils/mediaEmbedValidation.js';
import youtubeEmbedValidation, {
	validateYoutubeFormFields
} from './utils/youtube/youtubeEmbedValidation.js';

import embedIcon from './icons/embed-icon.svg';
import youtubeIcon from './icons/youtube-icon.svg';

import './styles/styles.css';
import { createYoutubeIframeProperties } from './utils/youtube/utils.js';

export default class MediaEmbedUI extends Plugin {
	static get requires() {
		return [ContextualBalloon];
	}

	init() {
		// eslint-disable-next-line no-undef
		const editor = this.editor;

		// Create the balloon and the form view.
		this._balloon = this.editor.plugins.get(ContextualBalloon);
		this.formView = this._createMediaEmbedFormView();
		this.youtubeFormView = this._createYoutubeFormView();

		editor.ui.componentFactory.add('EPPmediaEmbedButton', () => {
			const button = new ButtonView();

			button.label = 'Media embed';
			button.tooltip = true;
			button.withText = true;
			button.icon = embedIcon;

			this.listenTo(button, 'execute', () => {
				this._showUI();
			});

			return button;
		});
		editor.ui.componentFactory.add('EPPYoutubeEmbedButton', () => {
			const button = new ButtonView();

			button.label = 'Youtube embed';
			button.tooltip = true;
			button.withText = true;
			button.icon = youtubeIcon;

			this.listenTo(button, 'execute', () => {
				this._showUI('Youtube');
			});

			return button;
		});
	}

	_createMediaEmbedFormView() {
		const editor = this.editor;
		const formView = new FormView(editor.locale);

		this.listenTo(formView, 'submit', () => {
			const iframe = formView.iframeInputView.fieldView.element.value?.trim();
			const socialMedia = mediaEmbedValidation(iframe);

			if (!socialMedia) {
				formView.iframeInputView.errorText = 'Invalid embed code';
				return;
			}

			editor.model.change(writer => {
				const container = writer.createElement('rawHtml', {
					value: iframe,
					socialMedia
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

	_createYoutubeFormView() {
		const editor = this.editor;
		const formView = new YoutubeEmbedFormView(editor.locale);

		this.listenTo(formView, 'YTIframeInputchange', () => {
			const iframe = formView.iframeInputView.fieldView.element.value?.trim();
			const fields = formView.getAllFieldsInArray();

			if (!iframe) {
				if (!formView.getIsIframe()) {
					return;
				}

				fields.forEach(field => (field.view.isEnabled = true));
				formView.setIsIframe(false);
				return;
			}

			fields.forEach(field => {
				field.view.isEnabled = field.name === 'iframeInput';
			});
			formView.setIsIframe(true);
		});

		this.listenTo(formView, 'submit', () => {
			const iframe = formView.iframeInputView.fieldView.element.value?.trim();
			const socialMedia = youtubeEmbedValidation(iframe);

			if (!socialMedia || (socialMedia.isRegex && !iframe)) {
				formView.iframeInputView.errorText = 'Invalid embed code';
				return;
			}

			if (!socialMedia.isRegex) {
				const fields = formView.getAllFields();
				const isValid = validateYoutubeFormFields(fields);
				if (!isValid) {
					return;
				}
				const iframeProperties = createYoutubeIframeProperties(fields);
				editor.model.change(writer => {
					const container = writer.createElement('rawHtml', {
						value: iframe,
						socialMedia,
						customIframeProperties: iframeProperties
					});
					editor.model.insertContent(container);
				});

				this._hideUI('Youtube');
				return iframeProperties;
			}

			editor.model.change(writer => {
				const container = writer.createElement('rawHtml', {
					value: iframe,
					socialMedia
				});
				editor.model.insertContent(container);
			});

			this._hideUI('Youtube');
		});

		// Hide the form view after clicking the "Cancel" button.
		this.listenTo(formView, 'cancel', () => {
			this._hideUI('Youtube');
		});

		// Hide the form view when clicking outside the balloon.
		clickOutsideHandler({
			emitter: formView,
			activator: () => this._balloon.visibleView === formView,
			contextElements: [this._balloon.view.element],
			callback: () => this._hideUI('Youtube')
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

	_showUI(formType = 'default') {
		if (formType === 'Youtube') {
			this._balloon.add({
				view: this.youtubeFormView,
				position: this._getBalloonPositionData()
			});

			this.youtubeFormView.focus();
			return;
		}

		this._balloon.add({
			view: this.formView,
			position: this._getBalloonPositionData()
		});

		this.formView.focus();
	}

	_hideUI(formType = 'default') {
		if (formType === 'Youtube') {
			this.youtubeFormView.resetFields();
			this.youtubeFormView.element.reset();
			this._balloon.remove(this.youtubeFormView);
		} else {
			this.formView.resetFields();
			this.formView.element.reset();
			this._balloon.remove(this.formView);
		}

		// Focus the editing view after closing the form view.
		this.editor.editing.view.focus();
	}
}
