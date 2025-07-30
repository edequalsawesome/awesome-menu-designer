/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import './style.scss';
import './view.scss';
import Edit from './edit';
import metadata from './block.json';
import '../../mobile-menu/navigation-edit';

const megaMenuIcon = (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M11 5.5H6C5.86739 5.5 5.74025 5.55272 5.64648 5.64648C5.55272 5.74025 5.5 5.86739 5.5 6V18C5.5 18.1326 5.55272 18.2597 5.64648 18.3535C5.74025 18.4473 5.86739 18.5 6 18.5H18C18.1326 18.5 18.2597 18.4473 18.3535 18.3535C18.4473 18.2597 18.5 18.1326 18.5 18V10.5H20V18C20 18.5304 19.7891 19.039 19.4141 19.4141C19.039 19.7891 18.5304 20 18 20H6C5.46957 20 4.96101 19.7891 4.58594 19.4141C4.21086 19.039 4 18.5304 4 18V6C4 5.46957 4.21086 4.96101 4.58594 4.58594C4.96101 4.21086 5.46957 4 6 4H11V5.5ZM17 15.5H7V14H17V15.5ZM17 11.9912H7V10.4912H17V11.9912ZM21 5.07422L17 8.4502L13 5.07422L13.9795 3.94922L17 6.49902L20.0205 3.94922L21 5.07422Z" />
	</svg>
);

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
registerBlockType( metadata.name, {
	icon: megaMenuIcon,
	edit: Edit,
} );

/**
 * Make the Mega Menu Block available to Navigation blocks.
 *
 * @since 0.1.0
 *
 * @param {Object} blockSettings The original settings of the block.
 * @param {string} blockName     The name of the block being modified.
 * @return {Object} The modified settings for the Navigation block or the original settings for other blocks.
 */
const addToNavigation = ( blockSettings, blockName ) => {
	if ( blockName === 'core/navigation' ) {
		return {
			...blockSettings,
			allowedBlocks: [
				...( blockSettings.allowedBlocks ?? [] ),
				'ollie/mega-menu',
			],
		};
	}
	return blockSettings;
};
addFilter(
	'blocks.registerBlockType',
	'ollie-mega-menu-add-to-navigation',
	addToNavigation
);
