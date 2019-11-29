package main

import (
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/apigatewaymanagementapi"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"

	"fmt"
)

type connectionID struct {
	ConnectionID string
}

// Declare a new DynamoDB instance. Note that this is safe for concurrent
// use.
var db = dynamodb.New(session.New(), aws.NewConfig().WithRegion("us-east-1"))

func getAllConnectionIDs() []connectionID {
	params := &dynamodb.ScanInput{
		TableName: aws.String("chat"),
	}

	result, err := db.Scan(params)
	if err != nil {
		fmt.Errorf("failed to make Query API call, %v", err)
	}

	connectionIDs := []connectionID{}
	dynamodbattribute.UnmarshalListOfMaps(result.Items, &connectionIDs)

	return connectionIDs
}

func message(request events.APIGatewayWebsocketProxyRequest) (events.APIGatewayProxyResponse, error) {

	// Create PostConnectionInputs for each ConnectionID in ConnectionID array

	connectionIds := getAllConnectionIDs()

	var gateway = apigatewaymanagementapi.New(session.New(), aws.NewConfig().WithRegion("us-east-1").
		WithEndpoint(request.RequestContext.DomainName+"/"+request.RequestContext.Stage))

	for _, connectionID := range connectionIds {
		
		if connectionID.ConnectionID != request.RequestContext.ConnectionID {
			
			params := new(apigatewaymanagementapi.PostToConnectionInput)
	
			params.SetConnectionId(connectionID.ConnectionID)
			params.SetData([]byte(request.Body))
	
			_,err := gateway.PostToConnection(params)
	
			if err!=nil {
				fmt.Println(err)
			}
		}
	}

	return events.APIGatewayProxyResponse{Body: "success", StatusCode: 200}, nil

}

func main() {
	lambda.Start(message)
}
