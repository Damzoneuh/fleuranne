import React, {Component} from 'react';
import axios from 'axios';
import Loader from "../../common/loader/Loader";

export default class NewsBuilder extends Component{
    constructor(props) {
        super(props);
        this.state={
            datas: null,
            isLoaded: false
        }
    }

    componentDidMount(){
      axios.get('/api/news')
          .then(res => {
              this.setState({
                  datas: res.data,
                  isLoaded: true
              })
          })
    }

    render() {
        const {isLoaded, datas} = this.state;
        if (!isLoaded){
            return (
                <Loader/>
            )
        }
        else {
            return (
                <div className="container-fluid">
                    <div className="row align-items-stretch mb-2">
                        {datas && datas.length > 0 ? datas.map((data, key) => {
                            return (
                                <div className={key % 2 === 0 ? 'col-sm-12 col-md-6 bg-pink-inherit text-grey ' : 'col-sm-12 col-md-6 bg-grey-inherit text-pink' }>
                                    <div className="p-sm-2 p-5">
                                        {data.img ?
                                            <div className="row align-items-stretch">
                                                <div className="col-6">
                                                    <div className="p-2 text-center">
                                                        <div >
                                                            <img src={'/img/' + data.img.id} alt={data.img.name} className="img-thumbnail" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                   <div className="p-2 justify-content-center d-flex align-items-center h-100 ">
                                                       <h2 className="h2">{data.title}</h2>
                                                   </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="p-2 text-center">
                                                        {data.text}
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <div className="row">
                                                <div className="col-12 text-center">
                                                    <div className="p-2">
                                                        <h2 className="h2">{data.title}</h2>
                                                    </div>
                                                </div>
                                                <div className="col-12 text-center">
                                                    <div className="p-2">
                                                        {data.text}
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                                )
                            }) : ''}
                    </div>
                </div>
            )
        }
    }


}