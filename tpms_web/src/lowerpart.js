import clsx from 'clsx';
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import PropTypes from "prop-types";
import {withStyles, withTheme} from "@material-ui/styles";
import {theme} from "./defaultTheme";
import {CssBaseline, Dialog, Slide} from "@material-ui/core";
import SearchFrag from "./searchFrag";
import DetailDialog from "./detailDialog";

const drawerWidth = 240;

const styles = theme => ({
    lowerPart: {
        display: 'flex',
    },
    appBarPlaceHolder: {
        minHeight: 128,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    addFragTitle: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    addFragAppBar: {
        position: 'relative',
    },
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class LowerPart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            func_code: 1,
            dialog: false,
        }
        this.detailDialog = React.createRef();
    }

    handleDialogClose = () =>{
        this.setState({dialog: false});
    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.lowerPart}>
                <CssBaseline/>
                <Drawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: this.props.draweropen,
                        [classes.drawerClose]: !this.props.draweropen,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: this.props.draweropen,
                            [classes.drawerClose]: !this.props.draweropen,
                        }),
                    }}
                >
                    <div className={classes.appBarPlaceHolder}/>
                    <div>
                        <List>
                            <ListItem button key='ThesisRetrieval' onClick={() => {
                                this.setState({func_code: 1})
                            }}>
                                <ListItemIcon> <LibraryBooksIcon/> </ListItemIcon>
                                <ListItemText primary='论文检索'/>
                            </ListItem>
                            <ListItem button key='AddThesis' onClick={() => {
                                this.setState({dialog: true})
                            }}>
                                <ListItemIcon> <LibraryAddIcon/> </ListItemIcon>
                                <ListItemText primary='添加新论文'/>
                            </ListItem>
                        </List>
                    </div>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.appBarPlaceHolder}/>
                    {(() => {
                            switch (this.state.func_code) {
                                case 1:
                                    return <SearchFrag/>;
                                default:
                                    return null;
                            }
                        }
                    )()}
                </main>
                <Dialog fullScreen open={this.state.dialog} onClose={this.handleDialogClose}
                        TransitionComponent={Transition}>
                    <DetailDialog ref={this.detailDialog} handleClose={this.handleDialogClose}/>
                </Dialog>
            </div>
        );
    }

}

LowerPart.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles(theme))(withTheme(LowerPart));