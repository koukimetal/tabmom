import * as React from 'react';
import { connect } from 'react-redux';
import { FormGroup } from '@material-ui/core';
import { ADay } from './day';

class WeekSettingInner extends React.Component<{}> {
    public render() {
        const res: JSX.Element[] = [];
        for (let day = 0; day < 7; day++) {
            res.push(<ADay day={day} />);
        }

        return (
            <div>
                <FormGroup row>{res}</FormGroup>
            </div>
        );
    }
}

export const WeekSetting = connect<null, null>(
    null,
    null,
)(WeekSettingInner);
