// Data Start
var root = document.body;

var lss = {}; // Local Storage Settings
if (typeof localStorage.getItem('settings') === 'string') {
  lss = JSON.parse(localStorage.getItem('settings'));
}
var s = { // Settings from localStorage or default
  theme: typeof lss.theme === 'string' ? lss.theme : 'dark',
}
document.body.className = s.theme;

var decrementerState = {
  input: "",
  output: "",
  update: function(value) {
    decrementerState.input = value;
    decrementerState.output = decrementBracketNumbers(value);
  }
};


// Data End
// Functions Start
function setButtonHighlight(buttonName) {
  document.getElementById('decrementer_btn').classList.remove("btn_highlight");
  document.getElementById('chunker_btn').classList.remove("btn_highlight");
  document.getElementById('image-resizer_btn').classList.remove("btn_highlight");
  document.getElementById(buttonName).classList.add("btn_highlight");
}

var re = /\[(\d+)\]/g;
function decrementBracketNumbers(input) {
  return input.replace(re, decrementBracketNumber);
}

function decrementBracketNumber(val) {
  if (parseInt(val.slice(1, -1)) <= 0) {
    return "[XXXX]";
  } else {
    return "[" + (parseInt(val.slice(1, -1))-1) + "]";
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
// Functions End
// Mithril Components Start
var Main = {
  view: function() {
    return m("main", [
      m(Header),
      m("div", {id: "content"}, [
        
      ])
    ])
  }
};

var Header = {
  view: function() {
    return m("header", [
      
        m('h1', 'SocialGalactic Tools'),
        m('button', {id: 'decrementer_btn', onclick: function() {m.route.set("/decrementer")}}, "Prayer Count Decrementer"),
        m('button', {id: 'chunker_btn', onclick: function() {m.route.set("/chunker")}}, "Thread Chunker"),
        m('button', {id: 'image-resizer_btn', onclick: function() {m.route.set("/image-resizer")}}, "Image Resizer")
      
    ]);
  }
};

var themeOptions = {
  oncreate: function() {
    document.getElementById(s.theme).checked = true;
  },
  view: function() {
    return m('div', {class: 'settings_option_container'}, [
      m('h3', 'Theme'),
      m('form', {
        class: 'radios_container',
        value: s.theme,
        onchange: e => {
          console.log('radio form value', e.target.value);
          s.theme = e.target.value;
          localStorage.setItem('settings', JSON.stringify(s));
          document.body.className = s.theme;
        }
      }, [
        m('div', {class: 'radio_container'}, [
          m('label[for=light]', 'Light'),
          m('input[type=radio][id=light][name=theme][value=light]')
        ]),
        m('div', {class: 'radio_container'}, [
          m('label[for=dark]', 'Dark'),
          m('input[type=radio][id=dark][name=theme][value=dark]')
        ])
      ])
    ]);
  }
};

var Decrementer = {
  oncreate: function() {
    setButtonHighlight('decrementer_btn');
  },
  view: function() {
    return m("section", {class: "decrementer_section"}, [
      m(inputText),
      m(outputText),
    ]);
    
  }
};

var inputText = {
  view: function() {
    return m("div", [
      m('h3', 'Input'),
      m("textarea.input[placeholder=Paste text here...]", {
        oninput: function (e) { decrementerState.update(e.target.value) }
      }),
      m('p', {class: 'input_count'}, decrementerState.input.length + ' Characters')
    ]);
  }
};

var outputText = {
  view: function() {
    return m("div", [
      m('h3', 'Output'),
      m('button', { onclick: function() {copyToClipboard(decrementerState.output)}}, 'Copy to Clipboard'),
      m('p', decrementerState.output)
    ]);
  }
};

var Chunker = {
  oncreate: function() {
    setButtonHighlight('chunker_btn');
  },
  view: function() {
    return m("section", {class: "chunker_section"}, [
      m('h2', 'Under Construction...maybe'),
    ]);
    
  }
};

var ImageResizer = {
  oncreate: function() {
    setButtonHighlight('image-resizer_btn');
  },
  view: function() {
    return m("section", {class: "image-resizer_section"}, [
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