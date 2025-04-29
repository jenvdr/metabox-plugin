( function( wp ) {
	const { registerPlugin } = wp.plugins;
	const { PluginDocumentSettingPanel, PluginPrePublishPanel } = wp.editPost;
	const { TextareaControl, TextControl, ToggleControl, DateTimePicker } = wp.components;
	const { withSelect, withDispatch } = wp.data;
	const { compose } = wp.compose;
	const { useState, useEffect, createElement, Fragment } = wp.element;

	const validateFields = ( meta, postType ) => {
		if ( postType === 'post' ) {
			const excerpt = meta.excerpt?.trim();
			return Boolean( excerpt );
		}

		if ( postType === 'advocacy' ) {
			const description = meta.description?.trim();
			const externalLink = Boolean( meta.external_link );
			const externalUrl = meta.external_url?.trim();
			const isValidExternalUrl = /^https:\/\/.+/.test( externalUrl );

			if ( !description ) return false;
			if ( externalLink && !isValidExternalUrl ) return false;
			return true;
		}

		if ( postType === 'events' ) {
			const eventDate = Boolean( meta.event_date );
			const externalLink = Boolean( meta.external_link );
			const externalUrl = meta.external_url?.trim();
			const isValidExternalUrl = /^https:\/\/.+/.test( externalUrl );

			if ( !eventDate ) return false;
			if ( externalLink && !isValidExternalUrl ) return false;
			return true;
		}

		return true;
	};

	// Field Renderers
	const renderPostFields = ( meta, setMeta ) => [
		createElement( TextareaControl, {
			label: 'Excerpt (required)',
			value: meta.excerpt || '',
			onChange: ( value ) => setMeta( { excerpt: value } )
		})
	];

	const renderAdvocacyFields = ( meta, setMeta, hasExternalLink, setHasExternalLink ) => [
		createElement( TextareaControl, {
			label: 'Description (required)',
			value: meta.description || '',
			onChange: ( value ) => setMeta( { description: value } )
		}),
		createElement( ToggleControl, {
			label: 'Does this page link to an external page?',
			checked: hasExternalLink,
			onChange: ( value ) => {
				setMeta( { external_link: value } );
				setHasExternalLink( value );
			}
		}),
		hasExternalLink && createElement( TextControl, {
			label: 'External Link URL (required)',
			value: meta.external_url || '',
			onChange: ( value ) => setMeta( { external_url: value } ),
			placeholder: 'https://example.com'
		})
	];

	const renderChapterFields = ( meta, setMeta, isPopup, setIsPopup ) => [
		createElement( ToggleControl, {
			label: 'Page or popup?',
			checked: isPopup,
			help: isPopup ? 'Popup' : 'Page',
			onChange: ( value ) => {
				setMeta( { is_popup: value } );
				setIsPopup( value );
			}
		})
	];

	const renderEventFields = ( meta, setMeta, date, setDate, hasExternalLink, setHasExternalLink ) => [
		createElement( TextareaControl, {
			label: 'Event Description',
			value: meta.description || '',
			onChange: ( value ) => setMeta( { description: value } )
		}),
		createElement( DateTimePicker, {
			label: 'Event Date (required)',
			currentDate: date || new Date().toISOString(),
			onChange: ( newDate ) => {
				setMeta( { event_date: newDate } );
				setDate( newDate );
			},
			is12Hour: true
		}),
		createElement( ToggleControl, {
			label: 'Does this event link to an external page?',
			checked: hasExternalLink,
			onChange: ( value ) => {
				setMeta( { external_link: value } );
				setHasExternalLink( value );
			}
		}),
		hasExternalLink && createElement( TextControl, {
			label: 'Event URL (required)',
			value: meta.external_url || '',
			onChange: ( value ) => setMeta( { external_url: value } ),
			placeholder: 'https://example.com'
		})
	];


	const renderValidationWarning = ( meta, postType ) => {
		if ( validateFields( meta, postType ) ) return null;

		return createElement(
			"div",
			{
				style: {
					backgroundColor: "#ffe0e0",
					border: "2px solid #d63638",
					padding: "16px",
					borderRadius: "8px",
					marginBottom: "20px"
				}
			},
			createElement(
				"p",
				{
					style: {
						color: "#d63638",
						fontWeight: "bold",
						fontSize: "16px",
						marginBottom: "0"
					}
				},
				"❗ Important: Meta information required before publishing."
			),
			postType === 'events' && createElement(
				"p",
				{ style: { color: "#d63638", marginTop: "8px" } },
				"→ You must select an event date and add a valid external URL (starting with 'https://')."
			),
			postType === 'advocacy' && createElement(
				"p",
				{ style: { color: "#d63638", marginTop: "8px" } },
				"→ You must add a description and optionally a valid external URL (starting with 'https://')."
			)
		);
	};

	// Main MetaBox Component
	const MetaBox = ( { meta, setMeta, postType, lockPostSaving, unlockPostSaving } ) => {
		const [ hasExternalLink, setHasExternalLink ] = useState( meta.external_link || false );
		const [ isPopup, setIsPopup ] = useState( meta.is_popup || false );
		const [ date, setDate ] = useState( meta.event_date || '' );

		useEffect( () => {
			const isValid = validateFields( meta, postType );
			if ( isValid ) {
				unlockPostSaving();
			} else {
				lockPostSaving();
			}
		}, [meta, postType]);

		return createElement(
			Fragment,
			null,
			createElement(
				PluginDocumentSettingPanel,
				{
					name: 'meta-panel',
					title: 'Meta Information',
					className: validateFields(meta, postType)
						? 'meta-panel meta-panel--valid'
						: 'meta-panel meta-panel--invalid'
				},
				postType === 'post' && renderPostFields( meta, setMeta ),
				postType === 'advocacy' && renderAdvocacyFields( meta, setMeta, hasExternalLink, setHasExternalLink ),
				postType === 'chapters' && renderChapterFields( meta, setMeta, isPopup, setIsPopup ),
				postType === 'events' && renderEventFields( meta, setMeta, date, setDate, hasExternalLink, setHasExternalLink )
			),
			createElement(
				PluginPrePublishPanel,
				{
					title: "Validation Check",
					initialOpen: true,
					priority: 1,
					children: () => renderValidationWarning( meta, postType )
				}
			)
		);
	};

	// Compose and Register Plugin
	const EnhancedMetaBox = compose(
		withSelect( ( select ) => {
			const editor = select( 'core/editor' );
			return {
				meta: editor.getEditedPostAttribute( 'meta' ),
				postType: editor.getCurrentPostType(),
			};
		}),
		withDispatch( ( dispatch ) => {
			const editor = dispatch( 'core/editor' );
			return {
				setMeta: ( meta ) => editor.editPost( { meta } ),
				lockPostSaving: () => editor.lockPostSaving( 'custom-meta-validation' ),
				unlockPostSaving: () => editor.unlockPostSaving( 'custom-meta-validation' ),
			};
		})
	)( MetaBox );

	registerPlugin( 'custom-meta-box', {
		render: EnhancedMetaBox
	} );

} )( window.wp );
