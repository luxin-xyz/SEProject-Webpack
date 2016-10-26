﻿var AddPDOtempt = React.createClass( {

    render: function() {

        $( document ).ready( function() {
            // The maximum number of options
            var MAX_OPTIONS = 5;

            alert( "get" );

            $( '#surveyForm' )
                .bootstrapValidator( {
                    feedbackIcons: {
                        valid: 'glyphicon glyphicon-ok',
                        invalid: 'glyphicon glyphicon-remove',
                        validating: 'glyphicon glyphicon-refresh'
                    },
                    fields: {
                        question: {
                            validators: {
                                notEmpty: {
                                    message: 'The question required and cannot be empty'
                                }
                            }
                        },
                        'option[]': {
                            validators: {
                                notEmpty: {
                                    message: 'The option required and cannot be empty'
                                },
                                stringLength: {
                                    max: 100,
                                    message: 'The option must be less than 100 characters long'
                                }
                            }
                        }
                    }
                })

                // Add button click handler
                .on( 'click', '.addButton', function() {
                    var $template = $( '#optionTemplate' ),
                        $clone = $template
                            .clone()
                            .removeClass( 'hide' )
                            .removeAttr( 'id' )
                            .insertBefore( $template ),
                        $option = $clone.find( '[name="option[]"]' );

                    // Add new field
                    $( '#surveyForm' ).bootstrapValidator( 'addField', $option );
                })

                // Remove button click handler
                .on( 'click', '.removeButton', function() {
                    var $row = $( this ).parents( '.form-group' ),
                        $option = $row.find( '[name="option[]"]' );

                    // Remove element containing the option
                    $row.remove();

                    // Remove field
                    $( '#surveyForm' ).bootstrapValidator( 'removeField', $option );
                })

                // Called after adding new field
                .on( 'added.field.bv', function( e, data ) {
                    // data.field   --> The field name
                    // data.element --> The new field element
                    // data.options --> The new field options

                    if ( data.field === 'option[]' ) {
                        if ( $( '#surveyForm' ).find( ':visible[name="option[]"]' ).length >= MAX_OPTIONS ) {
                            $( '#surveyForm' ).find( '.addButton' ).attr( 'disabled', 'disabled' );
                        }
                    }
                })

                // Called after removing the field
                .on( 'removed.field.bv', function( e, data ) {
                    if ( data.field === 'option[]' ) {
                        if ( $( '#surveyForm' ).find( ':visible[name="option[]"]' ).length < MAX_OPTIONS ) {
                            $( '#surveyForm' ).find( '.addButton' ).removeAttr( 'disabled' );
                        }
                    }
                });
        });
        return (
            <form id="surveyForm" method="post" className="form-horizontal">
                <div className="form-group">
                    <label className="col-sm-3 control-label">Question</label>
                    <div className="col-sm-5">
                        <input type="text" className="form-control" name="question" />
                    </div>
                </div>

                <div className="form-group">
                    <label className="col-sm-3 control-label">Options</label>
                    <div className="col-sm-5">
                        <input type="text" className="form-control" name="option[]" />
                    </div>
                    <div className="col-sm-4">
                        <button type="button" className="btn btn-default addButton"><i className="fa fa-plus"></i></button>
                    </div>
                </div>

                <div className="form-group hide" id="optionTemplate">
                    <div className="col-sm-offset-3 col-sm-5">
                        <input className="form-control" type="text" name="option[]" />
                    </div>
                    <div className="col-sm-4">
                        <button type="button" className="btn btn-default removeButton"><i className="fa fa-minus"></i></button>
                    </div>
                </div>

                <div className="form-group">
                    <div className="col-sm-5 col-sm-offset-3">
                        <button type="submit" className="btn btn-default">Validate</button>
                    </div>
                </div>
            </form>
        );
    }
});

module.exports = AddPDOtempt;