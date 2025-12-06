import { fetchJSON } from './const.js';

let rs = await fetchJSON('excel/gamedata_const.json');

rs = rs.richTextStyles;

Object.keys(rs).forEach((k) => {
  let temp = rs[k];
  if (temp.indexOf('</color>') > -1) {
    rs[k] = temp
      .replace('<color=', '<span style="color:')
      .replace('>{0}</color>', ';">{0}</span>');
  }
});

export const applyRichText = function (text, isClearStyle = false) {
  let resPoint = []; //处理点数据
  let resText = '';
  let style_start_list = []; //tag的index
  {
    let matches = text.matchAll(/<@[a-z0-9]+\.[a-z0-9]+>/g);
    for (const match of matches) {
      style_start_list.push([match.index, match.index + match[0].length]); //查找样式tag的起止点，不是</>而是@的位置
    }
  }
  // 原数据转处理点
  style_start_list.forEach(([index, endindex]) => {
    let tag = text.substring(index + 2, endindex - 1); //获取的tag
    let tagSlashBeg = text.indexOf('</>', endindex); //tag尾部</>的起始点
    let styledText = text.substring(endindex, tagSlashBeg);
    let pointdata = {
      tagStart: index,
      tag: tag,
      styledText: styledText,
      tagSlashBeg: tagSlashBeg + 3,
    };
    resPoint.push(pointdata);
  });
  //开始处理
  if (resPoint.length > 0) {
    resPoint.forEach((point, i) => {
      //beg
      if (i == 0) {
        resText += text.substring(0, point.tagStart);
      } else {
        resText += text.substring(resPoint[i - 1].tagSlashBeg, point.tagStart);
      }
      //mid
      if (!isClearStyle) {
        resText += rs[point.tag].replace('{0}', point.styledText);
      } else {
        resText += point.styledText;
      }
      //end
      if (i == resPoint.length - 1) {
        resText += text.substring(point.tagSlashBeg);
      }
    });
    return resText;
  } else {
    return text;
  }
};
