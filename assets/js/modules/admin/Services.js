import React, {Component} from 'react';
import axios from 'axios';
import Loader from "../../common/loader/Loader";
import Logger from "../../common/logger/Logger";

export default class Services extends Component{
    constructor(props) {
        super(props);
        this.state = {
            create: false,
            name: null,
            description: null,
            time: null,
            womanPrice: null,
            manPrice: null,
            mark: null,
            care: null,
            message: null,
            type: null,
            newWomanPrice: null,
            newManPrice: null,
            selectedNewPrice: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.cancelCourse = this.cancelCourse.bind(this);
        this.hasToReload = this.hasToReload.bind(this);
        this.handleDeleteService = this.handleDeleteService.bind(this);
        this.handleNewPriceSubmit = this.handleNewPriceSubmit.bind(this);
        this.handleNewWomanPrice = this.handleNewWomanPrice.bind(this);
        this.handleNewManPrice = this.handleNewManPrice.bind(this);
    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleCreate(){
        if (this.state.create){
            this.setState({
                name: null,
                description: null,
                time: null,
                womanPrice: null,
                manPrice: null,
                mark: null,
                care: null,
                create: false,
            });
            this.cancelCourse();
        }
        else {
            this.setState({
                create: true
            })
        }
    }

    handleSubmit(e){
        e.preventDefault();
        if(!this.state.mark || !this.state.care){
            this.setState({
                message: 'Vous devez choisir une marque et une catégorie de soin',
                type: 'danger'
            })
        }
        else {
            let payLoad = {
                'name': this.state.name,
                'desc': this.state.description,
                'mark': this.state.mark,
                'care': this.state.care,
                'time': this.state.time,
                'womanPrice': this.state.womanPrice,
                'manPrice': this.state.manPrice
            };
            axios.post('/admin/api/create/service', payLoad)
                .then(res => {
                    this.cancelCourse();
                    this.setState({
                        name: null,
                        description: null,
                        time: null,
                        womanPrice: null,
                        manPrice: null,
                        mark: null,
                        care: null,
                        create: false,
                        message: res.data.success,
                        type: 'success'
                    });
                    this.hasToReload();
                })
                .catch(e => {
                    this.setState({
                        message: 'Vous devez choisir une marque et une catégorie de soin',
                        type: 'danger'
                    })
                })
        }
    }

    handleDeleteService(id){
        axios.delete('/admin/api/delete/service/' + id)
            .then(res => {
                this.setState({
                    message: res.data.success,
                    type: 'success'
                });
                this.hasToReload();
            })
            .catch(e => {
                this.setState({
                    message: 'Une erreur est survenue lors de la suppression',
                    type: 'danger'
                })
            })
    }

    hasToReload(){
        this.props.hasToReload();
    }

    cancelCourse(){
        this.servicesTypeForm.reset();
    }

    handleNewWomanPrice(e, id){
        this.setState({
            newWomanPrice: e.target.value,
            selectedNewPrice: id
        })
    }

    handleNewManPrice(e, id){
        this.setState({
            newManPrice: e.target.value,
            selectedNewPrice: id
        })
    }

    handleNewPriceSubmit(e){
        e.preventDefault();
        if (e.target.name === 'newWomanPrice'){
            axios.put('/admin/api/setwoman/service', {id: this.state.selectedNewPrice, price: this.state.newWomanPrice})
                .then(res => {
                    this.setState({
                        selectedNewPrice: null,
                        newWomanPrice: null,
                        message: res.data.success,
                        type: 'success'
                    });
                    this.hasToReload();
                })
                .catch(e => {
                    this.setState({
                        selectedNewPrice: null,
                        newWomanPrice: null,
                        message: 'Une erreur est survenue lors de la mise à jour',
                        type: 'danger'
                    })
                })
        }
        else{
            axios.put('/admin/api/setman/service', {id: this.state.selectedNewPrice, price: this.state.newManPrice})
                .then(res => {
                    this.setState({
                        newManPrice: null,
                        selectedNewPrice: null,
                        message: res.data.success,
                        type: 'success'
                    })
                })
                .catch(e => {
                    this.setState({
                        newManPrice: null,
                        selectedNewPrice: null,
                        message: 'Une erreur est survenue lors de la mise à jour',
                        type: 'danger'
                    })
                })
        }
    }


    render() {
        const {isLoaded, marks, cares, services} = this.props;
        const {message, type, create} = this.state;
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
                <div className="bg-grey-inherit rounded shadow text-pink">
                    {message && type ? <Logger message={message} type={type} /> : ''}
                    <div className="p-sm-2 p-5">
                        {!create ?
                            <div className="text-center">
                                <button className="btn btn-group btn-grey" onClick={this.handleCreate}>Ajouter une préstation</button>
                            </div>
                            :
                            <form className="form" ref={(el) => this.servicesTypeForm = el} onChange={this.handleChange} onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="serviceName">Nom</label>
                                    <input type="text" className="form-control" required={true} id="serviceName" name="name"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="serviceDesc">Description (facultatif)</label>
                                    <textarea  className="form-control" required={false} id="serviceDesc" name="description"/>
                                </div>
                                <div className="form-row">
                                    <div className="col">
                                        <div className="form-group">
                                            <label htmlFor="selectMark">Marque</label>
                                            <select className="form-control" name="mark" id="selectMark" required={true}>
                                                <option>Choisir une marque</option>
                                                {marks && marks.length > 0 ? marks.map(m => {
                                                    return(
                                                        <option key={m.id} value={m.id} >{m.name}</option>
                                                    )
                                                }) : ''}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <label htmlFor="selectCare">Type de soins</label>
                                            <select className="form-control" name="care" id="selectCare" required={true}>
                                                <option>Choisir un type de soin</option>
                                                {cares && cares.length > 0 ? cares.map(c => {
                                                    return (
                                                        <option key={c.id} value={c.id}>{c.name}</option>
                                                    )
                                                }) : ''}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <label htmlFor="timing">Temps</label>
                                            <input type="text" name="time" required={false} id="timing" className="form-control"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col">
                                        <div className="form-group">
                                            <label htmlFor="womanPrice" >Prix femme</label>
                                            <input type="text" required={true} name="womanPrice" className="form-control" id="womanPrice" pattern="(\d+(\.\d+)?)"/>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group">
                                            <label htmlFor="manPrice" >Prix Homme (facultatif)</label>
                                            <input type="text" required={false} name="manPrice" className="form-control" id="manPrice" pattern="(\d+(\.\d+)?)"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <button className="btn btn-group btn-pink">Envoyer</button>
                                    <a className="btn btn-group btn-danger text-white" onClick={this.handleCreate}>Retour</a>
                                </div>
                            </form>
                        }
                    </div>
                    <div className="p-sm-2 p-5 mt-2 mb-2">
                        <table className="table table-responsive-sm table-striped bg-pink-inherit">
                            <thead>
                                <tr>
                                    <th scope="col">Nom</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Marque</th>
                                    <th scope="col">Type de soin</th>
                                    <th scope="col">Temps</th>
                                    <th scope="col">Prix femme</th>
                                    <th scope="col">Prix homme</th>
                                    <th scope="col">Supprimer</th>
                                </tr>
                            </thead>
                            <tbody>
                            {services && services.length > 0 ? services.map(s => {
                                return (
                                    <tr key={s.id}>
                                        <td>{s.name}</td>
                                        <td>{s.description}</td>
                                        <td>{s.mark.name}</td>
                                        <td>{s.care.name}</td>
                                        <td>{s.time}</td>
                                        <td>
                                            <form onChange={(el) => this.handleNewWomanPrice(el, s.id)} onSubmit={this.handleNewPriceSubmit} name="newWomanPrice">
                                                <input className="form-control" defaultValue={s.priceWoman} />
                                            </form>
                                        </td>
                                        <td>
                                            <form onChange={(el) => this.handleNewManPrice(el, s.id)} onSubmit={this.handleNewPriceSubmit} name="newManPrice">
                                                <input className="form-control" defaultValue={s.priceMan} />
                                            </form>
                                        </td>
                                        <td className="text-center"><i className="fas fa-trash text-danger link" onClick={() => this.handleDeleteService(s.id)}></i></td>
                                    </tr>
                                )
                            }) : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }
    }


}