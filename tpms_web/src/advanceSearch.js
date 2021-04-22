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
import UtilSelector from "./utils/utilSelector";
import {authorListGet, authorRender, keywordListGet, keywordRender, topicListGet, topicRender} from "./utils/connector";

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
            mentors: [],
            firstAuthor: [],
            comAuthor: [],
            students: [],
            topics: [],
            keywords: [],
            snackOpen: false
        };
    }

    thesisOrPaperOptions = [
        {stateKey: "paper", title: "期刊论文"},
        {stateKey: "thesis", title: "毕业论文"},
    ]

    tempState = null

    resetForm = () => {
        this.tempState = this.state
        this.tempState.mentor = this.state.mentors
        this.tempState.firstAuthor = this.state.firstAuthor
        this.tempState.comAuthor = this.state.comAuthor
        this.tempState.students = this.state.students
        this.tempState.topics = this.state.topics
        this.tempState.keywords = this.state.keywords
        this.setState({thesisOrPaper: []})
        this.setState({startDate: null})
        this.setState({endDate: null})
        this.setState({mentors: []})
        this.setState({firstAuthor: []})
        this.setState({comAuthor: []})
        this.setState({students: []})
        this.setState({topics: []})
        this.setState({keywords: []})
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
            this.setState({mentors: this.tempState.mentors})
            this.setState({firstAuthor: this.tempState.firstAuthor})
            this.setState({comAuthor: this.tempState.comAuthor})
            this.setState({students: this.tempState.students})
            this.setState({topics: this.tempState.topics})
            this.setState({keywords: this.tempState.keywords})
            this.setState({snackOpen: false})
        }
    }

    getAdvanceValue = () => {
        return {
            thesisOrPaper: this.state.thesisOrPaper,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            mentors: this.state.mentors,
            firstAuthor: this.state.firstAuthor,
            comAuthor: this.state.comAuthor,
            students: this.state.students,
            topics: this.state.topics,
            keywords: this.keywords,
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
                                    variant="outlined"
                                    label="论文类型"
                                />
                            )}
                        />
                    </FormControl>
                    <FormControl className={classes.formControlFix}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker disableFuture autoOk clearable
                                        inputVariant="outlined"
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
                                        inputVariant="outlined"
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
                    <FormControl className={classes.formControl}>
                        <UtilSelector multiple connector={(q, r) => authorListGet(q, 'men', r)}
                                      render={authorRender}
                                      value={this.state.mentors}
                                      onChange={(value) => this.setState({mentors: value})}
                                      label="导师"/>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <UtilSelector multiple connector={(q, r) => authorListGet(q, 'fst', r)}
                                      render={authorRender}
                                      value={this.state.firstAuthor}
                                      onChange={(value) => this.setState({firstAuthor: value})}
                                      label="第一作者"/>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <UtilSelector multiple connector={(q, r) => authorListGet(q, 'com', r)}
                                      render={authorRender}
                                      value={this.state.comAuthor}
                                      onChange={(value) => this.setState({comAuthor: value})}
                                      label="通信作者"/>
                    </FormControl>
                </FormGroup>
                <FormGroup row>
                    <FormControl className={classes.formControl}>
                        <UtilSelector multiple connector={(q, r) => authorListGet(q, 'stu', r)}
                                      render={authorRender}
                                      value={this.state.students}
                                      onChange={(value) => this.setState({students: value})}
                                      label="学生"/>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <UtilSelector multiple connector={(q, r) => topicListGet(q, r)}
                                      render={topicRender}
                                      value={this.state.topics}
                                      onChange={(value) => this.setState({topics: value})}
                                      label="研究方向"/>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <UtilSelector multiple connector={(q, r) => keywordListGet(q, r)}
                                      render={keywordRender}
                                      value={this.state.keywords}
                                      onChange={(value) => this.setState({keywords: value})}
                                      label="关键字"/>
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