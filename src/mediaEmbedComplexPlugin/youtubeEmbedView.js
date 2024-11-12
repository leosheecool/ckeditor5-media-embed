import {
	View,
	LabeledFieldView,
	ButtonView,
	icons,
	submitHandler,
	createLabeledTextarea,
	SwitchButtonView,
	createLabeledInputText
} from 'ckeditor5';
import { secondsToHms, ytVidId, ytVidTime } from './utils/youtube/utils.js';

export default class YouubeEmbedFormView extends View {
	constructor(locale) {
		super(locale);
		this.isIframe = false;

		this.iframeInputView = this._createTextAreaInput(
			'Iframe HTML',
			'iframe-code-input'
		);

		this.youtubeUrl = this._createTextInput(
			'Paste YouTube Video URL',
			'youtube-url'
		);
		this.youtubeUrlWidth = this._createTextInput('Width', 'youtube-width', '560');
		this.youtubeUrlHeight = this._createTextInput('Height', 'youtube-height', '315');

		this.youtubeVideoStartAt = this._createTextInput(
			'Start at',
			'youtube-start-at'
		);
		this.showPlayerControls = this._createSwitchButton(
			'Show player controls',
			'_showPlayerControls'
		);
		this.videoImgAndLinkOnly = this._createSwitchButton(
			'Video image and link only',
			'_videoImgAndLinkOnly'
		);
		this.autoPlay = this._createSwitchButton('Auto play', '_autoPlay');
		this.useOldEmbedCode = this._createSwitchButton(
			'Use old embed code',
			'_useOldEmbedCode'
		);
		this.enablePrivacyEnhancedMode = this._createSwitchButton(
			'Enable privacy-enhanced mode',
			'_enablePrivacyEnhancedMode'
		);
		this.showRelatedVideos = this._createSwitchButton(
			'Show related videos at the end of the video',
			'_showRelatedVideos'
		);

		// this.youtubeUrlWidth.fieldView.element.type = 'number';
		// this.youtubeUrlHeight.fieldView.element.type = 'number';

		this.youtubeUrlAndSizeContainer = this._createViewContainer(
			'youtube-url-and-size-container',
			[this.youtubeUrl, this.youtubeUrlWidth, this.youtubeUrlHeight]
		);

		// Add onchange event listener to youtubeUrl
		this.youtubeUrl.on('change', () => {
			const youtubeUrlValue = this.youtubeUrl.fieldView.element.value;
			const video = ytVidId(youtubeUrlValue);
			const time = ytVidTime(youtubeUrlValue);

			if (video && time) {
				const hms = secondsToHms(time);

				this.youtubeVideoStartAt.fieldView.element.value = hms;
			}

			// Trigger the input event to ensure the label moves to the top
			// eslint-disable-next-line no-undef
			const event = new Event('input', {
				bubbles: true,
				cancelable: true
			});
			this.youtubeVideoStartAt.fieldView.element.dispatchEvent(event);
		});

		this.checkboxContainer = this._createViewContainer(
			'youtube-iframe-config-container',
			[
				this.youtubeVideoStartAt,
				this.showPlayerControls,
				this.videoImgAndLinkOnly,
				this.useOldEmbedCode,
				this.enablePrivacyEnhancedMode,
				this.autoPlay,
				this.showRelatedVideos
			]
		);

		this.iframeInputView.on('change', () => {
			this.fire('YTIframeInputchange');
		});

		// Create the save and cancel buttons.
		this.saveButtonView = this._createButton(
			'Save',
			icons.check,
			'ck-button-save'
		);
		// Set the type to 'submit', which will trigger
		// the submit event on entire form when clicked.
		this.saveButtonView.type = 'submit';

		this.cancelButtonView = this._createButton(
			'Cancel',
			icons.cancel,
			'ck-button-cancel'
		);

		// Delegate ButtonView#execute to FormView#cancel.
		this.cancelButtonView.delegate('execute').to(this, 'cancel');

		this.controlBtnContainer = this._createViewContainer(
			'control-btn-container',
			[this.saveButtonView, this.cancelButtonView]
		);

		this.childViews = this.createCollection([
			this.iframeInputView,
			this.youtubeUrlAndSizeContainer,
			// this.youtubeVideoStartAt,
			this.checkboxContainer,
			this.controlBtnContainer
		]);

		this.setTemplate({
			tag: 'form',
			attributes: {
				class: ['ck', 'ck-media-embed-form'],
				tabindex: '1'
			},
			children: this.childViews
		});
	}

