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

var incrementerState = {
  input: "",
  output: "",
  update: function(value) {
    incrementerState.input = value;
    incrementerState.output = incrementBracketNumbers(value);
  }
};


// Data End
// Functions Start
function setButtonHighlight(buttonName) {
  document.getElementById('incrementer_btn').classList.remove("btn_highlight");
  document.getElementById('chunker_btn').classList.remove("btn_highlight");
  document.getElementById('image-resizer_btn').classList.remove("btn_highlight");
  document.getElementById(buttonName).classList.add("btn_highlight");
}

var re = /\[(\d+)\]/g;
function incrementBracketNumbers(input) {
  return input.replace(re, incrementBracketNumber);
}

function incrementBracketNumber(val) {
  return "[" + (parseInt(val.slice(1, -1))+1) + "]";
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
        m('button', {id: 'incrementer_btn', onclick: function() {m.route.set("/incrementer")}}, "Prayer Count Incrementer"),
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

var Incrementer = {
  oncreate: function() {
    setButtonHighlight('incrementer_btn');
  },
  view: function() {
    return m("section", {class: "incrementer_section"}, [
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
        oninput: function (e) { incrementerState.update(e.target.value) }
      }),
      m('p', {class: 'input_count'}, incrementerState.input.length + ' Characters')
    ]);
  }
};

var outputText = {
  view: function() {
    return m("div", [
      m('h3', 'Output'),
      m('button', { onclick: function() {copyToClipboard(incrementerState.output)}}, 'Copy to Clipboard'),
      m('p', incrementerState.output)
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
m.route(document.getElementById('content'), "/incrementer", {
  "/incrementer": Incrementer,
  "/chunker": Chunker,
  "/image-resizer": ImageResizer,
})
// Routing End