import { ClassicEditor, Essentials, Paragraph, Heading } from 'ckeditor5';
import MediaEmbed from '../src/mediaembed.js';

/* global document */

describe( 'MediaEmbed', () => {
	it( 'should be named', () => {
		expect( MediaEmbed.pluginName ).to.equal( 'MediaEmbed' );
	} );

	describe( 'init()', () => {
		let domElement, editor;

		beforeEach( async () => {
			domElement = document.createElement( 'div' );
			document.body.appendChild( domElement );

			editor = await ClassicEditor.create( domElement, {
				plugins: [
					Paragraph,
					Heading,
					Essentials,
					MediaEmbed
				],
				toolbar: [
					'mediaEmbedButton'
				]
			} );
		} );

		afterEach( () => {
			domElement.remove();
			return editor.destroy();
		} );

		it( 'should load MediaEmbed', () => {
			const myPlugin = editor.plugins.get( 'MediaEmbed' );

			expect( myPlugin ).to.be.an.instanceof( MediaEmbed );
		} );

		it( 'should add an icon to the toolbar', () => {
			expect( editor.ui.componentFactory.has( 'mediaEmbedButton' ) ).to.equal( true );
		} );

		it( 'should add a text into the editor after clicking the icon', () => {
			const icon = editor.ui.componentFactory.create( 'mediaEmbedButton' );

			expect( editor.getData() ).to.equal( '' );

			icon.fire( 'execute' );

			expect( editor.getData() ).to.equal( '<p>Hello CKEditor 5!</p>' );
		} );
	} );
} );
