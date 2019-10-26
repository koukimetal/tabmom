const setCurrentTimeMock = jest.fn();
const sendMessageMock = jest.fn();
const setRuleMock = jest.fn();
jest.mock('../../proxy', () => ({
    getAllTabs: jest.fn().mockResolvedValue([
        {
            url: 'http://example.com',
            pinned: true,
        },
        {
            url: 'http://example.net',
            pinned: false,
        },
    ]),
    getCurrentTime: jest.fn().mockResolvedValue(1),
    setCurrentTime: setCurrentTimeMock,
    MessageType: {
        TIMER: 'timer',
    },
    setRule: setRuleMock,
}));
import { RuleManager } from '../rule_manager';
import { TimeRangeType, CronRule } from '../../components/system/actions';
describe('test rule managers', () => {
    let activeWeekSetting: boolean[] = [];
    beforeEach(() => {
        activeWeekSetting = [true, true, true, true, true, true, true];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (global as any).chrome = {
            runtime: {
                sendMessage: sendMessageMock,
            },
            tabs: {
                create: jest.fn(),
            },
        };
        setCurrentTimeMock.mockClear();
        sendMessageMock.mockClear();
    });
    test('isSatisfyOptions weekSetting', async () => {
        const manager = await RuleManager.getInstance(1, 2, 1);
        expect(manager.isSatisfyOptions(null, activeWeekSetting)).toBe(true);
        activeWeekSetting[1] = false;
        expect(manager.isSatisfyOptions(null, activeWeekSetting)).toBe(false);
    });
    test('isSatisfyOptions skipInfo', async () => {
        const manager = await RuleManager.getInstance(1, 2, 1);
        expect(
            manager.isSatisfyOptions(
                {
                    ignorePinned: true,
                    match: 'forinstance',
                },
                activeWeekSetting,
            ),
        ).toBe(true);
        expect(
            manager.isSatisfyOptions(
                {
                    ignorePinned: true,
                    match: 'example.com',
                },
                activeWeekSetting,
            ),
        ).toBe(true);
        expect(
            manager.isSatisfyOptions(
                {
                    ignorePinned: false,
                    match: 'example.com',
                },
                activeWeekSetting,
            ),
        ).toBe(false);
    });
    test('isShouldOpen', async () => {
        const manager = await RuleManager.getInstance(1, 2, 1);
        expect(
            await manager.isShouldOpen('fake', {
                type: TimeRangeType.ONCE,
                startTime: 2,
            }),
        ).toBe(true);
        expect(
            await manager.isShouldOpen('fake', {
                type: TimeRangeType.ONCE,
                startTime: 1,
            }),
        ).toBe(false);

        expect(
            await manager.isShouldOpen('fake', {
                type: TimeRangeType.ALL,
                period: 5,
            }),
        ).toBe(true);

        expect(
            await manager.isShouldOpen('fake', {
                type: TimeRangeType.MANY,
                startTime: 2,
                endTime: 4,
                period: 5,
            }),
        ).toBe(true);
        expect(
            await manager.isShouldOpen('fake', {
                type: TimeRangeType.MANY,
                startTime: 4,
                endTime: 5,
                period: 5,
            }),
        ).toBe(false);
    });

    test('updateNextCurrent', async () => {
        const manager = await RuleManager.getInstance(1, 2, 1);
        await manager.updateNextCurrent('fake', {
            type: TimeRangeType.ONCE,
            startTime: 2,
        });
        await manager.updateNextCurrent('fake', {
            type: TimeRangeType.MANY,
            startTime: 4,
            endTime: 5,
            period: 5,
        });
        expect(sendMessageMock.mock.calls.length).toBe(1);
    });

    test('handleOpenTab', async () => {
        const manager = await RuleManager.getInstance(1, 2, 1);
        const ruleBase: CronRule = {
            id: 'fake',
            url: 'fakeurl',
            name: 'name',
            active: true,
            oneTime: true,
            clockConfig: {
                type: TimeRangeType.ONCE,
                startTime: 2,
            },
        };
        await manager.handleOpenTab(ruleBase);
        expect(setRuleMock.mock.calls[0][0].active).toBe(false);
        await manager.handleOpenTab(Object.assign({}, ruleBase, { oneTime: false }));
        expect(setRuleMock.mock.calls.length).toBe(1);
    });
});
