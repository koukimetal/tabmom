jest.mock('../../shared', () => ({
    calculateNowMinutes: jest.fn().mockImplementation(() => 10),
}));
import { updateNowDate, alarmListner, AlarmName } from '../';
import { RuleManager } from '../rule_manager';
describe('test for back', () => {
    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (global as any).chrome = {
            runtime: {
                sendMessage: jest.fn(),
            },
        };
    });
    test('updateNowDate', () => {
        jest.unmock('../../proxy');
        updateNowDate(1, 2);
        expect((chrome.runtime.sendMessage as jest.Mock).mock.calls[0][0]).toMatchSnapshot();
    });
    test('test index', async () => {
        const getRuleOrder = jest.fn().mockResolvedValue([]);
        require('../../proxy').getRuleOrder = getRuleOrder;
        jest.mock('../rule_manager');
        RuleManager.getInstance = jest.fn().mockResolvedValue({
            handleRule: jest.fn(),
        });
        const updatePreviousMinutes = jest.fn();
        await alarmListner({ name: AlarmName.MINUTE } as chrome.alarms.Alarm, 1, updatePreviousMinutes);
        expect(getRuleOrder.mock.calls.length).toEqual(1);
        expect(updatePreviousMinutes.mock.calls[0][0]).toEqual(10);
    });
});
