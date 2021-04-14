import PropTypes from "prop-types";
import {withStyles, withTheme} from "@material-ui/styles";
import {theme} from "../defaultTheme";
import React from "react";
import {CircularProgress, debounce, TextField} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";

const styles = theme => ({

})

class OneSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            valueList: [{uid: "000001", name: "导师1"}, {uid: "000002", name: "导师2"}, {uid: "000003", name: "导师3"}],
            value: null,
            fixValue: [],
            inputValue: '',
        };
    }

    resetValue = () => {
        this.setState({value: null})
        this.setState({inputValue: ''})
    }

    getValue = () => {
        return(this.state.value);
    }

    setValue = (value) => {
        this.setState({value: value})
    }

    updateMentorList = debounce((query) => {
        this.setState({valueList: [
                {uid: '00000a', name: query+'a'},
                {uid: '00000b', name: query+'b'},
                {uid: '00000c', name: 'a'+query+'a'},
                {uid: '00000d', name: query.slice(0,-1)+'a'},
            ]
        });
    }, 500);

    handleOnChange = (event, newValue) => {
        this.setState({value: newValue})
        this.setState({fixValue: [newValue]})
    }

    handleOnInputChange = (event, newInputValue) => {
        this.setState({inputValue: newInputValue});
        this.updateMentorList(newInputValue);
    }

    render() {
        const {classes} = this.props;
        return (
            <Autocomplete
                disabled={this.props.readOnly}
                noOptionsText="无推荐"
                options={this.state.fixValue === [null] ? this.state.valueList.concat(this.state.fixValue) : this.state.valueList}
                getOptionLabel={(option) => option.name}
                value={this.state.value}
                onChange={this.handleOnChange}
                inputValue={this.state.inputValue}
                onInputChange={this.handleOnInputChange}
                filterOptions={(options, state) => options}
                loading={this.state.loading}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={this.props.label}
                        InputProps={{
                            ...params.InputProps,
                            readOnly: this.props.readOnly,
                            endAdornment: (
                                <React.Fragment>
                                    {this.state.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            )
                        }}
                    />
                )}
            />
        );
    }
}


OneSelector.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles(theme))(withTheme(OneSelector));