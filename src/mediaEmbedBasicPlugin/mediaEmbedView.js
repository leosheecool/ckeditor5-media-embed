import {
	View,
	LabeledFieldView,
	// createLabeledInputText,
	ButtonView,
	icons,
	submitHandler,
	createLabeledTextarea
} from 'ckeditor5';

export default class FormView extends View {
	constructor(locale) {
		super(locale);

		// console.log('FormView#constructor() got called');

		this.linkInputView = this._createInput('Add link');
		this.titleInputView = this._createInput('Add title');

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
			this.linkInputView,
			this.titleInputView,
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
}
