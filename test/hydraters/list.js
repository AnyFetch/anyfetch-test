'use strict';
/**
* @file Hydrater dependency
* This contain all basics dependencies hard-coded
*/


module.exports.params = {
  'plaintext' : {
    url : "http://plaintext.hydrater.anyfetch.com/hydrate",
    post :  {
      file_path : "",
      callback : "",
      long_poll : 1,
      document : {
        document_type : "file",
        metadatas : {},
        datas : {},
        identifier : ""
      }
    }
  },
  'pdf' : {
    url : "http://pdf.hydrater.anyfetch.com/hydrate/",
    post : {
      file_path : "",
      callback : "",
      long_poll : 1,
      document : {
        document_type : 'document',
        metadatas : {
          path: '\\.pdf$',
          mime_type: 'application/pdf'
        },
        datas : {},
        identifier : ""
      }
    }
  },
  'office' : {
    url : "http://office.hydrater.anyfetch.com/hydrate/",
    post : {
      file_path : "",
      callback : "",
      long_poll : 1,
      document : {
        document_type : 'document',
        metadatas : {
          path: '\\.(doc|docx|odt|rtf|ods|xls|xlsx|ppt|pptx|odp)$'
        },
        datas : {},
        identifier : ""
      }
    },
    samples : []
  },
  'image' : {
    url : "http://image.hydrater.anyfetch.com/hydrate/",
    post : {
      file_path : "",
      callback : "",
      long_poll : 1,
      document : {
        document_type : 'file',
        metadatas : {
          "content-type": '^image/'
        },
        datas : {},
        identifier : ""
      }
    }
  },
  'orc' : {
    url : "http://ocr.hydrater.anyfetch.com/hydrate/",
    post : {
      file_path : "",
      callback : "",
      long_poll : 1,
      document : {
        document_type : 'image',
        metadatas : {
        },
        datas : {},
        identifier : ""
      }
    }
  },
  'eml' : {
    url : "http://eml.hydrater.anyfetch.com/hydrate/",
    post : {
      file_path : "",
      callback : "",
      long_poll : 1,
      document : {
        document_type : 'document',
        metadatas : {
          path: '\\.eml$'
        },
        datas : {},
        identifier : ""
      }
    }
  },
};

module.exports.list = Object.keys(module.exports.params);