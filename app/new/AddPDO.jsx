var AddPDOdom = require( '../new/AddPDOdom' );
var AddPDO = React.createClass( {
    propTypes: {
        freshViewHandle: React.PropTypes.func.isRequired,
    },
    getInitialState: function() {
        return {
            fileds: [],
            name: '',
            clickNum: 1,
            pdoaddDOM: null
        };
    },
    clickMe: function() {
        var temp = this.state.clickNum + 1;
        
        var t_fileds = [];
        
        for ( var i = 0; i < this.state.fileds.length; i++ ) {
            t_fileds[i] = this.state.fileds[i];
        }
        t_fileds[temp-1] = '';

        this.setState( {
            fileds: t_fileds,
            clickNum: temp
        });
        
        
    },
    loadFormValidator: function( Form ) {
        $( Form ).bootstrapValidator( {
            message: '格式不正确',
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                pdoname: {
                    validators: {
                        notEmpty: {
                            message: 'pdoname不能为空'
                        },
                        stringLength: {
                            min: 0,
                            max: 20,
                            message: 'pdoname在20个字符以内'
                        },
                        remote: {
                            type: 'POST',
                            url: 'api/pdo/checkname',
                            message: '该pdoname已存在',
                            delay: 500
                        }
                    }
                },
                0: {
                    validators: {
                        notEmpty: {
                            message: '首字段不能为空'
                        },
                        stringLength: {
                            min: 0,
                            max: 10,
                            message: 'pdoname在20个字符以内'
                        },
                    }
                },
                1: {
                    validators: {
                        stringLength: {
                            min: 0,
                            max: 10,
                            message: 'pdoname在20个字符以内'
                        },
                    }
                }


            }
        })
            .on( 'success.form.bv', function( e ) {
                e.preventDefault();
            });
    },
    pdoaddDOMHandle: function( dom ) {
        this.setState( {
            pdoaddDOM: dom
        });
    },
    NameChangeHandle: function( event ) {
        var t_name = '';
        t_name = event.target.value;

        this.setState( {
            name: t_name
        });
    },
    StringChangeHandle: function( id, event ) {
        var t_fileds = [];
        for ( var i = 0; i < this.state.fileds.length; i++ ) {
            t_fileds[i] = this.state.fileds[i];
        }
        t_fileds[id] = event.target.value;
     
        this.setState( {
            fileds: t_fileds
        });
    },
    serializeForStruts2: function( name, fileds ) {
        //{"id":"1", "time":1477410877415, "user":"0", "name":"坐车", "fields":["始点", "终点", "耗时"]}
        var pdo = {};
        pdo['id']="-1";
        var q = new Date();
        pdo['time']=q.getTime();
        pdo['user']="-1";
        pdo['name']=name;

        var temp = this.state.fileds[0];
        for ( var i = 1; i < this.state.fileds.length; i++ ) {
            if(fileds[i]!=''){
                temp += ',' + fileds[i];
            }
        }
        pdo['fields']=temp;
       
        return pdo;
    },
    resetForm: function() {

        var check = $( this.state.pdoaddDOM ).data( 'bootstrapValidator' );

        if ( typeof ( check ) != "undefined" ) {

            $( this.state.pdoaddDOM ).data( 'bootstrapValidator' ).destroy();
            $( this.state.pdoaddDOM ).data( 'bootstrapValidator', null );
            this.loadFormValidator( this.state.pdoaddDOM );
        }
        var t_fileds = [];
        for ( var i = 0; i < this.state.fileds.length; i++ ) {
            t_fileds[i] = '';
        }
     
     
        this.setState( {
            fileds: t_fileds,
            name:''
        });

    },

    checkInput: function( name, fileds ) {
        var check1 = $( this.state.pdoaddDOM ).data( 'bootstrapValidator' );
        check1.validate();
        if ( !check1.isValid() ) {
            return false;
        }
        for ( var i = 0; i < this.state.clickNum - 1; i++ ) {
            for ( var j = i + 1; j < this.state.clickNum; j++ ) {
                if ( fileds[i] == fileds[j] && fileds[i]!= '') {
                    
                    alert( "字段不可重复！"+fileds[i]+fileds[j]);
                    return false;
                }
            }
        }
        return true;

    },

    subHandle: function( event ) {
        var pdoArray=[];
        pdoArray.push(this.serializeForStruts2( this.state.name, this.state.fileds ));
        var httpParams = {'pdos': pdoArray};
        if ( !this.checkInput( this.state.name, this.state.fileds ) ) {
        } else {
            $.ajax( {
                async: false,//阻塞的，保证刷新得到的视图是新的
                type: "POST",
                cache: false,
                url: "api/pdo/add",
                data: {'params':JSON.stringify(httpParams)},
            });
            this.props.freshViewHandle();
            alert( "添加成功" )
            this.resetForm();
        }
    },
    render: function() {

        return (

            <div className="col-md-12 column">
            
                <AddPDOdom  clickNum = {this.state.clickNum}
                    clickMe = {this.clickMe}
                    name = {this.state.name}
                    fileds = {this.state.fileds}
                    NameChangeHandle = {this.NameChangeHandle}
                    StringChangeHandle = {this.StringChangeHandle}
                    pdoaddDOMHandle = {this.pdoaddDOMHandle}
                    loadFormValidator = {this.loadFormValidator}
                    subHandle = {this.subHandle}
                    />
            </div>
        );
    }
});

module.exports = AddPDO;