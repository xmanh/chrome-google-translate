const translate = async (input) => {
  try {
    const items = await chrome.storage.sync.get(['xLang']);
    const targetLang = items['xLang'] ? items['xLang'] : 'vi';

    const url =
      'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' +
      targetLang +
      '&dt=t&q=' +
      encodeURI(input);

    const response = await fetch(url);
    const result = await response.json();

    const data = result[0] || {};
    let output = '';
    for (let i in data) {
      output += data[i][0];
    }

    return output;
  } catch (error) {
    console.error('translate', error);
    return '';
  }
};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.method === 'translate') {
    translate(msg.data).then(sendResponse);
  }
  return true;
});
