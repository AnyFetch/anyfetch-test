'use strict';
/**
* @file Hydrater dependency
* This contain all basics dependencies hard-coded
*/


module.exports.dependencies = {
  'http://tikahydrater.anyfetch.com/hydrate': {
    dependencies: [],
    filters: [
      {
        document_type: 'file',
      },
    ]
  },
  'http://pdfhydrater.anyfetch.com/hydrate': {
    dependencies: ['http://tikahydrater.anyfetch.com/hydrate'],
    filters: [
      {
        metadatas : {
          path: '\\.pdf$',
        },
        document_type: 'document',
      },
      {
        metadatas: {
          mime_type: 'application/pdf',
        },
        document_type: 'document',
      }
    ]
  },
  'http://officehydrater.anyfetch.com/hydrate': {
    dependencies: ['http://tikahydrater.anyfetch.com/hydrate'],
    filters: [
      {
        metadatas: {
          path: '\\.(doc|docx|odt|rtf|ods|xls|xlsx|ppt|pptx|odp)$'
        },
        document_type: 'document',
      },
    ]
  },
  "http://imagehydrater.anyfetch.com/hydrate": {
    dependencies: ['http://tikahydrater.anyfetch.com/hydrate'],
    filters: [
      {
        metadatas: {
          "content-type": '^image/'
        },
        document_type: 'file',
      },
    ]
  },
  "http://tesseracthydrater.anyfetch.com/hydrate": {
    dependencies: [],
    filters: [
      {
        document_type: 'image',
      },
    ]
  },

  "http://emlhydrater.anyfetch.com/hydrate": {
    dependencies: [],
    filters: [
      {
        metadatas: {
          path: '\\.eml$'
        },
        document_type: 'document',
      },
    ]
  }
};

module.exports.list = Object.keys(module.exports.dependencies);