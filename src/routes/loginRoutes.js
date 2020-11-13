var mysql = require('mysql');
var bcrypt = require('bcrypt');
var connection  = mysql.createConnection({
	host: '127.0.0.1',
	port: '3308',
	user: 'root',
	password: '',
	database: 'collo-e-gas'
});

connection.connect(function(err){
	if(!err){
		return  console.log('Database connection successfull');
	}
	return console.log('Error connecting to database!:  ' + err.message);
});

const registration = async function(req,res){
	const password = req.body.password;
	const salt = bcrypt.genSaltSync(10, 'a');
	const encryptedPassword = await bcrypt.hash(password, salt);
	let users = {
		'email' : req.body.email,
		'password': encryptedPassword
	};
	connection.query('INSERT INTO users SET ?', users, function (error, results, fields){
		if(error){
			return res.send({
				'code' : 400,
				'failed': 'An unknown error occurred'
			});
		}
		return res.status(200).json({
			'code': 200,
			'success': 'User registered successfully'
		});
	});
};
const login = async function(req,res){
	var email = req.body.email;
	var password = req.body.password;
	connection.query('SELECT * FROM users WHERE email = ?', [email],async function (err,results, fields) {
		if(err){
			return res.status(400).json({
				'code': 400,
				'failed': 'error occurred'
			});
		}
		if(results.length > 0) {
			const comparison = await bcrypt.compare(password, results[0].password);
			if(comparison){
				return res.status(200).json({
					'code' : 200,
					'success' : 'Login successfull'
				});
			}
			res.status(204).json({
				'code': 204,
				'success' : 'Email and password do not match'
			});
		}else{
			return res.status(206).json({
				'code': 206,
				'success': 'Email does not exist'
			});
		}
	});
};
module.exports = {registration, login};