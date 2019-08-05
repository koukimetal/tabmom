import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';
import { getRule, getCurrentTime, getRuleOrder } from './proxy';
import { CurrentMap, RuleMap } from 'components/system/actions';

const main = async () => {
    const ruleOrder = (await getRuleOrder()) || [];

    const rules: RuleMap = {};

    await Promise.all(
        ruleOrder.map(async id => {
            rules[id] = await getRule(id);
        }),
    );
    const current: CurrentMap = {};

    await Promise.all(
        ruleOrder.map(async id => {
            const time = await getCurrentTime(id);
            current[id] = time;
        }),
    );
    ReactDOM.render(<App ruleOrder={ruleOrder} current={current} rules={rules} />, document.getElementById('main'));
};

(async () => {
    await main();
})();
