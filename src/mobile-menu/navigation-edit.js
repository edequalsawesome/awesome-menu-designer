/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useStyleOverride } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { createInterpolateElement } from '@wordpress/element';
import { useEntityRecords } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import TemplateSelector from '../components/TemplateSelector';
import MenuDesignerGuide from '../components/MenuDesignerGuide';
import useTemplateCreation from '../hooks/useTemplateCreation';
import MobileMenuColorControls from './mobile-menu-color-controls';

/**
 * Add mobile menu controls to the navigation block
 */
const withMobileMenuControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { name, attributes, setAttributes } = props;

		// Only add controls to navigation block
		if ( name !== 'core/navigation' ) {
			return <BlockEdit { ...props } />;
		}

		const { 
			mobileMenuSlug, 
			mobileMenuBackgroundColor,
			mobileIconBackgroundColor,
			mobileIconColor,
			mobileIconSize
		} = attributes;

		// Check if menu templates are available
		const { records: templates, isResolving } = useEntityRecords( 'postType', 'wp_template_part', {
			per_page: -1,
			area: 'menu',
		} );
		const hasTemplates = !isResolving && templates && templates.length > 0;

		// Get the active theme slug for creating new template parts
		const themeSlug = useSelect( ( select ) => {
			const currentTheme = select( 'core' ).getCurrentTheme();
			return currentTheme?.stylesheet || 'theme';
		}, [] );

		// Use the shared template creation hook
		const { createTemplate: createMobileMenuTemplate, isCreating } = useTemplateCreation( {
			templateArea: 'menu',
			baseSlug: 'mobile-menu',
			baseTitle: __( 'Mobile Menu', 'ollie-menu-designer' ),
			existingTemplates: templates,
			currentTheme: themeSlug,
			onSuccess: ( newTemplate ) => {
				// Update the selected mobile menu template
				setAttributes( { mobileMenuSlug: newTemplate.slug } );
			},
		} );


		// Use WordPress's useStyleOverride for proper editor style injection
		const generateIconSizeStyles = () => {
			let iconSizeStyles = '';
			if ( mobileIconSize === 'large' ) {
				iconSizeStyles = `
					.mobile-icon-large .wp-block-navigation__responsive-container-close svg, 
					.mobile-icon-large .wp-block-navigation__responsive-container-open svg {
						width: 40px !important;
						height: 40px !important;
					}
				`;
			} else if ( mobileIconSize === 'medium' ) {
				iconSizeStyles = `
					.mobile-icon-medium .wp-block-navigation__responsive-container-close svg,
					.mobile-icon-medium .wp-block-navigation__responsive-container-open svg {
						width: 32px !important;
						height: 32px !important;
					}
				`;
			}
			// Small uses default size, no additional styles needed

			// Position hamburger button to match close button positioning
			const positioningStyles = `
				.wp-block-navigation__responsive-container-open {
					position: absolute !important;
					right: 12px !important;
					top: 12px !important;
					z-index: 100 !important;
				}
			`;

			// Build complete styles
			const colorStyles = `
				${ mobileIconBackgroundColor ? `.wp-block-navigation__overlay-menu-preview svg { background-color: ${mobileIconBackgroundColor} !important; }` : '' }
				${ mobileIconColor ? `.wp-block-navigation__overlay-menu-preview svg { fill: ${mobileIconColor} !important; }` : '' }
			`;

			return `
				${iconSizeStyles}
				${positioningStyles}
				${colorStyles}
			`;
		};

		// Apply styles using WordPress's proper method
		useStyleOverride( {
			id: 'menu-designer-mobile-icon-styles',
			css: generateIconSizeStyles(),
		} );

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls group="settings">
					<PanelBody
						title={ __( 'Mobile Menu', 'ollie-menu-designer' ) }
						initialOpen={ true }
					>
						<MenuDesignerGuide />
						<TemplateSelector
							value={ mobileMenuSlug }
							onChange={ ( value ) =>
								setAttributes( { mobileMenuSlug: value } )
							}
							templateArea="menu"
							label={ __(
								'Mobile Menu',
								'menu-designer'
							) }
							help={ 
								isResolving ? (
									__( 'Loading templates...', 'ollie-menu-designer' )
								) : hasTemplates ? (
									createInterpolateElement(
										__( 'Select a menu to use as the mobile menu or <create>create a new one</create> in the <editor>Site Editor</editor>.', 'ollie-menu-designer' ),
										{
											create: (
												<a
													href="#"
													onClick={ ( e ) => {
														e.preventDefault();
														if ( ! isCreating ) {
															createMobileMenuTemplate();
														}
													} }
													style={{ 
														textDecoration: 'underline',
														cursor: isCreating ? 'default' : 'pointer',
														opacity: isCreating ? 0.6 : 1
													}}
												/>
											),
											editor: (
												<a
													href={ `${window.location.origin}/wp-admin/site-editor.php?postType=wp_template_part&categoryId=menu` }
													target="_blank"
													rel="noreferrer"
													style={{ textDecoration: 'underline' }}
												/>
											),
										}
									)
								) : (
									createInterpolateElement(
										__( 'No menus found. <a>Create your first menu</a>.', 'ollie-menu-designer' ),
										{
											a: (
												<a
													href="#"
													onClick={ ( e ) => {
														e.preventDefault();
														if ( ! isCreating ) {
															createMobileMenuTemplate();
														}
													} }
													style={{ 
														textDecoration: 'underline',
														cursor: isCreating ? 'default' : 'pointer',
														opacity: isCreating ? 0.6 : 1
													}}
												/>
											),
										}
									)
								)
							}
							previewBackgroundColor={ mobileMenuBackgroundColor }
						/>
						<SelectControl
							label={ __( 'Icon Size', 'ollie-menu-designer' ) }
							value={ mobileIconSize || 'medium' }
							onChange={ ( value ) =>
								setAttributes( { mobileIconSize: value } )
							}
							options={ [
								{ label: __( 'Small', 'ollie-menu-designer' ), value: 'small' },
								{ label: __( 'Medium', 'ollie-menu-designer' ), value: 'medium' },
								{ label: __( 'Large', 'ollie-menu-designer' ), value: 'large' },
							] }
							help={ __( 'Choose the size of the mobile menu toggle icons.', 'ollie-menu-designer' ) }
						/>
					</PanelBody>
				</InspectorControls>
				<InspectorControls group="color">
					<MobileMenuColorControls
						attributes={ attributes }
						setAttributes={ setAttributes }
						clientId={ props.clientId }
					/>
				</InspectorControls>
			</>
		);
	};
}, 'withMobileMenuControls' );

