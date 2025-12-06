import { fetchJSON } from './const.js';

import { PROFESSTION_MAP } from './general.js';

const SP_SEASON = {
  1: {
    mode: 'ACTIVITY_SEASON',
    seasonCode: 'act1autochess',
    menuitem: {
      icon: 'mdi-dots-triangle',
      text: '盟约',
    },
  },
};

const ACT_EXTRA_DATAKEY = 'autoChessData';

const spCharRedirect = {
  char_601_cguard: '预备干员-近卫(卫戍协议)',
  char_607_cspec: '预备干员-特种(卫戍协议)',
  char_600_cpione: '预备干员-先锋(卫戍协议)',
  char_605_cmedic: '预备干员-医疗(卫戍协议)',
  char_604_ccast: '预备干员-术师(卫戍协议)',
  char_603_csnipe: '预备干员-狙击(卫戍协议)',
  char_602_cdfend: '预备干员-重装(卫戍协议)',
  char_606_csuppo: '预备干员-辅助(卫戍协议)',
  char_612_accast: 'Pith(卫戍协议)',
  char_614_acsupo: 'Raidian(卫戍协议)',
  char_609_acguad: 'Sharp(卫戍协议)',
  char_610_acfend: 'Mechanist(卫戍协议)',
  char_611_acnipe: 'Stormeye(卫戍协议)',
  char_615_acspec: 'Misery(卫戍协议)',
  char_608_acpion: '郁金香(卫戍协议)',
  char_613_acmedc: 'Touch(卫戍协议)',
  //char_617_sharp2: '领主·Sharp',
  //char_616_pithst: '盟约·辅助干员',
};

const OP_DATA = await fetchJSON('excel/character_table.json');
const ACT_DATA = await fetchJSON('excel/activity_table.json');

const getSPDatabase = async function (seasonNo) {
  const season = SP_SEASON[seasonNo.toString()];
  if (season.mode == 'ACTIVITY_SEASON') {
    let actData = ACT_DATA;
    let bondMetaList = actData[ACT_EXTRA_DATAKEY].bondInfoDict;
    let garrisonList =
      actData.activity['AUTOCHESS_SEASON'][season.seasonCode].garrisonDataDict;
    let result = {
      seasonNo,
      dataMode: season.mode,
      season: actData.activity['AUTOCHESS_SEASON'][season.seasonCode],
      extra: actData[ACT_EXTRA_DATAKEY],
      filterRuleSet: [
        genFilterRule(
          '等阶',
          [
            { key: '1', name: 'Ⅰ' },
            { key: '2', name: 'Ⅱ' },
            { key: '3', name: 'Ⅲ' },
            { key: '4', name: 'Ⅳ' },
            { key: '5', name: 'Ⅴ' },
            { key: '6', name: 'Ⅵ' },
          ],
          function (chess) {
            return [chess.rank.toString()];
          }
        ),
        genFilterRule(
          '核心盟约',
          Object.values(bondMetaList).reduce((acc, bond) => {
            if (bond.bondType == 'SEASON') {
              return [...acc, { key: bond.bondId, name: bond.name }];
            }
            return acc;
          }, []),
          function (chess) {
            return chess.bonds.map((b) => b.id);
          }
        ),
        genFilterRule(
          '附加盟约',
          Object.values(bondMetaList).reduce((acc, bond) => {
            if (bond.bondType == 'REGULAR') {
              return [...acc, { key: bond.bondId, name: bond.name }];
            }
            return acc;
          }, []),
          function (chess) {
            return chess.bonds.map((b) => b.id);
          }
        ),
        genFilterRule(
          '特质词条',
          uniquied(
            Object.values(garrisonList).map((gar) => {
              return { key: gar.eventTypeDesc, name: gar.eventTypeDesc };
            })
          ),
          function (chess) {
            return chess.gars.map((g) => g.eventTypeDesc);
          }
        ),
      ],
      opList: {},
    };
    Object.values(result.season.charChessDataDict).forEach((chess) => {
      if (!chess.chessId.includes('diy') && chess.upgradeChessId) {
        //console.log(chess.chessId);
        let isGolden = 0; //精锐

        let chessChar = result.season.charShopChessDatas[chess.chessId];
        let charId = chessChar.charId; //干员
        //---------------------------------------------
        if (!(charId in result.opList)) {
          let charRaw = OP_DATA[charId];
          result.opList[charId] = {
            id: charId,
            rarity: charRaw.rarity.replace('TIER_', ''),
            name: charRaw.name,
            profession: PROFESSTION_MAP[charRaw.profession],
            link: charId in spCharRedirect ? spCharRedirect[charId] : null,
            chess: [],
          };
        }
        result.opList[charId].chess[isGolden] = {
          charId,
          rank: chessChar.chessLevel, //等阶
          bonds: chess.bondIds.map((b) => {
            return { id: b, name: result.extra.bondInfoDict[b].name };
          }), //盟约
          gars: chess.garrisonIds.map((g) => {
            return result.season.garrisonDataDict[g];
          }), //特质
        };

        //------golden------
        chess = result.season.charChessDataDict[chess.upgradeChessId];
        isGolden = 1; //精锐

        result.opList[charId].chess[isGolden] = {
          charId,
          rank: chessChar.chessLevel, //等阶
          bonds: chess.bondIds.map((b) => {
            return { id: b, name: result.extra.bondInfoDict[b].name };
          }), //盟约
          gars: chess.garrisonIds.map((g) => {
            return result.season.garrisonDataDict[g];
          }), //特质
        };
      }
    });
    return result;
  }
};

const genFilterRule = function (name, items, valueToVerify) {
  return {
    name,
    items,
    valueToVerify,
    getItemTexts: function (keyArray) {
      return keyArray
        .map((k) => {
          let r = this.items.find((item) => item.key == k);
          return r.name;
        })
        .sort((a, b) => {
          let an = this.items.findIndex((e) => e.name == a);
          let bn = this.items.findIndex((e) => e.name == b);
          return an - bn;
        });
    },
  };
};

const uniquied = function (data) {
  const seen = new Set();
  const uniqueArr = data.filter((item) => {
    const key = `${item.key}|${item.name}`; // 组合唯一标识
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
  return uniqueArr;
};

export { SP_SEASON, getSPDatabase };
