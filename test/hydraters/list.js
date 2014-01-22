'use strict';
/**
* @file Hydrater dependency
* This contain all basics dependencies hard-coded
*/


module.exports.params = {
  "tikahydrater" : {
    url : "http://tikahydrater.anyfetch.com/hydrate",
    file_path : "",
    callback : "",
    long_poll : 1,
    document : {
      document_type : "file",
      metadatas : {},
      datas : {},
      identifier : ""
    }
  },
  "pdfhydrater" : {
    url : "http://pdfhydrater.anyfetch.com/hydrate",
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
  },
  "officehydrater" : {
    url : "http://officehydrater.anyfetch.com/hydrate",
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
  "imagehydrater" : {
    url : "http://imagehydrater.anyfetch.com/hydrate",
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
  },
  "tesseracthydrater" : {
    url : "http://tesseracthydrater.anyfetch.com/hydrate",
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
  },
  "emlhydrater" : {
    url : "http://emlhydrater.anyfetch.com/hydrate",
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
  },
};

module.exports.lists = Object.keys(module.exports.params);