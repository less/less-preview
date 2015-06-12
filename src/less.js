import lessVersions from 'less-versions';

class less {
  getVersions() {
    return lessVersions;
  }
  loadVersion(version) {
    const url = `//cdnjs.cloudflare.com/ajax/libs/less.js/${version}/less.min.js`;
    const scriptTag = document.createElement("script");
    scriptTag.src = url;

    delete window.less;
    document.head.appendChild(scriptTag);
  }
  convert(lessSrc) {
    return window.less.render(lessSrc);
  }
}

const lessInst = new less();

export { lessInst as default };
