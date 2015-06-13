import {customElement, bindable} from 'aurelia-framework';

import CodeMirror from 'codemirror';
import 'codemirror/mode/css/css';

@customElement("cmeditor")
export class cmeditor {
  @bindable readonly;
  @bindable value;

  attached() {
    this.codeMirror = CodeMirror.fromTextArea(this.cmTextarea, {
      lineNumbers: true,
      matchBrackets : true,
      mode: "text/x-less",
      theme: "lesser-dark",
      readOnly: this.readonly
    });
    this.codeMirror.setValue(this.value || "");
    this.codeMirror.on('change', (codeMirror, changeObj) => {
      const newValue = codeMirror.getValue();
      if (newValue !== this.value) {
        this.value = newValue;
      }
    });
  }
  valueChanged(newValue, oldValue) {
    if (this.codeMirror && newValue !== this.codeMirror.getValue()) {
      this.codeMirror.setValue(newValue);
    }
  }
}
