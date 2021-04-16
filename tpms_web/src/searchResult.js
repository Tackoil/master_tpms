import React from "react";
import PropTypes from "prop-types";
import {withStyles, withTheme} from "@material-ui/styles";
import {theme} from "./defaultTheme";
import {
    Chip,
    Dialog,
    Icon,
    Paper, Slide,
    Typography
} from "@material-ui/core";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import BookOutlinedIcon from "@material-ui/icons/BookOutlined";
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import DetailDialog from "./tpDetailDialog";

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
})

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class SearchResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dialog: false,
        }
        this.detailDialog = React.createRef();
        this.uniqid = require('uniqid');
    }

    handleDialogClose = () =>{
        this.setState({dialog: false});
    }

    render() {
        const {classes} = this.props;
        return (
            <>
                <Paper className={classes.cardRoot} onClick={() => {
                    this.setState({dialog: true});
                }}>
                    <div className={classes.oneLine}>
                        <Icon className={classes.myIcon} edge='start'>
                            {this.props.result.thesisOrPaper === 'thesis' ? <DescriptionOutlinedIcon /> :
                                <BookOutlinedIcon />}
                        </Icon>
                        <Typography className={classes.myIcon} variant="h5" noWrap>  {this.props.result.title} </Typography>
                        <Typography className={classes.title} variant='overline'>{this.props.result.author.map((item) => {
                            return(item.name+' ');
                        })}</Typography>
                        <Icon className={classes.myIcon} edge="end">
                            {this.props.result.favor ? <StarIcon /> : <StarBorderIcon />}
                        </Icon>
                    </div>
                    <Typography className={classes.intro} variant="body2" >
                        {this.props.result.intro}
                    </Typography>
                    <div className={classes.oneLine}>
                        <Typography className={classes.keywordTitle} >关键词：</Typography>
                        {this.props.result.keyword.map((item) => <Chip key={this.uniqid()} className={classes.myIcon} label={item.name}/>)}
                    </div>
                </Paper>
                <Dialog fullScreen open={this.state.dialog} onClose={this.handleDialogClose}
                        TransitionComponent={Transition}>
                    <DetailDialog ref={this.detailDialog} handleClose={this.handleDialogClose} data={this.props.result.uid}/>
                </Dialog>
            </>
        );
    }
}

SearchResult.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles(theme))(withTheme(SearchResult));