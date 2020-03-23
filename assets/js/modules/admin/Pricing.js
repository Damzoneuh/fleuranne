import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Mark from "./Mark";
import CareType from "./CareType";
import axios from 'axios';
import Services from "./Services";

export default class Pricing extends Component{
    constructor(props) {
        super(props);
        this.state = {
            marks: null,
            marksLoaded: false,
            cares: null,
            caresLoaded: false,
            servicesLoaded: false,
            services: null
        };
        this.hasToReload = this.hasToReload.bind(this);
        this.reloadCare = this.reloadCare.bind(this);
        this.reloadMarks = this.reloadMarks.bind(this);
        this.reloadServices = this.reloadServices.bind(this);
    }

    componentDidMount(){
        this.hasToReload();
    }

    reloadMarks(){
        this.setState({
            marksLoaded: false
        });
        axios.get('/admin/api/mark')
            .then(res => {
                this.setState({
                    marks: res.data,
                    marksLoaded: true
                })
            })
    }

    reloadCare(){
        this.setState({
            caresLoaded: false
        });
        axios.get('/api/care')
            .then(res => {
                this.setState({
                    cares: res.data,
                    caresLoaded: true
                })
            })
    }

    reloadServices(){
        this.setState({
            servicesLoaded: false,
        });
        axios.get('/api/services')
            .then(res => {
                this.setState({
                    servicesLoaded: true,
                    services: res.data
                })
            })
    }

    hasToReload(){
        this.reloadCare();
        this.reloadMarks();
        this.reloadServices();
    }




    render() {
        const {marksLoaded, marks, caresLoaded, cares, servicesLoaded, services} = this.state;
        return (
            <div className="container-fluid">
                <div className="row align-items-stretch">
                    <div className="col-md-6 col-12 mt-2 mb-2">
                        <Mark hasToReload={this.hasToReload} isLoaded={marksLoaded} cares={marks}/>
                    </div>
                    <div className="col-md-6 col-12 mt-2 mb-2">
                        <CareType hasToReload={this.hasToReload} isLoaded={caresLoaded} careTypes={cares} />
                    </div>
                    <div className="col-12 mb-2">
                        <Services services={services} isLoaded={servicesLoaded} marks={marks} cares={cares} hasToReaload={this.hasToReload}/>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Pricing/>, document.getElementById('pricing'));