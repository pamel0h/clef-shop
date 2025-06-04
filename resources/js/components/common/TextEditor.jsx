// src/components/common/TextEditor.jsx
import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const TextEditor = ({ initialValue, onChange }) => {
  const editorRef = useRef(null);

  return (
    <Editor
      apiKey="vkcmcx49iuev9aqstqk1ab9q30dlj8x8je5ak45gx8tqid1s" 
      onInit={(evt, editor) => (editorRef.current = editor)}
      initialValue={initialValue}
      onEditorChange={onChange}
      init={{
        height: 400,
        menubar: true,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount',
        ],
        toolbar:
          'undo redo | formatselect | bold italic | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | link image | code',
        image_uploadtab: true,
        file_picker_types: 'image',
        file_picker_callback: (callback, value, meta) => {
          if (meta.filetype === 'image') {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.onchange = function () {
              const file = this.files[0];
              const formData = new FormData();
              formData.append('file', file);

              fetch('/api/upload', {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`, // Если используете JWT
                },
                body: formData,
              })
                .then((response) => response.json())
                .then((result) => {
                  callback(result.url, { alt: file.name });
                })
                .catch((error) => {
                  console.error('Ошибка загрузки:', error);
                });
            };
            input.click();
          }
        },
      }}
    />
  );
};

export default TextEditor;