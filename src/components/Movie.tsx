import * as React from 'react';

export interface MovieComponentProps {
    
}

export default class MovieComponent extends React.Components<{}, {}> {
    render() {
        return <div>{this.props.id}</div>;
    }
}
