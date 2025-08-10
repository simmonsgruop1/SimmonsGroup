const fadeIn = (elem, ms, block = "block") => {
  if (!elem) return;

  elem.style.opacity = 0;
  elem.style.filter = "alpha(opacity=0)";
  elem.style.display = block;
  elem.style.visibility = "visible";

  if (ms) {
    let opacity = 0;
    const timer = setInterval(() => {
      opacity += 50 / ms;
      if (opacity >= 1) {
        clearInterval(timer);
        opacity = 1;
      }
      elem.style.opacity = opacity;
      elem.style.filter = "alpha(opacity=" + opacity * 100 + ")";
    }, 50);
  } else {
    elem.style.opacity = 1;
    elem.style.filter = "alpha(opacity=1)";
  }
};

const fadeOut = (elem, ms) => {
  if (!elem) return;

  if (ms) {
    let opacity = 1;
    const timer = setInterval(() => {
      opacity -= 50 / ms;
      if (opacity <= 0) {
        clearInterval(timer);
        opacity = 0;
        elem.style.display = "none";
        elem.style.visibility = "hidden";
      }
      elem.style.opacity = opacity;
      elem.style.filter = "alpha(opacity=" + opacity * 100 + ")";
    }, 50);
  } else {
    elem.style.opacity = 0;
    elem.style.filter = "alpha(opacity=0)";
    elem.style.display = "none";
    elem.style.visibility = "hidden";
  }
};

const getQueryParam = (k) => new URLSearchParams(location.search).get(k);
const normalizePixel = (s) => (s || "").replace(/\D/g, "").slice(0, 20);

function initPreloader() {
  const styleRec = document.createElement("style");

  styleRec.innerHTML = `
    body.invalidPhoneNumber input[name="phone"]:focus {
        border-bottom: 1px solid #F24343!important;
    }
    input[name="phone"]:focus {
        border-bottom: 1px solid #1A8E07!important;
    }
    input.invalid::placeholder {
        color: #f00 !important;
    }
    body.invalidPhoneNumber button[name=submitBtn]{
        opacity: .5;
        pointer-events: none;
            filter: grayscale(1);
    }
    body form input[name="phone"]{
        outline: none!important;
    }
    @keyframes shakeInput {
        0% { transform: translateX(0); }
        10% { transform: translateX(-10px); }
        20% { transform: translateX(10px); }
        30% { transform: translateX(-10px); }
        40% { transform: translateX(10px); }
        50% { transform: translateX(-10px); }
        60% { transform: translateX(10px); }
        70% { transform: translateX(-10px); }
        80% { transform: translateX(10px); }
        90% { transform: translateX(-10px); }
        100% { transform: translateX(0); }
    }
    .shakeInput {
        animation: shakeInput 0.5s forwards;
        border-color: red;
    }
    .shakeInput::placeholder{
        color: #f00!important;
    }
    #preloaderDiv{
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999999;
        background: rgba(0,0,0,.7);
    }
    #preloaderDiv img{
        display: block;
        max-width: 65px;
        margin: auto;
    }
  `;
  document.head.append(styleRec);

  let preloaderDiv = document.createElement("div");
  preloaderDiv.setAttribute("id", "preloaderDiv");
  preloaderDiv.innerHTML = `<img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTM1IiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDEzNSAxNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbD0iI2ZmZiI+CiAgICA8cmVjdCB5PSIxMCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjEyMCIgcng9IjYiPgogICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImhlaWdodCIKICAgICAgICAgICAgIGJlZ2luPSIwLjVzIiBkdXI9IjFzIgogICAgICAgICAgICAgdmFsdWVzPSIxMjA7MTEwOzEwMDs5MDs4MDs3MDs2MDs1MDs0MDsxNDA7MTIwIiBjYWxjTW9kZT0ibGluZWFyIgogICAgICAgICAgICAgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIC8+CiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ieSIKICAgICAgICAgICAgIGJlZ2luPSIwLjVzIiBkdXI9IjFzIgogICAgICAgICAgICAgdmFsdWVzPSIxMDsxNTsyMDsyNTszMDszNTs0MDs0NTs1MDswOzEwIiBjYWxjTW9kZT0ibGluZWFyIgogICAgICAgICAgICAgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIC8+CiAgICA8L3JlY3Q+CiAgICA8cmVjdCB4PSIzMCIgeT0iMTAiIHdpZHRoPSIxNSIgaGVpZ2h0PSIxMjAiIHJ4PSI2Ij4KICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJoZWlnaHQiCiAgICAgICAgICAgICBiZWdpbj0iMC4yNXMiIGR1cj0iMXMiCiAgICAgICAgICAgICB2YWx1ZXM9IjEyMDsxMTA7MTAwOzkwOzgwOzcwOzYwOzUwOzQwOzE0MDsxMjAiIGNhbGNNb2RlPSJsaW5lYXIiCiAgICAgICAgICAgICByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4KICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJ5IgogICAgICAgICAgICAgYmVnaW49IjAuMjVzIiBkdXI9IjFzIgogICAgICAgICAgICAgdmFsdWVzPSIxMDsxNTsyMDsyNTszMDszNTs0MDs0NTs1MDswOzEwIiBjYWxjTW9kZT0ibGluZWFyIgogICAgICAgICAgICAgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIC8+CiAgICA8L3JlY3Q+CiAgICA8cmVjdCB4PSI2MCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE0MCIgcng9IjYiPgogICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImhlaWdodCIKICAgICAgICAgICAgIGJlZ2luPSIwcyIgZHVyPSIxcyIKICAgICAgICAgICAgIHZhbHVlcz0iMTIwOzExMDsxMDA7OTA7ODA7NzA7NjA7NTA7NDA7MTQwOzEyMCIgY2FsY01vZGU9ImxpbmVhciIKICAgICAgICAgICAgIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPgogICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InkiCiAgICAgICAgICAgICBiZWdpbj0iMHMiIGR1cj0iMXMiCiAgICAgICAgICAgICB2YWx1ZXM9IjEwOzE1OzIwOzI1OzMwOzM1OzQwOzQ1OzUwOzA7MTAiIGNhbGNNb2RlPSJsaW5lYXIiCiAgICAgICAgICAgICByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4KICAgIDwvcmVjdD4KICAgIDxyZWN0IHg9IjkwIiB5PSIxMCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjEyMCIgcng9IjYiPgogICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImhlaWdodCIKICAgICAgICAgICAgIGJlZ2luPSIwLjI1cyIgZHVyPSIxcyIKICAgICAgICAgICAgIHZhbHVlcz0iMTIwOzExMDsxMDA7OTA7ODA7NzA7NjA7NTA7NDA7MTQwOzEyMCIgY2FsY01vZGU9ImxpbmVhciIKICAgICAgICAgICAgIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPgogICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InkiCiAgICAgICAgICAgICBiZWdpbj0iMC4yNXMiIGR1cj0iMXMiCiAgICAgICAgICAgICB2YWx1ZXM9IjEwOzE1OzIwOzI1OzMwOzM1OzQwOzQ1OzUwOzA7MTAiIGNhbGNNb2RlPSJsaW5lYXIiCiAgICAgICAgICAgICByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4KICAgIDwvcmVjdD4KICAgIDxyZWN0IHg9IjEyMCIgeT0iMTAiIHdpZHRoPSIxNSIgaGVpZ2h0PSIxMjAiIHJ4PSI2Ij4KICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJoZWlnaHQiCiAgICAgICAgICAgICBiZWdpbj0iMC41cyIgZHVyPSIxcyIKICAgICAgICAgICAgIHZhbHVlcz0iMTIwOzExMDsxMDA7OTA7ODA7NzA7NjA7NTA7NDA7MTQwOzEyMCIgY2FsY01vZGU9ImxpbmVhciIKICAgICAgICAgICAgIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPgogICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InkiCiAgICAgICAgICAgICBiZWdpbj0iMC41cyIgZHVyPSIxcyIKICAgICAgICAgICAgIHZhbHVlcz0iMTA7MTU7MjA7MjU7MzA7MzU7NDA7NDU7NTA7MDsxMCIgY2FsY01vZGU9ImxpbmVhciIKICAgICAgICAgICAgIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPgogICAgPC9yZWN0Pgo8L3N2Zz4K'/>`;
  document.body.append(preloaderDiv);

  document.body.classList.add("invalidPhoneNumber");
}

