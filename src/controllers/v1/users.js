//LOGIC
const usersModel = require('../../models/v1/users');
const { success, failed, tokenResult } = require('../../helpers/response');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenTime = 6000;
const {
	inboxGmailRegist,
	inboxGmailForgot
} = require('../../helpers/sendEmail');
const env = require('../../helpers/env');
const nodemailer = require('nodemailer');

const users = {
	registerCoi: async (req, res) => {
		try {
			const body = req.body;
			const passwords = req.body.password;
			// di ubah dengan karakter minimal 10 digit
			const hashPass = await bcrypt.hash(passwords, 10);
			const data = {
				email: body.email,
				password: hashPass
			};
			usersModel
				.register(data)
				.then(result => {
					const id = result.insertId;

					success(
						res,
						result,
						'Register success, please check your email for activation'
					);
					inboxGmailRegist(data.email, id);
				})
				.catch(err => {
					if (err) {
						failed(res, [], 'Email sudah ada');
					} else {
						failed(res, [], err.message);
					}
				});
		} catch (error) {
			failed(res, error.message, 'Email has been registered');
		}
	},
	login: async (req, res) => {
		const body = req.body;
		try {
			const loginUser = await usersModel.login(body);

			if (loginUser.length > 0) {
				const results = loginUser[0];

				if (results.status_aktivasi === 1) {
					const password = results.password;
					const userRefreshToken = results.refreshToken;
					const isMatch = await bcrypt.compare(body.password, password);
					if (isMatch) {
						jwt.sign(
							{
								email: results.email
							},
							env.JWTSECRET,
							{
								expiresIn: tokenTime
							},
							(err, token) => {
								if (err) {
									failed(res, [], err);
								} else {
									if (userRefreshToken === null) {
										const id = results.id;
										const refreshToken = jwt.sign({ id }, 'REFRESH TOKEN 123123');
										usersModel
											.updateRefreshToken(refreshToken, id)
											.then(() => {
												const data = {
													id: id,
													token: token,
													refreshToken: refreshToken
												};
												tokenResult(
													res,
													data,
													`Account anda sudah aktif dan berhasil login`
												);
											})
											.catch(err => {});
									} else {
										const data = {
											id: results.id,
											token: token,
											refreshToken: userRefreshToken
										};
										tokenResult(res, data, `Berhasil Login`);
									}
								}
							}
						);
					} else {
						failed(res, [], 'Password Salah');
					}
				} else {
					failed(res, [], 'Email belum aktif');
				}
			} else {
				failed(res, [], 'Email tidak terdaftar');
			}
		} catch (error) {
			failed(res, [], error.message);
		}
	},
	renewToken: (req, res) => {
		try {
			const refreshToken = req.body.refreshToken;
			usersModel
				.checkRefreshToken(refreshToken)
				.then(result => {
					if (result.length >= 1) {
						const user = result[0];
						const newToken = jwt.sign(
							{
								email: user.email
							},
							env.JWTSECRET,
							{
								expiresIn: tokenTime
							}
						);
						const data = {
							token: newToken,
							refreshToken: refreshToken
						};
						tokenResult(res, data, 'Token berhasil di refresh');
					} else {
						failed(res, [], 'Refresh token not found');
					}
				})
				.catch(err => {
					failed(res, [], err);
				});
		} catch (error) {
			failed(res, [], 'Internal Server Error');
		}
	},
	resetPassword: (req, res) => {
		try {
			const email = req.body.email;
			usersModel
				.resetPass(email)
				.then(result => {
					// gunakan nodemailer untuk kirim email
					if (!result[0]) {
						failed(res, [], 'Email invalid');
					} else {
						const key = Math.floor(Math.random(111999777) * Math.floor(222999777));
						usersModel
							.updateKeyReset(key, email)
							.then(result => {
								success(res, result, 'Check your email to reset password');
								const output = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                                        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
                                        
                                        <head>
                                            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                                            <meta name="viewport" content="width=device-width">
                                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                            <title></title>
                                            <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css">
                                            <style type="text/css">
                                                body {
                                                    margin: 0;
                                                    padding: 0;
                                                }
                                        
                                                table,
                                                td,
                                                tr {
                                                    vertical-align: top;
                                                    border-collapse: collapse;
                                                }
                                        
                                                * {
                                                    line-height: inherit;
                                                }
                                        
                                                a[x-apple-data-detectors=true] {
                                                    color: inherit !important;
                                                    text-decoration: none !important;
                                                }
                                            </style>
                                            <style type="text/css" id="media-query">
                                                @media (max-width: 560px) {
                                        
                                                    .block-grid,
                                                    .col {
                                                        min-width: 320px !important;
                                                        max-width: 100% !important;
                                                        display: block !important;
                                                    }
                                        
                                                    .block-grid {
                                                        width: 100% !important;
                                                    }
                                        
                                                    .col {
                                                        width: 100% !important;
                                                    }
                                        
                                                    .col>div {
                                                        margin: 0 auto;
                                                    }
                                        
                                                    img.fullwidth,
                                                    img.fullwidthOnMobile {
                                                        max-width: 100% !important;
                                                    }
                                        
                                                    .no-stack .col {
                                                        min-width: 0 !important;
                                                        display: table-cell !important;
                                                    }
                                        
                                                    .no-stack.two-up .col {
                                                        width: 50% !important;
                                                    }
                                        
                                                    .no-stack .col.num2 {
                                                        width: 16.6% !important;
                                                    }
                                        
                                                    .no-stack .col.num3 {
                                                        width: 25% !important;
                                                    }
                                        
                                                    .no-stack .col.num4 {
                                                        width: 33% !important;
                                                    }
                                        
                                                    .no-stack .col.num5 {
                                                        width: 41.6% !important;
                                                    }
                                        
                                                    .no-stack .col.num6 {
                                                        width: 50% !important;
                                                    }
                                        
                                                    .no-stack .col.num7 {
                                                        width: 58.3% !important;
                                                    }
                                        
                                                    .no-stack .col.num8 {
                                                        width: 66.6% !important;
                                                    }
                                        
                                                    .no-stack .col.num9 {
                                                        width: 75% !important;
                                                    }
                                        
                                                    .no-stack .col.num10 {
                                                        width: 83.3% !important;
                                                    }
                                        
                                                    .video-block {
                                                        max-width: none !important;
                                                    }
                                        
                                                    .mobile_hide {
                                                        min-height: 0px;
                                                        max-height: 0px;
                                                        max-width: 0px;
                                                        display: none;
                                                        overflow: hidden;
                                                        font-size: 0px;
                                                    }
                                        
                                                    .desktop_hide {
                                                        display: block !important;
                                                        max-height: none !important;
                                                    }
                                                }
                                            </style>
                                        </head>
                                        
                                        <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: transparent;">
                                            <table class="nl-container" style="table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse;  background-color: transparent; width: 100%;" cellpadding="0" cellspacing="0" role="presentation" width="100%" bgcolor="transparent" valign="top">
                                                <tbody>
                                                    <tr style="vertical-align: top;" valign="top">
                                                        <td style="word-break: break-word; vertical-align: top;" valign="top">
                                                            <div style="padding-top:30px; padding-bottom:30px; background-color:#eaf8f8;overflow:hidden">
                                                                <div class="block-grid " style="min-width: 320px; max-width: 540px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; width: 100%; background-color: #ffffff;">
                                                                    <div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">
                                                                        <div class="col num12" style="min-width: 320px; max-width: 540px; display: table-cell; vertical-align: top; width: 540px;">
                                                                            <div style="width:100% !important;">
                                                                                <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
                                                                                    <div style="color:#393d47;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:1.2;padding-top:5px;padding-right:20px;padding-bottom:0px;padding-left:20px;">
                                                                                        <div style="line-height: 1.2; font-size: 12px; color: #393d47; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; ">
                                                                                            <p style="text-align: center; line-height: 1.2; word-break: break-word; font-size: 38px;  margin: 0;"><span style="font-size: 38px; color: #48bdbd;">Point Of Sales</span></p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div style="color:#393d47;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:1.2;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;">
                                                                                        <div style="line-height: 1.2; font-size: 12px; color: #393d47; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;">
                                                                                            <p style="text-align: center; line-height: 1.2; word-break: break-word; font-size: 13px;margin: 0;"><span style="font-size: 13px; color: #808080;">serving the best food and drink</span></p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="img-container center fixedwidth" align="center" style="padding-right: 0px;padding-left: 0px;">
                                                                                        <img class="center fixedwidth" align="center" border="0" src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/594595_576305/oke/5482%20%281%29.png"  style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 351px; display: block;" width="351">
                                                                                    </div>
                                                                                    
                                                                                    <div style="color:#393d47;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:1.2;padding-top:10px;padding-right:60px;padding-bottom:15px;padding-left:60px;">
                                                                                        <div style="line-height: 1.2; font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; color: #393d47;">
                                                                                            <p style="font-size: 14px; line-height: 1.2; word-break: break-word; text-align: center; font-family: Montserrat, 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;  margin: 0;"><strong><span style="font-size: 16px;">Pengaturan ulang kata sandi</span></strong></p>
                                                                                        </div>
                                                                                    </div>
                                                                                    
                                                                                    <div style="color:#393d47;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:1.5;padding-top:10px;padding-right:5px;padding-bottom:0px;padding-left:5px;">
                                                                                        <div style="line-height: 1.5; font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; color: #393d47; ">
                                                                                            <p style="font-size: 13px; line-height: 1.5; text-align: center; word-break: break-word; font-family: Montserrat, 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; margin: 0;"><span style="font-size: 13px; ">Klik tombol di bawah untuk memperbarui kata sandi</span></p>
                                                                                        </div>
                                                                                    </div>
                                                                                
                                                                                    <div style="color:#393d47;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:2;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;">
                                                                                        <div style="line-height: 2; font-size: 12px; color: #393d47; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;">
                                                                                            <p style="text-align: center; line-height: 2; word-break: break-word; font-size: 11px; margin: 0;"><span style="color: #808080; font-size: 11px;">Sebaiknya gunakan sandi yang rumit agar lebih aman.</span></p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div class="button-container" align="center" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;"><a href="${env.urlFrontend}/confirm-password?key=${key}" target="_blank" style="-webkit-text-size-adjust: none; text-decoration: none; display: block; color: #ffffff; background-color: #48bdbd; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; width: 30%; width: 30%; border-top: 0px dotted #8a3b8f; border-right: 0px dotted #8a3b8f; border-bottom: 0px dotted #8a3b8f; border-left: 0px dotted #8a3b8f; padding-top: 5px; padding-bottom: 5px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; text-align: center; word-break: keep-all;"><span style="padding-left:5px;padding-right:5px;font-size:13px;display:inline-block;"><span style="font-size: 16px; line-height: 2; word-break: break-word; "><span style="font-size: 13px; line-height: 26px;" data-mce-style="font-size: 13px; line-height: 26px;">Reset Password</span></span></span></a>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr> 
                                                </tbody>
                                            </table>
                                        </body>
                                        
                                        </html>`;
								let transporter = nodemailer.createTransport({
									host: 'smtp.gmail.com',
									port: 587,
									secure: false,
									requireTLS: true,
									auth: {
										user: env.emailCom, // generated ethereal user
										pass: env.emaillpassword // generated ethereal password
									}
								});
								let Mail = {
									from: '"Point Of Sales" <no-reply@gmail.com>',
									to: req.body.email,
									subject: 'Reset Password',
									text: 'Plaintext version of the message',
									html: output
								};
								transporter.sendMail(Mail, (err, info) => {
									if (err) throw err;
									console.log('Email sent: ' + info.response);
								});
							})
							.catch(err => {
								failed(res, [], err.message);
							});
					}
				})
				.catch(err => {
					failed(res, [], err);
				});
		} catch (err) {
			failed(res, [], 'Server internal error');
		}
	},
	confirmPass: async (req, res) => {
		try {
			const data = req.body;
			const key = req.body.key;
			if (data.password !== data.confirmpwd) {
				failed(res, [], 'Password tidak boleh sama');
			} else {
				if (!key) {
					failed(
						res,
						[],
						'Anda tidak memiliki izin untuk mengganti password,silahkan verifikasi password terlebih dahulu'
					);
				} else {
					const pass = data.password;
					const salt = await bcrypt.genSalt(10);
					const generate = await bcrypt.hash(pass, salt);
					usersModel
						.ubahPassword(generate, key)
						.then(result => {
							success(res, result, 'Password sudah di ganti');
						})
						.catch(err => {
							failed(res, [], err.message);
						});
				}
			}
		} catch (err) {
			failed(res, [], 'Server internal error');
		}
	},
	verify: (req, res) => {
		try {
			const token = req.params.token;
			jwt.verify(token, env.JWTREGISTER, async (err, decode) => {
				if (err) {
					failed(
						res,
						[],
						'Anda belum registrasi,silahkan registrasi terlebih dahulu.'
					);
				} else {
					const email = decode.email;
					usersModel.aktifasiSuccess(email);
					res.render('thanks', { email });
				}
			});
		} catch (error) {
			errorServer(res, [], 'Internal server error');
		}
	}
};

module.exports = users;
