import React from "react";
import PropTypes from "prop-types";
import {withStyles, withTheme} from "@material-ui/styles";
import {theme} from "./defaultTheme";
import {Button, Collapse, Dialog, Fab, IconButton, InputBase, Paper, Slide, Zoom} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AdvanceSearch from "./advanceSearch";
import SearchResult from "./searchResult";
import {getQueryResult} from "./utils/connector";
import clsx from "clsx";
import AddIcon from "@material-ui/icons/Add";
import TpDetailDialog from "./tpDetailDialog";

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
    exportButton: {
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(1),
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
    fab: {
        position: 'fixed',
        top: 'auto',
        bottom: theme.spacing(3),
        left: 'auto',
        right: theme.spacing(3),
    },
})

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class SearchFrag extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            query: '',
            advanceOpen: false,
            haveResult: false,
            resultData: [],
            dialog: false,
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

    handleDialogClose = () =>{
        this.setState({dialog: false});
    }

    handleSubmit = () => {
        let queryMap = {};
        if(this.state.advanceOpen){
            queryMap = this.advanceSearch.current.getAdvanceValue();
        }
        queryMap.query = this.state.query;
        this.setState({resultData: getQueryResult()});
        this.setState({haveResult: true});
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
                    {this.state.haveResult && <Button className={classes.exportButton} variant="contained" color="primary">导出检索结果</Button>}
                    {this.state.resultData.map((item) => <SearchResult key={this.uniqid()} result={item} />)}
                </div>
                <Zoom in={!this.state.dialog}>
                    <Fab className={classes.fab} color="primary"
                         onClick={() => this.setState({dialog: true})}>
                        <AddIcon/>
                    </Fab>
                </Zoom>
                <Dialog fullScreen open={this.state.dialog} onClose={this.handleDialogClose}
                        TransitionComponent={Transition}>
                    <TpDetailDialog ref={this.detailDialog} handleClose={this.handleDialogClose}/>
                </Dialog>
            </div>
        );
    }
}

SearchFrag.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles(theme))(withTheme(SearchFrag));