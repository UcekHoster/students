const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient
const ejs = require('ejs');
const path = require('path');
const pdf = require('html-pdf');
const FileStream = require('fs');
const sendgrid_mail = require('@sendgrid/mail');
const Binary = mongodb.Binary
const publicIp = require('public-ip');
const cloudinary = require('cloudinary').v2;

router.use(cookieParser());
sendgrid_mail.setApiKey(process.env.SENGRID_KEY);
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

router.get('/', (req, res) => {
    res.render('home', {
        header: 'Student Database'
    });
});

router.get('/register', (req, res) => {
    res.render('register', {
        header: 'Register - Student Database'
    });
});
router.get('/emailExist', (req, res) => {
    res.render('emailExist', {
        header: 'Try Again - already exist'
    });
});
router.post('/register', async (req, res) => {
    const emailExist = await User.findOne({
        mail: req.body.mail
    });
    if (emailExist) {
        return res.status(400)
            .redirect('emailExist');
    } else {
        var fullUrl = req.protocol + '://' + req.get('host');
        const expiration = {
            expires: new Date(Date.now + 1 * 24 * 60 * 60 * 1000)
        };
        const token = jwt.sign({
            nad: req.body.id,
            dob: req.body.date,
            mail: req.body.mail,
            name: req.body.username
        }, process.env.TOKEN_SECRET, {
            expiresIn: '6h'
        });
        res.cookie('TOKEN', token, expiration);
        try {
            // const email = {
            //     to: req.body.mail,
            //     from: 'ucekcsedb@gmail.com',
            //     subject: `Hello, ${req.body.username}. Verification Mail from UCEK`,
            //     html: `<div style="text-align: center">
            // <h2>Univeristy college of Engineering - Kancheepuram</h4>
            // <h4>Department of Computer Science and Engineering</h5><br>
            // <p>Please confirm your Mail ID within 2 hours! Otherwise, your licence will be revoked.</p><br>
            // <p>Once you get verified using this Email, this Mail will become invalid!</p><br>
            // <button style="padding:10px 20px;background:#4f37b9;border-radius: 20px;border:1px solid #4f37b9"><a style="text-decoration: none; color: white" href="${fullUrl}/verify_email/${token}">Verify Me!</a></button></div>`
            // };
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'ucekhoster@gmail.com',
                    pass: 'ucekcse@44'
                }
            });

            const mailOptions = {
                to: req.body.mail,
                from: 'ucekhoster@gmail.com',
                subject: `Hello, ${req.body.username}. Verification Mail from UCEK`,
                html: `<div style="text-align: center">
            <h2>Univeristy college of Engineering - Kancheepuram</h4>
            <h4>Department of Computer Science and Engineering</h5><br>
            <p>Please confirm your Mail ID within 2 hours! Otherwise, your licence will be revoked.</p><br>
            <p>Once you get verified using this Email, this Mail will become invalid!</p><br>
            <button style="padding:10px 20px;background:#4f37b9;border-radius: 20px;border:1px solid #4f37b9"><a style="text-decoration: none; color: white" href="${fullUrl}/verify_email/${token}">Verify Me!</a></button></div>`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    res.redirect('/error')
                } else {

                }
            });
            // sendgrid_mail.send(email)
        } catch (err) {
            res.redirect('/error');
        }
        res.redirect('/sent');
    }
});

router.get('/error', async (req, res) => {
    res.render('error', {
        header: "Internal Server Error"
    })
});


router.get('/revoked', async (req, res) => {
    res.render('revoked', {
        header: "Please try to login..."
    })
});

router.get('/sent', async (req, res) => {
    res.render('sent', {
        header: 'Sent - check your Mail'
    });
});

