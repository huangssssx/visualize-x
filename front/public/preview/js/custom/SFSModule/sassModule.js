import { VueCompilerSFCInstance as VueCompilerSFC } from "../../vue3/compiler-sfc.global.js";

const sass = new Sass();
// import sass from "../../sass/sass.esm.js";
// import sass from "../../sass/sass.esm.js";

var backslashRegEx = /\\/g;
function resolveIfNotPlainOrUrl(relUrl, parentUrl) {
  if (relUrl.indexOf("\\") !== -1) relUrl = relUrl.replace(backslashRegEx, "/");
  // protocol-relative
  if (relUrl[0] === "/" && relUrl[1] === "/") {
    return parentUrl.slice(0, parentUrl.indexOf(":") + 1) + relUrl;
  }
  // relative-url
  else if (
    (relUrl[0] === "." &&
      (relUrl[1] === "/" ||
        (relUrl[1] === "." && (relUrl[2] === "/" || (relUrl.length === 2 && (relUrl += "/")))) ||
        (relUrl.length === 1 && (relUrl += "/")))) ||
    relUrl[0] === "/"
  ) {
    var parentProtocol = parentUrl.slice(0, parentUrl.indexOf(":") + 1);
    // Disabled, but these cases will give inconsistent results for deep backtracking
    //if (parentUrl[parentProtocol.length] !== '/')
    //  throw Error('Cannot resolve');
    // read pathname from parent URL
    // pathname taken to be part after leading "/"
    var pathname;
    if (parentUrl[parentProtocol.length + 1] === "/") {
      // resolving to a :// so we need to read out the auth and host
      if (parentProtocol !== "file:") {
        pathname = parentUrl.slice(parentProtocol.length + 2);
        pathname = pathname.slice(pathname.indexOf("/") + 1);
      } else {
        pathname = parentUrl.slice(8);
      }
    } else {
      // resolving to :/ so pathname is the /... part
      pathname = parentUrl.slice(
        parentProtocol.length + (parentUrl[parentProtocol.length] === "/")
      );
    }

    if (relUrl[0] === "/")
      return parentUrl.slice(0, parentUrl.length - pathname.length - 1) + relUrl;

    // join together and split for removal of .. and . segments
    // looping the string instead of anything fancy for perf reasons
    // '../../../../../z' resolved to 'x/y' is just 'z'
    var segmented = pathname.slice(0, pathname.lastIndexOf("/") + 1) + relUrl;

    var output = [];
    var segmentIndex = -1;
    for (var i = 0; i < segmented.length; i++) {
      // busy reading a segment - only terminate on '/'
      if (segmentIndex !== -1) {
        if (segmented[i] === "/") {
          output.push(segmented.slice(segmentIndex, i + 1));
          segmentIndex = -1;
        }
      }

      // new segment - check if it is relative
      else if (segmented[i] === ".") {
        // ../ segment
        if (segmented[i + 1] === "." && (segmented[i + 2] === "/" || i + 2 === segmented.length)) {
          output.pop();
          i += 2;
        }
        // ./ segment
        else if (segmented[i + 1] === "/" || i + 1 === segmented.length) {
          i += 1;
        } else {
          // the start of a new segment as below
          segmentIndex = i;
        }
      }
      // it is the start of a new segment
      else {
        segmentIndex = i;
      }
    }
    // finish reading out the last segment
    if (segmentIndex !== -1) output.push(segmented.slice(segmentIndex));
    return parentUrl.slice(0, parentUrl.length - pathname.length) + output.join("");
  }
}

function resolveUrl(relUrl, parentUrl) {
  return (
    resolveIfNotPlainOrUrl(relUrl, parentUrl) ||
    (relUrl.indexOf(":") !== -1 ? relUrl : resolveIfNotPlainOrUrl("./" + relUrl, parentUrl))
  );
}

export async function generateSass(styles, dataVId, url) {
  return new Promise((resolve, reject) => {
    if (styles.length) {
      for (let i = 0; i < styles.length; i++) {
        const styleItem = styles[i];
        //使用sassjs进行处理
        sass.compile(styleItem.content, function (styles) {
          const styleBlock = VueCompilerSFC.compileStyle({
            source: styles.text,
            id: dataVId,
            scoped: styleItem.scoped,
          }).code;

          var styleCode = styleBlock;
          var styleUrl = url + ".css";
          styleCode = styleCode.replace(
            /url\(\s*(?:(["'])((?:\\.|[^\n\\"'])+)\1|((?:\\.|[^\s,"'()\\])+))\s*\)/g,
            function (match, quotes, relUrl1, relUrl2) {
              return "url(" + quotes + resolveUrl(relUrl1 || relUrl2, styleUrl) + quotes + ")";
            }
          );
          var styleSheet = new CSSStyleSheet();
          styleSheet.replaceSync(styleCode);
          document.adoptedStyleSheets = [styleSheet, ...document.adoptedStyleSheets];
          resolve();
          // console.log("############生成的css:", styleCode);
        });
      }
    }
  });
}
