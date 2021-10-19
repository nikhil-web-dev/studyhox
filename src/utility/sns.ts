import AWS from "aws-sdk";

export const sendSNS = (phone: string, message: string) => {
  if (phone.toString().length == 10) {
    phone = "+91" + phone;
  }

  AWS.config.update({
    region: "ap-south-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  // Create publish parameters
  var params = {
    Message: message,
    PhoneNumber: phone,
    Subject: "SUBJECT",
    MessageAttributes: {
      "AWS.SNS.SMS.SenderID": {
        DataType: "String",
        StringValue: "appname",
      },
      "AWS.SNS.SMS.SMSType": {
        DataType: "String",
        StringValue: "Transactional",
      },
    },
  };

  // Create promise and SNS service object
  var publishTextPromise = new AWS.SNS({ apiVersion: "latest" })
    .publish(params)
    .promise();

  // Handle promise's fulfilled/rejected states
  publishTextPromise
    .then(function (data) {
      console.log(
        `Message ${params.Message} send sent to the topic ${params.PhoneNumber}`
      );
      console.log("MessageID is " + data.MessageId);
    })
    .catch(function (err) {
      console.error(err, err.stack);
      return false;
    });

  return true;
};
