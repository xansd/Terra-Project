import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Editor, schema, Toolbar, Validators } from 'ngx-editor';
@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
})
export class TextEditorComponent {
  @Input() productDescription!: string;
  @Output() editorValueChange = new EventEmitter<string>();
  editor = new Editor({
    content: '',
    history: true,
    keyboardShortcuts: true,
    inputRules: true,
    plugins: [], //https://prosemirror.net/docs/guide/#state
    schema, //https://prosemirror.net/examples/schema/
    nodeViews: {}, //https://prosemirror.net/docs/guide/#state,
    attributes: {}, // https://prosemirror.net/docs/ref/#view.EditorProps.attributes
  });
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['horizontal_rule', 'format_clear'],
  ];

  ngOnInit(): void {
    this.editor = new Editor({
      content: this.productDescription || '',
    });
  }

  handleEditorChange(event: any): void {
    const editorValue = event.target.innerHTML;
    this.updateEditorValue(editorValue);
  }

  updateEditorValue(editorValue: string): void {
    this.editorValueChange.emit(editorValue);
  }
}
