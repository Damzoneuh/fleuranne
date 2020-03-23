import React, {Component} from 'react';

export default class PricingTable extends Component{
    constructor(props) {
        super(props);
        this.state = {
            active: null
        }
    }

    handleToggle(id = null){
        if (id){
            this.setState({
                active: id
            })
        }
        else {
            this.setState({
                active: null
            })
        }
    }

    render() {
        const {active} = this.state;
        const {services} = this.props;
        return (
            <div className="container-fluid">
                <div className="col">
                    <div className="p-sm-2 p-5 bg-grey-inherit rounded shadow">
                        <table className="table table-striped table-responsive-sm bg-pink-inherit">
                            <thead>
                            <tr>
                                <th scope="col">Préstation</th>
                                <th scope="col">Temps</th>
                                <th scope="col">Homme</th>
                                <th scope="col">Femme</th>
                            </tr>
                            </thead>
                            <tbody>
                            {services && services.length > 0 ? services.map(service => {
                                return (
                                  <tr key={service.id}>
                                      <td>
                                          <div>
                                              {service.name}  {service.description ? active === service.id ?
                                              <div className="text-grey">
                                                  <div>{service.description} <i className="fas fa-arrow-up fa-sm link" onClick={() => this.handleToggle()}></i></div>

                                              </div>
                                              :
                                              <i className="fas fa-arrow-down fa-sm text-grey link" onClick={() => this.handleToggle(service.id)}></i>
                                              :
                                              ''}
                                          </div>

                                      </td>
                                      <td>{service.time}</td>
                                      <td>{service.priceWoman ? service.priceWoman + ' €' : ''}</td>
                                      <td>{service.priceMan ? service.priceMan + ' €' : ''}</td>
                                  </tr>
                                )
                            }) : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }


}