router.get('/verifyExist', async (req, res) => {
    res.render('verifyExist', {
        header: 'Already Verified!'
    });
});
router.get('/verify_email/:token', async (req, res) => {
    const token = req.params.token;
    const data = jwt.decode(token, process.env.TOKEN_SECRET);
    const exp = data.exp;
    const iat = data.iat;
    const name = data.name;
    const nad = data.nad;
    const dob = data.dob;
    const mail = data.mail;
    const expValue = (exp - iat) / 60;
    await User.findOne({
        nad,
        dob
    }, async (userField) => {
        try {
            if (expValue / 60 <= 6) {
                const user = new User({
                    name: name,
                    nad: nad,
                    autherized: 'No',
                    mail: mail,
                    dob: dob,
                    token: token,
                    nationality: null,
                    phone_no: null,
                    address: null,
                    branch: null,
                    yearofJoining: null,
                    regulation: null,
                });
                await user.save();
                res.render('user_verify', {
                    myid: nad,
                    mydob: dob
                });
            }
        } catch (e) {
            res.redirect('/verifyExist')
        }
    });
});

router.get('/feonbnkkkujnxdkrqgouhqpsiaarpsfhekrpgwvuscmdtfvcpokzegryacvzsdha', async (req, res) => {
    res.render('feonbnkkkujnxdkrqgouhqpsiaarpsfhekrpgwvuscmdtfvcpokzegryacvzsdha', {
        header: 'Login - Student Database'
    });
});

