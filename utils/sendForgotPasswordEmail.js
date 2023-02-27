const nodeMailer = require("nodemailer");

exports.sendForgotPasswordEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    service: "gmail",
    secure:true,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASS,
    },
    logger:true
  });

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions)
};

exports.sendMarksMail = async (subjectName,userMailState,count,ansState) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    service: "gmail",
    secure:true,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASS,
    },
    logger:true
  });

  let str = "";
  ansState.forEach((e)=>{
    str+=`<div style="border:"2px solid red">
      <div>Q.${e.questionNumber} &nbsp;&nbsp; ${e.questionName}</div>
      <div>
        <p>1. &nbsp;&nbsp; ${e.option_1} </p>
        <p>2. &nbsp;&nbsp; ${e.option_2} </p>
        <p>3. &nbsp;&nbsp; ${e.option_3} </p>
        <p>4. &nbsp;&nbsp; ${e.option_4} </p>
        <p>Rigth Ans. &nbsp;&nbsp; ${e.right_Answer} </p>
        <p>Your Ans. &nbsp;&nbsp; ${e.yourAnswer} </p>
      </div>
    </div><br/></br>`
  })

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: userMailState,
    subject: `${subjectName} test result.`,
    html:`<h1>You Scored: &nbsp;${count}</h1>
    ${str}`
  };
  await transporter.sendMail(mailOptions)
};

