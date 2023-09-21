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
  update: function (value) {
    chunkerState.input = value;
    if (value.length == 0) {
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

    while (chunkCount != chunkTotal && iterLimit > 0) {
      chunkTotal = chunkCount;
      chunkCount = 0;
      idx = 0;
      arr = [];
      paginationLength = 2 + digitCount(chunkCount) + digitCount(chunkTotal);
      chunkLength = chunkerState.charLimit - paginationLength;
      var chunkBeginning = "";
      var splitPoint = -1;
      while (idx < value.length) {
        chunkBeginning = "";
        splitPoint = -2;
        if (idx + chunkLength >= value.length) {
          chunkBeginning = value.slice(idx);
        } else {
          chunkBeginning = value.slice(idx, idx + chunkLength);
          splitPoint = chunkBeginning.search(splitRegex) + 1;
        }
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
    }
    chunkerState.outputs = arr;
    chunkerState.copied = Array(arr.length).fill(false);
  }
}


// Data End
// Functions Start
function setButtonHighlight(buttonName) {
  document.getElementById('instructions_btn').classList.remove("btn_highlight");
  document.getElementById('decrementer_btn').classList.remove("btn_highlight");
  document.getElementById('extractor_btn').classList.remove("btn_highlight");
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

function scrollToAnchor(anchor) {
  var is = (el) => { return el !== undefined && el !== null };
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
      m('button', { id: 'instructions_btn', onclick: function () { m.route.set("/instructions") } }, "Prayer List Instructions"),
      m('button', { id: 'decrementer_btn', onclick: function () { m.route.set("/decrementer") } }, "Prayer Count Decrementer"),
      m('button', { id: 'extractor_btn', onclick: function () { m.route.set("/extractor") } }, "Thread Extractor"),
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

var Instructions = {
  oncreate: function () {
    setButtonHighlight('instructions_btn');
  },
  view: function () {
    return m("section", { class: "decrementer_section" }, [
      m('h3', 'Prayer List Instructions'),
      m('ul', [
        m('li', 'Cut the whole list from the previous day, all entries at once'),
        m('li', [
          m('span', 'Paste into the'),
          m('a', { onclick: function () { m.route.set("/decrementer") } }, 'Prayer Count Decrementer'),
          m('span', 'input field and press the "Copy to Clipboard" button. Re-numbering is done all at once!')
        ]),
        m('li', 'Counts that go below zero are shown as [XXXX]. Those entries should be removed or extended.'),
        m('li', 'Clean up included name headers'),
        m('li', 'Change date to today'),
        m('li', 'Scan #prayerrequest, #praisereport and last day’s #prayerlist each day for new add and remove requests'),
        m('li', [m('span', 'Use the numbering rules below for each'), m('ul', [
          m('li', 'New items 4d count down [3-0]'),
        m('li', 'Death/ Birth/ Life-changing 7d [6-0]'),
        m('li', 'SG & Immediate Family fatalities [29-0]'),
        m('li', 'Extensions can be requested'),
        m('li', 'SGIF ongoing serious need = indefinite'),
        ])]),
        m('li', 'Place new items alphabetically within your list'),
        m('li', 'Download graphics for use'),
        m('li', 'Post to SG'),
        m('li', 'Prayer graphic always on top post'),
        m('li', [
          m('span', 'Keep individual entries under 180 characters, pics'),
          m('a', { onclick: function () { m.route.set("/image-resizer") } }, 'under 200KB'),
          m('span', ', so bronze can also help')
        ]),
        m('li', 'Graphics on SG have to be expanded first to download properly'),


      ]),
      m('p', [
        m('span', 'Note that the'),
        m('a', { onclick: function () { m.route.set("/chunker") } }, 'Thread Chunker'),
        m('span', 'is a tool for text only threads, not the prayer list.')
      ]),
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


var extractorScript = 'copy(Array.from(document.querySelectorAll("p")).filter(item => item.attributes.length === 0).map(item => item.innerText).join("\\n\\n"));';
var Extractor = {
  oncreate: function () {
    setButtonHighlight('extractor_btn');
  },
  view: function () {
    return m("section", { class: "extractor_section" }, [
      m('h3', 'SG Thread Extractor'),
      m('ul', [
        m('li', 'Copy the following script into your clipboard:'),
        m('p', [m('code', extractorScript), m('button', { onclick: function () { copyToClipboard(extractorScript) } }, 'Copy to Clipboard')]),
        m('li', 'Go to the SocialGalactic thread you would like to extract.'),
        m('li', "Open your browser's dev tools. With [ Ctrl ] + [ Shift ] + [ i ], or by right clicking and selecting \"Inspect\""),
        m('li', 'Go to the "Console" tab of the dev tools.'),
        m('li', 'Paste in the script and press enter to run.'),
        m('li', 'The contents of the SG thread should now be in your clipboard.')
      ])

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
    return m("form", {
      onsubmit: function (e) {
        e.preventDefault();
        chunkerState.update(chunkerState.input);
      }
    }, [
      m("p", { class: "label_container charlimit" }, [
        m("label.label[for=charlimit]", "Character Limit"),
        m("span", { class: "value pitch" }, s.pitch),
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
      chunkerState.outputs.map(function (chunkText, index, arr) {
        var copiedClass = chunkerState.copied[index] ? ' copied' : '';
        var anchor = "chunk" + index;
        return m('div', { class: 'chunk_container' + copiedClass }, [
          m('div', { class: 'flex-row' }, [
            m('p', { id: anchor, class: 'chunk_label' }, 'Chunk ' + (index + 1) + '/' + arr.length),
            m('span', chunkText.length.toString() + ' Characters'),
            m('button', {
              onclick: function () {
                copyToClipboard(chunkText);
                chunkerState.copied[index] = true;
                m.route.set("/chunker", {
                  "a": anchor
                });
                scrollToAnchor(anchor);
              }
            }, 'Copy Chunk ' + (index + 1) + '/' + arr.length + ' to Clipboard')
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
      m('h3', 'Image Resizer'),
      m('p', [
        m('span', 'I recommend '),
        m('a', { href: 'https://bulkresizephotos.com/' }, 'bulkresizephotos.com'),
      ]),
      m('p', 'Links with preset settings:'),
      m('p',
        m('a', { href: 'https://bulkresizephotos.com/en?resize_type=filesize&resize_value=200000&skip_resize_settings=true' }, 'Resize to 200kb')
      ),
      m('p',
        m('a', { href: 'https://bulkresizephotos.com/en?resize_type=filesize&resize_value=500000&skip_resize_settings=true' }, 'Resize to 500kb')
      )
    ]);

  }
};

// Mithril Components End
// Routing Start
m.mount(root, Main);
m.route(document.getElementById('content'), "/decrementer", {
  "/instructions": Instructions,
  "/decrementer": Decrementer,
  "/extractor": Extractor,
  "/chunker": Chunker,
  "/image-resizer": ImageResizer,
})
// Routing End