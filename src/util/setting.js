import { useStorage } from '@vueuse/core'

const defaultSetting = {
    curVersion: '0.021',
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

export { getSetting, setSetting }