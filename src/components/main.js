import React, { Component } from 'react';
import axios from 'axios';
import Scorecard from './scorecard';
import AddCard from './addcard';
import CardDetails from './carddetails';
import LoadingCard from './loadingcard';
import _ from 'lodash';
const $ = window.$;
const password = 'abs';

class Main extends Component {
    constructor(props) {
        super(props);
        this.setEdit = this.setEdit.bind(this);
        this.updateScore = this.updateScore.bind(this);
        this.cancelAdd = this.cancelAdd.bind(this);
        this.uploadScore = this.uploadScore.bind(this);
        this.state = {
            scores: [],
            search: '',
            searchresults: [],
            edit: null,
            file: null,
            loading: 0,
            initialload: false,
            searching: true,
            pw: false
        }
    }

    componentWillMount() {        
        const formdata = new FormData();
        formdata.append('checktype', 'pullten');
        axios({
            method: 'post',
            url: 'http://18.237.174.123/internalapi.php',
            data: formdata
        }).then(response => {
            this.setState({scores: response.data, initialload: true, searching: false});
        });
    }

    componentDidMount() {
        $('#passwordinput').focus();
        window.addEventListener('keyup', this.clickButton);
    }

    componentDidUpdate() {
        if (this.state.edit === null && this.state.file === null && this.state.loading === 0) {
            $('#greyout').remove();
            $('html, body').css({
                overflow: 'auto',
                height: 'auto'
            });
        }else {
            if (!$('#greyout').length) {
                $('body').append('<div id="greyout" style="position: fixed; top: 0; left: 0; height: 100%; width: 100%; background: rgba(68, 68, 68, 0.7)"></div>');
                $('html, body').css({
                    overflow: 'hidden',
                    height: '100%'
                });
            }
        }
        if (this.state.pw) {
            window.removeEventListener('keyup', this.clickButton);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('keyup', this.clickButton); 
    }

    clickButton(event) {
        if (event.keyCode === 13) {
            $('#passwordsubmit').trigger('click');
        }
    }

    openPDF(id) {
        window.open('http://18.237.174.123/scores/' + id + '.pdf','_blank');
    }

    updateSearch(e) {        
        this.setState({search: e.target.value, scores: [], searching: true});
        const searchterm = e.target.value.toLowerCase();
        this.runSearch(searchterm);        
    }

    setEdit(value) {
        this.setState({edit: value});
    }

    updateScore(id, newvalues) {
        const formdata = new FormData();
        formdata.append('id', id);
        formdata.append('title', newvalues.title);
        formdata.append('author', newvalues.author);
        formdata.append('type', newvalues.type);
        formdata.append('year', newvalues.year);
        formdata.append('checktype', 'updatescore');
        axios({
            method: 'post',
            url: 'http://18.237.174.123/internalapi.php',
            data: formdata
        });
        this.setState({scores: [], searching: true});
        this.runSearch(this.state.search.toLowerCase());
    }

    runSearch = _.debounce(searchterm => {        
        if (searchterm === '') {
            const formdata = new FormData();
            formdata.append('checktype', 'pullten');
            axios({
                method: 'post',
                url: 'http://18.237.174.123/internalapi.php',
                data: formdata
            }).then(response => {
                this.setState({scores: response.data, searching: false});
            });
        }else {
            const searchterms = searchterm.split(' ');
            const formdata = new FormData();
            formdata.append('checktype', 'pullsearch');
            formdata.append('searchterms', JSON.stringify(searchterms));
            axios({
                method: 'post',
                url: 'http://18.237.174.123/internalapi.php',
                data: formdata
            }).then(response => {
                this.setState({scores: response.data, searching: false});
            });
        }        
    }, 250);

    addScore() {
        const that = this;
        if (!$('#addscore').length) {
            $('body').append('<input type="file" id="addscore" style="display: none" />');
            $('#addscore').change(function(e) {
                const file = e.target.files[0];
                if(file.type !== "application/pdf"){
                    $('#addscore').remove();
                    alert(file.name + ' is not a pdf file.');
                    return;
                }
                that.setState({file});
                $('#addscore').remove();
            });
            $('#addscore').trigger('click');
        }else {
            $('#addscore').trigger('click');
        }      
    }

    cancelAdd() {
        this.setState({file: null});
    }

    uploadScore(file, newvalues) {
        this.setState({file: null, loading: 1});
        const formdata = new FormData();
        formdata.append('title', newvalues.title);
        formdata.append('author', newvalues.author);
        formdata.append('type', newvalues.type);
        formdata.append('year', newvalues.year);
        formdata.append('file', file);
        formdata.append('checktype', 'addscore');
        axios({
            method: 'post',
            url: 'http://18.237.174.123/internalapi.php',
            data: formdata
        }).then(response => {
            this.setState({scores: [], searching: true, loading: 0});
            this.runSearch(this.state.search.toLowerCase());
        });        
    }

    render() {
        return (
            <div>
                {!this.state.pw &&
                    <div style={{textAlign: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                        <p style={{margin: '0 auto 4px auto', fontSize: '14px', color: '#666'}}>Enter Password</p>
                        <input id="passwordinput" type="password" style={{height: '30px', width: '200px', fontSize: '16px', textAlign: 'center'}} />
                        <div id="passwordsubmit" className="button" style={{textAlign: 'center', cursor: 'pointer', margin: '20px auto 20px auto', width: '120px', height: '30px', background: '#0494e1', borderRadius: '2px'}} onClick={() => {if ($('#passwordinput').val() === password) {this.setState({pw: true});} } }>
                            <span style={{lineHeight: '30px', height: '100%', width: '100%', color: 'white', fontSize: '14px'}}>SUBMIT</span>
                        </div>
                    </div>
                }
                {(!this.state.initialload && this.state.pw) &&
                    <div>Loading...</div>
                }
                {(this.state.initialload && this.state.pw) &&
                    <div style={{width: '90%', margin: '0 5% 0 5%'}}>
                        <div style={{textAlign: 'center'}}>
                            <input type="text" style={{background: 'url(http://18.237.174.123/searchicon.png) 7px 7px no-repeat', backgroundSize: '18px', margin: '20px auto', height: '30px', width: '30%', fontSize: '16px', paddingLeft: '30px'}} value={this.state.search} onChange={(e) => this.updateSearch(e)}/>
                        </div>
                        <div style={{position: 'relative'}}>
                            <h1 style={{textAlign: 'center', margin: '0', color: '#666'}}>{(this.state.searching) ? 'Searching...' : (this.state.search === '') ? 'Recent Additions' : 'Search Results'}</h1>
                            {!this.state.searching &&
                                <div>
                                    <div className="button" style={{textAlign: 'center', cursor: 'pointer', margin: '20px auto 20px auto', width: '120px', height: '30px', background: '#0494e1', borderRadius: '2px', position: 'absolute', left: '4px', top: '-14px'}} onClick={() => this.addScore()}>
                                        <span style={{lineHeight: '30px', height: '100%', width: '100%', color: 'white', fontSize: '14px'}}>ADD SCORE</span>
                                    </div>
                                    {this.state.scores.map(value => {
                                        return <Scorecard value={value} theid={value.id} key={value.id} setEdit={this.setEdit}/>
                                    })}
                                    {this.state.scores.length === 0 &&
                                        <p style={{textAlign: 'center', marginTop: '50px'}}>No Scores Match Your Search Critera</p>
                                    }
                                </div>
                            }                            
                        </div>   
                        {this.state.edit !== null &&
                            <CardDetails setEdit={this.setEdit} value={this.state.edit} updateScore={this.updateScore}/>
                        }   
                        {this.state.file !== null &&
                            <AddCard file={this.state.file} cancelAdd={this.cancelAdd} uploadScore={this.uploadScore} />
                        }
                        {this.state.loading === 1 &&
                            <LoadingCard />
                        }
                    </div>                    
                }
            </div>
        );
    }
}

export default Main;