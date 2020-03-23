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
            type: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
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
            axios.post('/admin/api/create/') //TODO finir ici le back est prêt 
        }
    }

    cancelCourse(){
        this.servicesTypeForm.reset();
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
                            <tbody>
                            {services && services.length > 0 ? services.map(s => {
                                return (
                                    <tr key={s.id}>
                                        <td>{s.name}</td>
                                        <td>{s.description}</td>
                                        <td>{s.mark.name}</td>
                                        <td>{s.care.name}</td>
                                        <td>{s.time}</td>
                                        <td>{s.priceWoman}</td>
                                        <td>{s.priceMan}</td>
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