import { Plugin } from 'ckeditor5';

export default class AbbreviationEditing extends Plugin {
	init() {
		this._defineSchema();
		this._defineConverters();
	}

	_defineSchema() {
		const editor = this.editor;
		const schema = editor.model.schema;
		schema.register('EPPQuote', {
			allowWhere: '$text',
			isObject: true,
			isSelectable: true,
			allowAttributes: [
				'sourceUrl',
				'isSourceUrlShown',
				'citation',
				'sourceName'
			]
		});
	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		conversion.for('downcast').elementToElement({
			model: 'EPPQuote',
			view: (modelAttributeValue, conversionApi) => {
				const { writer } = conversionApi;
				const sourceUrl = modelAttributeValue.getAttribute('sourceUrl');
				const citation = modelAttributeValue.getAttribute('citation');
				const isSourceUrlShown =
					modelAttributeValue.getAttribute('isSourceUrlShown');
				const sourceName = modelAttributeValue.getAttribute('sourceName');
				const children = [];

				// get the selected text and store it in a const variable
				const selectionText = writer.createRawElement('p', null, el => {
					el.innerHTML = citation;
				});
				children.push(selectionText);

				if (sourceName) {
					const foooter = writer.createRawElement(
						'footer',
						{
							class: 'blockquote-footer'
						},
						el => {
							el.innerHTML = sourceName;
						}
					);
					children.push(foooter);
				}

				if (sourceUrl && isSourceUrlShown) {
					const sourceUrlElement = writer.createRawElement(
						'cite',
						{
							class: 'blockquote-source-url'
						},
						el => {
							el.innerHTML = sourceUrl;
						}
					);
					children.push(sourceUrlElement);
				}

				return writer.createContainerElement(
					'blockquote',
					{
						class: 'blockquote',
						cite: sourceUrl ? sourceUrl : ''
					},
					children
				);
			}
		});

		conversion.for('upcast').elementToElement({
			view: {
				name: 'blockquote',
				classes: 'blockquote'
			},
			model: ( viewElement, { writer } ) => {
				const result = {
					sourceUrl: viewElement.getAttribute('cite'),
					sourceName: null,
					citation: null
				};

				for (const child of viewElement.getChildren()) {
					if (child.name === 'p') {
						result.citation = child.getChild(0).data;
					} else if (child.name === 'footer') {
						result.sourceName = child.getChild(0).data;
					} else if (child.name === 'cite') {
						result.sourceUrl = child.getChild(0).data;
					}
				}

				return writer.createElement('EPPQuote', result);
			}
		});
	}
}
