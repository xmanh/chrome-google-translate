function getOffsets(selection) {
  var tmpNode = document.createElement('span');
  selection.getRangeAt(0).insertNode(tmpNode);
  offsets = _getOffsets(tmpNode);
  tmpNode.parentNode.removeChild(tmpNode);
  delete tmpNode;

  return offsets;
}

function _getOffsets(el) {
  const b = el.getBoundingClientRect();
  const doc = document.documentElement;
  return {
    top: b.top + doc.scrollTop - doc.clientTop,
    left: b.left + doc.scrollLeft - doc.clientLeft,
  };
}

const updatePosition = (d) => {
  const offset = 3;
  const selection = window.getSelection();

  if (!selection || !selection.baseNode) return;

  const offsets = getOffsets(selection);

  if (offsets.top - document.documentElement.scrollTop >= d.offsetHeight)
    d.style.top = offsets.top - d.offsetHeight - offset + 'px';
  else d.style.top = offsets.top + 20 + offset + 'px';

  d.style.left = offsets.left + 'px';
};

const showTranslate = (data) => {
  let text = '';

  for (i in data) {
    text += data[i][0];
  }

  const d = document.createElement('DIV');
  //d.id = '-google-translate-dialog';
  d.className = 'google-translate';
  d.style.display = 'none';
  d.setAttribute(
    'style',
    'display: block;' +
      'max-width: 600px;' +
      'border: none; border-radius: 4px;' +
      'margin: 0; padding: 10px;' +
      'position: absolute; top: 0;left: 0;' +
      'color: #fff; background-color: rgba(0,0,0,0.8);' +
      'text-align: justify; font-size:13px; font-family: Arial; line-height: 1.4em;' +
      'overflow: visible;' +
      'z-index: 999999;'
  );
  d.innerHTML = text.replace('\n', '<br/>');
  document.body.appendChild(d);

  updatePosition(d);
};

if (!window['-google-translate-loaded']) {
  window['-google-translate-loaded'] = true;

  const translate = () => {
    try {
      var text = window.getSelection().toString();
      if (text && text.length > 0) {
        chrome.runtime.sendMessage(
          {
            method: 'translate',
            data: text,
          },
          (response) => {
            response && showTranslate(response);
          }
        );
      }
    } catch (error) {
      console.error('translate', error);
    }
  };

  // onmouseup : Ctrl + Alt -> send text select text
  document.body.addEventListener(
    'keyup',
    (e) => {
      if (e.ctrlKey && e.metaKey) {
        translate();
      }
    },
    false
  );

  // onmouseup : Ctrl + select text -> send text
  document.body.addEventListener(
    'mouseup',
    (e) => {
      if (e.ctrlKey || e.metaKey) {
        translate();
      }
    },
    false
  );

  // onmousedown : hide dialog
  document.body.addEventListener(
    'mousedown',
    function (e) {
      var r = true;
      while (e.parentNode) {
        if (e.className == 'google-translate') {
          r = false;
          break;
        }
        e = e.parentNode;
      }
      if (r) {
        var items = document.querySelectorAll('.google-translate');
        for (var i = 0; i < items.length; i++) {
          items[i].parentNode.removeChild(items[i]);
        }
      }
    },
    false
  );
}
