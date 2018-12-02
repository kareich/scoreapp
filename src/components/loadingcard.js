import React from 'react';

const LoadingCard = props => {
        return (                
            <div style={{position: 'absolute', top: '50%', left: '50%', backgroundColor: 'white', width: '400px', zIndex: 1, textAlign: 'center', transform: 'translate(-50%, -50%)', borderRadius: '3px', boxShadow: '2px 2px 2px rgba(68,68,68,0.6)'}}>
                <p style={{fontSize: '18px', color: '#666', margin: '20px auto 20px auto', fontWeight: 'bold'}}>Loading...Please Wait</p>                
            </div>
        );
}

export default LoadingCard;