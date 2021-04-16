import React from "react";
import PropTypes from "prop-types";
import {withStyles, withTheme} from "@material-ui/styles";
import {theme} from "./defaultTheme";
import {
    Collapse,
    Divider,
    FormControlLabel,
    FormGroup,
    InputAdornment, Paper,
    Radio,
    RadioGroup,
    TextField
} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import BookOutlinedIcon from '@material-ui/icons/BookOutlined';
import ThesisAddDetail from "./thesisAddDetail";
import PaperAddDetail from "./paperAddDetail";

const styles = theme => ({
    addFragRoot: {
        margin: theme.spacing(3),
        padding: theme.spacing(3),
    },
    titleIcon: {
        margin: theme.spacing(1),
    },
    formGroup: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
})

class TpDetailFrag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            thesisOrPaper: 'thesis',
            intro: '',
        }
        this.detail = React.createRef()
    }

    componentDidMount() {
        if(!this.props.edit && this.props.data !== undefined){
            this.setState({title: this.props.data.title});
            this.setState({thesisOrPaper: this.props.data.thesisOrPaper});
            this.setState({intro: this.props.data.intro});
        }
    }

    handleTitleChange = (event) => {
        const newTitle = event.target.value;
        this.setState({title: newTitle});
        this.props.onTitleChange(newTitle);
    }

    getTitle = () => {
        return this.state.title;
    }

    getAllData = () => {
        let detail = this.detail.current.getAllData();
        detail.error = detail.error || this.state.title === '';
        let mainData = {
            title: this.state.title,
            thesisOrPaper: this.state.thesisOrPaper,
        }
        return Object.assign(mainData, detail)
    }

    render() {
        const {classes} = this.props;
        return (
            <Paper className={classes.addFragRoot}>
                <FormGroup row className={classes.formGroup}>
                    <FormControl fullWidth className={classes.formControl}>
                        <TextField value={this.state.title} required fullWidth
                                   id="outlined-basic" label="论文标题"
                                   inputProps={{style: {fontSize: 40}}}
                                   onChange={this.handleTitleChange}
                                   InputProps={{
                                       readOnly: !this.props.edit,
                                       startAdornment: (
                                           <InputAdornment position="start">
                                               {this.state.thesisOrPaper === 'thesis' ? <DescriptionOutlinedIcon className={classes.titleIcon}/> :
                                                   <BookOutlinedIcon className={classes.titleIcon}/>}
                                           </InputAdornment>
                                       ),
                                   }}/>
                    </FormControl>
                </FormGroup>
                <Collapse in={this.props.edit}>
                    <RadioGroup row name="kind" className={classes.formControl}
                                value={this.state.thesisOrPaper}
                                onChange={(event) => {
                                    this.setState({thesisOrPaper: event.target.value});
                                }}>

                            <FormControlLabel value="thesis" disabled={!this.props.edit} control={<Radio size='small'/>} label="毕业论文"/>
                            <FormControlLabel value="paper" disabled={!this.props.edit} control={<Radio size='small'/>} label="期刊论文"/>
                    </RadioGroup>
                <Divider/>
                </Collapse>
                {this.state.thesisOrPaper === "thesis" ?
                    <ThesisAddDetail ref={this.detail} edit={this.props.edit} data={this.props.data}/> :
                    <PaperAddDetail ref={this.detail} edit={this.props.edit} data={this.props.data}/>}
                <Divider/>
                <FormGroup row className={classes.formGroup}>
                    <FormControl fullWidth className={classes.formControl}>
                        <TextField multiline label="摘要" value={this.state.intro} onChange={(event) =>
                            this.setState({intro: event.target.value})}
                                   InputProps={{readOnly: !this.props.edit}}/>
                    </FormControl>
                </FormGroup>
            </Paper>
        );
    }
}

TpDetailFrag.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles(theme))(withTheme(TpDetailFrag));