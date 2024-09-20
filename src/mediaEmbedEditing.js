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
			allowAttributes: ['mediaEmbed', 'title', 'class']
		});

		schema.register('mediaEmbed', {
			inheritAllFrom: '$block',
			allowAttributes: ['mediaEmbedTitle', 'mediaEmbedClass', 'title', 'class']
		});
	}

	_defineConverters() {
		// ADDED
		const conversion = this.editor.conversion;

		conversion.for('downcast').elementToElement({
			model: 'mediaEmbed',
			view: (modelElement, { writer }) => {
				// console.log('modelElement', modelElement);
				return writer.createContainerElement('div', {
					class: 'cald_consent_wrapper'
				});
				// if (!modelElement.getAttribute('mediaEmbed')) {
				// 	return;
				// }
				// const title = modelElement.getAttribute('title');
				// const className = modelElement.getAttribute('class');

				// const mainContainer = writer.createContainerElement('div', {
				// 	class: 'cald_consent_wrapper'
				// });
				// const iframeContainer = writer.createContainerElement('div', {
				// 	class: `${ className } epp-ckeditor-iframe`
				// });

				// writer.insert(writer.createText(title), iframeContainer);
				// writer.insert(iframeContainer, mainContainer);

				// console.log('mainContainer', mainContainer);

				// return mainContainer;
			}
		});

		// Conversion from a model attribute to a view element.
		// conversion.for('downcast').attributeToElement({
		// 	model: 'mediaEmbed',
		// 	// Callback function provides access to the model attribute value
		// 	// and the DowncastWriter.
		// 	view: (modelAttributeValue, conversionApi) => {
		// 		// console.log('test');
		// 		const { writer } = conversionApi;
		// 		console.log('ici');
		// 		// console.log('modelAttributeValue', modelAttributeValue);

		// 		return writer.createAttributeElement('p', {
		// 			title: modelAttributeValue,
		// 			class: 'test e' // modelAttributeValue.modelAttributeValue.mediaEmbedClass
		// 		});
		// 	}
		// });

		// conversion.for('downcast').elementToStructure({
		// 	model: 'mediaEmbed',
		// 	view: (modelElement, { writer }) => {
		// 		return writer.createText('p', {class: 'test', title: modelElement.getAttribute('title')});
		// 	}
		// })

		conversion.for('upcast').elementToElement({
			view: {
				name: 'p',
				attributes: ['title', 'class']
			},
			model: (viewElement, { writer: modelWriter }) => {
				// console.log('viewElement', viewElement);
				return modelWriter.createElement('mediaEmbed', {
					mediaEmbed: viewElement.getAttribute('title'),
					mediaEmbedClass: viewElement.getAttribute('class')
				});
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
