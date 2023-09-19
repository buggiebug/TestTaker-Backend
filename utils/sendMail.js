const nodeMailer = require("nodemailer");

exports.sendForgotPasswordEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    service: "gmail",
    secure:true,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASS,
    },
    // logger:true
  });

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions)
};

exports.sendMarksMail = async (subjectName,userMailState,count,ansState,timeMinState,timeSecState) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    service: "gmail",
    secure:true,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASS,
    },
    // logger:true
  });

  //  Design HTML file which shows in mail...
  let str = "";
  let totalMarks = 0;
  ansState.forEach((e)=>{
    str+=`<div style="color:black;padding: 5px;">
      <br/>
      <div><strong>Q.${e.questionNumber} &nbsp;&nbsp; ${e.questionName}</strong></div>
      <div>
        <p>1. &nbsp;&nbsp; ${e.option_1} </p>
        <p>2. &nbsp;&nbsp; ${e.option_2} </p>
        <p>3. &nbsp;&nbsp; ${e.option_3} </p>
        <p>4. &nbsp;&nbsp; ${e.option_4} </p>
        <p style="color: orange">Your Ans. &nbsp;&nbsp; ${e.yourAnswer} </p>
        <p style="color: green"><strong>Rigth Ans. &nbsp;&nbsp; ${e.right_Answer}</strong></p>
      </div>
      <br/>
      <hr/>
      <br/>
    </div>
    `
    totalMarks++;
  })

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: String(userMailState),
    subject: `${subjectName} test result.`,
    html:`<h1>You Scored: &nbsp;${count}/${totalMarks}</h1>
          <h3>Time: ${timeMinState}:${timeSecState} sec</h3>
    ${str}`
  };
  await transporter.sendMail(mailOptions)
};

