//! Load .env configuration file
require('dotenv').config();

//! 3rd party dependencies
const path = require('path'),
	express = require('express'),
	session = require('express-session'),
	jsforce = require('jsforce');

//! Instantiate Salesforce client with .env configuration
/*const oauth2 = new jsforce.OAuth2({
	loginUrl: process.env.domain,
	clientId: process.env.consumerKey,
	clientSecret: process.env.consumerSecret,
	redirectUri: process.env.callbackUrl
});*/

//! Setup HTTP server
const app = express();
const port = process.env.PORT || 3000;
app.set('port', port);

/*
//! Enable server-side sessions
app.use(
	session({
		secret: process.env.sessionSecretKey,
		cookie: { secure: process.env.isHttps === 'true' },
		resave: false,
		saveUninitialized: false
	})
);

//! Serve HTML pages under root directory
app.use('/', express.static(path.join(__dirname, '../public')));


 // Attemps to retrieves the server session.
 // If there is no session, redirects with HTTP 401 and an error message
 
function getSession(request, response) {
	const session = request.session;
	if (!session.sfdcAuth) {
		response.status(401).send('No active session');
		return null;
	}
	return session;
}

function resumeSalesforceConnection(session) {
	return new jsforce.Connection({
		instanceUrl: session.sfdcAuth.instanceUrl,
		accessToken: session.sfdcAuth.accessToken,
		version: process.env.apiVersion
	});
}


 //Login endpoint
 
app.get('/auth/login', function (request, response) {
	//! Redirect to Salesforce login/authorization page
	response.redirect(oauth2.getAuthorizationUrl({ scope: 'api' }));
});


  //Login callback endpoint (only called by Salesforce)
 
app.get('/auth/callback', function (request, response) {
	if (!request.query.code) {
		response.status(500).send('Failed to get authorization code from server callback.');
		return;
	}

	//! Authenticate with OAuth
	const conn = new jsforce.Connection({
		oauth2: oauth2,
		version: process.env.apiVersion
	});
	conn.authorize(request.query.code, function (error, userInfo) {
		if (error) {
			console.log('Salesforce authorization error: ' + JSON.stringify(error));
			response.status(500).json(error);
			return;
		}

		//! Store oauth session data in server (never expose it directly to client)
		request.session.sfdcAuth = {
			instanceUrl: conn.instanceUrl,
			accessToken: conn.accessToken
		};
		//! Redirect to app main page
		return response.redirect('/index.html');
	});
});


 // Logout endpoint
 
app.get('/auth/logout', function (request, response) {
	const session = getSession(request, response);
	if (session == null) return;

	//! Revoke OAuth token
	const conn = resumeSalesforceConnection(session);
	conn.logout(function (error) {
		if (error) {
			console.error('Salesforce OAuth revoke error: ' + JSON.stringify(error));
			response.status(500).json(error);
			return;
		}

		//! Destroy server-side session
		session.destroy(function (error) {
			if (error) {
				console.error('Salesforce session destruction error: ' + JSON.stringify(error));
			}
		});

		//! Redirect to app main page
		return response.redirect('/index.html');
	});
});


  //Endpoint for retrieving currently connected user
 
app.get('/auth/whoami', function (request, response) {
	const session = getSession(request, response);
	if (session == null) {
		return;
	}

	//! Request session info from Salesforce
	const conn = resumeSalesforceConnection(session);
	conn.identity(function (error, res) {
		response.send(res);
	});
});


  // Endpoint for performing a SOQL query on Salesforce
 
app.get('/query', function (request, response) {
	const session = getSession(request, response);
	if (session == null) {
		return;
	}

	const query = request.query.q;
	if (!query) {
		response.status(400).send('Missing query parameter.');
		return;
	}

	const conn = resumeSalesforceConnection(session);
	conn.query(query, function (error, result) {
		if (error) {
			console.error('Salesforce data API error: ' + JSON.stringify(error));
			response.status(500).json(error);
			return;
		} else {
			response.send(result);
			return;
		}
	});
});

app.listen(app.get('port'), function () {
	console.log('Server started: http://localhost:' + app.get('port') + '/');
});*/

//!Login
console.log('LOGIN');
const username = process.env.SALESFORCE_USERNAME
console.log(username);
const password = process.env.SALESFORCE_PASSWORD
console.log(password);

var conn = new jsforce.Connection({

	// you can change loginUrl to connect to sandbox or prerelease env.
	loginUrl: 'https://login.salesforce.com',
	sessionId: '',
	serverUrl: 'https://tusharsaini16-dev-ed.my.salesforce.com/',
	version : process.env.apiVersion

});
conn.login(username, password, function (err, userInfo) {
	if (err) { return console.error(err); }
	// Now you can get the access token and instance URL information.
	// Save them to establish connection next time.
	//conn.sessionId = conn.accessToken;
	console.log(conn.accessToken);
	console.log(conn.instanceUrl);
	// logged in user property
	console.log("User ID: " + userInfo.id);
	console.log("Org ID: " + userInfo.organizationId);

	var records = [];
	conn.query("SELECT Id, Name FROM Account LIMIT 1", function (err, result) {
		if (err) { return console.error(err); }
		console.log("total : " + result.totalSize);
		console.log("fetched : " + result.records.length);
		records = result;
		console.log('Records', records);
	});

	/*conn.sobject("Account").create({ Name: 'Aaabbacus test node' }, function (err, ret) {
		if (err || !ret.success) { return console.error(err, ret); }
		console.log("Created record id : " + ret.id);
		// ...
	});*/

	// DELETE FROM Account WHERE CreatedDate = TODAY
	conn.sobject('Account')
		.find({ CreatedDate: jsforce.Date.TODAY })
		.destroy(function (err, rets) {
			if (err) { return console.error(err); }
			console.log('DELETED',rets);
			// ...
		});

	//!Logout
	/*conn.logout(function (err) {
		if (err) { return console.error(err); }
		// now the session has been expired.
		console.log('LOGOUT');
	});*/

});