	render() {
		super.render();

		// Submit the form when the user clicked the save button
		// or pressed enter in the input.
		submitHandler({
			view: this
		});
	}

	focus() {
		this.childViews.first.focus();
	}

	_createTextAreaInput(label, className = '') {
		const labeledInput = new LabeledFieldView(
			this.locale,
			createLabeledTextarea
		);

		labeledInput.label = label;

		if (className) {
			labeledInput.class = className;
		}

		return labeledInput;
	}

	_createTextInput(label, className = '', defaultValue = '') {
		const labeledInput = new LabeledFieldView(
			this.locale,
			createLabeledInputText
		);

		labeledInput.label = label;
		labeledInput.render();

		if (defaultValue) {
			labeledInput.fieldView.element.value = defaultValue;
			labeledInput.fieldView.element.placeholder = defaultValue;
			labeledInput.fieldView.element.defaultValue = defaultValue;
			labeledInput.isEmpty = false;
		}
		if (className) {
			labeledInput.class = className;
		}
		return labeledInput;
	}

	_createButton(label, icon, className) {
		const button = new ButtonView();

		button.set({
			label,
			icon,
			tooltip: true,
			class: className
		});

		return button;
	}

	_createSwitchButton(title, id) {
		const t = this.locale.t;
		const switchButton = new SwitchButtonView(this.locale);

		if (typeof this[id] === 'undefined') {
			this.set(id, false);
		}

		switchButton.set({
			label: t(title),
			withText: true
		});

		switchButton.class = 'test-switch-' + id;
		// Let the switch be controlled by form's observable property.
		switchButton.bind('isOn').to(this, id);
		// // Update the state of the form when a switch is toggled.
		switchButton.on('execute', () => {
			this.set(id, !this[id]);
		});

		return switchButton;
	}

	_createViewContainer(className, children) {
		const container = new View();
		let classes = [];
		if (typeof className === 'string') {
			classes = className.split(' ');
		} else if (Array.isArray(className)) {
			classes = className;
		}

		container.setTemplate({
			tag: 'div',
			attributes: {
				class: classes
			},
			children
		});

		return container;
	}

	getIsIframe() {
		return this.isIframe;
	}

	setIsIframe(isIframe) {
		this.isIframe = isIframe;
	}

	getAllFields() {
		return {
			iframeInput: this.iframeInputView,
			youtubeUrl: this.youtubeUrl,
			youtubeUrlWidth: this.youtubeUrlWidth,
			youtubeUrlHeight: this.youtubeUrlHeight,
			youtubeVideoStartAt: this.youtubeVideoStartAt,
			showPlayerControls: this.showPlayerControls,
			videoImgAndLinkOnly: this.videoImgAndLinkOnly,
			autoPlay: this.autoPlay,
			useOldEmbedCode: this.useOldEmbedCode,
			enablePrivacyEnhancedMode: this.enablePrivacyEnhancedMode,
			showRelatedVideos: this.showRelatedVideos
		};
	}

	/**
	 * Returns an array of all fields in the form.
	 *
	 * @returns {Array}
	 */
	getAllFieldsInArray() {
		return [
			{
				name: 'iframeInput',
				view: this.iframeInputView
			},
			{
				name: 'youtubeUrl',
				view: this.youtubeUrl
			},
			{
				name: 'youtubeUrlWidth',
				view: this.youtubeUrlWidth
			},
			{
				name: 'youtubeUrlHeight',
				view: this.youtubeUrlHeight
			},
			{
				name: 'youtubeVideoStartAt',
				view: this.youtubeVideoStartAt
			},
			{
				name: 'showPlayerControls',
				view: this.showPlayerControls
			},
			{
				name: 'videoImgAndLinkOnly',
				view: this.videoImgAndLinkOnly
			},
			{
				name: 'autoPlay',
				view: this.autoPlay
			},
			{
				name: 'useOldEmbedCode',
				view: this.useOldEmbedCode
			},
			{
				name: 'enablePrivacyEnhancedMode',
				view: this.enablePrivacyEnhancedMode
			},
			{
				name: 'showRelatedVideos',
				view: this.showRelatedVideos
			}
		];
	}

	resetFields() {
		// Reset the text fields.
		this.getAllFieldsInArray().forEach(field => {
			if (!field.view.fieldView)
			{ return; }
			field.view.fieldView.value = '';
		});

		// Reset the switch buttons.
		this.showPlayerControls.isOn = false;
		this.videoImgAndLinkOnly.isOn = false;
		this.autoPlay.isOn = false;
		this.useOldEmbedCode.isOn = false;
		this.enablePrivacyEnhancedMode.isOn = false;
	}
}
