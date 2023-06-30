// Data Start
var root = document.body;

var lss = {}; // Local Storage Settings
if (typeof localStorage.getItem('settings') === 'string') {
  lss = JSON.parse(localStorage.getItem('settings'));
}
var s = { // Settings from localStorage or default
  theme: typeof lss.theme === 'string' ? lss.theme : 'dark',
  charLimit: typeof lss.charLimit === 'string' ? lss.charLimit : 240
}
document.body.className = s.theme;

var decrementerState = {
  input: "",
  output: "",
  update: function (value) {
    decrementerState.input = value;
    decrementerState.output = decrementBracketNumbers(value);
  }
};


var splitRegex = /\W\w+$/g;
var chunkerState = {
  charLimit: s.charLimit,
  input: "",
  outputs: [],
  copied: [],
  update: function(value) {
    chunkerState.input = value;
    if(value.length == 0) {
      chunkerState.outputs = [""];
      return;
    }
    var idx = 0;
    var chunkTotal = 0;
    var chunkCount = 1;
    var iterLimit = 10;
    var paginationLength = 4;
    var chunkLength = chunkerState.charLimit - paginationLength;
    var arr = [];

    while(chunkCount != chunkTotal && iterLimit > 0) {
      chunkTotal = chunkCount;
      chunkCount = 0;
      idx = 0;
      arr = [];
      paginationLength = 2 + digitCount(chunkCount) + digitCount(chunkTotal);
      chunkLength = chunkerState.charLimit - paginationLength;
      var chunkBeginning = "";
      var splitPoint = -1;
      while(idx < value.length) {
        chunkBeginning = "";
        splitPoint = -2;
        if(idx+chunkLength >= value.length) {
          chunkBeginning = value.slice(idx);
        } else {
          chunkBeginning = value.slice(idx, idx+chunkLength);
          splitPoint = chunkBeginning.search(splitRegex)+1;
        }
        console.log("splitpoint: ", splitPoint, "chunkLength: ", chunkLength);
        if (splitPoint > 0) {
          chunkBeginning = chunkBeginning.slice(0, splitPoint);
          idx += splitPoint;
        } else {
          idx += chunkLength;
        }
        chunkCount++;
        arr.push(chunkBeginning.trim() + " " + chunkCount + "/" + chunkTotal);
        paginationLength = 2 + digitCount(chunkCount) + digitCount(chunkTotal);
        chunkLength = chunkerState.charLimit - paginationLength;
      }
      iterLimit--;
      console.log("iter limit: ", iterLimit);
    }
    chunkerState.outputs = arr;
    chunkerState.copied = Array(arr.length).fill(false);
  }
}


// Data End
// Functions Start
function setButtonHighlight(buttonName) {
  document.getElementById('decrementer_btn').classList.remove("btn_highlight");
  document.getElementById('chunker_btn').classList.remove("btn_highlight");
  document.getElementById('image-resizer_btn').classList.remove("btn_highlight");
  document.getElementById(buttonName).classList.add("btn_highlight");
}

function digitCount(n) {
  if (n == 0) {
    return 1;
  } else if (n < 0) {
    return 0;
  }
  return Math.log(n) * Math.LOG10E + 1 | 0;
}

var re = /\[(\d+)\]/g;
function decrementBracketNumbers(input) {
  return input.replace(re, decrementBracketNumber);
}

