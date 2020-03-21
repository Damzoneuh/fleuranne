import React, {Component} from 'react';
import axios from 'axios';
import Loader from "../../common/loader/Loader";
import Logger from "../../common/logger/Logger";

export default class CareType extends Component{
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            careTypes : null,
            isLoaded: false,
            message: null,
            type: null,
            create: false
        };

        this.hasToReload = this.hasToReload.bind(this);
        this.getAllCareType = this.getAllCareType.bind(this);
        this.cancelCourse = this.cancelCourse.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleDeleteCare = this.handleDeleteCare.bind(this);
    }

    componentDidMount(){
        this.getAllCareType();
    }

    componentDidUpdate({reload}){
        if(reload){
            this.getAllCareType();
        }
    }

    componentWillUnmount(){
        this.hasToReload(false);
    }

    getAllCareType(){
        axios.get('/api/care')
            .then(res => {
                this.setState({
                    careTypes: res.data,
                    isLoaded: true
                });
                this.hasToReload(false)
            })
    }

    hasToReload(bool){
        this.props.hasToReload(bool);
    }

    handleCreate(){
        if (this.state.create){
            this.setState({
                name: null,
                create: false,
            })
        }
        else {
            this.setState({
                create: true
            })
        }
    }

    cancelCourse(){
        this.careTypeForm.reset();
    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e){
        e.preventDefault();
        axios.post('/admin/api/create/care', {name: this.state.name})
            .then(res => {
                this.setState({
                    message: res.data.success,
                    type: 'success',
                    name: null
                });
                this.cancelCourse();
                this.hasToReload(true);
                this.handleCreate();
            })
            .catch(e => {
                this.setState({
                    name: null
                });
                this.cancelCourse();
                this.hasToReload(true);
                this.handleCreate()
            })
    }

    handleDeleteCare(id){
        axios.delete('/admin/api/delete/care/' + id)
            .then(res => {
                this.setState({
                    message: res.data.success,
                    type: 'success'
                });
                this.hasToReload(true);
                this.getAllCareType();
            })
            .catch(e => {
                this.setState({
                    message: 'Une erreur est survenue lors de la suppression',
                    type: 'danger'
                });
                this.hasToReload(true);
                this.getAllCareType();
            })
    }

    render() {
        const {careTypes, isLoaded, message, type, create} = this.state;
        if (!isLoaded){
            return (
                <div className="bg-grey-inherit">
                    <div className="p-sm-2 p-5 mt-2 mb-2">
                        <Loader/>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="bg-grey-inherit h-100 rounded shadow">
                    {message && type ? <Logger message={message} type={type} /> : ''}
                    <div className="p-sm-2 p-5">
                        {!create ?
                            <div className="text-center">
                                <button className="btn btn-group btn-grey" onClick={this.handleCreate}>Ajouter une section</button>
                            </div>
                            :
                            <form className="form" ref={(el) => this.careTypeForm = el} onChange={this.handleChange} onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="careName">Nom</label>
                                    <input type="text" className="form-control" required={true} id="careName" name="name"/>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <button className="btn btn-group btn-pink">Envoyer</button>
                                    <a className="btn btn-group btn-danger text-white" onClick={this.handleCreate}>Retour</a>
                                </div>
                            </form>
                        }
                        <div className="p-sm-2 p-5  mt-2 mb-2">
                            <table className="table table-responsive-sm table-striped bg-pink-inherit">
                                <tbody>
                                {careTypes && careTypes.length > 0 ? careTypes.map(care => {
                                    return (
                                        <tr>
                                            <td>
                                                {care.name}
                                            </td>
                                            <td className="text-right"><i className="fas fa-trash text-danger link" onClick={() => this.handleDeleteCare(care.id)}></i></td>
                                        </tr>
                                    )
                                }): ''}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        }
    }

}