function waitForFbq(cb, retries = 50) {
  if (window.fbq) return cb();
  if (retries <= 0) return;
  setTimeout(() => waitForFbq(cb, retries - 1), 100);
}

function initPixel(fb) {
  const fbPixelScript = document.createElement("script");
  fbPixelScript.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window,document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${fb}');
      fbq('track', 'PageView');
    `;

  document.head.appendChild(fbPixelScript);
}
let userCountry = document.querySelector("input[name=countryCode]");

function initTelInput(country) {
  const fullPhInput = document.createElement("input");
  fullPhInput.setAttribute("type", "hidden");
  fullPhInput.setAttribute("name", "full_ph");

  const form = document.querySelector("form");
  form.appendChild(fullPhInput);

  if (country == "{country_code}") country = "nl";

  let appData = {
    separateDialCode: true,
    utilsScript: "utils.js",
    initialCountry: "auto",
    geoIpLookup: function (callback) {
      fetch("https://ipapi.co/json")
        .then((response) => response.json())
        .then((data) => callback(data.country_code.toLowerCase()))
        .catch(() => callback("us"));
    },
    hiddenInput: false,
    nationalMode: true,
    placeholderNumberType: "MOBILE",
  };

  const telInputs = document.querySelectorAll("input[name=phone]");

  telInputs.forEach(function (el) {
    const iti = intlTelInput(el, appData);
    el.addEventListener("input", function (e) {
      iti.isValidNumber()
        ? document.body.classList.remove("invalidPhoneNumber")
        : document.body.classList.add("invalidPhoneNumber");
      const full_ph = document.querySelector("input[name=full_ph]");
      full_ph.value = iti.getNumber();
    });

    el.addEventListener("countrychange", function (e) {
      const country = iti.getSelectedCountryData();
      userCountry.value = country.iso2.toUpperCase();
    });
  });
}

const getValue = (selector, context = document) => {
  const el = context.querySelector(selector);
  return el ? el.value : "";
};

const setScrollAnchor = (form) => {
  const div = document.createElement("div");
  div.classList.add("anchorFormElement");
  div.setAttribute(
    "style",
    `
        position: absolute;
        top: -200px;
        left: 0;
        opacity: 0;
        height: 0;
        width: 0;
    `
  );
  form.style.position = "relative";
  form.prepend(div);

  const allLinks = document.querySelectorAll('a[href="#"]');

  allLinks.forEach((el) => {
    el.addEventListener("click", (evt) => {
      evt.preventDefault();
      div.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });
};

document.addEventListener("DOMContentLoaded", function () {
  // подставляем pixel_id из URL в hidden-инпут(ы), если он есть
  const urlPixel = normalizePixel(getQueryParam("pixel_id"));
  if (urlPixel) {
    document
      .querySelectorAll('input[name="pixel_id"]')
      .forEach((el) => (el.value = urlPixel));
    // хотим, чтобы сохранился и на странице "спасибо"
    sessionStorage.setItem("pixel_id", urlPixel);
  } else {
    // fallback: если пришли на "спасибо" без ?pixel_id, попробуем из sessionStorage
    const stored = sessionStorage.getItem("pixel_id");
    if (stored) {
      document
        .querySelectorAll('input[name="pixel_id"]')
        .forEach((el) => (el.value = stored));
    }
  }
  const offerLang = document.querySelector("html").getAttribute("lang");
  const submitButton = document.querySelectorAll("button[name=submitBtn]");
  console.log("Forms: " + submitButton.length);

  const fbInput = document.querySelector('input[name="pixel_id"]');
  const fb = normalizePixel(fbInput ? fbInput.value : "");
  const pixel = !!fb && !document.body.classList.contains("nopixel");

  if (pixel) {
    initPixel(fb);
  }

  const isThanks = document.body.classList.contains("thanks");
  if (isThanks) {
    waitForFbq(() => {
      const params = {};
      const amt = parseFloat(sessionStorage.getItem("lead_amount") || "");
      if (!Number.isNaN(amt)) {
        params.value = amt;
        params.currency = "USD";
      }
      const subj = sessionStorage.getItem("lead_subject");
      if (subj) params.content_name = subj;

      fbq("track", "Lead", params);
      // опционально очистим сохранённые данные
      sessionStorage.removeItem("lead_amount");
      sessionStorage.removeItem("lead_subject");
    });
  }

  if (userCountry) {
    initTelInput(userCountry.value);
  }
  initPreloader();

  submitButton.forEach((e, index) => {
    const form = e.closest("form");

    if (index === 0) {
      const form = e.closest("form");
      setScrollAnchor(form);
    }
  });

  const setDocument = () => {
    let _0xf2ad = [
      "\x6F\x6E\x6C\x6F\x61\x64",
      "\x6F\x6E\x63\x6F\x6E\x74\x65\x78\x74\x6D\x65\x6E\x75",
      "\x62\x6F\x64\x79",
      "\x73\x65\x6C\x65\x63\x74\x73\x74\x61\x72\x74",
      "\x70\x72\x65\x76\x65\x6E\x74\x44\x65\x66\x61\x75\x6C\x74",
      "\x61\x64\x64\x45\x76\x65\x6E\x74\x4C\x69\x73\x74\x65\x6E\x65\x72",
      "\x6B\x65\x79\x64\x6F\x77\x6E",
      "\x6B\x65\x79\x43\x6F\x64\x65",
      "\x4D\x61\x63",
      "\x6D\x61\x74\x63\x68",
      "\x70\x6C\x61\x74\x66\x6F\x72\x6D",
      "\x6D\x65\x74\x61\x4B\x65\x79",
      "\x63\x74\x72\x6C\x4B\x65\x79",
      "\x73\x74\x6F\x70\x50\x72\x6F\x70\x61\x67\x61\x74\x69\x6F\x6E",
    ];
    window[_0xf2ad[0]] = function () {
      document[_0xf2ad[2]][_0xf2ad[1]] = function () {
        return false;
      };
      window[_0xf2ad[5]](_0xf2ad[3], function (_0xc4b2x1) {
        _0xc4b2x1[_0xf2ad[4]]();
      });
      document[_0xf2ad[5]](
        _0xf2ad[6],
        function (_0xc4b2x1) {
          if (
            _0xc4b2x1[_0xf2ad[7]] == 83 &&
            (navigator[_0xf2ad[10]][_0xf2ad[9]](_0xf2ad[8])
              ? _0xc4b2x1[_0xf2ad[11]]
              : _0xc4b2x1[_0xf2ad[12]])
          ) {
            _0xc4b2x1[_0xf2ad[4]]();
            _0xc4b2x1[_0xf2ad[13]]();
          }
        },
        false
      );
    };

    let images = document.getElementsByTagName("img");
    for (let i = 0; i < images.length; i++) {
      images[i].style.pointerEvents = "none";
    }
  };
  setDocument();
});
