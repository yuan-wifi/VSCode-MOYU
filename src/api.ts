
import axios from 'axios';
import * as vscode from "vscode";

function getApi(url: string) {
  return new Promise(resolve => {
    axios
      .get(url)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        console.log(err);
        vscode.window.showInformationMessage("哎哟，帖子飞了。。。");
        resolve();
      });
  });
}

export { getApi };