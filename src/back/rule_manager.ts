import {
    getAllTabs,
    MessageType,
    getRule,
    TabInfo,
    getCurrentTime,
    setCurrentTime,
    TimerMessage,
    UpdateRuleMessage,
    setRule,
} from '../proxy';
import { CronRule, TimeRangeType, SkipInfo, ClockConfig } from '../components/system/actions';

export class RuleManager {
    private readonly nowDay: number;
    private readonly nowMinutes: number;
    private readonly previousMinutes: number;
    private readonly tabs: TabInfo[];

    private constructor(nowDay: number, nowMinutes: number, previousMinutes: number, tabs: TabInfo[]) {
        this.nowDay = nowDay;
        this.nowMinutes = nowMinutes;
        this.previousMinutes = previousMinutes;
        this.tabs = tabs;
    }

    public static async getInstance(nowDay: number, nowMinutes: number, previousMinutes: number) {
        const allTabs = await getAllTabs();
        return new RuleManager(nowDay, nowMinutes, previousMinutes, allTabs);
    }

    public isSatisfyOptions(skipInfo?: SkipInfo, weekSetting?: boolean[]) {
        if (weekSetting) {
            if (!weekSetting[this.nowDay]) {
                return false;
            }
        }

        if (skipInfo) {
            const hitTab = this.tabs
                .filter(tab => !(skipInfo.ignorePinned && tab.pinned))
                .find(tab => tab.url.includes(skipInfo.match));
            if (hitTab) {
                return false;
            }
        }
        return true;
    }

    public async isShouldOpen(id: string, clockConfig: ClockConfig, skipInfo?: SkipInfo, weekSetting?: boolean[]) {
        if (clockConfig.type === TimeRangeType.ONCE) {
            const minutes = clockConfig.startTime;
            const isFitTime = this.previousMinutes < minutes && minutes <= this.nowMinutes;
            return isFitTime && this.isSatisfyOptions(skipInfo, weekSetting);
        } else if (clockConfig.type === TimeRangeType.ALL || clockConfig.type === TimeRangeType.MANY) {
            const current = (await getCurrentTime(id)) || clockConfig.period;
            if (clockConfig.type === TimeRangeType.ALL) {
                return this.isSatisfyOptions(skipInfo, weekSetting) && current <= 1;
            } else {
                // MANY
                const inRange = clockConfig.startTime <= this.nowMinutes && this.nowMinutes <= clockConfig.endTime;
                return this.isSatisfyOptions(skipInfo, weekSetting) && inRange && current <= 1;
            }
        }
    }

    public async updateNextCurrent(id: string, clockConfig: ClockConfig) {
        if (
            clockConfig.type !== TimeRangeType.ONCE &&
            (clockConfig.type === TimeRangeType.ALL || clockConfig.type === TimeRangeType.MANY)
        ) {
            const current = (await getCurrentTime(id)) || clockConfig.period;
            const nextCurrent = current <= 1 ? clockConfig.period : current - 1;
            await setCurrentTime(id, nextCurrent);
            const message: TimerMessage = { type: MessageType.TIMER, id, time: nextCurrent };
            chrome.runtime.sendMessage(message);
        }
    }

    public async handleOpenTab(rule: CronRule) {
        if (rule.oneTime) {
            const nextRule = Object.assign({}, rule, { active: false });
            const message: UpdateRuleMessage = {
                type: MessageType.UPDATE_RULE,
                rule: nextRule,
            };
            await setRule(nextRule);
            chrome.runtime.sendMessage(message);
        }
        chrome.tabs.create({ url: rule.url });
    }

    public handleRule = async (id: string) => {
        const rule = await getRule(id);
        const { clockConfig, skipInfo, weekSetting, active } = rule;
        if (!active) {
            return;
        }

        const shouldOpen = await this.isShouldOpen(id, clockConfig, skipInfo, weekSetting);
        await this.updateNextCurrent(id, clockConfig);

        if (shouldOpen) {
            await this.handleOpenTab(rule);
        }
    };
}
