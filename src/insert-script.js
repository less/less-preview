/**
 * Inserts a script
 * @param url
 */
export default function insertScript(url) {
  return new Promise((resolve, reject) => {
    var head = document.getElementsByTagName("head")[0] || document.documentElement;
    var script = document.createElement("script");
    script.src = url;
    script.async = true;

    script.onload = script.onerror = function (e) {
      if (e.type === "error") {
        reject();
      } else {
        resolve();
      }

      if (head && script.parentNode) {
        head.removeChild(script);
      }
    };

    head.appendChild(script);
  });
}
