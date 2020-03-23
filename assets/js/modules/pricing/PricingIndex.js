import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Loader from "../../common/loader/Loader";
import PricingBody from "./PricingBody";

export default class PricingIndex extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            tabs: null,
            active: null,
            scroll: 0,
            marks: null,
            marksLoaded: false
        };
        this.handleTab = this.handleTab.bind(this);
        this.scrollHandler = this.scrollHandler.bind(this);
        this.getAllMarks = this.getAllMarks.bind(this);
    }

    componentDidMount(){
        axios.get('/api/care')
            .then(res => {
                this.setState({
                    isLoaded: true,
                    tabs: res.data,
                    active: res.data[0].id
                });
                this.getAllMarks(res.data[0].id)
            });
        window.addEventListener('scroll', this.scrollHandler, true);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.scrollHandler);
    }

    scrollHandler(){
        if (window.scrollY === 0){
            this.setState({
                scroll: 0
            })
        }
        else {
            this.setState({
                scroll: 1
            })
        }
    }

    handleTab(id){
        this.setState({
            active: id
        });
        this.getAllMarks(id)
    }

    getAllMarks(id){
        this.setState({
            marksLoaded: false
        });
        axios.get('/api/pricing/body/' + id)
            .then(res => {
                this.setState({
                    marks: res.data,
                    marksLoaded: true
                })
            })
    }


    render() {
        const {tabs, isLoaded, active, scroll, marks, marksLoaded} = this.state;
        if (!isLoaded){
            return (
                <div className="p-sm-2 p-5 mt-2 mb-2">
                    <Loader/>
                </div>
            )
        }
        else {
            return (
                <div>
                    <nav className={scroll === 0 ? 'navbar navbar-expand-lg navbar-light bg-grey-inherit border-bottom border-pink'
                        : 'navbar navbar-expand-lg navbar-light bg-grey-inherit border-bottom border-pink fixed-top'}>
                        <button className="navbar-toggler" type="button" data-toggle="collapse"
                                data-target="#navbarTogglerPricing" aria-controls="navbarTogglerPricing" aria-expanded="false"
                                aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarTogglerPricing">
                            <ul className="navbar-nav m-auto mt-2 mt-lg-0">
                                {tabs && tabs.length > 0 ? tabs.map(tab => {
                                    return (
                                        <li className={'nav-item'} key={tab.id}>
                                            <a className={tab.id === active ? "nav-link text-pink h4" : 'nav-link h4'} href="#" onClick={() => this.handleTab(tab.id)}>{tab.name}</a>
                                        </li>
                                    )
                                }) : ''}
                            </ul>
                        </div>
                    </nav>
                    <PricingBody marks={marks} isLoaded={marksLoaded} />
                </div>
            );
        }
    }

}

ReactDOM.render(<PricingIndex/>, document.getElementById('pricing'));