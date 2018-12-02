import React from 'react';

const openPDF = id => {
    window.open('http://18.237.174.123/scores/' + id + '.pdf','_blank');
}

const openRaw = (id, extension) => {
    window.open('http://18.237.174.123/scores/' + id + '.' + extension,'_blank');
}

const clipString = string => {
    const length = 36;
    if (string.length < length) {
        return string;
    }
    return string.substring(0, length-3) + '...';
}

const convertYear = year => {
    if (year === '0') {
        return '';
    }
    return year;
}

export default props => {
    const value = props.value;
    return (
        <div style={{position: 'relative', height: '220px', width: '300px', display: 'inline-block', margin: '5px', border: '1px solid #bcbcbc', boxShadow: '2px 2px 2px rgba(68,68,68,0.6)', borderRadius: '3px'}}>
            <span style={{padding: 0, margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#444', position: 'absolute', top: '2px', left: '2px'}}>{clipString(value.title)}</span>
            <span style={{margin: '0', padding: '0', position: 'absolute', top: '19px', left: '2px', fontSize: '12px', color: '#888'}}>{value.author}</span>
            <span style={{margin: '0', padding: '0', position: 'absolute', top: '34px', left: '2px', fontSize: '12px', color: '#888'}}>{value.type}</span>
            <span style={{margin: '0', padding: '0', position: 'absolute', top: '50px', left: '2px', fontSize: '12px', color: '#888'}}>{convertYear(value.year)}</span>
            <img alt="" onClick={() => {openPDF(value.id)}} src={'http://18.237.174.123/thumbnails/' + value.id + '.png'} style={{cursor: 'pointer', maxHeight: '160px', maxWidth: '280px', position: 'absolute', bottom: '0', left: '50%', transform: 'translate(-50%, 0)'}}/>
            <span onClick={() => props.setEdit(value)} style={{color:'#0494e1', cursor: 'pointer', fontSize: '12px', position: 'absolute', top: '2px', right: '4px'}}>Edit</span>
            {value.raw !== null &&
                <span onClick={() => {openRaw(value.id, value.raw)}} style={{color:'#0494e1', cursor: 'pointer', fontSize: '12px', position: 'absolute', top: '16px', right: '4px'}}>Raw File</span>
            }
        </div>
    );
}