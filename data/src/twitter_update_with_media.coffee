fs = require('fs')
path = require('path')
request = require('request')

class twitter_update_with_media
  constructor: (@auth_settings) ->
    @api_url = 'https://api.twitter.com/1.1/statuses/update_with_media.json'

  post: (status, file_path, callback) ->
    r = request.post(@api_url, oauth:@auth_settings, callback)
    form = r.form()
    form.append('status', status)
    form.append('media[]', fs.createReadStream(path.normalize(file_path)))

module.exports = twitter_update_with_media