import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Mark from "./Mark";
import CareType from "./CareType";

export default class Pricing extends Component{
    constructor(props) {
        super(props);
        this.state = {
            hasToReload: false
        };
        this.hasToReload = this.hasToReload.bind(this);
    }

    hasToReload(bool){
        this.setState({
            hasToReload: bool
        });
    }


    render() {
        const {hasToReload} = this.state;
        return (
            <div className="container-fluid">
                <div className="row align-items-stretch">
                    <div className="col-md-6 col-12 mt-2 mb-2">
                        <Mark hasToReload={this.hasToReload} reload={hasToReload}/>
                    </div>
                    <div className="col-md-6 col-12 mt-2 mb-2">
                        <CareType hasToReload={this.hasToReload} reload={hasToReload}/>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Pricing/>, document.getElementById('pricing'));