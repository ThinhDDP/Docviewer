import React from 'react'

import './Create.css'

class Create extends React.Component{
    constructor(){
        super();
        this.state = {
            state : 'idle',
            timer : null,
            link : ''
        }
    }


    render(){
        if (this.state.state == 'idle' || this.state.link == '' || this.state.link == null){
            return(
                <div className="wrapper">
                <div className="bg">
                    <div className='content'>
                    <div className="title-wrapper">
                        <input placeholder="Document's title"></input>
                    </div>
                    <div className="input-wrapper">
                        <input placeholder="Google Document preview link"></input>
                    </div>
                    <p>Don't know what that is? <a href='https://www.youtube.com/watch?v=AAeloLXO8T0' target="_blank">See this</a></p>
                    <br/>
                    <button className="btn">VIEW</button>
                    </div>
                </div>
                </div>
            )
        }
        else {

        }
    }
}

export default Create;