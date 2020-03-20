import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { ParallaxProvider } from 'react-scroll-parallax';
import {ParallaxBanner} from "react-scroll-parallax/cjs";
import paralax from '../../../img/teaserbox_4134539.jpg';
import NewsBuilder from "./NewsBuilder";

export default class Index extends Component{
    constructor(props) {
        super(props);

    }


    render() {
        return (
            <div>
                <ParallaxProvider>
                    <ParallaxBanner layers={[
                        {image: paralax, amount: -0.5, props:{className: 'banner'}}
                    ]} className={'layout-banner'} >
                        <div className="w-100 text-center text-grey mt-2 banner-text d-flex flex-column justify-content-between h-100">
                            <h1 className="h2">Institut de beauté Fleuranne</h1>
                            <p className="p-2 bg-pink-inherit d-none d-md-inline">L’Institut de Beauté Fleuranne vous accueille dans un cadre calme et apaisant où vous pourrez vous détendre et bénéficier d'un vaste choix de soins esthétiques, de beauté et de bien-être, pour femme et homme.</p>
                        </div>
                    </ParallaxBanner>
                </ParallaxProvider>
                <NewsBuilder/>
            </div>
        );
    }
}
ReactDOM.render(<Index/>, document.getElementById('index'));