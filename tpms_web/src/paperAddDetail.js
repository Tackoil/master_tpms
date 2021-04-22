import React from "react";
import PropTypes from "prop-types";
import {withStyles, withTheme} from "@material-ui/styles";
import {theme} from "./defaultTheme";
import {
    Checkbox,
    Divider, FormControlLabel,
    FormGroup, FormLabel,
    InputLabel, MenuItem, Select,
    TextField
} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import UtilSelector from "./utils/utilSelector";
import {
    authorListGet,
    authorRender,
    journalListGet,
    journalRender, keywordBuilder,
    keywordListGet,
    keywordRender, outcomeListGet, outcomeRender, projectListGet, projectRender, topicBuilder, topicListGet, topicRender
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

class PaperAddDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: null,
            pk: '',
            state: {pk: 'published', name: '已发布'},
            withInduc: false,
            withGov: false,
            withInt: false,
            withInterd: false,
            mentor: null,
            authors: [],
            comAuthors: [],
            journal: null,
            keywords: [],
            topics: [],
            projects: [],
            outcomes: [],
        };
    }

    componentDidMount() {
        if(!this.props.edit && this.props.data !== undefined){
            let data = this.props.data;
            this.setState({date: data.date});
            this.setState({mentor: data.mentor});
            this.setState({authors: data.authors});
            this.setState({comAuthors: data.comAuthors});
            this.setState({journal: data.journal});
            this.setState({pk: data.pk});
            this.setState({keywords: data.keywords});
            this.setState({topics: data.topics});
            this.setState({withInduc: data.with.withInduc});
            this.setState({withGov: data.with.withGov});
            this.setState({withInt: data.with.withInt});
            this.setState({withInterd: data.with.withInterd});
            this.setState({projects: data.projects});
            this.setState({outcomes: data.outcomes});
        }
    }

    getAllData = () => {
        return {
            error: false,
            date: this.state.date,
            mentor: this.state.mentor,
            authors: this.state.authors,
            journal: this.state.journal,
            pk: this.state.pk,
            state: this.state.state,
            keywords: this.state.keywords,
            topics: this.state.topics,
            withInduc: this.state.withInduc,
            withGov: this.state.withGov,
            withInt: this.state.withInt,
            withInterd: this.state.withInterd,
            projects: this.state.projects,
            outcomes: this.state.outcomes,
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
                    <FormControl className={classes.formControl}>
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
                    <FormControl className={classes.formControl}>
                        <UtilSelector connector={(q, r) => authorListGet(q, 'men', r)}
                                      render={authorRender}
                                      readOnly={!this.props.edit}
                                      value={this.state.mentor}
                                      onChange={(value) => this.setState({mentor: value})}
                                      label="指导老师"/>
                    </FormControl>
                </FormGroup>
                <FormGroup row className={classes.formGroup}>
                    <FormControl className={classes.formControl}>
                        <UtilSelector multiple connector={(q, r) => authorListGet(q, 'all', r)}
                                      render={authorRender}
                                      readOnly={!this.props.edit}
                                      value={this.state.authors}
                                      onChange={(value) => this.setState({authors: value})}
                                      label="作者"/>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <UtilSelector multiple connector={(q, r) => authorListGet(q, 'all', r)}
                                      render={authorRender}
                                      readOnly={!this.props.edit}
                                      value={this.state.comAuthors}
                                      onChange={(value) => this.setState({comAuthors: value})}
                                      label="通信作者"/>
                    </FormControl>
                </FormGroup>
                <FormGroup row className={classes.formGroup}>
                    <FormControl className={classes.formControl}>
                        <UtilSelector connector={(q, r) => journalListGet(q, r)}
                                      render={journalRender}
                                      readOnly={!this.props.edit}
                                      value={this.state.journal}
                                      onChange={(value) => this.setState({journal: value})}
                                      label="发表期刊"/>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <TextField required variant="outlined" label="论文编号" id="paper_id" value={this.state.pk} onChange={(event) =>
                            this.setState({pk: event.target.value})
                        }
                        InputProps={{readOnly: !this.props.edit}}/>
                    </FormControl>
                    <FormControl className={classes.formControlFix}>
                        <UtilSelector connector={(q, r) => r([{pk: 'published', name: '已发布'}])}
                                      render={item => item.name}
                                      readOnly={true}
                                      value={this.state.state}
                                      onChange={(value) => this.setState({state: {pk: 'published', name: '已发布'}})}
                                      label="收录状态"/>
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
                                      onChange={(value) => {
                                          this.setState({keywords: value})
                                      }}
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

PaperAddDetail.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles(theme))(withTheme(PaperAddDetail));