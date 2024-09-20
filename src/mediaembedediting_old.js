/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from 'ckeditor5';

export default class MediaEmbedEditing extends Plugin {
	init() {
		this._defineSchema();
		this._defineConverters();
	}

	_defineSchema() {
		const schema = this.editor.model.schema;

		// Extend the text node's schema to accept the abbreviation attribute.
		schema.extend( '$text', {
			allowAttributes: [ 'mediaembed' ]
		} );
	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		// Conversion from a model attribute to a view element
		conversion.for( 'downcast' ).attributeToElement( {
			model: 'mediaembed',

			// Callback function provides access to the model attribute value
			// and the DowncastWriter
			view: ( modelAttributeValue, conversionApi ) => {
				const { writer } = conversionApi;
				return writer.createAttributeElement( 'iframe', {
					title: modelAttributeValue
				} );
			}
		} );

		// Conversion from a view element to a model attribute
		conversion.for( 'upcast' ).elementToAttribute( {
			view: {
				name: 'firame',
				attributes: [ 'title' ]
			},
			model: {
				key: 'mediaembed',

				// Callback function provides access to the view element
				value: viewElement => {
					const title = viewElement.getAttribute( 'title' );
					return title;
				}
			}
		} );
	}
}
