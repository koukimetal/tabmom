import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';
import { getRules, getCurrentTime } from './proxy';
import { CurrentMap } from 'components/system/actions';

const main = async () => {
    const rules = (await getRules()) || [];
    const current: CurrentMap = {};

    await Promise.all(
        rules.map(async rule => {
            const time = await getCurrentTime(rule.id);
            current[rule.id] = time;
        }),
    );
    ReactDOM.render(<App rules={rules} current={current} />, document.getElementById('main'));
};

(async () => {
    await main();
})();
