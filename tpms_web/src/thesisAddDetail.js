import React from "react";
import PropTypes from "prop-types";
import {withStyles, withTheme} from "@material-ui/styles";
import {theme} from "./defaultTheme";
import {
    Divider,
    FormGroup, FormLabel, IconButton,
    InputAdornment,
    TextField
} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import OneSelector from "./utils/oneSelector";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import MultiSelector from "./utils/multiSelector";
import RefreshIcon from "@material-ui/icons/Refresh";
import {isfloat} from "./utils/eval";

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
            thesis_id: '',
            rate: '',
            rateError: false,
        };
        this.mentorSelector = React.createRef();
        this.studentSelector = React.createRef();
        this.typeSelector = React.createRef();
        this.keywordSelector = React.createRef();
        this.topicSelector = React.createRef();
        this.projectSelector = React.createRef();
        this.outcomeSelector = React.createRef();
    }

    componentDidMount() {
        if(!this.props.edit && this.props.data !== undefined){
            let data = this.props.data;
            this.setState({data: data.date});
            this.mentorSelector.current.setValue(data.mentor);
            this.studentSelector.current.setValue(data.author[0]);
            this.typeSelector.current.setValue(data.type);
            this.setState({thesis_id: data.uid});
            this.setState({rate: data.rate});
            this.keywordSelector.current.setValue(data.keyword);
            this.topicSelector.current.setValue(data.topic);
            this.projectSelector.current.setValue(data.project);
            this.outcomeSelector.current.setValue(data.outcome);
        }
    }

    getAllData = () => {
        return {
            error: this.state.rateError,
            date: this.state.date,
            mentor: this.mentorSelector.current.getValue(),
            student: this.studentSelector.current.getValue(),
            type: this.typeSelector.current.getValue(),
            thesis_id: this.state.thesis_id,
            rate: this.state.rate,
            keyword: this.keywordSelector.current.getValue(),
            topic: this.topicSelector.current.getValue(),
            project: this.projectSelector.current.getValue(),
            outcome: this.outcomeSelector.current.getValue(),
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
                        <OneSelector ref={this.mentorSelector} readOnly={!this.props.edit} label="指导老师" labelId="mentor_label" query="mentor"/>
                    </FormControl>
                    <FormControl className={classes.formControlFix}>
                        <OneSelector ref={this.studentSelector} readOnly={!this.props.edit} label="作者" labelId="student_label" query="student"/>
                    </FormControl>
                </FormGroup>
                <FormGroup row className={classes.formGroup}>
                    <FormControl className={classes.formControlFix}>
                        <OneSelector ref={this.typeSelector} readOnly={!this.props.edit} label="论文类型" labelId="type_label" query="type"/>
                    </FormControl>
                    <FormControl className={classes.formControlFix}>
                        <TextField required label="论文编号" id="thesis_id" value={this.state.thesis_id}
                                   onChange={event => this.setState({thesis_id: event.target.value})}
                                   InputProps={{readOnly: !this.props.edit}}
                        />
                    </FormControl>
                    <FormControl className={classes.formControlFix}>
                        <TextField label="重复率" id="rate" value={this.state.rate}
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
                        <MultiSelector ref={this.keywordSelector} readOnly={!this.props.edit} allowNew label="关键词" labelId="keyword"
                                       query="keyword"/>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <MultiSelector ref={this.topicSelector} readOnly={!this.props.edit} allowNew label="研究方向" labelId="topic" query="topic"/>
                    </FormControl>
                </FormGroup>
                <FormGroup row className={classes.formGroup}>
                    <FormControl fullWidth className={classes.formControl}>
                        <MultiSelector ref={this.projectSelector} readOnly={!this.props.edit} label="关联项目" labelId="project" query="project"/>
                    </FormControl>
                </FormGroup>
                <FormGroup row className={classes.formGroup}>
                    <FormControl fullWidth className={classes.formControl}>
                        <MultiSelector ref={this.outcomeSelector} readOnly={!this.props.edit} label="关联成果" labelId="outcome" query="outcome"/>
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