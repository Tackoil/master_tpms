import React from "react";
import PropTypes from "prop-types";
import {withStyles, withTheme} from "@material-ui/styles";
import {theme} from "./defaultTheme";
import {
    AppBar,
    Button,
    Fab,
    IconButton,
    Snackbar,
    Typography, Zoom
} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from '@material-ui/icons/Edit';
import TpDetailFrag from "./tpDetailFrag";
import {getDataByUid} from "./utils/connector";
import {Alert} from "@material-ui/lab";

const styles = theme => ({
    detailTitle: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    detailAppBar: {
        position: 'relative',
    },
    fab: {
        position: 'fixed',
        top: 'auto',
        bottom: theme.spacing(3),
        left: 'auto',
        right: theme.spacing(3),
    },
})


class TpDetailDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false,
            data: {},
            snackOpen: false,
            title: '',
        };
        this.detailFrag = React.createRef();
        if (this.props.data === undefined) {
            this.state.edit = true;
        } else {
            this.state.data = getDataByUid(this.props.data);
            this.state.title = this.state.data.title;
        }
    }

    open = () => {
        this.setState({open: true})
    }

    handleTitleChange = (value) => {
        this.setState({title: value})
    }

    handleSave = () => {
        let detailData = this.detailFrag.current.getAllData();
        if(detailData.error){
            this.setState({snackOpen: true})
        }
        else{
            console.info(detailData);
            this.setState({edit: false});
        }
    };

    handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({snackOpen: false});
    };

    render() {
        const {classes} = this.props;
        return (
            <>
                <AppBar className={classes.detailAppBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={this.props.handleClose} aria-label="close">
                            <CloseIcon/>
                        </IconButton>
                        <Typography variant="h6" className={classes.detailTitle}>
                            {this.state.title === '' ? "添加新论文" : this.state.title}
                        </Typography>
                        {this.state.edit && <Button autoFocus color="inherit" onClick={this.handleSave}>保存</Button>}
                    </Toolbar>
                </AppBar>
                <TpDetailFrag ref={this.detailFrag} edit={this.state.edit} data={this.state.data}
                            onTitleChange={this.handleTitleChange}/>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.snackOpen}
                    autoHideDuration={6000}
                    onClose={this.handleSnackClose}
                >
                    <Alert onClose={this.handleSnackClose} severity="error">
                        保存失败，请检查必填项与其他格式要求。
                    </Alert>
                </Snackbar>
                <Zoom in={!this.state.edit}>
                    <Fab className={classes.fab} color="primary"
                         onClick={() => this.setState({edit: true})}>
                        <EditIcon />
                    </Fab>
                </Zoom>
            </>

        );
    }
}

TpDetailDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles(theme))(withTheme(TpDetailDialog));