import React from "react";
import PropTypes from "prop-types";
import {withStyles, withTheme} from "@material-ui/styles";
import {theme} from "./defaultTheme";
import FormControl from "@material-ui/core/FormControl"
import {
    Button,
    FormGroup, IconButton,
    Snackbar, TextField
} from "@material-ui/core";
import {MuiPickersUtilsProvider, DatePicker} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import {Autocomplete} from "@material-ui/lab";
import RefreshIcon from '@material-ui/icons/Refresh';
import CloseIcon from '@material-ui/icons/Close';
import OneSelector from "./utils/oneSelector";
import MultiSelector from "./utils/multiSelector";

const styles = theme => ({
    adSearchRoot: {
        marginBottom: theme.spacing(2),
    },
    formRow: {
        whiteSpace: 'nowrap',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    formControlFix: {
        margin: theme.spacing(1),
        width: 120,
    },
    resetButton: {
        marginLeft: theme.spacing(1),
        padding: 10
    },
})

class AdvanceSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            thesisOrPaper: [],
            dateUsage: false,
            startDate: null,
            endDate: null,
            selectedStudents: [],
            selectedTopics: [],
            selectedKeywords: [],
            snackOpen: false
        };
        this.mentorSelector = React.createRef();
        this.firstAuthorSelector = React.createRef();
        this.comAuthorSelector = React.createRef();
        this.studentSelector = React.createRef();
        this.topicSelector = React.createRef();
        this.keywordSelector = React.createRef();
    }

    thesisOrPaperOptions = [
        {stateKey: "paper", title: "期刊论文"},
        {stateKey: "thesis", title: "毕业论文"},
    ]

    tempState = null

    resetForm = () => {
        this.tempState = this.state
        this.tempState.mentor = this.mentorSelector.current.getValue()
        this.tempState.firstAuthor = this.firstAuthorSelector.current.getValue()
        this.tempState.comAuthor = this.comAuthorSelector.current.getValue()
        this.tempState.students = this.studentSelector.current.getValue()
        this.tempState.topics = this.topicSelector.current.getValue()
        this.tempState.keywords = this.keywordSelector.current.getValue()
        this.setState({thesisOrPaper: []})
        this.setState({startDate: null})
        this.setState({endDate: null})
        this.mentorSelector.current.resetValue()
        this.firstAuthorSelector.current.resetValue()
        this.comAuthorSelector.current.resetValue()
        this.studentSelector.current.resetValue()
        this.topicSelector.current.resetValue()
        this.keywordSelector.current.resetValue()
        this.setState({snackOpen: true})
    }

    handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({snackOpen: false});
    };

    handleRevert = () => {
        if(this.tempState != null){
            this.setState({thesisOrPaper: this.tempState.thesisOrPaper})
            this.setState({startDate: this.tempState.startDate})
            this.setState({endDate: this.tempState.endDate})
            this.mentorSelector.current.setValue(this.tempState.mentor)
            this.firstAuthorSelector.current.setValue(this.tempState.firstAuthor)
            this.comAuthorSelector.current.setValue(this.tempState.comAuthor)
            this.studentSelector.current.setValue(this.tempState.students)
            this.topicSelector.current.setValue(this.tempState.topics)
            this.keywordSelector.current.setValue(this.tempState.keywords)
            this.setState({snackOpen: false})
        }
    }

    getAdvanceValue = () => {
        return {
            thesisOrPaper: this.state.thesisOrPaper,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            mentor: this.mentorSelector.current.getValue(),
            firstAuthor: this.firstAuthorSelector.current.getValue(),
            comAuthor: this.comAuthorSelector.current.getValue(),
            students: this.studentSelector.current.getValue(),
            topics: this.topicSelector.current.getValue(),
            keywords: this.keywordSelector.current.getValue()
        }
    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.adSearchRoot}>
                <FormGroup row>
                    <FormControl className={classes.formControl}>
                        <Autocomplete
                            multiple filterSelectedOptions disableCloseOnSelect
                            id="thesisOrPaper"
                            options={this.thesisOrPaperOptions}
                            noOptionsText="无"
                            getOptionLabel={(option) => option.title}
                            value={this.state.thesisOrPaper}
                            onChange={(event, newValue) => {
                                this.setState({thesisOrPaper: newValue})
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    label="论文类型"
                                />
                            )}
                        />
                    </FormControl>
                    <FormControl className={classes.formControlFix}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker disableFuture autoOk clearable
                                        size='medium' variant="dialog"
                                        label="起始时间" format="yyyy/MM/dd"
                                        value={this.state.startDate}
                                        onChange={(date) => {
                                            this.setState({startDate: date})
                                        }}
                            />
                        </MuiPickersUtilsProvider>
                    </FormControl>
                    <FormControl className={classes.formControlFix}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker disableFuture autoOk clearable
                                        size='medium' variant="dialog"
                                        label="截止时间" format="yyyy/MM/dd"
                                        minDateMessage="应大于起始时间"
                                        minDate={this.state.startDate}
                                        value={this.state.endDate}
                                        onChange={(date) => {
                                            this.setState({endDate: date})
                                        }}
                            />
                        </MuiPickersUtilsProvider>
                    </FormControl>
                </FormGroup>
                <FormGroup row>
                    <FormControl className={classes.formControlFix}>
                        <OneSelector ref={this.mentorSelector} label="导师" labelId="mentor_label" query="mentor"/>
                    </FormControl>
                    <FormControl className={classes.formControlFix}>
                        <OneSelector ref={this.firstAuthorSelector} label="第一作者" labelId="first_author_label" query="first_author"/>
                    </FormControl>
                    <FormControl className={classes.formControlFix}>
                        <OneSelector ref={this.comAuthorSelector} label="通信作者" labelId="com_author_label" query="com_author"/>
                    </FormControl>
                </FormGroup>
                <FormGroup row>
                    <FormControl className={classes.formControl}>
                        <MultiSelector ref={this.studentSelector} label="学生" labelId='students' query='students' />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <MultiSelector ref={this.topicSelector} label="研究方向" labelId="topic" query="topic"/>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <MultiSelector ref={this.keywordSelector} label="关键字" labelId="keyword" query="keyword" />
                    </FormControl>
                    <IconButton type="reset" className={classes.resetButton} onClick={this.resetForm}>
                        <RefreshIcon />
                    </IconButton>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        open={this.state.snackOpen}
                        autoHideDuration={6000}
                        onClose={this.handleSnackClose}
                        message="已重置筛选条件"
                        action={
                            <React.Fragment>
                                <Button color="secondary" size="small" onClick={this.handleRevert}>
                                    恢复
                                </Button>
                                <IconButton size="small" aria-label="close" color="inherit"
                                            onClick={this.handleSnackClose}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </React.Fragment>
                        }
                    />
                </FormGroup>
            </div>
        );
    }
}

AdvanceSearch.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles(theme))(withTheme(AdvanceSearch));