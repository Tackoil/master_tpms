import React from "react";
import PropTypes from "prop-types";
import {withStyles, withTheme} from "@material-ui/styles";
import {theme} from "./defaultTheme";
import {
    Divider,
    FormGroup,
    InputAdornment,
    TextField
} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import UtilSelector from "./utils/utilSelector";
import {isfloat} from "./utils/utils";
import {
    authorListGet,
    authorRender,
    keywordBuilder,
    keywordListGet,
    keywordRender,
    outcomeListGet, outcomeRender,
    projectListGet,
    projectRender,
    topicBuilder,
    topicListGet,
    topicRender,
    typeBuilder,
    typeListGet,
    typeRender
} from "./utils/connector";

const styles = theme => ({
    formGroup: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    formControlFix: {
        margin: theme.spacing(1),
        width: 120,
    },
})

class ThesisAddDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: null,
            pk: '',
            rate: '',
            rateError: false,
            mentor: null,
            student: null,
            type: null,
            keywords: [],
            topics: [],
            projects: [],
            outcomes: [],
        };
    }

    componentDidMount() {
        if(!this.props.edit && this.props.data !== undefined){
            let data = this.props.data;
            this.setState({data: data.date});
            this.setState({mentor: data.mentor});
            this.setState({student: data.student});
            this.setState({type: data.type});
            this.setState({pk: data.pk});
            this.setState({rate: data.rate});
            this.setState({keywords: data.keywords});
            this.setState({topics: data.topics});
            this.setState({projects: data.projects});
            this.setState({outcomes: data.outcomes});
        }
    }

    getAllData = () => {
        return {
            error: this.state.rateError,
            date: this.state.date,
            mentor: this.state.mentor,
            student: this.state.student,
            type: this.state.type,
            pk: this.state.pk,
            rate: this.state.rate,
            keywords: this.state.keywords,
            topics: this.state.topics,
            projects: this.state.projects,
            outcomes: this.state.outcomes,
        }
    }

    handleRateChange = (event) => {
        let newValue = event.target.value;
        let newValueError;
        if(isfloat(newValue)){
            newValueError = !(parseFloat(newValue) <= 100 && parseFloat(newValue) >= 0);
        }
        else newValueError = newValue !== '';
        this.setState({rate: newValue});
        this.setState({rateError: newValueError});
    }


    render() {
        const {classes} = this.props;
        return (
            <>
                <FormGroup row className={classes.formGroup}>
                    <FormControl className={classes.formControlFix}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker disableFuture autoOk clearable
                                        inputVariant="outlined"
                                        readOnly={!this.props.edit}
                                        size='medium' variant="dialog"
                                        label="日期" format="yyyy/MM/dd"
                                        value={this.state.date}
                                        onChange={(date) => {
                                            this.setState({date: date})
                                        }}
                            />
                        </MuiPickersUtilsProvider>
                    </FormControl>
                    <FormControl className={classes.formControlFix}>
                        <UtilSelector connector={(q, r) => authorListGet(q, 'men', r)}
                                      render={authorRender}
                                      readOnly={!this.props.edit}
                                      value={this.state.mentor}
                                      onChange={(value) => this.setState({mentor: value})}
                                      label="指导老师"/>
                    </FormControl>
                    <FormControl className={classes.formControlFix}>
                        <UtilSelector connector={(q, r) => authorListGet(q, 'stu', r)}
                                      render={authorRender}
                                      readOnly={!this.props.edit}
                                      value={this.state.student}
                                      onChange={(value) => this.setState({student: value})}
                                      label="作者"/>
                    </FormControl>
                </FormGroup>
                <FormGroup row className={classes.formGroup}>
                    <FormControl className={classes.formControlFix}>
                        <UtilSelector allowNew
                                      buildNew={typeBuilder}
                                      connector={(q, r) => typeListGet(q, r)}
                                      render={typeRender}
                                      readOnly={!this.props.edit}
                                      value={this.state.type}
                                      onChange={(value) => this.setState({type: value})}
                                      label="类型"/>
                    </FormControl>
                    <FormControl className={classes.formControlFix}>
                        <TextField required variant="outlined" label="论文编号" id="thesis_id" value={this.state.pk}
                                   onChange={event => this.setState({pk: event.target.value})}
                                   InputProps={{readOnly: !this.props.edit}}
                        />
                    </FormControl>
                    <FormControl className={classes.formControlFix}>
                        <TextField label="重复率" variant="outlined" id="rate" value={this.state.rate}
                                   onChange={this.handleRateChange}
                                   error={this.state.rateError}
                                   helperText={this.state.rateError ? '请输入0至100的小数' : ''}
                                   InputProps={{
                                       readOnly: !this.props.edit,
                                       endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                   }}/>
                    </FormControl>
                </FormGroup>
                <Divider/>
                <FormGroup row className={classes.formGroup}>
                    <FormControl className={classes.formControl}>
                        <UtilSelector multiple allowNew
                                      buildNew={keywordBuilder}
                                      connector={(q, r) => keywordListGet(q, r)}
                                      render={keywordRender}
                                      readOnly={!this.props.edit}
                                      value={this.state.keywords}
                                      onChange={(value) => this.setState({keywords: value})}
                                      label="关键词"/>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <UtilSelector multiple allowNew
                                      buildNew={topicBuilder}
                                      connector={(q, r) => topicListGet(q, r)}
                                      render={topicRender}
                                      readOnly={!this.props.edit}
                                      value={this.state.topics}
                                      onChange={(value) => this.setState({topics: value})}
                                      label="研究方向"/>
                    </FormControl>
                </FormGroup>
                <FormGroup row className={classes.formGroup}>
                    <FormControl fullWidth className={classes.formControl}>
                        <UtilSelector multiple
                                      connector={(q, r) => projectListGet(q, r)}
                                      render={projectRender}
                                      readOnly={!this.props.edit}
                                      value={this.state.projects}
                                      onChange={(value) => this.setState({projects: value})}
                                      label="关联项目"/>
                    </FormControl>
                </FormGroup>
                <FormGroup row className={classes.formGroup}>
                    <FormControl fullWidth className={classes.formControl}>
                        <UtilSelector multiple
                                      connector={(q, r) => outcomeListGet(q, r)}
                                      render={outcomeRender}
                                      readOnly={!this.props.edit}
                                      value={this.state.outcomes}
                                      onChange={(value) => this.setState({outcomes: value})}
                                      label="关联成果"/>
                    </FormControl>
                </FormGroup>
            </>
        );
    }
}

ThesisAddDetail.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles(theme))(withTheme(ThesisAddDetail));