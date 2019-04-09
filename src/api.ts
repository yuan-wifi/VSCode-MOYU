
import axios from 'axios';

function getApi(url: string) {
  return new Promise(resolve => {
    axios
      .get(url)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        console.log(err);
        resolve();
      });
  });
}

export { getApi };