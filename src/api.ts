
import axios from 'axios';

const v2ex_url = "https://www.v2ex.com";

function getLastest(type?: string) {
  return new Promise((resolve) => {
    axios
      .get(v2ex_url + "/api/topics/latest.json")
      .then(res => {
        let results = [];
        for (let index = 0; index < Object.keys(res.data).length; index++) {
          results.push(res.data[index].title);
          results.push(res.data[index].url);
        }
        resolve(results);
      })
      .catch((err) => {
        console.log(err);
        resolve({});
      });
  });
}

function getContent(urls: [], msg: string) {
  let chooseArr = [],chooseId = 0;
  chooseArr = msg.split("：");
  chooseId = parseInt(chooseArr[0]);
  axios
    .get(urls[chooseId])
    .then(res => {
      console.log(res.data);
    })
    .catch(err => {
      console.log(err);
    });
  
}



export { getLastest, getContent };