import React, {Component} from 'react';
import axios from 'axios';
import Loader from "../../common/loader/Loader";
import {ParallaxBanner, ParallaxProvider} from "react-scroll-parallax";
import PricingTable from "./PricingTable";

export default class PricingBody extends Component{
    constructor(props) {
        super(props);


    }

    render() {
        const {marks, isLoaded} = this.props;
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
                <div className="mb-2">
                    <ParallaxProvider>
                    {marks && Object.entries(marks).length > 0 ? Object.entries(marks).map((mark, key) => {
                        return (
                            <div key={key}>
                                    <ParallaxBanner layers={[
                                        {image: 'https://' + window.location.hostname + '/img/' + mark[1].img.id,
                                            amount: -0.5,
                                        }
                                    ]} className={'layout-table-banner'} >
                                    </ParallaxBanner>
                                <PricingTable services={mark[1].services} />
                            </div>
                        )
                    }) : ''}
                    </ParallaxProvider>
                </div>
            );
        }
    }

}