import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';
import { getRules } from './proxy';

const main = async () => {
    const rules = await getRules();
    ReactDOM.render(<App rules={rules}/>, document.getElementById('main'));
};

(async () => {
    await main();
})();
