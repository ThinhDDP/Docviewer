import React from 'react'
import './Home.css'

class Home extends React.Component {
    render() {
        return (
            <>
                <h1>DocViewer</h1>
                <div className="content">
                    <div id="box1">
                        <h2>Ideas</h2>
                        

                        <p>The idea of this website is making file sharing be easier and secure for anyone.<br></br> With basic steps, you can have your file sharing to anyone you want, with only a few steps</p>
                    </div>
                    <div id="box2">
                        <h2>Technology</h2>

                        <p>With easy-to-use framework use to build this site like Firebase, <br></br>this become more easier for both developers and users when using the site</p>
                    </div>
                    <div id="box3">
                        <h2>Functions</h2>
                        <p>Currently we have: <br></br> ◉ Authenication for the user manager their own files<br></br> ◉ File uploading to share between people and people <br></br> ◉ And a lot more!</p>
                    </div>
                </div>


            </>
        )
    }
}

export default Home