import * as vscode from "vscode";
import { getApi } from "../api";

const v2ex_url = "https://www.v2ex.com";

export default function() {
  vscode.window
    .showQuickPick(["最新文章", "最热文章"], {
      canPickMany: false,
      ignoreFocusOut: true,
      matchOnDescription: true,
      matchOnDetail: true,
      placeHolder: "你想点看啥？"
    })
    .then(function(msg) {
      if (msg === undefined) {
      } else {
        getList(msg);
      }
    });
}

/*
  根据输入命令获取不同文章列表
*/
function getList(type: string) {
  let url = "";
  if (type === "最新文章") {
    url = v2ex_url + "/api/topics/latest.json";
  } else if (type === "最热文章") {
    url = v2ex_url + "/api/topics/hot.json";
  } else {
    vscode.window.showInformationMessage("抱歉，暂时没有该功能！正在努力中...");
  }
  if (url !== "") {
    getApi(url).then((res: any) => {
      let results = [];
      for (let index = 0; index < Object.keys(res).length; index++) {
        results.push(res[index].title);
        results.push(res[index].url);
      }
      let res_title = [],
        res_url: any[] = [],
        i = 0,
        chooseId = 0;
      for (let index = 0; index < results.length; index++) {
        res_title.push(i + "：" + results[index]);
        res_url.push(results[++index]);
        i++;
      }
      getpages(res_title, res_url);
    });
  }
}

/*
  处理获取到文章详细页面的数据
*/
function getpages(res_title: any, res_url: any) {
  vscode.window
    .showQuickPick(res_title, {
      canPickMany: false,
      ignoreFocusOut: true,
      matchOnDescription: true,
      matchOnDetail: true,
      placeHolder: "你想点看啥？"
    })
    .then(function(msg) {
      if (msg === undefined) {
      } else {
        let choose = parseInt(msg.split("：")[0]);
        getApi(res_url[choose]).then((res: any) => {
          let MainStr = res.substring(
            res.indexOf('<div id="Main">'),
            res.indexOf('<div class="c">')
          );
          let title =
            "<a href=" +
            res_url[choose] +
            ">" +
            MainStr.substring(
              MainStr.indexOf("<h1>"),
              MainStr.indexOf("</h1>")
            ) +
            "</h1></a>";
          let content = MainStr.substring(
            MainStr.indexOf('<div class="topic_content">')
          );
          let topic_content =
            content.substring(
              content.indexOf('<div class="topic_content">'),
              content.indexOf("</div>")
            ) + "</div>";
          let panel = vscode.window.createWebviewPanel(
            "Content",
            msg.split("：")[1],
            vscode.ViewColumn.One,
            {
              enableScripts: false,
              retainContextWhenHidden: false
            }
          );
          panel.webview.html = title + topic_content;
        });
      }
    });
}

