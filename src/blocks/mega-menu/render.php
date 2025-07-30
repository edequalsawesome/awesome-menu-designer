<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

$disable_when_collapsed = $attributes['disableWhenCollapsed'] ?? false;
$show_on_hover          = $attributes['showOnHover'] ?? false;
$label                  = esc_html( $attributes['label'] ?? '' );
$description            = esc_html( $attributes['description'] ?? '' );
$title                  = esc_attr( $attributes['title'] ?? '' );
$menu_slug              = esc_attr( $attributes['menuSlug'] ?? '');
$collapsed_url          = esc_url( $attributes['collapsedUrl'] ?? '');
$justify_menu           = esc_attr( $attributes['justifyMenu'] ?? '');
$menu_width             = esc_attr( $attributes['width'] ?? 'content');
$custom_width           = intval( $attributes['customWidth'] ?? 600 );
$top_spacing            = intval( $attributes['topSpacing'] ?? 0 );

// Generate unique ID for aria-describedby
$unique_id = wp_unique_id( 'mega-menu-' );

// Don't display the mega menu link if there is no label or no menu slug.
if ( ! $label || ! $menu_slug ) {
	return null;	
}

$classes  = $disable_when_collapsed ? 'disable-menu-when-collapsed ' : '';
$classes .= $collapsed_url ? 'has-collapsed-link ' : '';

$wrapper_attributes = get_block_wrapper_attributes(
	array( 'class' => $classes . 'wp-block-navigation-item' )
);

$menu_classes  = 'wp-block-ollie-mega-menu__menu-container';
$menu_classes .= ' menu-width-' . $menu_width;
$menu_classes .= $justify_menu ? ' menu-justified-' . $justify_menu : '';

// Icons.
$close_icon  = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M13 11.8l6.1-6.3-1-1-6.1 6.2-6.1-6.2-1 1 6.1 6.3-6.5 6.7 1 1 6.5-6.6 6.5 6.6 1-1z"></path></svg>';
$toggle_icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false" fill="none"><path d="M1.50002 4L6.00002 8L10.5 4" stroke-width="1.5"></path></svg>'
?>

<li
	<?php echo $wrapper_attributes; ?>
	data-wp-interactive='{ "namespace": "ollie/mega-menu" }'
	data-wp-context='{ "menuOpenedBy": { "click": false, "focus": false, "hover": false }, "showOnHover": <?php echo $show_on_hover ? 'true' : 'false'; ?>, "topSpacing": <?php echo $top_spacing; ?> }'
	data-wp-on--focusout="actions.handleMenuFocusout"
	data-wp-on--keydown="actions.handleMenuKeydown"
	data-wp-watch="callbacks.initMenu"
	data-wp-watch--layout="callbacks.initMenuLayout"
	data-wp-on-window--resize="actions.handleResize"
>
	<button
		class="wp-block-ollie-mega-menu__toggle wp-block-navigation-item__content"
		data-wp-on--click="actions.toggleMenuOnClick"
		data-wp-on--mouseenter="actions.handleMouseEnter"
		data-wp-on--mouseleave="actions.handleMouseLeave"
		data-wp-bind--aria-expanded="state.isMenuOpen"
		<?php if ( $title ) : ?>
		title="<?php echo $title; ?>"
		<?php endif; ?>
		<?php if ( $description ) : ?>
		aria-describedby="<?php echo esc_attr( $unique_id ); ?>-desc"
		<?php endif; ?>
	>
		<span class="wp-block-navigation-item__label"><?php echo $label; ?></span><?php if ( $description ) : ?><span id="<?php echo esc_attr( $unique_id ); ?>-desc" class="wp-block-navigation-item__description"><?php echo $description; ?></span><?php endif; ?><span class="wp-block-ollie-mega-menu__toggle-icon" aria-hidden="true"><?php echo $toggle_icon; ?></span>
	</button>

	<div
		class="<?php echo $menu_classes; ?>"
		tabindex="-1"
		data-top-spacing="<?php echo $top_spacing; ?>"
		data-custom-width="<?php echo $custom_width; ?>"
		data-wp-on--mouseenter="actions.handleMenuMouseEnter"
		data-wp-on--mouseleave="actions.handleMenuMouseLeave"
		role="region"
		aria-label="<?php 
			/* translators: %s: Menu label */
			echo esc_attr( sprintf( __( '%s menu', 'menu-designer' ), $label ) ); 
		?>"
	>
		<?php echo block_template_part( $menu_slug ); ?>
		<button 
			aria-label="<?php echo __( 'Close menu', 'menu-designer' ); ?>" 
			class="menu-container__close-button" 
			data-wp-on--click="actions.closeMenuOnClick"
			type="button" 
		>
			<?php echo $close_icon; ?>
		</button>
	</div>

	<?php if ( $disable_when_collapsed && $collapsed_url ) { ?>
		<a class="wp-block-ollie-mega-menu__collapsed-link wp-block-navigation-item__content" href="<?php echo $collapsed_url; ?>"<?php if ( $title ) : ?> title="<?php echo $title; ?>"<?php endif; ?>>
			<span class="wp-block-navigation-item__label"><?php echo $label; ?></span><?php if ( $description ) : ?><span class="wp-block-navigation-item__description"><?php echo $description; ?></span><?php endif; ?>
		</a>
	<?php } ?>
</li>
