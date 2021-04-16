import React from "react";
import PropTypes from "prop-types";
import {withStyles, withTheme} from "@material-ui/styles";
import {theme} from "./defaultTheme";
import {Collapse, IconButton, InputBase, Paper} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import AdvanceSearch from "./advanceSearch";
import SearchResult from "./searchResult";
import {getQueryResult} from "./utils/connector";
import clsx from "clsx";

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
})

class SearchFrag extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            query: '',
            advanceOpen: false,
            resultData: [],
        };
        this.advanceSearch = React.createRef()
        this.uniqid = require('uniqid');
    }

    handleAdvanceOpen = () => {
        this.setState({advanceOpen: true})
    };

    handleAdvanceClose = () => {
        this.setState({advanceOpen: false})
    };

    handleSubmit = () => {
        let queryMap = {};
        if(this.state.advanceOpen){
            queryMap = this.advanceSearch.current.getAdvanceValue();
        }
        queryMap.query = this.state.query;
        this.setState({resultData: getQueryResult()});
    };

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Paper className={classes.searchRoot}>
                    <InputBase
                        className={classes.searchInput}
                        onChange={(event) => {
                            this.setState({query: event.target.value})
                        }}
                        type="search"
                        id="search_query"
                        placeholder="论文搜索"
                    />
                    <IconButton type="submit" className={classes.searchButton}
                                onClick={this.handleSubmit}>
                        <SearchIcon />
                    </IconButton>
                    <IconButton className={clsx(classes.expand, {
                        [classes.expandOpen]: this.state.advanceOpen,
                    })}
                                onClick={this.state.advanceOpen ? this.handleAdvanceClose : this.handleAdvanceOpen}>
                        <ExpandMoreIcon />
                    </IconButton>
                </Paper>
                <Collapse in={this.state.advanceOpen}>
                    <AdvanceSearch ref={this.advanceSearch}/>
                </Collapse>
                <div>
                    {this.state.resultData.map((item) => <SearchResult key={this.uniqid()} result={item} />)}
                </div>
            </div>
        );
    }
}

SearchFrag.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles(theme))(withTheme(SearchFrag));