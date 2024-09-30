import {
	addMenuToDropdown,
	BodyCollection,
	ButtonView,
	createDropdown,
	createLabeledInputText,
	icons,
	LabeledFieldView,
	submitHandler,
	View
} from 'ckeditor5';

export default class FormView extends View {
	constructor(locale) {
		super(locale);

		this.sourceUrl = this._createTextInput('Source Url');
		this.sourceName = this._createTextInput(
			'Source name (Author or site reference)'
		);
		this.showURLSourceView = this._createdropDown('Select show source URL ?', [
			{
				id: 'EPPCopyCitationForm_show',
				label: 'Show source URL'
			},
			{
				id: 'EPPCopyCitationForm_hide',
				label: 'Hide source URL'
			}
		]);

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

		this.cancelButtonView.delegate('execute').to(this, 'cancel');

		this.childViews = this.createCollection([
			this.sourceUrl,
			this.showURLSourceView,
			this.sourceName,
			this.saveButtonView,
			this.cancelButtonView
		]);

		this.setTemplate({
			tag: 'form',
			attributes: {
				class: ['ck', 'ck-abbr-form'],
				tabindex: '-1'
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

	_createTextInput(label) {
		const labeledInput = new LabeledFieldView(
			this.locale,
			createLabeledInputText
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

	_createdropDown(label, options) {
		const dropdownView = createDropdown(this.locale);
		const body = new BodyCollection();

		dropdownView.buttonView.set({
			withText: true,
			label
		});

		addMenuToDropdown(dropdownView, body, options);

		// onChange, set the dropdown button label to the selected item label
		dropdownView.on('execute', evt => {
			const item = evt.source;
			dropdownView.buttonView.set('label', item.label);
			this.showURLSourceView.buttonView.element.value = item.id;
		});

		dropdownView.render();

		return dropdownView;
	}
}
