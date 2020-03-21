import React, {Component} from 'react';
import axios from 'axios';
import Loader from "../../common/loader/Loader";
import Logger from "../../common/logger/Logger";
const abortController = new AbortController();

export default class Mark extends Component{

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            message: null,
            type: null,
            create: false,
            img: null,
            name: null
        };
        this.cancelCourse = this.cancelCourse.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getAllCares = this.getAllCares.bind(this);
        this.hasToReload = this.hasToReload.bind(this);
        this.handleDeleteMark = this.handleDeleteMark.bind(this);
    }

    componentDidMount(){
        this.getAllCares();
    }

    componentWillReceiveProps({reload}){
        if(reload){
            this.getAllCares();
        }
    }

    componentWillUnmount(){
       this.hasToReload(false);
    }


    getAllCares(){
        this.setState({
            isLoaded: false
        });
        axios.get('/admin/api/mark')
            .then(res => {
                this.setState({
                    cares: res.data,
                    isLoaded: true
                });
                this.hasToReload(false);
            })
            .catch(e => {
                this.setState({
                    isLoaded: true,
                    message: 'Une erreur est survenue lors de la recheche des soins',
                    type: 'danger'
                })
            })
    }

    hasToReload(bool){
        this.props.hasToReload(bool);
    }

    handleCreate(){
        if (this.state.create === true){
            this.setState({
                create: false,
                img: null,
                name: null
            });
            this.cancelCourse()
        }
        else {
            this.setState({
                create: true
            })
        }
    }

    cancelCourse(){
        this.careForm.reset();
    }

    handleChange(e){
        if (e.target.files){
            this.setState({
                [e.target.name]: e.target.files[0]
            })
        }
        else {
            this.setState({
                [e.target.name] : e.target.value
            })
        }
    }

    handleSubmit(e){
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', this.state.img);
        formData.append('name', this.state.name);
        this.setState({
            isLoaded: false
        });
        axios.post('/admin/api/mark/img', formData)
            .then(res => {
                this.setState({
                    message: res.data.success,
                    type: 'success',
                    isLoaded: true
                });
                this.handleCreate();
                this.hasToReload(true);
            })
            .catch(e => {
                this.setState({
                    isLoaded: true
                });
                this.hasToReload(true);
                this.handleCreate();
            })
    }

    handleDeleteMark(id){
        this.setState({
            isLoaded: false
        });
        axios.delete('/admin/api/delete/mark/' + id)
            .then(res => {
                this.setState({
                    message: res.data.success,
                    type: 'success'
                });
                this.hasToReload(true);
            })
    }

    render() {
        const {isLoaded, message, type, cares, create} = this.state;
        if (!isLoaded){
            return (
                <div className="bg-pink-inherit">
                    <div className="p-sm-2 p-5 mt-2 mb-2">
                        <Loader/>
                    </div>
                </div>
            )
        }
       else {
            return (
                <div className="bg-pink-inherit">
                    {message && type ? <Logger message={message} type={type}/> : ''}
                    <div className="p-sm-2 p-5  mt-2 mb-2">
                        {!create ?
                            <div className="text-center">
                                <button className="btn btn-group btn-grey" onClick={this.handleCreate}>Ajouter une marque</button>
                            </div>
                            :
                            <form ref={(el) => this.careForm = el} className="form text-grey mb-3" onChange={this.handleChange} onSubmit={this.handleSubmit}>
                                <h1 className="text-grey h3 text-center">Ajouter une marque</h1>
                                <div className="form-group">
                                    <label htmlFor="careName">Nom</label>
                                    <input id="careName" name="name" className="form-control" type="text" required={true}/>
                                </div>
                                <div className="form-group">
                                    <div className="custom-file">
                                        <input type="file" className="custom-file-input" id="inputGroupFile01"
                                               aria-describedby="inputGroupFileAddon01" name="img"/>
                                            <label className="custom-file-label" htmlFor="inputGroupFile01">Choisir un fichier</label>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <button className="btn btn-group btn-grey" type="submit">Envoyer</button>
                                    <a className="btn btn-group btn-danger text-white" onClick={this.handleCreate}>Retour</a>
                                </div>
                            </form>
                        }
                        <div className="p-sm-2 p-5  mt-2 mb-2">
                            <table className="table table-responsive-sm table-striped bg-grey-inherit">
                                <tbody>
                                {cares && cares.length > 0 ? cares.map(care => {
                                    return (
                                        <tr>
                                            <td>{care.name}</td>
                                            <td className="text-right"><i className="fas fa-trash text-danger" onClick={() => this.handleDeleteMark(care.id)}></i></td>
                                        </tr>
                                    )
                                }) : ''}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )
        }
    }
}