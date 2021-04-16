import React from "react";
import PropTypes from "prop-types";
import {withStyles, withTheme} from "@material-ui/styles";
import {theme} from "./defaultTheme";
import {getJournalList} from "./utils/connector";
import {Collapse, Fab, IconButton, InputBase, Paper, Slide, Zoom} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from '@material-ui/icons/Add';
import JournalResult from "./journalResult";

const styles = theme => ({
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
})

class JournalFrag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            data: [],
            newJournal: false,
        };
        this.uniqid = require('uniqid');
        this.state.data = getJournalList();
    }

    refresh = () => {
        this.setState({newJournal: false})
        this.setState({data: getJournalList()})
    }

    render() {
        const {classes} = this.props;
        return (
            <>
                <Paper className={classes.searchRoot}>
                    <InputBase
                        className={classes.searchInput}
                        onChange={(event) => {
                            this.setState({query: event.target.value})
                        }}
                        type="search"
                        id="search_query"
                        placeholder="期刊搜索"
                    />
                    <IconButton type="submit" className={classes.searchButton}
                                onClick={this.handleSubmit}>
                        <SearchIcon/>
                    </IconButton>
                </Paper>
                <Collapse in={this.state.newJournal} >
                    <JournalResult key={this.uniqid()} new refresh={this.refresh}/>
                </Collapse>
                <div>{this.state.data.map((item) => <JournalResult key={this.uniqid()} data={item} refresh={this.refresh}/>)}</div>
                <Zoom in={!this.state.dialog}>
                    <Fab className={classes.fab} color="primary"
                         onClick={() => this.setState({newJournal: true})}>
                        <AddIcon/>
                    </Fab>
                </Zoom>
            </>
        );
    }
}

JournalFrag.propTypes = {
    classes: PropTypes.object.isRequired
,
}

;

export default withStyles(styles(theme))(withTheme(JournalFrag));