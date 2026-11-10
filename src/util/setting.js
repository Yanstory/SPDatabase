import { useStorage } from '@vueuse/core'

const defaultSetting = {
    curVersion: '0.030',
    //---------------------
    lastVisitedVersion: null,
    lastNewsViewTime: null
}
const settings = useStorage('settings', defaultSetting, localStorage, { mergeDefaults: true })

function getSetting(key) {
    return settings.value[key]
}

function setSetting(key, value) {
    settings.value[key] = value
}

const refreshSettingRange = [
    'curVersion'
]

function refreshSetting() {
    refreshSettingRange.forEach(k => setSetting(k, defaultSetting[k]))
}

export { getSetting, setSetting, refreshSetting }