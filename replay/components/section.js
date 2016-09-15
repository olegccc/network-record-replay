import React from 'react';

export default ({header, children, className}) => {
    return (
        <div className={'section ' + (className || '')}>
            <div className="header">{header}</div>
            <div className="body">
                {children}
            </div>
        </div>
    )
}