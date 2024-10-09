import {
	View,
	LabeledFieldView,
	ButtonView,
	icons,
	submitHandler,
	createLabeledTextarea,
	SwitchButtonView
} from 'ckeditor5';

export default class YouubeEmbedFormView extends View {
	constructor(locale) {
		super(locale);

		this.iframeInputView = this._createInput('Iframe HTML');

		this.youtubeUrl = this._createInput('Paste YouTube Video URL');
		this.youtubeUrlWidth = this._createInput('Width');
		this.youtubeUrlHeight = this._createInput('Height');
		this.youtubeVideoStartAt = this._createInput('Start at');
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
		this.showRelatedVideos = this._createSwitchButton(
			'Show related videos at the end of the video',
			'_showRelatedVideos'
		);

		this.checkboxes = [
			this.showPlayerControls,
			this.videoImgAndLinkOnly,
			this.autoPlay,
			this.useOldEmbedCode,
			this.showRelatedVideos
		];

		this.iframeInputView.on('change', () => {});

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

		this.childViews = this.createCollection([
			this.iframeInputView,
			this.youtubeUrl,
			this.youtubeUrlWidth,
			this.youtubeUrlHeight,
			this.youtubeVideoStartAt,
			this.showPlayerControls,
			this.videoImgAndLinkOnly,
			this.autoPlay,
			this.useOldEmbedCode,
			this.showRelatedVideos,
			this.saveButtonView,
			this.cancelButtonView
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

	_createInput(label) {
		const labeledInput = new LabeledFieldView(
			this.locale,
			createLabeledTextarea
		);

		labeledInput.label = label;

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

		if (typeof this[ id ] === 'undefined') {
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
			this.set(id, !this[ id ]);
		});

		return switchButton;
	}
}
