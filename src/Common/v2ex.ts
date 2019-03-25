import * as vscode from "vscode";
import {getLastest, getContent} from '../api';

export default function () {
  getLastest().then((res: any,) => {
    let res_title = [],res_url :any =[],i= 0;
    for (let index = 0; index < res.length; index++) {
      res_title.push(i+"："+res[index++]);
      res_url.push(res[index]);
      i++;
    }
    /* console.log(res_title);
    console.log(res_url); */
    vscode.window.showQuickPick(
      res_title,
      {
        canPickMany: false,
        ignoreFocusOut: true,
        matchOnDescription: true,
        matchOnDetail: true,
        placeHolder: '你想点看什么？'
      })
      .then(function (msg) {
        //console.log(msg);
        if(msg === undefined){
          console.log("你没有选择文章哦！");
        }
        else{
          getContent(res_url, msg);
        }
      });
  });
}
