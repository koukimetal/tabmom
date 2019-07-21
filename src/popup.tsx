import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';

const main = () => {
    (window as any).a = 3;
    setInterval(() => {
        console.log('hello tab mom');
        (window as any).a = (window as any).a + 1;
    }, 1000);
    console.log('started');
    ReactDOM.render(<App />, document.getElementById('main'));
};

(() => {
    main();
})();
