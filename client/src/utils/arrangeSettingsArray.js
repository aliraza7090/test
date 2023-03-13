import {INDICATORS} from "../constants";

const arrangeSettingsArray = (setting) => {
    return setting.length > 0
        ? setting.reduce((settings, _setting) => {

            if (_setting.operation === 'AUTO') {
                if (_setting.indicator === INDICATORS.trailing)
                    settings['trailing'] = _setting;
                else if (_setting.indicator === INDICATORS.rsi)
                    settings['rsi'] = _setting
            } else
                settings['manual'] = _setting;
            return settings;
        }, {})
        : console.log('setting is empty') && {}
};

export default arrangeSettingsArray;