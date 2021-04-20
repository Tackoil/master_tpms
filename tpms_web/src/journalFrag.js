import React, { useState, useEffect } from 'react';
import {journalListGet} from "./utils/connector";
import {Fab, IconButton, InputBase, makeStyles, Paper, Zoom} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from '@material-ui/icons/Add';
import JournalResult from "./journalResult";

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
}));


export default function JournalFrag(props) {
    const classes = useStyles();
    const [query, setQuery] = useState('');
    const [datalist, setData] = useState([]);
    const [newJournal, setNewJournal] = useState(false);

    const uniqid = require('uniqid')

    useEffect(() => {
        journalListGet('', (r) => setData(r))
    }, [props])

    const handleSubmit = () => {
        journalListGet(query, (r) => setData(r))
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
            <div>{datalist.map((item) => <JournalResult data={item}
                                                        closeNone={handleCloseNone}
                                                    key={uniqid()}/>)}</div>
            <Zoom in={!newJournal}>
                <Fab className={classes.fab} color="primary"
                     onClick={handleNew}>
                    <AddIcon/>
                </Fab>
            </Zoom>
        </>
    );
}
