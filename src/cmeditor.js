import {customElement, bindable} from 'aurelia-framework';

import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css!';
import 'codemirror/theme/cobalt.css!';
import 'codemirror/mode/css/css';

@customElement("cmeditor")
export class cmeditor {
  @bindable readonly;

  attached() {
    CodeMirror.fromTextArea(this.cmTextarea, {
      lineNumbers: true,
      matchBrackets : true,
      mode: "text/x-less",
      theme: "cobalt",
      readOnly: this.readonly
    });
  }
}