router.post('/feonbnkkkujnxdkrqgouhqpsiaarpsfhekrpgwvuscmdtfvcpokzegryacvzsdha', async (req, res) => {
    const token = jwt.sign({
        nad: req.body.id,
        dob: req.body.date
    }, process.env.TOKEN_SECRET, {
        expiresIn: '6h'
    });
    res.cookie('TOKEN', token, {
        expires: new Date(Date.now + 1 * 24 * 60 * 60 * 1000)
    });
    await User.findOne({
        nad: req.body.id,
        dob: req.body.date
    }, (err, data) => {
        try {
            const mail = data.mail;
            var fullUrl = req.protocol + '://' + req.get('host');
            try {
                (async () => {
                    const ip = await publicIp.v4();
                    // const email = {
                    //     to: mail,
                    //     from: 'ucekcsedb@gmail.com',
                    //     subject: `UCEK- Kancheepuram.`,
                    //     html: `<div style="text-align: center">
                    //         <p>It's just a notification!<br>${req.body.id}, You've Logged In Recently from <b>IP: ${ip}</b>.</p>
                    //         <button style="padding:10px 20px;background:#4f37b9;border-radius: 20px;border:1px solid #4f37b9"><a style="text-decoration: none; color: white" href=${fullUrl}>Home</a></button></div>`
                    // };
                    // sendgrid_mail.send(email)
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'ucekhoster@gmail.com',
                            pass: 'ucekcse@44'
                        }
                    });

                    const mailOptions = {
                        from: 'ucekhoster@gmail.com',
                        to: mail,
                        subject: `UCEK- Kancheepuram.`,
                        html: `<div style="text-align: center">
                            <p>It's just a notification!<br>${req.body.id}, You've Logged In Recently from <b>IP: ${ip}</b>.</p>
                            <button style="padding:10px 20px;background:#4f37b9;border-radius: 20px;border:1px solid #4f37b9"><a style="text-decoration: none; color: white" href=${fullUrl}>Home</a></button></div>`
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            res.redirect('/error')
                        } else {

                        }
                    });
                })();
                res.redirect('/formEntry');
            } catch (err) {
                res.render('error', {
                    header: 'Sorry! Try again soon'
                });
            }
        } catch (err) {
            res.render('feonbnkkkujnxdkrqgouhqpsiaarpsfhekrpgwvuscmdtfvcpokzegryacvzsdha', {
                addOn: 'add',
                header: "Login - Student Database"
            })
        }
    })
});
router.get('/formEntry', async (req, res) => {
    const token = req.cookies.TOKEN;
    const data = jwt.decode(token, process.env.TOKEN_SECRET);
    const d1 = new Date();
    const year0 = d1.getFullYear();
    const d = new Date(year0, 4, 25);
    const first_year = d.getFullYear();
    const second_year = d.getFullYear() - 1;
    const third_year = d.getFullYear() - 2;
    const fourth_year = d.getFullYear() - 3;
    // const second_year = new Date(year-1, d.getMonth(), d.getDate())
    // const third_year = new Date(year-2, d.getMonth(), d.getDate())
    // const fourth_year = new Date(year-3, d.getMonth(), d.getDate())
    await User.findOne({
        nad: data.nad
    }, (err, hold) => {
        if (err) {
            res.render('formEntry', {
                myid: data.nad,
                mydob: data.dob,
                mymail: '',
                myname: '',
                mynation: '',
                myph: '',
                myaddress: '',
                later_entry: '',
                mysslc: '',
                mysslc_cutoff: '',
                sslc_file: '',
                myhsc: '',
                myhsc_cutoff: '',
                hsc_file: '',
                mybranch: '',
                myyearofJoining: '',
                myregulation: '',
                year1: first_year,
                year2: second_year,
                year3: third_year,
                year4: fourth_year,
                header: 'Student Information'
            });
        } else {
            if (hold.later_entry === 'No') {
                res.render('formEntry', {
                    myid: hold.nad,
                    mydob: hold.dob,
                    mymail: hold.mail,
                    myname: hold.name,
                    mynation: hold.nationality,
                    myph: hold.phone_no,
                    myaddress: hold.address,
                    later_entry: hold.later_entry,
                    mysslc: hold.sslc,
                    mysslc_cutoff: hold.sslc_cutoff,
                    sslc_file: hold.sslc_file,
                    sslc_size: hold.sslc_size,
                    myhsc: hold.hsc,
                    myhsc_cutoff: hold.hsc_cutoff,
                    hsc_file: hold.hsc_file,
                    hsc_size: hold.hsc_size,
                    mybranch: hold.branch,
                    myyearofJoining: hold.yearofJoining,
                    myregulation: hold.regulation,
                    year1: first_year,
                    year2: second_year,
                    year3: third_year,
                    year4: fourth_year,
                    header: 'Student Information'
                });
            } else {
                res.render('formEntry', {
                    myname: hold.name,
                    myid: data.nad,
                    mydob: data.dob,
                    mymail: hold.mail,
                    mymail: '',
                    myname: '',
                    mynation: '',
                    myph: '',
                    myaddress: '',
                    later_entry: '',
                    mysslc: '',
                    mysslc_cutoff: '',
                    sslc_file: '',
                    myhsc: '',
                    myhsc_cutoff: '',
                    hsc_file: '',
                    mybranch: '',
                    myyearofJoining: '',
                    myregulation: '',
                    year1: first_year,
                    year2: second_year,
                    year3: third_year,
                    year4: fourth_year,
                    header: 'Student Information'
                });
            }
        }
    })
});
router.post('/formEntry', async (req, res) => {
    async function uriGen(data) {
        if (data.includes("http://res.cloudinary.com/ucekcse/image/")) {
            return data
        } else if (data) {
            const uri = await cloudinary.uploader.upload(data)
            return uri.url
        } else {
            return null
        }
    }
    const token = req.cookies.TOKEN;
    const data = jwt.decode(token, process.env.TOKEN_SECRET);
    const tech_array = {
        tech_option: req.body.group1,
        technical_head: req.body.technical_head,
        technical_start: req.body.technical_start,
        technical_end: req.body.technical_end,
        technical_title: req.body.technical_title,
        technical_description: req.body.technical_description,
        technical_remark: req.body.technical_remark,
        tech_file: await uriGen(req.body.technical_file),
    }
    const sport_array = {
        sports_option: req.body.group2,
        sports_head: req.body.sports_head,
        sports_start: req.body.sports_start,
        sports_remark: req.body.sports_remark,
        sport_file: await uriGen(req.body.sports_file),
    }
    const sslcFile = req.body.sslc_file
    const hscFile = req.body.hsc_file
    try {
        if (hscFile.includes("http://res.cloudinary.com/ucekcse/image/") && sslcFile.includes("http://res.cloudinary.com/ucekcse/image/")) {
            await User.updateMany({
                nad: data.nad
            }, {
                name: req.body.username,
                nad: req.body.id,
                mail: req.body.email,
                dob: req.body.date,
                token: token,
                nationality: req.body.nation,
                phone_no: req.body.tele,
                address: req.body.address,
                later_entry: req.body.form_group1,
                sslc: req.body.sslc,
                sslc_cutoff: req.body.sslc_cutoff,
                sslc_file: req.body.sslc_file,
                hsc: req.body.hsc,
                hsc_cutoff: req.body.hsc_cutoff,
                hsc_file: req.body.hsc_file,
                branch: req.body.branch,
                yearofJoining: req.body.yearofJoining,
                regulation: req.body.regulation,
                $push: {
                    technical: tech_array,
                    sports: sport_array
                },
            })
        } else if (req.body.form_group1 === 'Yes') {
            await User.updateMany({
                nad: data.nad
            }, {
                name: req.body.username,
                nad: req.body.id,
                mail: req.body.email,
                dob: req.body.date,
                token: token,
                nationality: req.body.nation,
                phone_no: req.body.tele,
                address: req.body.address,
                later_entry: req.body.form_group1,
                branch: req.body.branch,
                yearofJoining: req.body.yearofJoining,
                regulation: req.body.regulation,
                $push: {
                    technical: tech_array,
                    sports: sport_array
                },
                Semester_1: {
                    later_entry: null,
                    attended: null,
                    sub1: null,
                    sub2: null,
                    sub3: null,
                    sub4: null,
                    sub5: null,
                    sub6: null,
                    lab1: null,
                    lab2: null,
                    gpa: null,
                    arrear: null,
                    s1_file: await uriGen('')
                },
                Semester_2: {
                    later_entry: null,
                    attended: null,
                    sub1: null,
                    sub2: null,
                    sub3: null,
                    sub4: null,
                    sub5: null,
                    sub6: null,
                    lab1: null,
                    lab2: null,
                    gpa: null,
                    arrear: null,
                    s2_file: await uriGen('')
                },
                Semester_3: {
                    later_entry: null,
                    attended: null,
                    sub1: null,
                    sub2: null,
                    sub3: null,
                    sub4: null,
                    sub5: null,
                    lab1: null,
                    lab2: null,
                    lab3: null,
                    lab4: null,
                    gpa: null,
                    arrear: null,
                    s3_file: await uriGen('')
                },
                Semester_4: {
                    later_entry: null,
                    attended: null,
                    sub1: null,
                    sub2: null,
                    sub3: null,
                    sub4: null,
                    sub5: null,
                    sub6: null,
                    lab1: null,
                    lab2: null,
                    lab3: null,
                    gpa: null,
                    arrear: null,
                    s4_file: await uriGen('')
                },
                Semester_5: {
                    later_entry: null,
                    attended: null,
                    sub1: null,
                    sub2: null,
                    sub3: null,
                    sub4: null,
                    sub5: null,
                    oe_1: null,
                    sub6: null,
                    lab1: null,
                    lab2: null,
                    lab3: null,
                    gpa: null,
                    arrear: null,
                    s5_file: await uriGen('')
                },
                Semester_6: {
                    later_entry: null,
                    attended: null,
                    sub1: null,
                    sub2: null,
                    sub3: null,
                    sub4: null,
                    sub5: null,
                    pe_1: null,
                    sub6: null,
                    lab1: null,
                    lab2: null,
                    gpa: null,
                    arrear: null,
                    s6_file: await uriGen('')
                },
                Semester_7: {
                    attended: null,
                    sub1: null,
                    sub2: null,
                    sub3: null,
                    pe_2: null,
                    sub4: null,
                    pe_3: null,
                    sub5: null,
                    oe_2: null,
                    sub6: null,
                    lab1: null,
                    lab2: null,
                    gpa: null,
                    arrear: null,
                    s7_file: await uriGen('')
                },
                Semester_8: {
                    attended: null,
                    pe_4: null,
                    sub1: null,
                    pe_5: null,
                    sub2: null,
                    gpa: null,
                    arrear: null,
                    s8_file: await uriGen('')
                },
                project_work: {
                    project_head: null,
                    project_count: null,
                    name_team: null,
                    project_description: null,
                    project_remark: null
                },
                mini_project: {
                    mini_head: null,
                    mini_count: null,
                    m_name_team: null,
                    m_description: null,
                    mini_remark: null
                },
            })
        } else {
            await User.updateMany({
                nad: data.nad
            }, {
                name: req.body.username,
                nad: req.body.id,
                mail: req.body.email,
                dob: req.body.date,
                token: token,
                nationality: req.body.nation,
                phone_no: req.body.tele,
                address: req.body.address,
                later_entry: req.body.form_group1,
                sslc: req.body.sslc,
                sslc_cutoff: req.body.sslc_cutoff,
                sslc_file: await uriGen(req.body.sslc_file),
                hsc: req.body.hsc,
                hsc_cutoff: req.body.hsc_cutoff,
                hsc_file: await uriGen(req.body.hsc_file),
                branch: req.body.branch,
                yearofJoining: req.body.yearofJoining,
                regulation: req.body.regulation,
                $push: {
                    technical: tech_array,
                    sports: sport_array
                },
                Semester_1: {
                    later_entry: null,
                    attended: null,
                    sub1: null,
                    sub2: null,
                    sub3: null,
                    sub4: null,
                    sub5: null,
                    sub6: null,
                    lab1: null,
                    lab2: null,
                    gpa: null,
                    arrear: null,
                    s1_file: await uriGen('')
                },
                Semester_2: {
                    later_entry: null,
                    attended: null,
                    sub1: null,
                    sub2: null,
                    sub3: null,
                    sub4: null,
                    sub5: null,
                    sub6: null,
                    lab1: null,
                    lab2: null,
                    gpa: null,
                    arrear: null,
                    s2_file: await uriGen('')
                },
                Semester_3: {
                    later_entry: null,
                    attended: null,
                    sub1: null,
                    sub2: null,
                    sub3: null,
                    sub4: null,
                    sub5: null,
                    lab1: null,
                    lab2: null,
                    lab3: null,
                    lab4: null,
                    gpa: null,
                    arrear: null,
                    s3_file: await uriGen('')
                },
                Semester_4: {
                    later_entry: null,
                    attended: null,
                    sub1: null,
                    sub2: null,
                    sub3: null,
                    sub4: null,
                    sub5: null,
                    sub6: null,
                    lab1: null,
                    lab2: null,
                    lab3: null,
                    gpa: null,
                    arrear: null,
                    s4_file: await uriGen('')
                },
                Semester_5: {
                    later_entry: null,
                    attended: null,
                    sub1: null,
                    sub2: null,
                    sub3: null,
                    sub4: null,
                    sub5: null,
                    oe_1: null,
                    sub6: null,
                    lab1: null,
                    lab2: null,
                    lab3: null,
                    gpa: null,
                    arrear: null,
                    s5_file: await uriGen('')
                },
                Semester_6: {
                    later_entry: null,
                    attended: null,
                    sub1: null,
                    sub2: null,
                    sub3: null,
                    sub4: null,
                    sub5: null,
                    pe_1: null,
                    sub6: null,
                    lab1: null,
                    lab2: null,
                    gpa: null,
                    arrear: null,
                    s6_file: await uriGen('')
                },
                Semester_7: {
                    attended: null,
                    sub1: null,
                    sub2: null,
                    sub3: null,
                    pe_2: null,
                    sub4: null,
                    pe_3: null,
                    sub5: null,
                    oe_2: null,
                    sub6: null,
                    lab1: null,
                    lab2: null,
                    gpa: null,
                    arrear: null,
                    s7_file: await uriGen('')
                },
                Semester_8: {
                    attended: null,
                    pe_4: null,
                    sub1: null,
                    pe_5: null,
                    sub2: null,
                    gpa: null,
                    arrear: null,
                    s8_file: await uriGen('')
                },
                project_work: {
                    project_head: null,
                    project_count: null,
                    name_team: null,
                    project_description: null,
                    project_remark: null
                },
                mini_project: {
                    mini_head: null,
                    mini_count: null,
                    m_name_team: null,
                    m_description: null,
                    mini_remark: null
                },
            })
        }
        res.redirect('/semesters');
    } catch (err) {
        res.send(err)
    }
});
router.get('/semesters', async (req, res) => {
    const token = req.cookies.TOKEN;
    const data = jwt.decode(token, process.env.TOKEN_SECRET);
    const exist = await User.findOne({
        nad: data.nad
    })
    res.render('semesters', {
        exist: exist,
        header: 'Student Semester Details'
    });
});
router.post('/semesters', async (req, res) => {
    async function uriGen(data) {
        if (data.includes("http://res.cloudinary.com/ucekcse/")) {
            return data
        } else if (data) {
            const uri = await cloudinary.uploader.upload(data)
            return uri.url
        } else {
            return null
        }
    }
    // const sslc_uri = await cloudinary.uploader.upload(sslc_img)
    // const test = Object.values(req.body).map(e => e !== "" || e !== null)
    // console.log("before-----", req.body)
    // console.log("after------", test)
    // const concated = "semester";

    //  const Semester+req.body.= {
    //         later_entry: req.body.group1,
    //         attended: req.body.group2,
    //         sub1: req.body.s1_sub1,
    //         sub2: req.body.s1_sub2,
    //         sub3: req.body.s1_sub3,
    //         sub4: req.body.s1_sub4,
    //         sub5: req.body.s1_sub5,
    //         sub6: req.body.s1_sub6,
    //         lab1: req.body.s1_lab1,
    //         lab2: req.body.s1_lab2,
    //         gpa: req.body.sem1,
    //         arrear: req.body.arrear1,
    //         s1_file: ''
    //     }
    // console.log(s8_uri)
    const token = req.cookies.TOKEN;
    const data = jwt.decode(token, process.env.TOKEN_SECRET);
    const ref_nad = data.nad;
    try {
        await User.updateMany({
            nad: ref_nad
        }, {
            autherized: "No",
            Semester_1: {
                later_entry: req.body.group1,
                attended: req.body.group2,
                sub1: req.body.s1_sub1,
                sub2: req.body.s1_sub2,
                sub3: req.body.s1_sub3,
                sub4: req.body.s1_sub4,
                sub5: req.body.s1_sub5,
                sub6: req.body.s1_sub6,
                lab1: req.body.s1_lab1,
                lab2: req.body.s1_lab2,
                gpa: req.body.sem1,
                arrear: req.body.arrear1,
                s1_file: await uriGen(req.body.s1_file)
            },
            Semester_2: {
                later_entry: req.body.group3,
                attended: req.body.group4,
                sub1: req.body.s2_sub1,
                sub2: req.body.s2_sub2,
                sub3: req.body.s2_sub3,
                sub4: req.body.s2_sub4,
                sub5: req.body.s2_sub5,
                sub6: req.body.s2_sub6,
                lab1: req.body.s2_lab1,
                lab2: req.body.s2_lab2,
                gpa: req.body.sem2,
                arrear: req.body.arrear2,
                s2_file: await uriGen(req.body.s2_file)
            },
            Semester_3: {
                later_entry: req.body.group5,
                attended: req.body.group6,
                sub1: req.body.s3_sub1,
                sub2: req.body.s3_sub2,
                sub3: req.body.s3_sub3,
                sub4: req.body.s3_sub4,
                sub5: req.body.s3_sub5,
                lab1: req.body.s3_lab1,
                lab2: req.body.s3_lab2,
                lab3: req.body.s3_lab3,
                lab4: req.body.s3_lab4,
                gpa: req.body.sem3,
                arrear: req.body.arrear3,
                s3_file: await uriGen(req.body.s3_file)
            },
            Semester_4: {
                later_entry: req.body.group7,
                attended: req.body.group8,
                sub1: req.body.s4_sub1,
                sub2: req.body.s4_sub2,
                sub3: req.body.s4_sub3,
                sub4: req.body.s4_sub4,
                sub5: req.body.s4_sub5,
                sub6: req.body.s4_sub6,
                lab1: req.body.s4_lab1,
                lab2: req.body.s4_lab2,
                lab3: req.body.s4_lab3,
                gpa: req.body.sem4,
                arrear: req.body.arrear4,
                s4_file: await uriGen(req.body.s4_file)
            },
            Semester_5: {
                later_entry: req.body.group9,
                attended: req.body.group10,
                sub1: req.body.s5_sub1,
                sub2: req.body.s5_sub2,
                sub3: req.body.s5_sub3,
                sub4: req.body.s5_sub4,
                sub5: req.body.s5_sub5,
                oe_1: req.body.oe_1,
                sub6: req.body.s5_sub6,
                lab1: req.body.s5_lab1,
                lab2: req.body.s5_lab2,
                lab3: req.body.s5_lab3,
                gpa: req.body.sem5,
                arrear: req.body.arrear5,
                s5_file: await uriGen(req.body.s5_file)
            },
            Semester_6: {
                later_entry: req.body.group11,
                attended: req.body.group12,
                sub1: req.body.s6_sub1,
                sub2: req.body.s6_sub2,
                sub3: req.body.s6_sub3,
                sub4: req.body.s6_sub4,
                sub5: req.body.s6_sub5,
                pe_1: req.body.pe_1,
                sub6: req.body.s6_sub6,
                lab1: req.body.s6_lab1,
                lab2: req.body.s6_lab2,
                gpa: req.body.sem6,
                arrear: req.body.arrear6,
                s6_file: await uriGen(req.body.s6_file)
            },
            Semester_7: {
                attended: req.body.group13,
                sub1: req.body.s7_sub1,
                sub2: req.body.s7_sub2,
                sub3: req.body.s7_sub3,
                pe_2: req.body.pe_2,
                sub4: req.body.s7_sub4,
                pe_3: req.body.pe_3,
                sub5: req.body.s7_sub5,
                oe_2: req.body.oe_2,
                sub6: req.body.s7_sub6,
                lab1: req.body.s7_lab1,
                lab2: req.body.s7_lab2,
                gpa: req.body.sem7,
                arrear: req.body.arrear7,
                s7_file: await uriGen(req.body.s7_file)
            },
            Semester_8: {
                attended: req.body.group14,
                pe_4: req.body.pe_4,
                sub1: req.body.s8_sub1,
                pe_5: req.body.pe_5,
                sub2: req.body.s8_sub2,
                gpa: req.body.sem8,
                arrear: req.body.arrear8,
                s8_file: await uriGen(req.body.s8_file)
            },
            project_work: {
                project_head: req.body.project_head,
                project_count: req.body.project_count,
                name_team: req.body.name_team,
                project_description: req.body.project_description,
                project_remark: req.body.project_remark
            },
            mini_project: {
                mini_head: req.body.mini_head,
                mini_count: req.body.mini_count,
                m_name_team: req.body.m_name_team,
                m_description: req.body.m_description,
                mini_remark: req.body.mini_remark
            },
        })
        res.redirect('/download');
    } catch (err) {
        res.send(err)
    }
})
router.get('/download', async (req, res) => {
    const token = req.cookies.TOKEN;
    const data = jwt.decode(token, process.env.TOKEN_SECRET);
    const ref_nad = data.nad;
    await User.findOne({
        nad: ref_nad
    }, (err, profile) => {
        if (err) {
            res.redirect('/error');
        } else {
            const userData = profile;
            ejs.renderFile(path.join(__dirname, '../views/', "pdfTemplate.ejs"), {
                profile: userData
            }, (err, data) => {
                if (err) {
                    res.render("error", {
                        header: 'Sorry! Try again soon'
                    })
                } else {
                    let options = {
                        "format": "A4",
                        "orientation": "portrait",
                        "border": {
                            "left": "1cm",
                            "right": "1cm",
                            "top": "1cm",
                            "bottom": "1cm"
                        },
                        "header": {
                            "height": "5mm",
                            "contents": {
                                first: '<div style="text-align: center"><h2>UNIVERSITY COLLEGE OF ENGINEERING - KANCHEEPURAM</h4><h3>DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING</h5><hr></div>'
                            }
                        },
                        "footer": {
                            "height": "20mm",
                            "contents": '<hr><h1><b>UNAUTHORIZED COPY</b></h1>'
                        }
                    };
                    pdf.create(data, options).toBuffer(function (err, data) {
                        if (err) {
                            res.redirect('/download', {
                                profile: profile,
                                header: 'Download Details'
                            });
                        } else {
                            let file = {
                                nad: profile.nad,
                                username: profile.name,
                                yearofJoining: profile.yearofJoining,
                                autherized: profile.autherized,
                                file: Binary(data)
                            }
                            insertFile(file, res);
                        }
                    });
                }
            });
            res.render('download', {
                profile: profile,
                header: 'Download details'
            });
        }
    });
});

