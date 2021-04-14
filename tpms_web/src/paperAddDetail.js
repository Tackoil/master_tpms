import React from "react";
import PropTypes from "prop-types";
import {withStyles, withTheme} from "@material-ui/styles";
import {theme} from "./defaultTheme";
import {
    Checkbox,
    Divider, FormControlLabel,
    FormGroup, FormLabel, IconButton,
    InputAdornment, InputLabel, MenuItem, Select,
    TextField
} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import OneSelector from "./utils/oneSelector";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import MultiSelector from "./utils/multiSelector";
import RefreshIcon from "@material-ui/icons/Refresh";

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

class PaperAddDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: null,
            paper_id: '',
            state: 'published',
            withInduc: false,
            withGov: false,
            withInt: false,
            withInterd: false,
        };
        this.mentorSelector = React.createRef();
        this.authorSelector = React.createRef();
        this.comAuthorSelector = React.createRef();
        this.journalSelector = React.createRef();
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
            this.authorSelector.current.setValue(data.author);
            this.comAuthorSelector.current.setValue(data.comAuthor);
            this.journalSelector.current.setValue(data.journal);
            this.setState({paper_id: data.uid});
            this.keywordSelector.current.setValue(data.keyword);
            this.topicSelector.current.setValue(data.topic);
            this.setState({withInduc: data.with.withInduc});
            this.setState({withGov: data.with.withGov});
            this.setState({withInt: data.with.withInt});
            this.setState({withInterd: data.with.withInterd});
            this.projectSelector.current.setValue(data.project);
            this.outcomeSelector.current.setValue(data.outcome);
        }
    }

    getAllData = () => {

        return {
            error: false,
            date: this.state.date,
            mentor: this.mentorSelector.current.getValue(),
            author: this.authorSelector.current.getValue(),
            journal: this.journalSelector.current.getValue(),
            paper_id: this.state.paper_id,
            state: this.state.state,
            keyword: this.keywordSelector.current.getValue(),
            topic: this.topicSelector.current.getValue(),
            withInduc: this.state.withInduc,
            withGov: this.state.withGov,
            withInt: this.state.withInt,
            withInterd: this.state.withInterd,
            project: this.projectSelector.current.getValue(),
            outcome: this.outcomeSelector.current.getValue(),
        }
    }

    handleCheckChange = (event) => {
        this.setState({[event.target.name]: event.target.checked})
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
                    <FormControl className={classes.formControl}>
                        <MultiSelector ref={this.authorSelector} readOnly={!this.props.edit} label="作者" labelId="student_label" query="author"/>
                    </FormControl>
                    <FormControl className={classes.formControlFix}>
                        <OneSelector ref={this.comAuthorSelector} readOnly={!this.props.edit} label="通信作者" labelId="com_label" query="author"/>
                    </FormControl>
                </FormGroup>
                <FormGroup row className={classes.formGroup}>
                    <FormControl className={classes.formControlFix}>
                        <OneSelector ref={this.journalSelector} readOnly={!this.props.edit} label="发表期刊" labelId="journal" query="journal"/>
                    </FormControl>
                    <FormControl className={classes.formControlFix}>
                        <TextField required label="论文编号" id="paper_id" value={this.state.paper_id} onChange={(event) =>
                            this.setState({paper_id: event.target.value})
                        }
                        InputProps={{readOnly: !this.props.edit}}/>
                    </FormControl>
                    <FormControl className={classes.formControlFix}>
                        <InputLabel id="state-label">收录状态</InputLabel>
                        <Select id="state" disabled value={this.state.state} onChange={(event) =>
                            this.setState({state: event.target.value})}>
                            <MenuItem value={'published'}>已发布</MenuItem>
                        </Select>
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
                    <FormControl className={classes.formControl}>
                        <FormLabel>联合发表情况</FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox checked={this.state.withInduc} onChange={this.handleCheckChange}
                                                   disabled={!this.props.edit} name="withInduc"/>}
                                label="与行业联合发表"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={this.state.withGov} onChange={this.handleCheckChange}
                                                   disabled={!this.props.edit} name="withGov"/>}
                                label="与地方联合发表"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={this.state.withInt} onChange={this.handleCheckChange}
                                                   disabled={!this.props.edit} name="withInt"/>}
                                label="与国际联合发表"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={this.state.withInterd} onChange={this.handleCheckChange}
                                                   disabled={!this.props.edit} name="withInterd"/>}
                                label="跨学科论文"
                            />
                        </FormGroup>
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

PaperAddDetail.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles(theme))(withTheme(PaperAddDetail));