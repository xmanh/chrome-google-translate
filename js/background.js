if (!localStorage["lang"]) {
  localStorage["lang"] = "vi";
}
// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//   chrome.tabs.executeScript(tabId, {
//     file: "js/content_script.js",
//     // allFrames: true,
//   });
// });

chrome.extension.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (m) {
    switch (m.message) {
      case "translate":
        translate(m.text, port);
        break;
    }
  });
});

function translate(text, port) {
  if (!localStorage["lang"]) {
    targetLang = "vi";
  } else {
    targetLang = localStorage["lang"];
  }
  chrome.storage.sync.get("lang", (items) => {
    var targetLang = items["lang"] ? items["lang"] : "vi";

    var url =
      "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=" +
      targetLang +
      "&dt=t&q=" +
      encodeURI(text);

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        try {
          result = JSON.parse(xhr.responseText);
          if (result[0] != "") {
            port.postMessage({
              message: "result",
              result: result[0],
            });
          }
        } catch (error) {
          console.log('Google Translate limited.')
        }
      }
    };
    xhr.send();
  });
}
