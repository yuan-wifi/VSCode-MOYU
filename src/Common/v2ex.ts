import * as vscode from "vscode";
import {getLastest} from '../api';

export default function () {
  getLastest().then((res: any,) => {
    let res_title = [],res_url =[];
    for (let index = 0; index < res.length; index++) {
      res_title.push(index+"："+res[index]);
      res_url.push(res[++index]);
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
        console.log(msg);
      });
  });
}