/**
 * Add the mobile menu attributes to the navigation block
 */
const addMobileMenuAttribute = ( settings, name ) => {
	if ( name !== 'core/navigation' ) {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			mobileMenuSlug: {
				type: 'string',
				default: '',
			},
			mobileMenuBackgroundColor: {
				type: 'string',
				default: '',
			},
			customMobileMenuBackgroundColor: {
				type: 'string',
				default: '',
			},
			mobileIconBackgroundColor: {
				type: 'string',
				default: '',
			},
			customMobileIconBackgroundColor: {
				type: 'string',
				default: '',
			},
			mobileIconColor: {
				type: 'string',
				default: '',
			},
			customMobileIconColor: {
				type: 'string',
				default: '',
			},
			mobileIconSize: {
				type: 'string',
				default: 'medium',
			},
		},
	};
};

/**
 * Add custom class to navigation block in the editor based on icon size
 */
const withMobileIconSizeClass = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		// Only modify navigation blocks
		if ( props.name !== 'core/navigation' ) {
			return <BlockListBlock { ...props } />;
		}

		const { mobileIconSize } = props.attributes;
		
		// Add the mobile icon size class if set
		let className = props.className || '';
		if ( mobileIconSize ) {
			className = `${className} mobile-icon-${mobileIconSize}`.trim();
		}

		return <BlockListBlock { ...props } className={ className } />;
	};
}, 'withMobileIconSizeClass' );

// Add filters
addFilter(
	'blocks.registerBlockType',
	'menu-designer/add-mobile-menu-attribute',
	addMobileMenuAttribute
);

addFilter(
	'editor.BlockEdit',
	'menu-designer/with-mobile-menu-controls',
	withMobileMenuControls
);

addFilter(
	'editor.BlockListBlock',
	'menu-designer/with-mobile-icon-size-class',
	withMobileIconSizeClass
);
