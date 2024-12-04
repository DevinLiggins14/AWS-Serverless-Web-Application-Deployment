# AWS-Serverless-Web-Application-Deployment
<h2>Description</h2>
<br/> In this project we will deploy a serverless web application built on AWS, optimized for scalability and low maintenance. It uses CloudFront to deliver static content from S3 Bucket and API Gateway to handle dynamic requests processed by Lambda functions, with DynamoDB for data storage. Optional integrations include Route 53 for custom domains and Cognito for user authentication, making it a flexible serverless deployment and production ready!

<br />
<br/> Project Architecture: <br/>
<img src="https://github.com/user-attachments/assets/cc3adab1-a2fd-4edc-b22b-39352f5520a4"/>
<br/> We will host a static web application using static web hosting. We will then configure static web hosting to the API Gateway, then the API Gateway will trigger Lambda Functions. When it triggers the GET function it will gather data from the DynamoDB table and show it to the end user. To add data to the DynamoDB table the API Gateway will trigger the POST Lambda function and store the data within the table.   <br/>

<h2> Services involved: </h2>

| **Service**       | **Purpose**                                                                 |
|--------------------|-----------------------------------------------------------------------------|
| **CloudFront**     | Distributes static and dynamic content with low latency and high transfer speeds. |
| **S3 Bucket**      | Stores static files like HTML, CSS, and JavaScript for the web application. |
| **API Gateway**    | Handles HTTP API requests and routes them to Lambda functions.             |
| **Lambda Functions** | Executes backend logic for handling GET and POST requests.                |
| **DynamoDB**       | Provides fast and scalable NoSQL database storage for application data.    |
| **Route 53** (optional) | Manages custom domain names for the application.                       |
| **Cognito** (optional) | Enables user authentication and authorization.                         |


### **Notes for Usage**
1. **Required Services**: S3, API Gateway, Lambda, DynamoDB.
2. **Optional Services**: Route53 (for custom domains), CloudFront (for faster performance), Cognito (for user authentication).  



<p align="center">
  
### **Prerequisites**  
- Have an [AWS account](https://aws.amazon.com/console/)   


 ##  Step 1: Create DynamoDB table and Lambda Functions
<img src="https://github.com/user-attachments/assets/3c73e1c2-8c94-4c32-bb6a-551b915776eb"/>

<br/>  We will create 2 different Lambda Functions, 1 for GET and 1 for POST, and then test them with the DynamoDB table <br/>
<br/> Navigate to DynamoDB and go to tables to create a table <br/>
<br/> We will refer our data using 1 key (studentid) so we can place our data within the table <br/> 
<br/>  <br/>

<img src="https://github.com/user-attachments/assets/5808c381-64c1-48bb-8341-de11b96447f1"/>

<br/> While the DynamoDB is being created go to Lambda and click create Lambda Function --> from scratch --> python runtime. <br/>
<img src="https://github.com/user-attachments/assets/ce1eafa5-512c-455e-8031-d07ecb54bd15"/>
<br/> Now the execution role we must create an IAM policy that grants Lambda Functions access to DynamoDB. Navigate to IAM --> choose create policy --> select Lambda as the service --> enter the following <br/>

```JSON
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "dynamodb:*",
      "Resource": "*"
    }
  ]
}
# Note: this grants full access, for dev purposes only!
```
<br/> Click next to name and then create the policy. Next create a role and attach the policy to it. Then return to the Lambda function, refresh, and choose the new existing role then create the function.   <br/>
<img src="https://github.com/user-attachments/assets/b0479d5b-aa6a-43bb-b1a3-9e187db5a420"/>
<img src="https://github.com/user-attachments/assets/ff255e17-d2ce-40a4-b340-cf89c26c1d9b"/>
<img src="https://github.com/user-attachments/assets/71341329-212e-48bf-b08a-a3227927e45b"/>
<br/> With our new function created let's now enter the code needed to get data from the DB table (Can also be found under worker_scripts) <br/>
```.py
import json
import boto3

def lambda_handler(event, context):
    # Initialize a DynamoDB resource object for the specified region
    dynamodb = boto3.resource('dynamodb', region_name='us-east-2')

    # Select the DynamoDB table named 'studentData'
    table = dynamodb.Table('studentData')

    # Scan the table to retrieve all items
    response = table.scan()
    data = response['Items']

    # If there are more items to scan, continue scanning until all items are retrieved
    while 'LastEvaluatedKey' in response:
        response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        data.extend(response['Items'])

    # Return the retrieved data
    return data
```
<br/> This function will retrieve all items from the DynamoDB table studentData, handling pagination by continuously scanning until all records are fetched. The retrieved data is then returned as the function's response. Once copied click Deploy on the left to save changes <br/>
<br/> Now let's test our Lambda Function to see if it is working or not, click test, enter a name, and test <br/>
<img src="https://github.com/user-attachments/assets/f0f693fc-1126-46ab-9e07-60714259a1c6"/>
<br/> By clicking test we invoke the Lambda Function causing this Function to go to DynamoDB table and try to get data from the table. (This is why we needed to create the IAM polciy). We can see the output from the table is [] blank because our table does not contain any items: <br/>
<img src="https://github.com/user-attachments/assets/f38f2e10-ecec-4206-9a7b-d73cd837f1d5"/>
<br/>  <br/>
<img src=""/>

<br/>  <br/>

<img src=""/>

<br/> <br/>
<img src=""/>
<br/> <br/>
<img src=""/>
<br/> <br/>
<img src=""/>

<img src=""/>

<br/>  <br/>

<img src=""/>

<br/> <br/>
<img src=""/>
<br/> <br/>
<img src=""/>
<br/> <br/>
<img src=""/>

 
<img src=""/>

<br/>  <br/>

<img src=""/>
<img src=""/>
<img src=""/>
<img src=""/>


 ##  Step 2: Create API to trigger Lambda Functions and S3 static web hosting
<img src="https://github.com/user-attachments/assets/f3f59313-4559-4468-b585-2cbfcbcb9d5f"/>

<br/>  <br/>


<img src=""/>

<br/>  <br/>

<img src=""/>

<br/> <br/>
<img src=""/>
<br/> <br/>
<img src=""/>
<br/> <br/>
<img src=""/>

<img src=""/>

<br/>  <br/>

<img src=""/>

<br/> <br/>
<img src=""/>
<br/> <br/>
<img src=""/>
<br/> <br/>
<img src=""/>


<img src=""/>
<img src=""/>
<img src=""/>
<img src=""/>
