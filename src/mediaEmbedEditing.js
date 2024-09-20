import { Plugin } from 'ckeditor5';

export default class MediaEmbedEditing extends Plugin {
	init() {
		// console.log('MediaEmbedEditing#init() got called');

		this._defineSchema();
		this._defineConverters();
	}

	_defineSchema() {
		// ADDED
		const schema = this.editor.model.schema;

		// Extend the text node's schema to accept the mediaEmbed attribute.
		schema.extend('$text', {
			allowAttributes: ['mediaEmbed', 'mediaEmbedClass', 'mediaEmbedTitle']
		});
	}

	_defineConverters() {
		// ADDED
		const conversion = this.editor.conversion;

		// Conversion from a model attribute to a view element.
		conversion.for('downcast').attributeToElement({
			model: 'mediaEmbed',
			// Callback function provides access to the model attribute value
			// and the DowncastWriter.
			view: (modelAttributeValue, conversionApi) => {
				// console.log('test');
				const { writer } = conversionApi;
				// console.log('modelAttributeValue', modelAttributeValue);

				return writer.createAttributeElement('p', {
					title: modelAttributeValue,
					class: 'test' // modelAttributeValue.modelAttributeValue.mediaEmbedClass
				});
			}
		});

		// conversion.for('downcast').elementToStructure({
		// 	model: 'mediaEmbed',
		// 	view: (modelElement, { writer }) => {
		// 		return writer.createText('p', {class: 'test', title: modelElement.getAttribute('title')});
		// 	}
		// })

		conversion.for('upcast').elementToAttribute({
			view: {
				name: 'p',
				attributes: ['mediaEmbedTitle', 'mediaEmbedClass']
			},
			model: {
				key: 'mediaEmbed',
				// Callback function provides access to the view element.
				value: viewElement => {
					const title = viewElement.getAttribute('mediaEmbedTitle');
					// const className = viewElement.getAttribute('mediaEmbedClass');
					// console.log("view element", viewElement);

					return title;
					// return {
					// 	title,
					// 	class: 'test' //className
					// };
				}
			}
		});
	}

	// getWrapper(writer, modelAttributeValue) {
	// 	const mainContainer = writer.createContainerElement('div', {
	// 		class: 'cald_consent_wrapper'
	// 	});
	// 	const iframeContainer = writer.createContainerElement('div', {
	// 		class: `${ modelAttributeValue } epp-ckeditor-iframe`
	// 	});
	// }
}
