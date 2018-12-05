import React, { Component } from 'react';
const $ = window.$;

class CardDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: props.value.title,
            author: props.value.author,
            type: props.value.type,
            year: props.value.year
        }
    }

    componentDidMount() {
        $('#editscoretitle').focus();
        window.addEventListener('keyup', this.clickButton);
    }

    componentWillUnmount() {
        window.removeEventListener('keyup', this.clickButton); 
    }

    clickButton(event) {
        if (event.keyCode === 13) {
            console.log('yo yo yo');
            $('#editscorebutton').trigger('click');
        }
    }

    updateDetail(value, type) {
        this.setState({[type]: value});
    }

    submitChange() {
        if (this.state.title !== this.props.value.title || this.state.author !== this.props.value.author || this.state.type !== this.props.value.type || this.state.year !== this.props.value.year) {
            this.props.updateScore(this.props.value.id, this.state);
        }
        this.props.setEdit(null);
    }

    render() {
        const types = ['Exercise', 'Fanfare', 'Hornpipe', 'Instructional', 'Jig', 'March', 'Reel', 'Slow Air', 'Strathspey', 'Waltz'];
        let buttonstyle = {cursor: 'pointer', margin: '20px auto 20px auto', width: '100px', height: '30px', background: '#0494e1', borderRadius: '2px'};
        let buttonclick = () => this.submitChange();
        if (this.state.title === '' || this.state.author === '' || this.state.year === '' || isNaN(this.state.year) || this.state.year < 1800) {
            buttonstyle = {margin: '20px auto 20px auto', width: '100px', height: '30px', background: '#666', borderRadius: '2px'};
            buttonclick = null;
        }
        return (
            <div style={{position: 'absolute', top: '50%', left: '50%', backgroundColor: 'white', width: '400px', zIndex: 1, textAlign: 'center', transform: 'translate(-50%, -50%)', borderRadius: '3px', boxShadow: '2px 2px 2px rgba(68,68,68,0.6)'}}>
                <p style={{fontSize: '18px', color: '#666', margin: '4px auto 0 auto', fontWeight: 'bold'}}>Edit Score Details</p>
                <p style={{color: '#666', fontSize: '12px', margin: '16px auto 2px auto'}}>Title</p>
                <input id="editscoretitle" type="text" style={{fontSize: '14px', textAlign: 'center', width: '300px', height: '24px'}} value={this.state.title} onChange={e => this.updateDetail(e.target.value, 'title')} />
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
                <div id="editscorebutton" className="button" style={buttonstyle} onClick={buttonclick}>
                    <span style={{lineHeight: '30px', height: '100%', width: '100%', color: 'white', fontSize: '14px'}}>DONE</span>
                </div>
            </div>
        );
    }
}

export default CardDetails;