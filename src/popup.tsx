import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';
import { getRules, getCounter } from './proxy';

const main = async () => {
    const rules = await getRules();
    const counter = await getCounter();
    console.log('counter', counter);
    ReactDOM.render(<App rules={rules} counter={counter} />, document.getElementById('main'));
};

(async () => {
    await main();
})();
