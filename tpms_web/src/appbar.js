import React from "react";
import {withStyles} from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import {IconButton} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import MoreIcon from "@material-ui/icons/MoreVert";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import LowerPart from "./lowerpart";
import PropTypes from "prop-types";
import {theme} from "./defaultTheme";


const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    apptool: {
        alignItems: 'flex-start',
        minHeight: 128,
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(2),
    },
    appBarPlaceHolder: {
        minHeight: 128,
    },
    apptitle: {
        flexGrow: 1,
        alignSelf: 'flex-end',
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    drawer: {}
});

class AppbarWithDrawer extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            draweropen: false
        }
    }

    handleDrawerOpen = () => {
        this.setState({draweropen: true})
    };

    handleDrawerClose = () => {
        this.setState({draweropen: false})
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <CssBaseline/>
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar className={classes.apptool}>
                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            onClick={this.state.draweropen ? this.handleDrawerClose : this.handleDrawerOpen}
                            color="inherit"
                        >
                            {this.state.draweropen ? <ArrowBackIcon /> : <MenuIcon/>}
                        </IconButton>
                        <Typography className={classes.apptitle} variant="h6" noWrap>
                            研究生论文管理系统
                        </Typography>
                        <IconButton edge="end" color="inherit">
                            <MoreIcon/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <LowerPart draweropen={this.state.draweropen}/>
            </div>
        );
    }
}

AppbarWithDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles(theme))(AppbarWithDrawer);