import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { ParallaxProvider } from 'react-scroll-parallax';
import {ParallaxBanner} from "react-scroll-parallax/cjs";
import paralax from '../../../img/teaserbox_4134539.jpg';

export default class Index extends Component{
    constructor(props) {
        super(props);

    }


    render() {
        return (
            <div>
                <ParallaxProvider>
                    <ParallaxBanner layers={[
                        {image: paralax, amount: 0.5}
                    ]} style={{
                        height: '80vh',
                    }} />
                </ParallaxProvider>

            </div>
        );
    }
}
ReactDOM.render(<Index/>, document.getElementById('index'));