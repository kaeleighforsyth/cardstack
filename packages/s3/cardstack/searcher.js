const { declareInjections }   = require('@cardstack/di');
const log = require('@cardstack/logger')('cardstack/s3');
const { makeS3Client } = require('./s3');
const { get } = require('lodash');
const { basename } = require('path');
const { lookup } = require('mime-types');
const moment = require('moment');


module.exports = declareInjections({
  searcher: 'hub:searchers'
},

class S3Searcher {
  static create(...args) {
    return new this(...args);
  }
  constructor({ dataSource, config, searcher, branches }) {
    this.config       = config;
    this.branches     = branches;
    this.dataSource   = dataSource;
    this.searcher     = searcher;
  }

  async get(session, branch, type, id, next) {
    let result = await next();

    if (result) { return result; }

    if (type === 'content-types') { return next(); }

    let contentType = await this.searcher.get(session, branch, 'content-types', type);

    let dataSourceId = get(contentType, 'data.relationships.data-source.data.id');

    // only look for files in s3 if the content type is actually stored
    // in this data source
    if (dataSourceId !== this.dataSource.id) {
      return result;
    }

    try {
      let name = basename(id);
      let result = await this.getObject(branch, { Key: id });
      let contentType = lookup(name) || 'application/octet-stream';


      let attributes = {
        'created-at':  moment(result.LastModified).format(),
        'content-type': contentType,
        'size':         result.ContentLength,
        'file-name':    name
      };

      let data = {
        type,
        id,
        attributes
      };


      return { data };
    } catch(e) {
      return result;
    }
  }

  async search(session, branch, query, next) {
    return next();
  }

  async getObject(branch, options) {
    let config = this.branches[branch];
    log.debug(`Attempting to read ${options.Key} from bucket ${config.bucket}`);

    return await makeS3Client(config).getObject(options).promise();
  }

  async getBinary(session, branch, type, id) {
    let result = await this.getObject(branch, { Key: id });
    return result.Body;
  }
});
