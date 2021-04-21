import React, { useState, useEffect } from 'react';
import {journalListGet} from "./utils/connector";
import {
    CircularProgress,
    Collapse,
    Fab,
    IconButton,
    InputBase,
    makeStyles,
    Paper,
    Snackbar,
    Zoom
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from '@material-ui/icons/Add';
import JournalResult from "./journalResult";
import {Alert} from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
    searchRoot: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        marginBottom: theme.spacing(1),
    },
    searchInput: {
        margin: theme.spacing(1),
        flex: 1,
    },
    searchButton: {
        marginLeft: theme.spacing(1),
        padding: 10
    },
    fab: {
        position: 'fixed',
        top: 'auto',
        bottom: theme.spacing(3),
        left: 'auto',
        right: theme.spacing(3),
    },
    loading: {
        marginTop: theme.spacing(1),
        position: 'absolute',
        top: '50%',
        left: '50%',
    }
}));


export default function JournalFrag(props) {
    const classes = useStyles();
    const [query, setQuery] = useState('');
    const [datalist, setData] = useState([]);
    const [newJournal, setNewJournal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successSnackOpen, setSuccessSnackOpen] = useState(false);
    const [errorSnackOpen, setErrorSnackOpen] = useState(false);

    const uniqid = require('uniqid')

    useEffect(() => {
        setLoading(true);
        journalListGet('', (r) => {
            setData(r)
            setLoading(false)
        })
    }, [])

    const handleSubmit = () => {
        journalListGet(query, (r) => {
            setData(r)
            setLoading(false)
        })
    }

    const handleNew = () => {
        const newDatalist = [...datalist]
        newDatalist.unshift({})
        setData(newDatalist)
    }

    const handleCloseNone = () => {
        const newDatalist = [...datalist]
        newDatalist.shift()
        setData(newDatalist)
    }

    const handleSnackbar = (state) => {
        if(state){
            setSuccessSnackOpen(true)
        }else{
            setErrorSnackOpen(true)
        }
    }

    return (
        <>
            <Paper className={classes.searchRoot}>
                <InputBase
                    className={classes.searchInput}
                    onChange={(event) => {
                        setQuery(event.target.value)
                    }}
                    id="search_query"
                    placeholder="期刊搜索"
                />
                <IconButton type="submit" className={classes.searchButton} onClick={handleSubmit}>
                    <SearchIcon/>
                </IconButton>
            </Paper>
            {loading && <CircularProgress className={classes.loading}/>}
            <Collapse in={!loading} >
                <div>{datalist.map((item) => <JournalResult data={item}
                                                            closeNone={handleCloseNone}
                                                            onSnackbar={handleSnackbar}
                                                            key={uniqid()}/>)}</div>
            </Collapse>
            <Zoom in={!newJournal}>
                <Fab className={classes.fab} color="primary"
                     onClick={handleNew}>
                    <AddIcon/>
                </Fab>
            </Zoom>
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