function decrementBracketNumber(val) {
  if (parseInt(val.slice(1, -1)) <= 0) {
    return "[XXXX]";
  } else {
    return "[" + (parseInt(val.slice(1, -1)) - 1) + "]";
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(
    () => {
      /* clipboard successfully set */
      console.log("clipboard successfully set");
    },
    () => {
      /* clipboard write failed */
      alert("clipboard write failed");
    }
  );
}

function scrollToAnchor( anchor ){
  var is = (el)=>{return el !== undefined && el !== null};
  //if you pass an undefined anchor it will scroll to the top of the body
  var targetEl = is(anchor) ? document.getElementById(anchor) : document.body;
  var scrollTop = window.scrollY || document.documentElement.scrollTop;
  var target = is(targetEl) ? targetEl.getBoundingClientRect().top : 0;
  window.scroll({
      top: target + scrollTop - 200,
      left: 0,
      behavior: "smooth"
  });
}
// Functions End
// Mithril Components Start
var Main = {
  view: function () {
    return m("main", [
      m(Header),
      m("div", { id: "content" }, [

      ])
    ])
  }
};

var Header = {
  view: function () {
    return m("header", [

      m('h1', 'SocialGalactic Tools'),
      m('button', { id: 'decrementer_btn', onclick: function () { m.route.set("/decrementer") } }, "Prayer Count Decrementer"),
      m('button', { id: 'chunker_btn', onclick: function () { m.route.set("/chunker") } }, "Thread Chunker"),
      m('button', { id: 'image-resizer_btn', onclick: function () { m.route.set("/image-resizer") } }, "Image Resizer")

    ]);
  }
};

var themeOptions = {
  oncreate: function () {
    document.getElementById(s.theme).checked = true;
  },
  view: function () {
    return m('div', { class: 'settings_option_container' }, [
      m('h3', 'Theme'),
      m('form', {
        class: 'radios_container',
        value: s.theme,
        onchange: e => {
          s.theme = e.target.value;
          localStorage.setItem('settings', JSON.stringify(s));
          document.body.className = s.theme;
        }
      }, [
        m('div', { class: 'radio_container' }, [
          m('label[for=light]', 'Light'),
          m('input[type=radio][id=light][name=theme][value=light]')
        ]),
        m('div', { class: 'radio_container' }, [
          m('label[for=dark]', 'Dark'),
          m('input[type=radio][id=dark][name=theme][value=dark]')
        ])
      ])
    ]);
  }
};

var Decrementer = {
  oncreate: function () {
    setButtonHighlight('decrementer_btn');
  },
  view: function () {
    return m("section", { class: "decrementer_section" }, [
      m(inputText),
      m(outputText),
    ]);

  }
};

var inputText = {
  view: function () {
    return m("div", [
      m('h3', 'Input'),
      m("textarea.input[placeholder=Paste text here...]", {
        oninput: function (e) { decrementerState.update(e.target.value) }
      }),
      m('p', { class: 'input_count' }, decrementerState.input.length + ' Characters')
    ]);
  }
};

var outputText = {
  view: function () {
    return m("div", [
      m('h3', 'Output'),
      m('button', { onclick: function () { copyToClipboard(decrementerState.output) } }, 'Copy to Clipboard'),
      m('p', decrementerState.output)
    ]);
  }
};

var Chunker = {
  oncreate: function () {
    setButtonHighlight('chunker_btn');
  },
  view: function () {
    return m("section", { class: "chunker_section" }, [
      m(ChunkerSettings),
      m(ChunkerInput),
      m(ChunkerOutput),
    ]);

  }
};

var ChunkerSettings = {
  view: function () {
    return m("form", {onsubmit: function(e) {
      e.preventDefault();
      chunkerState.update(chunkerState.input);
    }}, [
      m("p", {class: "label_container charlimit"}, [
        m("label.label[for=charlimit]", "Character Limit"),
        m("span", {class: "value pitch"}, s.pitch),
      ]),
      m("input.input[type=number]", {
        oninput: function (e) {
          chunkerState.charLimit = e.target.value;
          s.charLimit = e.target.value;
          localStorage.setItem('settings', JSON.stringify(s));
        },
        value: chunkerState.charLimit,
        id: "charlimit"
    })
    ]);
  }
};

var ChunkerInput = {
  view: function () {
    return m("div", [
      m('h3', 'Input Long Post'),
      m("textarea.input[placeholder=Paste text here...]", {
        oninput: function (e) { chunkerState.update(e.target.value) }
      }, chunkerState.input),
      m('p', { class: 'input_count' }, chunkerState.input.length + ' Characters')
    ]);
  }
};

var ChunkerOutput = {
  view: function () {
    return m("div", [
      m('h3', 'Output Into Chunks'),
      chunkerState.outputs.map(function(chunkText, index, arr) {
        var copiedClass = chunkerState.copied[index] ? ' copied':'';
        var anchor = "chunk"+index;
        return m('div', {class: 'chunk_container' + copiedClass}, [
          m('div', {class: 'flex-row'}, [
            m('p', {id: anchor, class: 'chunk_label'}, 'Chunk ' + (index+1) + '/' + arr.length),
            m('span', chunkText.length.toString() + ' Characters'),
            m('button', { onclick: function () {
              copyToClipboard(chunkText);
              chunkerState.copied[index] = true;
              m.route.set("/chunker", {
                "a": anchor
              });
              scrollToAnchor(anchor);
            } },  'Copy Chunk ' + (index+1) + '/' + arr.length + ' to Clipboard')
          ]),
          m('p', chunkText)
        ]);
      })
    ]);
  }
};

var ImageResizer = {
  oncreate: function () {
    setButtonHighlight('image-resizer_btn');
  },
  view: function () {
    return m("section", { class: "image-resizer_section" }, [
      m('h2', 'Under Construction...maybe'),
    ]);

  }
};

// Mithril Components End
// Routing Start
m.mount(root, Main);
m.route(document.getElementById('content'), "/decrementer", {
  "/decrementer": Decrementer,
  "/chunker": Chunker,
  "/image-resizer": ImageResizer,
})
// Routing End