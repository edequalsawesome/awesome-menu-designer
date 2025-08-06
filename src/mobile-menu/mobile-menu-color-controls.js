/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	withColors,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

const MobileMenuColorControls = ({
	clientId,
	mobileMenuBackgroundColor,
	mobileIconBackgroundColor,
	mobileIconColor,
	setMobileMenuBackgroundColor,
	setMobileIconBackgroundColor,
	setMobileIconColor,
}) => {
	const colorSettings = [
		{
			value: mobileMenuBackgroundColor?.color,
			onChange: setMobileMenuBackgroundColor,
			label: __( 'Mobile Menu Background', 'menu-designer' ),
			resetAllFilter: () => ({
				mobileMenuBackgroundColor: undefined,
				customMobileMenuBackgroundColor: undefined,
			}),
		},
		{
			value: mobileIconBackgroundColor?.color,
			onChange: setMobileIconBackgroundColor,
			label: __( 'Mobile Icon Background', 'menu-designer' ),
			resetAllFilter: () => ({
				mobileIconBackgroundColor: undefined,
				customMobileIconBackgroundColor: undefined,
			}),
		},
		{
			value: mobileIconColor?.color,
			onChange: setMobileIconColor,
			label: __( 'Mobile Icon', 'menu-designer' ),
			resetAllFilter: () => ({
				mobileIconColor: undefined,
				customMobileIconColor: undefined,
			}),
		},
	];

	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	if ( ! colorGradientSettings.hasColorsOrGradients ) {
		return null;
	}

	return (
		<>
			{ colorSettings.map(
				( { onChange, label, value, resetAllFilter } ) => (
					<ColorGradientSettingsDropdown
						key={ `mobile-menu-color-${ label }` }
						__experimentalIsRenderedInSidebar
						settings={ [
							{
								colorValue: value,
								label,
								onColorChange: onChange,
								resetAllFilter,
								isShownByDefault: false,
								enableAlpha: true,
								clearable: true,
							},
						] }
						panelId={ clientId }
						{ ...colorGradientSettings }
					/>
				)
			) }
		</>
	);
};

export default withColors(
	{ mobileMenuBackgroundColor: 'color' },
	{ mobileIconBackgroundColor: 'color' },
	{ mobileIconColor: 'color' }
)( MobileMenuColorControls );