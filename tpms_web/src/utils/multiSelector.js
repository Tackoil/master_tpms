import PropTypes from "prop-types";
import {withStyles, withTheme} from "@material-ui/styles";
import {theme} from "../defaultTheme";
import React from "react";
import {debounce, TextField} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";

const styles = theme => ({

})

class MultiSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            valueList: [],
            fixValue: [],
            value: [],
            inputValue: '',
        };
    }

    resetValue = () => {
        this.setState({value: []})
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
                {uid: '00000a'+this.state.value.length, name: query+'a'},
                {uid: '00000b'+this.state.value.length, name: query+'b'},
                {uid: '00000c'+this.state.value.length, name: 'a'+query+'a'},
                {uid: '00000d'+this.state.value.length, name: query.slice(0,-1)+'a'},
            ]
        });
    }, 500);

    handleOnChange = (event, newValue) => {
        let value = newValue.map((item) => {
               return item.inputValue ? {uid: '', name: item.inputValue} : item;
        })
        this.setState({value: value})
        this.setState({fixValue: value})
    }

    handleOnInputChange = (event, newInputValue) => {
        this.setState({inputValue: newInputValue});
        this.updateMentorList(newInputValue);
    }

    render() {
        const {classes} = this.props;
        return (
            <Autocomplete
                multiple filterSelectedOptions disableCloseOnSelect
                disabled={this.props.readOnly}
                noOptionsText="无推荐"
                options={this.state.valueList.concat(this.state.fixValue)}
                getOptionLabel={(option) => option.name}
                value={this.state.value}
                onChange={this.handleOnChange}
                inputValue={this.state.inputValue}
                onInputChange={this.handleOnInputChange}
                filterOptions={(options, params) => {
                    if(this.props.allowNew && params.inputValue !== ''){
                        options.push({
                            inputValue: params.inputValue,
                            name: `添加 "${params.inputValue}"`,
                        })
                    }
                    return options;
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={this.props.label}
                    />
                )}
            />
        );
    }
}


MultiSelector.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles(theme))(withTheme(MultiSelector));