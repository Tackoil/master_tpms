import React, {useEffect, useState} from "react";
import {
    Button,
    Card,
    Chip,
    Collapse, Divider,
    FormGroup,
    IconButton, makeStyles, Snackbar,
    TextField,
    Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {green, blue, red} from "@material-ui/core/colors";
import FormControl from "@material-ui/core/FormControl";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import clsx from "clsx";
import {journalSave} from "./utils/connector";
import CloseIcon from "@material-ui/icons/Close";
import {Alert} from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
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
}));

const callStateDict = {
    1: {label: '征稿中', color: blue},
    2: {label: '已截止', color: red},
    3: {label: '已发布', color: green},
}

export default function JournalResult(props) {
    const {data, closeNone} = props;
    const classes = useStyles();
    const [callState, setCallState] = useState(0);
    const [deadline, setDeadline] = useState(null);
    const [publish, setPublish] = useState(null);
    const [name, setName] = useState('');
    const [ename, setEname] = useState('');
    const [shortname, setShortname] = useState('');
    const [type, setType] = useState([]);
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [error, setError] = useState(false);
    const [successSnackOpen, setSuccessSnackOpen] = useState(false);
    const [errorSnackOpen, setErrorSnackOpen] = useState(false);
    const [tempState, setTempState] = useState({});

    const typeSelector = React.createRef();
    const uniqid = require('uniqid');

    useEffect(() => {
        if(Object.keys(data).length === 0){
            setOpen(true);
            setEdit(true);
        }else{
            setDeadline(data.deadline === null ? null : new Date(data.deadline));
            setPublish(data.publish === null ? null : new Date(data.publish));
            setName(data.name === null ? '' : data.name);
            setEname(data.ename === null ? '' : data.ename);
            setShortname(data.shortname === null ? '' : data.shortname);
        }
    }, [data])

    useEffect(() => {
        if (deadline !== null && publish !== null) {
            let now = new Date();
            if (now <= deadline) {
                setCallState(1)
            } else if (now < publish) {
                setCallState(2)
            } else {
                setCallState(3)
            }
        } else {
            setCallState(0)
        }
    }, [deadline, publish])

    useEffect(() => {
        if(name === '' && ename === ''){
            setError(true)
        }
        else{
            setError(false)
        }
    }, [name, ename])

    const handleEdit = () => {
        console.info('handleEdit')
        setTempState({
            deadline: deadline,
            publish: publish
        })
        setEdit(true)
    }

    const handleSave = () => {
        if(!error){
            journalSave({
                uid: data.uid === undefined ? undefined : data.uid,
                deadline: deadline === null ? undefined : deadline.getTime(),
                publish: publish === null ? undefined : publish.getTime(),
                name: name === '' ? undefined : name,
                ename: ename === '' ? undefined : ename,
                shortname: shortname === '' ? undefined : shortname,
            }, () => {
                setEdit(false)
                setOpen(false)
                setSuccessSnackOpen(true)
            }, () => setErrorSnackOpen(true))
        }
    }

    const handleCancel = () => {
        if(Object.keys(data).length === 0){
            closeNone()
        }
        setDeadline(tempState.deadline === undefined ? null : tempState.deadline);
        setPublish(tempState.publish === undefined ? null : tempState.publish);
        setEdit(false);
    }

    const handleOpen = () => {
        if (edit && open) {
            handleCancel()
        }
        setOpen(!open)
    }

    return (
        <>
            <Card className={classes.cardRoot}>
                <div className={classes.oneLine}>
                    <Typography className={classes.myIcon} variant="h5" noWrap>
                        {name === '' ? ename : name}
                        {shortname !== '' && `(${shortname})`}
                    </Typography>
                    {name !== '' &&
                        <Typography className={classes.myIcon} variant='overline'>{ename}</Typography>}
                    {callState !== 0 &&
                        <Chip label={callStateDict[callState].label}
                              variant='outlined'
                              style={{
                                  backgroundColor: callStateDict[callState].color[400],
                                  color: "white"
                              }}/>}
                    <IconButton className={clsx(classes.expand, {[classes.expandOpen]: open,})}
                                onClick={() => handleOpen()}>
                        <ExpandMoreIcon/>
                    </IconButton>
                </div>
{/*                {this.state.type.length !== 0 &&
                <div className={classes.oneLine}>
                    <Typography className={classes.keywordTitle}>评级：</Typography>
                    {this.state.type.map((item) =>
                        <Chip className={classes.myIcon} key={this.uniqid()}
                              label={item.name}/>
                    )}
                </div>
                }*/}
                <Collapse in={open}>
                    <Divider/>
                    <FormGroup row className={classes.formGroup}>
                        <FormControl fullWidth className={classes.formControl}>
                            <TextField value={ename}
                                       label='英文名称'
                                       InputProps={{readOnly: !edit}}
                                       helperText={error ? '英文名称与中文名称至少填写其中一个' : ''}
                                       error={error}
                                       onChange={(event) => {
                                           setEname(event.target.value)
                                       }}/>
                        </FormControl>
                    </FormGroup>
                    <FormGroup row className={classes.formGroup}>
                        <FormControl className={classes.formControl}>
                            <TextField value={name}
                                       label='中文名称'
                                       helperText={error ? '英文名称与中文名称至少填写其中一个' : ''}
                                       error={error}
                                       InputProps={{readOnly: !edit}}
                                       onChange={(event) => {
                                           setName(event.target.value)
                                       }}/>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <TextField value={shortname}
                                       label='简称'
                                       InputProps={{readOnly: !edit}}
                                       onChange={(event) => {
                                           setShortname(event.target.value)
                                       }}/>
                        </FormControl>
                    </FormGroup>
                    <FormGroup row className={classes.formGroup}>
                        <FormControl className={classes.formControlFix}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DatePicker autoOk clearable
                                            readOnly={!edit}
                                            size='medium' variant="dialog"
                                            label="截稿日期" format="yyyy/MM/dd"
                                            value={deadline}
                                            onChange={(date) => {
                                                setDeadline(date)
                                            }}
                                />
                            </MuiPickersUtilsProvider>
                        </FormControl>
                        <FormControl className={classes.formControlFix}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DatePicker autoOk clearable
                                            readOnly={!edit}
                                            size='medium' variant="dialog"
                                            label="通知日期" format="yyyy/MM/dd"
                                            value={publish}
                                            onChange={(date) => {
                                                setPublish(date)
                                            }}
                                />
                            </MuiPickersUtilsProvider>
                        </FormControl>
                    </FormGroup>
{/*                    <FormGroup row className={classes.formGroup}>
                        <FormControl className={classes.formControl}>
                            <MultiSelector ref={typeSelector} allowNew noSuggest readOnly={!edit}
                                           rule={isDual}
                                           label="评级"/>
                        </FormControl>
                    </FormGroup>*/}
                    {edit ?
                        <Button onClick={handleSave} disabled={error} color='primary'> 保存 </Button> :
                        <Button onClick={handleEdit} color='primary'> 编辑 </Button>
                    }
                    {edit && <Button onClick={handleCancel}> 取消 </Button>}
                </Collapse>
            </Card>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={successSnackOpen}
                autoHideDuration={6000}
                onClose={() => setSuccessSnackOpen(false)}
            >
                <Alert onClose={() => setSuccessSnackOpen(false)} severity="success">
                    已保存
                </Alert>
            </Snackbar>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={errorSnackOpen}
                autoHideDuration={6000}
                onClose={() => setErrorSnackOpen(false)}
            >
                <Alert onClose={() => setErrorSnackOpen(false)} severity="error">
                    保存失败，请检查网络设置
                </Alert>
            </Snackbar>
        </>
    );
}