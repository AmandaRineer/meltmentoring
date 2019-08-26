const AWS = require('aws-sdk');
const sanitize = require("sanitize-filename");
let s3 = new AWS.S3();

exports.lambdaHandler = async (event, context) => {
    const eventBody = JSON.parse(event.body);

    let toDoList = { }

    if (eventBody.name){
        toDoList.name = eventBody.name;
    }

    toDoList.date = Date.now();

    if (eventBody.items){
        toDoList.items = eventBody.items;
    }

    let params = {
        Body: JSON.stringify(toDoList), 
        Bucket: "melt-mentoring", 
        Key: "rineer-2019/to-do-list/" + sanitize(toDoList.name) + ".json"
       };

    let saveResponse = await SaveObject(params);

    return {
        'statusCode': 200,
        'body': JSON.stringify(saveResponse)
    }

};

function SaveObject(saveObjectParams) {
  return new Promise((resolve, reject) => {
    s3.putObject(saveObjectParams, function (err, data) {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}