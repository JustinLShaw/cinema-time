package main

import (
   "github.com/aws/aws-sdk-go/aws"
   "github.com/aws/aws-sdk-go/aws/session"
   "github.com/aws/aws-sdk-go/service/dynamodb"
   "github.com/aws/aws-lambda-go/lambda"
   "github.com/aws/aws-lambda-go/events"

   "fmt"
)

// Declare a new DynamoDB instance. Note that this is safe for concurrent
// use.
var db = dynamodb.New(session.New(), aws.NewConfig().WithRegion("us-east-1"))

func connect(request events.APIGatewayWebsocketProxyRequest) (events.APIGatewayProxyResponse, error) {

   input := &dynamodb.PutItemInput{
      Item: map[string]*dynamodb.AttributeValue{
         "connectionID": {
            S: aws.String(request.RequestContext.ConnectionID),
         },
      },
      TableName:              aws.String("chat"),
   }
   
   result,err := db.PutItem(input)
   if err != nil {
      fmt.Println("Got error calling PutItem:")
      fmt.Println(err.Error())
   }

   fmt.Println(result);

   return events.APIGatewayProxyResponse{Body: "success", StatusCode: 200}, nil
   
}

func main() {
   lambda.Start(connect)
}