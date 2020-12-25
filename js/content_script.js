if (!window["-google-translate-loaded"]) {
  window["-google-translate-loaded"] = true;

  new (function () {
    var port = chrome.extension.connect();

    // show result
    port.onMessage.addListener(function (m) {
      switch (m.message) {
        case "result":
          var text = "";

          for (i in m.result) {
            text += m.result[i][0];
          }

          var d = document.createElement("DIV");
          //d.id = '-google-translate-dialog';
          d.className = "google-translate";
          d.style.display = "none";
          d.setAttribute(
            "style",
            "display: block;" +
              "max-width: 600px;" +
              "border: none; border-radius: 4px;" +
              "margin: 0; padding: 10px;" +
              "position: absolute; top: 0;left: 0;" +
              "color: #fff; background-color: rgba(0,0,0,0.8);" +
              "text-align: justify; font-size:13px; font-family: Arial; line-height: 1.4em;" +
              "overflow: visible;" +
              "z-index: 999999;"
          );

          d.innerHTML = text.replace("\n", "<br/>");

          document.body.appendChild(d);

          (function (d) {
            var offset = 3;
            var selection = window.getSelection();

            if (!selection || !selection.baseNode) return;

            offsets = getOffsets(selection);

            if (
              offsets.top - document.documentElement.scrollTop >=
              d.offsetHeight
            )
              d.style.top = offsets.top - d.offsetHeight - offset + "px";
            else d.style.top = offsets.top + 20 + offset + "px";

            d.style.left = offsets.left + "px";
          })(d);
          //window.getSelection().empty();
          break;
      }
    });

    function translate() {
      var text = window.getSelection().toString();
      if (text.length > 0) {
        port.postMessage({
          message: "translate",
          text: text,
        });
      }
    }

    // onmouseup : Ctrl + select text -> send text
    document.body.addEventListener(
      "mouseup",
      function (e) {
        if (e.ctrlKey) {
          translate();
        }
      },
      false
    );

    var ctrlKeyCount = 0;
    document.body.addEventListener(
      "keyup",
      function (e) {
        if (e.key == "Control") {
          ctrlKeyCount++;
          setTimeout(function () {
            ctrlKeyCount = 0;
          }, 300);
        }

        if (ctrlKeyCount == 2) {
          ctrlKeyCount = 0;
          translate();
        }
      },
      false
    );

    // onmousedown : hide dialog
    document.body.addEventListener(
      "mousedown",
      function (e) {
        var r = true;
        e = e.srcElement;
        while (e.parentNode) {
          if (e.className == "google-translate") {
            r = false;
            break;
          }
          e = e.parentNode;
        }
        if (r) {
          var items = document.querySelectorAll(".google-translate");
          for (var i = 0; i < items.length; i++) {
            items[i].parentNode.removeChild(items[i]);
          }
        }
      },
      false
    );
  })();
}

function getOffsets(selection) {
  var tmpNode = document.createElement("span");
  selection.getRangeAt(0).insertNode(tmpNode);
  offsets = _getOffsets(tmpNode);
  tmpNode.parentNode.removeChild(tmpNode);
  delete tmpNode;

  return offsets;
}

function _getOffsets(el) {
  var b = el.getBoundingClientRect(),
    doc = document.documentElement;
  return {
    top: b.top + (window.pageYOffset || doc.scrollTop) - doc.clientTop,
    left: b.left + (window.pageXOffset || doc.scrollLeft) - doc.clientLeft,
  };
}
