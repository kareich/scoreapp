import React, { Component } from 'react';
const PDFJS = window.PDFJS;
const $ = window.$;

class AddCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            author: '',
            type: '',
            year: ''
        }
    }

    componentDidMount() {
        const file = this.props.file;
        this.setState({title: file.name.replace('.pdf', '')});
        if (FileReader) {
            const cardheight = $('#addcard').height();
            let roomleft = window.innerHeight - cardheight - 40;
            roomleft = (roomleft > 200) ? 200 : roomleft;
            $('#canvas').height(roomleft);
            if(file.type !== "application/pdf"){
                console.error(file.name, "is not a pdf file.")
                return
            }            
            const fileReader = new FileReader();  
            fileReader.onload = function() {
                const typedarray = new Uint8Array(this.result);
                PDFJS.getDocument(typedarray).then(function(pdf) {
                    pdf.getPage(1).then(function(page) {
                        const viewport = page.getViewport(.4);
                        const canvas = document.querySelector("canvas")
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        page.render({
                            canvasContext: canvas.getContext('2d'),
                            viewport: viewport
                        });
                    });

                });
            };
            fileReader.readAsArrayBuffer(file);
        }
        window.addEventListener('keyup', this.clickButton);  
        $('#addscoretitle').focus();
    }

    componentWillUnmount() {
        window.removeEventListener('keyup', this.clickButton); 
    }

    clickButton(event) {
        if (event.keyCode === 13) {
            $('#addscorebutton').trigger('click');
        }
    }

    updateDetail(value, type) {
        this.setState({[type]: value});
    }

    render() {
        const types = ['Collection', 'Exercise', 'Fanfare', 'Hornpipe', 'Instructional', 'Jig', 'March', 'Reel', 'Slow Air', 'Strathspey', 'Waltz'];
        let buttonstyle = {cursor: 'pointer', margin: '20px auto 20px auto', width: '100px', height: '30px', background: '#0494e1', borderRadius: '2px', float: 'left'};
        let buttonclick = () => this.props.uploadScore(this.props.file, this.state);
        if (this.state.title === '' || this.state.author === '' || this.state.year === '' || isNaN(this.state.year) || this.state.year < 1800) {
            buttonstyle = {margin: '20px auto 20px auto', width: '100px', height: '30px', background: '#666', borderRadius: '2px', float: 'left'};
            buttonclick = null;
        }
        return (                
            <div id="addcard" style={{position: 'absolute', top: '50%', left: '50%', backgroundColor: 'white', width: '400px', zIndex: 1, textAlign: 'center', transform: 'translate(-50%, -50%)', borderRadius: '3px', boxShadow: '2px 2px 2px rgba(68,68,68,0.6)'}}>
                <p style={{fontSize: '18px', color: '#666', margin: '4px auto 0 auto', fontWeight: 'bold'}}>New Score Details</p>
                <canvas id="canvas" style={{height: '0'}}></canvas>
                <p style={{color: '#666', fontSize: '12px', margin: '16px auto 2px auto'}}>Title</p>
                <input id="addscoretitle" type="text" style={{fontSize: '14px', textAlign: 'center', width: '300px', height: '24px'}} value={this.state.title} onChange={e => this.updateDetail(e.target.value, 'title')} />
                <p style={{color: '#666', fontSize: '12px', margin: '16px auto 2px auto'}}>Author</p>
                <input type="text" style={{fontSize: '14px', textAlign: 'center', width: '300px', height: '24px'}} value={this.state.author} onChange={e => this.updateDetail(e.target.value, 'author')} />
                <p style={{color: '#666', fontSize: '12px', margin: '16px auto 2px auto'}}>Type</p>
                <select style={{fontSize: '14px', textAlign: 'center', width: '300px', height: '24px'}} value={this.state.type} onChange={e => this.updateDetail(e.target.value, 'type')}>
                    <option value="" disabled></option>
                    {types.map(value => {
                            return <option key={value} value={value}>{value}</option>
                        })
                    }
                </select>
                <p style={{color: '#666', fontSize: '12px', margin: '16px auto 2px auto'}}>Year</p>
                <input type="text" style={{fontSize: '14px', textAlign: 'center', width: '300px', height: '24px'}} value={this.state.year} onChange={e => this.updateDetail(e.target.value, 'year')} />
                <div style={{width: '220px', margin: '0 auto'}}>
                    <div id="addscorebutton" className="button" style={buttonstyle} onClick={buttonclick}>
                        <span style={{lineHeight: '30px', height: '100%', width: '100%', color: 'white', fontSize: '14px'}}>DONE</span>
                    </div>
                    <div className="button" style={{cursor: 'pointer', margin: '20px auto 20px auto', width: '100px', height: '30px', background: '#f44336', borderRadius: '2px', float: 'right'}} onClick={() => this.props.cancelAdd()}>
                        <span style={{lineHeight: '30px', height: '100%', width: '100%', color: 'white', fontSize: '14px'}}>CANCEL</span>
                    </div>
                    <div style={{clear: 'both'}}></div>
                </div>
                
            </div>
        );
    }
}

export default AddCard;