router.post('/download', async (req, res) => {
    const token = req.cookies.TOKEN;
    const data = jwt.decode(token, process.env.TOKEN_SECRET);
    const ref_nad = data.nad;
    mongoClient.connect(process.env.DB_SECRET_KEY, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        },
        async (err, client) => {
            let db = client.db('mainStore')
            let collection = db.collection('storage')
            collection.findOne({
                nad: ref_nad
            }, (err, data) => {
                if (err) {

                } else {
                    BUFFER = data.file.buffer;
                    FileStream.writeFileSync(`${data.nad}.pdf`, BUFFER)
                    var stream = FileStream.ReadStream(`${data.nad}.pdf`)
                    // FileStream.unlinkSync(`${data.nad}.pdf`)
                    var file_name = data.nad
                    res.setHeader('content-type', 'application/pdf')
                    res.setHeader('content-disposition', 'inline; filenmae ="' + file_name + '"')
                    stream.pipe(res)
                }
            });
        });
});

async function insertFile(file, res) {
    mongoClient.connect(process.env.DB_SECRET_KEY, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        },
        async (err, client) => {
            let db = client.db('mainStore')
            let collection = db.collection('storage')
            collection.findOne({
                nad: file.nad
            }, async (err, data) => {
                if (err) {
                    collection.insertOne(file);
                } else {
                    try {
                        await collection.updateMany({
                            nad: file.nad
                        }, {
                            $set: {
                                "name": file.username,
                                "file": file.file,
                                "yearofJoining": file.yearofJoining,
                                "autherized": file.autherized
                            }
                        }, {
                            upsert: true
                        });
                    } catch (err) {
                        res.redirect('/error');
                    }
                }
                client.close(true)
            });
        });
}

router.get('/feedback', async (req, res) => {
    res.render('feedback', {
        header: "Your thought to improve"
    })
})
router.post('/feedback', async (req, res) => {
    const feedback = {
        name: req.body.username,
        year: req.body.year,
        title: req.body.feed_title,
        description: req.body.desc
    }
    await mongoClient.connect(process.env.DB_SECRET_KEY, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        },
        async (err, client) => {
            let db = client.db('mainStore')
            let collection = db.collection('feedback')
            await collection.insertOne(feedback);
        })
    res.render('thanks', {
        header: "Thanks"
    })
})

module.exports = router;