require! [fibers,"fibers/future",http,url,fs]

exports.request = (options)->
	out = new future
	timer = set-timeout (->out.throw Error \timeout), 1e5

	req = http.request options, (res)->
		res.on \error ->out.throw it
		res.on \end ->
			clear-timeout timer
		out.return res

	req.on \error ->out.throw it
	
	req |> match options.data
	| (?) >> (not) => (.end!)
	| (.readable) => options.data~pipe
	| otherwise => (.end options.data)
	
	out.wait!


[\GET \POST \PUT \DELETE \OPTIONS \TRACE \CONNECT \HEAD].for-each (method)->
	exports[method.to-lower-case!] = (path,options ? {})~>
		exports.request options import (url.parse path) import {method}
