export const TORAPPU_ENDPOINT = 'https://torappu.prts.wiki';
export const PRTS_BASE_DOMAIN = 'https://prts.wiki';
export const MEDIA_ENDPOINT = 'https://media.prts.wiki';

export const fetchJSON = async function (path) {
  const resp = await fetch(`${TORAPPU_ENDPOINT}/gamedata/latest/` + path);
  return await resp.json();
};

export const DEV_LIST = {
  enko: {
    avatar: '/staff/enko.png',
    name: 'User:Enko',
    desc: '核心开发',
    homepage: 'https://prts.wiki/w/User:Enko',
    donate: 'https://enkosite.epizy.com/donate/',
  },
  mcak: {
    avatar: '/staff/mcak.png',
    spAvatar: true,
    name: 'PRTS.WIKI',
    desc: '技术和平台支持',
    homepage: 'https://prts.wiki',
  },
};
