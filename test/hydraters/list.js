'use strict';
/**
* @file Hydrater dependency
* This contain all basics dependencies hard-coded
*/


module.exports.params = {
  'plaintext' : {
    url : "http://plaintext.hydrater.anyfetch.com",
    post :  {
      file_path : "",
      callback : "",
      long_poll : 1,
      document_type : "file",
      metadatas : {},
      datas : {},
      identifier : 'plaintext-test'
    }
  },
  'pdf' : {
    url : "http://pdf.hydrater.anyfetch.com",
    post : {
      file_path : "",
      callback : "",
      long_poll : 1,
      document_type : 'document',
      metadatas : {
        path: '\\.pdf$',
        mime_type: 'application/pdf'
      },
      datas : {},
      identifier : 'pdf-test'
    }
  },
  'office' : {
    url : "http://office.hydrater.anyfetch.com",
    post : {
      file_path : "",
      callback : "",
      long_poll : 1,
      document_type : 'document',
      metadatas : {
        path: '\\.(doc|docx|odt|rtf|ods|xls|xlsx|ppt|pptx|odp)$'
      },
      datas : {},
      identifier : 'office-test'
    }
  },
  'image' : {
    url : "http://image.hydrater.anyfetch.com",
    post : {
      file_path : "",
      callback : "",
      long_poll : 1,
      document_type : 'file',
      metadatas : {
        "content-type": '^image/'
      },
      datas : {},
      identifier : 'image-test'
    }
  },
  'ocr' : {
    url : "http://ocr.hydrater.anyfetch.com",
    post : {
      file_path : "",
      callback : "",
      long_poll : 1,
      document_type : 'image',
      metadatas : {
      },
      datas : {},
      identifier : 'ocr-test'
    }
  },
  'eml' : {
    url : "http://eml.hydrater.anyfetch.com",
    post : {
      file_path : "",
      callback : "",
      long_poll : 1,
      document_type : 'document',
      metadatas : {
        path: '\\.eml$'
      },
      datas : {},
      identifier : 'eml-test'
    }
  },
};

module.exports.list = Object.keys(module.exports.params);