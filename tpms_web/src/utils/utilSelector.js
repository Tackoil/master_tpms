import React, {useEffect, useState} from "react";
import {debounce, makeStyles, TextField} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({}));

export default function UtilSelector(props) {
    const {noSuggest, readOnly, allowNew, buildNew, multiple, value, onChange, connector, render, label} = props;

    const classes = useStyles();
    const [valueList, setValueList] = useState([]);
    const [input, setInputValue] = useState('');
    const [inValue, setInValue] = useState(multiple ? [] : '');
    // const [inputWidth, setInputWidth] = useState(150);

    const addAlias = (input) => {
        if (Array.isArray(input)) {
            return input.map((item) => {
                return {
                    mainValue: item,
                    alias: render(item),
                }
            })
        } else if (input !== null && input !== undefined) {
            return {
                mainValue: input,
                alias: render(input)
            }
        } else {
            return multiple ? [] : null
        }
    }

    useEffect(() => {
        setInValue(addAlias(value))
    }, [value])

    useEffect(() => {
        let unmounted = false;
        connector('', unmounted ? (r) => setValueList(addAlias(r)) : () => null)
        return () => {
            unmounted = true
        };
    }, [])

    const updateValueList = debounce((query) => {
        connector(query, (r) => setValueList(addAlias(r)))
    }, 500);

    const handleOnChange = (event, newValue) => {
        if (multiple) {
            onChange(newValue.map(item => item.mainValue))
        } else {
            onChange(newValue.mainValue)
        }
    }

    const handleOnInputChange = (event, newInputValue) => {
        setInputValue(newInputValue)
        if (!noSuggest) {
            updateValueList(newInputValue);
        }
    }

    return (
        <Autocomplete
            multiple={multiple}
            filterSelectedOptions={multiple}
            disableCloseOnSelect={multiple}
            disabled={readOnly}
            noOptionsText="无推荐"
            getOptionSelected={(option, value) => {
                if (value === '') return true;
                else {
                    if (option.mainValue.pk !== undefined && value.mainValue.pk !== undefined) {
                        return option.mainValue.pk === value.mainValue.pk;
                    } else {
                        return option.alias === value.alias;
                    }
                }
            }}
            options={valueList}
            getOptionLabel={option => option ? option.alias : ''}
            value={inValue}
            onChange={handleOnChange}
            inputValue={input}
            onInputChange={handleOnInputChange}
            filterOptions={(options, params) => {
                if (allowNew && params.inputValue !== '') {
                    options.push({
                        mainValue: buildNew(params.inputValue),
                        alias: `添加 "${params.inputValue}"`,
                    })
                }
                return options;
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    variant='outlined'
                />
            )}
        />
    );
}