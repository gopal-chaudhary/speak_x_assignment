const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = "./questions.proto";
const { connection_string } = require('./secrets/keys');
const mongoose = require('mongoose');
const { Question } = require('./schema/questions'); 

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const questionsProto = grpc.loadPackageDefinition(packageDefinition);




const server = new grpc.Server();

const setDefaultValues = (question) => {
  if (!question.solution) {
    question.solution = '';
  }
  
  if (!question.options) {
    question.options = [];
  }

  return question;
};



server.addService(questionsProto.QuestionService.service, {
  
    SearchByTitle: async (call, callback) => {
      const { title, page = 1, limit = 10 } = call.request;  
      const skip = (page - 1) * limit;
  
      try {
        const questions = await Question.find({
          title: { $regex: title, $options: "i" },  
        })
          .skip(skip)  
          .limit(limit);
  
        const updatedQuestions = questions.map(setDefaultValues);
  
        callback(null, {
          questions: updatedQuestions
        });
      } catch (err) {
        console.error("Error while searching by title:", err.message);
      }
    },
  
    
    GetById: async (call, callback) => {
      const { question_id } = call.request;
      try {
        
        const question = await Question.findById(question_id);
        if (!question) {
          return callback({
            code: grpc.status.NOT_FOUND,
            details: "Question not found",
          });
        }
        callback(null, question);
      } catch (err) {
        console.error("Error while fetching question by ID:", err.message);
        callback({
          code: grpc.status.INTERNAL,
          details: "Error fetching question by ID",
        });
      }
    },
  });

server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (!err) {
    mongoose
      .connect(connection_string, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        console.log('Database connected successfully!');
      })
      .catch((err) => {
        console.log('Error while connecting to the database!');
        console.log(err);
      });

    console.log(`Server is running on port: ${port}`);
  } else {
    console.error("Failed to bind server:", err);
  }
});
