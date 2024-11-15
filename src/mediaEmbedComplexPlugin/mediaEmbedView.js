import {
	View,
	LabeledFieldView,
	ButtonView,
	icons,
	submitHandler,
	createLabeledTextarea
} from 'ckeditor5';

export default class FormView extends View {
	constructor(locale) {
		super(locale);

		this.iframeInputView = this._createInput('Iframe HTML');

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

	getAllFields() {
		return {
			iframe: this.iframeInputView.fieldView.element.value
		};
	}

	getAllFieldsInArray() {
		return [
			{
				name: 'iframe',
				view: this.iframeInputView.fieldView.element.value
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
	}
}
