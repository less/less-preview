import lessVersions from 'less-versions';
import lessOptions from 'less-options';
import lessFeatures from 'less-features';
import insertScript from 'insert-script';

class less {
  getVersions() {
    return lessVersions;
  }
  loadVersion(version) {
    delete window.less;
    lessOptions.version = version;
    this.lessPromise = insertScript(`//cdnjs.cloudflare.com/ajax/libs/less.js/${version}/less.min.js`)
      .then(() => window.less);
    return this.lessPromise;
  }
  convert(lessSrc) {
    return this.lessPromise
      .then((less) => {
        if (lessFeatures.hasPromises()) {
          return less.render(lessSrc, lessOptions);
        } else {
          return new Promise((resolve, reject) => {
            const parser = new less.Parser(lessOptions);
            parser.parse(lessSrc, (e, tree) => {
              if (!e && tree) {
                try {
                  const css = tree.toCSS(lessOptions);
                  resolve({ css: css });
                } catch(e) {
                  reject(e);
                }
              } else {
                reject(e);
              }
            });
          });
        }
      });
  }
}

const lessInst = new less();

export { lessInst as default };
