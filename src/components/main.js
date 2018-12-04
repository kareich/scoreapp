import React, { Component } from 'react';
import axios from 'axios';
import Scorecard from './scorecard';
import AddCard from './addcard';
import CardDetails from './carddetails';
import LoadingCard from './loadingcard';
import _ from 'lodash';
const $ = window.$;


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
            loading: 0
        }
    }

    componentWillMount() {
        const formdata = new FormData();
        formdata.append('checktype', 'pullscores');
        axios({
            method: 'post',
            url: 'http://18.237.174.123/internalapi.php',
            data: formdata
        }).then(response => {
            this.setState({scores: response.data});
        });
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
    }

    openPDF(id) {
        window.open('http://18.237.174.123/scores/' + id + '.pdf','_blank');
    }

    updateSearch(e) {        
        this.setState({search: e.target.value});
        const searchterm = e.target.value.toLowerCase();
        this.runSearch(searchterm);        
    }

    setEdit(value) {
        this.setState({edit: value});
    }

    updateScore(id, newvalues) {
        let copy = [...this.state.scores];
        for (let i = 0; i < copy.length; i++) {
            if (copy[i].id === id) {
                copy[i].title = newvalues.title;
                copy[i].author = newvalues.author;
                copy[i].type = newvalues.type;
                copy[i].year = newvalues.year;
            }
        }
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
        this.setState({scores: copy});
    }

    runSearch = _.debounce(searchterm => {
        const searchterms = searchterm.split(' ');
        let searchresults = this.state.scores.filter(value => {
            let match = 0;
            const title = value.title.toLowerCase();
            const author = value.author.toLowerCase();
            const type = value.type.toLowerCase();
            for (let i = 0; i < searchterms.length; i++) {
                if (title.indexOf(searchterms[i]) > -1 || author.indexOf(searchterms[i]) > -1 || type.indexOf(searchterms[i]) > -1) {
                    match++;
                }
            }
            return (match === searchterms.length);
        });
        this.setState({searchresults});
    }, 300);

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
            let copy = [...this.state.scores];
            const newscore = {
                title: newvalues.title,
                author: newvalues.author,
                type: newvalues.type,
                year: newvalues.year,
                id: +response.data
            };
            copy.push(newscore);
            this.setState({scores: copy, loading: 0});
        });
        
    }

    render() {
        let lastten = [];
        for (let i = this.state.scores.length-10; i < this.state.scores.length; i++) {
            lastten.push(this.state.scores[i]);
        }
        lastten.reverse();
        return (
            <div>
                {this.state.scores.length === 0 &&
                    <div>Loading...</div>
                }
                {this.state.scores.length > 0 &&                    
                    <div style={{width: '90%', margin: '0 5% 0 5%'}}>
                        <div style={{textAlign: 'center'}}>
                        <input type="text" style={{background: 'url(http://18.237.174.123/searchicon.png) 7px 7px no-repeat', backgroundSize: '18px', margin: '20px auto', height: '30px', width: '30%', fontSize: '16px', paddingLeft: '30px'}} value={this.state.search} onChange={(e) => this.updateSearch(e)}/>
                        </div>
                        {this.state.search === '' &&
                            <div style={{position: 'relative'}}>
                                <h1 style={{textAlign: 'center', margin: '0', color: '#666'}}>Most Recent Additions</h1>
                                <div>
                                <div className="button" style={{textAlign: 'center', cursor: 'pointer', margin: '20px auto 20px auto', width: '120px', height: '30px', background: '#0494e1', borderRadius: '2px', position: 'absolute', left: '4px', top: '-14px'}} onClick={() => this.addScore()}>
                                    <span style={{lineHeight: '30px', height: '100%', width: '100%', color: 'white', fontSize: '14px'}}>ADD SCORE</span>
                                </div>
                                    {lastten.map(value => {
                                        return <Scorecard value={value} theid={value.id} key={value.id} setEdit={this.setEdit}/>
                                    })}
                                </div>
                            </div>                            
                        }
                        {this.state.search !== '' &&
                            <div style={{position: 'relative'}}>
                                <h1 style={{textAlign: 'center', margin: '0', color: '#666'}}>Search Results</h1>
                                <div className="button" style={{textAlign: 'center', cursor: 'pointer', margin: '20px auto 20px auto', width: '120px', height: '30px', background: '#0494e1', borderRadius: '2px', position: 'absolute', left: '4px', top: '-14px'}} onClick={() => this.addScore()}>
                                    <span style={{lineHeight: '30px', height: '100%', width: '100%', color: 'white', fontSize: '14px'}}>ADD SCORE</span>
                                </div>
                                <div>
                                    {this.state.searchresults.map(value => {
                                        return <Scorecard value={value} theid={value.id} key={value.id} setEdit={this.setEdit}/>
                                    })}
                                </div>
                            </div>
                        }
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