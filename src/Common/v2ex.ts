import * as vscode from "vscode";
import { getLastest, getContent } from '../api';

export default function () {
  getLastest().then((res: any, ) => {
    let res_title = [], res_url: any[] = [], i = 0, chooseId = 0;
    for (let index = 0; index < res.length; index++) {
      res_title.push(i + "：" + res[index]);
      res_url.push(res[++index]);
      i++;
    }
    vscode.window.showQuickPick(
      res_title,
      {
        canPickMany: false,
        ignoreFocusOut: true,
        matchOnDescription: true,
        matchOnDetail: true,
        placeHolder: '你想点看啥？'
      })
      .then(function (msg) {
        if (msg === undefined) { }
        else {
          let choose = parseInt(msg.split("：")[0]);
          getContent(res_url[choose]);
        }
  });
});
}
