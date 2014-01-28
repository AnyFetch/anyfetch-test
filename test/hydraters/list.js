'use strict';
/**
* @file Hydrater dependency
* This contain all basics dependencies hard-coded
*/


module.exports.params = {
  'plaintext' : {
    url : "http://plaintext.hydrater.anyfetch.com",
    post :  {
      file_path : "https://raw2.github.com/Papiel/anyfetch-test/cb808057f26562bec2e10975cbe7950a3a6bb6b0/test/hydraters/samples/plaintext.hydrater.anyfetch.com.test.doc",
      callback : "exemple.com",
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
      file_path : "https://raw2.github.com/Papiel/anyfetch-test/cb808057f26562bec2e10975cbe7950a3a6bb6b0/test/hydraters/samples/pdf.hydrater.anyfetch.com.test.pdf",
      callback : "exemple.com",
      long_poll : 1,
      document_type : 'document',
      metadatas : {
        path: 'pdf.hydrater.anyfetch.com.test.pdf',
        mime_type: 'application/pdf'
      },
      datas : {},
      identifier : 'pdf-test'
    }
  },
  'office' : {
    url : "http://office.hydrater.anyfetch.com",
    post : {
      access_token: "321",
      file_path : "https://raw2.github.com/Papiel/anyfetch-test/cb808057f26562bec2e10975cbe7950a3a6bb6b0/test/hydraters/samples/office.hydrater.anyfetch.com.test.doc",
      callback : "exemple.com",
      long_poll : 1,
      document_type : 'document',
      metadatas : {
        path: 'office.hydrater.anyfetch.com.test.doc'
      },
      datas : {},
      identifier : 'office-test'
    }
  },
  'image' : {
    url : "http://image.hydrater.anyfetch.com",
    post : {
      file_path : "https://raw2.github.com/Papiel/anyfetch-test/cb808057f26562bec2e10975cbe7950a3a6bb6b0/test/hydraters/samples/image.hydrater.anyfetch.com.test.png",
      callback : "exemple.com",
      long_poll : 1,
      document_type : 'file',
      metadatas : {
        "content-type": 'image/'
      },
      datas : {},
      identifier : 'image-test'
    }
  },
  'ocr' : {
    url : "http://ocr.hydrater.anyfetch.com",
    post : {
      file_path : "https://raw2.github.com/Papiel/anyfetch-test/cb808057f26562bec2e10975cbe7950a3a6bb6b0/test/hydraters/samples/ocr.hydrater.anyfetch.com.test.png",
      callback : "exemple.com",
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
      access_token : "321",
      file_path : "https://raw2.github.com/Papiel/anyfetch-test/cb808057f26562bec2e10975cbe7950a3a6bb6b0/test/hydraters/samples/eml.hydrater.anyfetch.com.test.eml",
      callback : "exemple.com",
      long_poll : 1,
      document_type : 'document',
      metadatas : {
        path: 'eml.hydrater.anyfetch.com.eml'
      },
      datas : {},
      identifier : 'eml-test'
    }
  },
};

module.exports.list = Object.keys(module.exports.params);