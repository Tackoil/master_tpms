import React from "react";
import PropTypes from "prop-types";
import {withStyles, withTheme} from "@material-ui/styles";
import {theme} from "./defaultTheme";
import {getJournalList} from "./utils/connector";
import {
    Button,
    Card,
    Chip,
    Collapse, Divider,
    Fab,
    FormGroup,
    IconButton,
    InputBase,
    Paper, Select, TextField,
    Typography, useFormControl,
    Zoom
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {green, blue, grey, red, yellow} from "@material-ui/core/colors";
import SearchFrag from "./searchFrag";
import JournalFrag from "./journalFrag";
import EditIcon from "@material-ui/icons/Edit";
import FormControl from "@material-ui/core/FormControl";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import clsx from "clsx";
import MultiSelector from "./utils/multiSelector";

const styles = theme => ({
    cardRoot: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(1),
    },
    oneLine: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    myIcon: {
        marginRight: theme.spacing(1),
    },
    title: {
        flexGrow: 1,
    },
    intro: {
        textIndent: '2em',
    },
    keywordTitle: {
        fontWeight: 'bold',
    },
    detailTitle: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    detailAppBar: {
        position: 'relative',
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
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

const callStateDict = {
    1: {label: '征稿中', color: blue},
    2: {label: '已截止', color: red},
    3: {label: '已发布', color: green},
}

class JournalResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            callState: 0,
            dlDate: null,
            infoDate: null,
            name: '',
            ename: '',
            short_name: '',
            type: {
                ccf: '',
                core: '',
                qualis: '',
            },
            open: false,
            edit: false,
        };
        this.uniqid = require('uniqid');
        if(this.props.new){
            this.state.open = true;
            this.state.edit = true;
        }else if (this.props.data !== undefined) {
            if (this.props.data.deadline !== undefined && this.props.data.info !== undefined) {
                this.state.dlDate = new Date(this.props.data.deadline);
                this.state.infoDate = new Date(this.props.data.info);
            }
            this.state.name = this.props.data.name !== undefined ? this.props.data.name : '';
            this.state.ename = this.props.data.ename !== undefined ? this.props.data.ename : '';
            this.state.short_name = this.props.data.short_name !== undefined ? this.props.data.short_name : '';
            if(this.props.data.type !== undefined){
                this.state.type.ccf = this.props.data.type.ccf !== undefined ? this.props.data.type.ccf : '';
                this.state.type.core = this.props.data.type.core !== undefined ? this.props.data.type.core : '';
                this.state.type.qualis = this.props.data.type.qualis !== undefined ? this.props.data.type.qualis : '';
            }
        }
    }

    componentDidMount() {
        this.updateCallState()
    }

    updateCallState = () => {
        if (this.state.dlDate !== null && this.state.infoDate !== null) {
            let now = new Date();
            if (now <= this.state.dlDate) {
                this.setState({callState: 1});
            } else if (now < this.state.infoDate) {
                this.setState({callState: 2});
            } else {
                this.setState({callState: 3});
            }
        } else {
            this.setState({callState: 0});
        }
    }

    tempState = {}

    handleEdit = () => {
        if (this.state.edit) {
            console.info("Save")
            this.updateCallState()
            this.props.refresh()
        } else {
            this.tempState.dlDate = this.state.dlDate;
            this.tempState.infoDate = this.state.infoDate;
        }
        this.setState({edit: !this.state.edit});
    }

    handleCancel = () => {
        this.setState({dlDate: this.tempState.dlDate === undefined ? null : this.tempState.dlDate});
        this.setState({infoDate: this.tempState.infoDate === undefined ? null : this.tempState.infoDate});
        this.setState({edit: false});
        this.props.refresh();
    }

    handleOpen = () => {
        if (this.state.edit && this.state.open) {
            this.handleCancel()
        }
        this.setState({open: !this.state.open})
    }

    render() {
        const {classes} = this.props;
        return (
            <>
                <Card className={classes.cardRoot}>
                    <div className={classes.oneLine}>
                        <Typography className={classes.myIcon} variant="h5" noWrap>
                            {this.state.name === '' ? this.state.ename : this.state.name}
                            {this.state.short_name !== '' && `(${this.state.short_name})`}
                        </Typography>
                        {this.state.name !== '' &&
                        <Typography className={classes.myIcon} variant='overline'>{this.state.ename}</Typography>}
                        {this.state.callState !== 0 && <Chip label={callStateDict[this.state.callState].label}
                                                             variant='outlined'
                                                             style={{
                                                                 backgroundColor: callStateDict[this.state.callState].color[400],
                                                                 color: "white"
                                                             }}/>}
                        <IconButton className={clsx(classes.expand, {[classes.expandOpen]: this.state.open,})}
                                    onClick={this.handleOpen}>
                            <ExpandMoreIcon/>
                        </IconButton>
                    </div>
                    {(this.state.type.ccf !== '' && this.state.type.core !== '' && this.state.type.qualis !== '')&&
                    <div className={classes.oneLine}>
                        <Typography className={classes.keywordTitle}>评级：</Typography>
                        {this.state.type.ccf !== '' &&
                        <Chip className={classes.myIcon}
                              label={`CCF: ${this.state.type.ccf}`}/>}
                        {this.state.type.core !== '' &&
                        <Chip className={classes.myIcon}
                              label={`CORE: ${this.state.type.core}`}/>}
                        {this.state.type.qualis !== '' &&
                        <Chip className={classes.myIcon}
                              label={`QUALIS: ${this.state.type.qualis}`}/>}
                    </div>
                    }
                    <Collapse in={this.state.open}>
                        <Divider />
                        <FormGroup row className={classes.formGroup}>
                            <FormControl fullWidth className={classes.formControl}>
                                <TextField value={this.state.ename}
                                           label='英文名称'
                                           InputProps={{readOnly: !this.state.edit}}
                                           onChange={(event) => {
                                    this.setState({ename: event.target.value})
                                }}/>
                            </FormControl>
                        </FormGroup>
                        <FormGroup row className={classes.formGroup}>
                            <FormControl className={classes.formControl}>
                                <TextField value={this.state.name}
                                           label='中文名称'
                                           InputProps={{readOnly: !this.state.edit}}
                                           onChange={(event) => {
                                               this.setState({name: event.target.value})
                                           }}/>
                            </FormControl>
                            <FormControl className={classes.formControl} >
                                <TextField value={this.state.short_name}
                                           label='简称'
                                           InputProps={{readOnly: !this.state.edit}}
                                           onChange={(event) => {
                                               this.setState({short_name: event.target.value})
                                           }}/>
                            </FormControl>
                        </FormGroup>
                        <FormGroup row className={classes.formGroup}>
                            <FormControl className={classes.formControlFix}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <DatePicker autoOk clearable
                                                readOnly={!this.state.edit}
                                                size='medium' variant="dialog"
                                                label="截稿日期" format="yyyy/MM/dd"
                                                value={this.state.dlDate}
                                                onChange={(date) => {
                                                    this.setState({dlDate: date})
                                                }}
                                    />
                                </MuiPickersUtilsProvider>
                            </FormControl>
                            <FormControl className={classes.formControlFix}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <DatePicker autoOk clearable
                                                readOnly={!this.state.edit}
                                                size='medium' variant="dialog"
                                                label="通知日期" format="yyyy/MM/dd"
                                                value={this.state.infoDate}
                                                onChange={(date) => {
                                                    this.setState({infoDate: date})
                                                }}
                                    />
                                </MuiPickersUtilsProvider>
                            </FormControl>
                        </FormGroup>
                        <Button onClick={this.handleEdit} color='primary'>{this.state.edit ? '保存' : '编辑'}</Button>
                        {this.state.edit && <Button onClick={this.handleCancel}> 取消 </Button>}
                    </Collapse>
                </Card>
            </>
        );
    }
}

JournalResult.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles(theme))(withTheme(JournalResult));