import { icons } from '../src/index.js';

import ckeditor from './../theme/icons/ckeditor.svg';

describe( 'CKEditor5 MediaEmbed', () => {
	describe( 'icons', () => {
		it( 'exports the "ckeditor" icon', () => {
			expect( icons.ckeditor ).to.equal( ckeditor );
		} );
	} );
} );
