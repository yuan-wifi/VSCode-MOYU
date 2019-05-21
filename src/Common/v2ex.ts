import * as vscode from "vscode";
import { getApi } from "../api";
import { resolve } from "url";

const v2ex_url = "https://www.v2ex.com";

/**
 * V2ex程序入口
 */
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

/**
 * 根据输入命令获取不同文章列表
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
        results.push(res[index].replies);
        results.push(res[index].content_rendered);
      }
      let res_title = [],
        res_display_title = [],
        res_url = [],
        res_replies = [],
        res_content_rendered = [],
        i = 0;
      for (let s = 0; s < results.length; s = s + 4) {
        res_display_title.push(
          i + "：" + results[s] + "（回复：" + results[s + 2] + "）"
        );
        res_title.push(results[s]);
        res_url.push(results[s + 1]);
        res_replies.push(results[s + 2]);
        res_content_rendered.push(results[s + 3]);
        i++;
      }
      choosePages(
        res_display_title,
        res_title,
        res_url,
        res_replies,
        res_content_rendered
      );
    });
  }
}

/**
 * 选择帖子
 */
function choosePages(
  res_display_title: any,
  res_title: any,
  res_url: any,
  res_replies: any,
  res_content_rendered: any
) {
  vscode.window
    .showQuickPick(res_display_title, {
      canPickMany: false,
      ignoreFocusOut: true,
      matchOnDescription: true,
      matchOnDetail: true,
      placeHolder: "选一个帖子瞧瞧呢"
    })
    .then(function(msg) {
      if (msg === undefined) {
      } else {
        let choose = parseInt(msg.split("：")[0]);

        /*获取文章标题并绑定链接 */
        let title =
          "<a href=" +
          res_url[choose] +
          "><h1>" +
          res_title[choose] +
          "</h1></a>";

        /*获取文章内容 */
        let topic_Content = res_content_rendered[choose];

        generatePage(
          res_title[choose],
          title,
          topic_Content,
          res_url[choose],
          res_replies[choose]
        );
      }
    });
}

/**
 * 根据选择的帖子去获取数据，并合成网页显示
 */
function generatePage(
  page_Title: string,
  topic_Title: string,
  topic_Content: string,
  topic_Url: string,
  topic_Replies: number
) {
  /*判断回复数是否大于100(大于100产生分页) */
  /*开始获取回复信息(本页) */
  let replies_Html = "",
    Headurl = "",
    Content = "",
    flag = 0,
    replies_Content: string = "",
    replies_Name: string = "",
    replies_Headurl: string = "";

  for (let i = 1; i <= Math.ceil(topic_Replies / 100); i++) {
    /*获取回复信息 */
    getApi(topic_Url + "?p=" + i + "").then((res: any) => {
      flag++;
      /*初步处理返回的网页数据 */
      let MainStr = res.substring(
        res.indexOf('<div id="Main">'),
        res.indexOf('<div class="c">')
      );
      /*再次处理数据(仅保留回复) */
      let content = MainStr.substring(
        MainStr.indexOf('<div class="topic_content">')
      );
      let ss = content.split('<div id="r_');
      for (i = 1; i < ss.length; i++) {
        Headurl = ss[i].substring(
          ss[i].indexOf("<img"),
          ss[i].indexOf("</td>")
        );
        Content = ss[i].substring(ss[i].indexOf('<div class="reply_content">'));
        replies_Headurl =
          '<div class="item" style="margin-top:1rem;"><div class="comment" style="display:flex"><div class="userImage">' +
          Headurl.slice(0, 5) +
          'width="48px" ' +
          Headurl.slice(5, 10) +
          "https:" +
          Headurl.slice(10) +
          "</div>";
        replies_Name =
          '<div style="padding-left: 1rem;"><div class="userName">' +
          ss[i].substring(
            ss[i].indexOf("<strong>"),
            ss[i].indexOf('<div class="sep5">')
          ) +
          "</div>";
        replies_Content =
          Content.substring(
            Content.indexOf('<div class="reply_content">'),
            Content.indexOf("</div>")
          ) + "</div></div></div>";
        
        replies_Html =
          replies_Headurl +
          replies_Name +
          replies_Content +
          replies_Html;
      }
      if (flag == Math.ceil(topic_Replies / 100)){
        /*生成网页 */
        let panel = vscode.window.createWebviewPanel(
          "Content",
          page_Title,
          vscode.ViewColumn.One,
          {
            enableScripts: false,
            retainContextWhenHidden: false
          }
        );
        panel.webview.html =
          '<div style = "margin: 0 auto 0 auto;width:50%;">' +
          topic_Title +
          topic_Content +
          replies_Html;
        console.log(panel.webview.html);
      }
    });
  }
}