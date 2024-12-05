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
2. **Optional Services**: Route53 (for custom domains) and Cognito (for user authentication).  



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
<br/> Now lets create our Lambda Function to add data to the DynamoDB table (POST). Similar to the steps above, create the function with python runtime and use the same IAM role as before. <br/>
<img src="https://github.com/user-attachments/assets/128eb89d-5c6d-42a1-a5da-db582b89fa66"/>

<br/> Now again let's add our code however this time it will be to add data (Can be found under worker_scripts) <br/>

```.py
import json
import boto3

# Create a DynamoDB object using the AWS SDK
dynamodb = boto3.resource('dynamodb')
# Use the DynamoDB object to select our table
table = dynamodb.Table('studentData')

# Define the handler function that the Lambda service will use as an entry point
def lambda_handler(event, context):
    # Extract values from the event object we got from the Lambda service and store in variables
    student_id = event['studentid']
    name = event['name']
    student_class = event['class']
    age = event['age']
    
    # Write student data to the DynamoDB table and save the response in a variable
    response = table.put_item(
        Item={
            'studentid': student_id,
            'name': name,
            'class': student_class,
            'age': age
        }
    )
    
    # Return a properly formatted JSON object
    return {
        'statusCode': 200,
        'body': json.dumps('Student data saved successfully!')
    }
```
<br/> This function inserts a new item into the DynamoDB table studentData using values provided in the Lambda event object, such as studentid, name, class, and age. After successfully writing the data, it returns a JSON response indicating success with a status code of 200.<br/>

<br/> After deploying the code we must test our function. Enter the following key and values for the event JSON (values can be custom) <br/>

```JSON
{
  "studentid": "12345",
  "name": "John Doe",
  "class": "10",
  "age": 15
}
```

<br/> Save and click on test <br/>
<img src="https://github.com/user-attachments/assets/360ab534-cb86-45ea-97cc-0620b87391ea"/>

<br/> It returned successful. Go to the DynamoDB table and refresh to see if the data was added <br/>
<img src="https://github.com/user-attachments/assets/43339f09-92a2-4b78-b6a9-f080b2e2c596"/>
<br/> The Lambda Functions have now been successfully tested with the DynamoDB table and is working properly!  <br/>


 ##  Step 2: Create API to trigger Lambda Functions and S3 static web hosting
<img src="https://github.com/user-attachments/assets/f3f59313-4559-4468-b585-2cbfcbcb9d5f"/>

<br/> Next we will create the API Gateway and S3 bucket. The API Gateway will trigger the Lambda Functions to retrieve data and put data in the DynamoDB table. After creating the API we will put the API endpoint in scripts.js (under worker_scripts). Index.html and scripts.js will go within the S3 Bucket to host our website. <br/>

<br/> First let's create the API Gateway. Navigate to API Gateway and choose REST --> New API --> Edge-optimized <br/>
<img src="https://github.com/user-attachments/assets/06469665-a50f-487b-ad32-8a10f0b6ade4"/>
<br/> We choose edge-optimized instead of regional because regional only accepts users from within the same region we are using (us-east-2) where a the edge-optimized allows users from around the world. This means that end users can access our application from anywhere. <br/>

<br/> Now to create the GET and POST methods. Click create method --> choose GET --> Lambda Integration to trigger Lambda Functions --> Choose the corresponding function (getStudent for GET method).   <br/>

<img src="https://github.com/user-attachments/assets/0839f686-d65f-4092-bc5f-19fe3b5b7f25"/>
<br/> Repeat steps for the POST method and confirm by checking the trigger for both functions  <br/>
<img src="https://github.com/user-attachments/assets/a38426d2-c7f7-4619-96fa-52fe12aafc7f"/>
<img src="https://github.com/user-attachments/assets/fa144fa3-f6de-4f20-a81d-8be2b61e261a"/>

<br/> Now to test the GET Method select test at the API console and hit enter to view the DB table conents <br/>
<img src="https://github.com/user-attachments/assets/bce1ccdd-27f8-4d28-8ca3-b34a235be56c"/>
<br/> Now let's deploy our API and pick a stage name <br/>
<img src="https://github.com/user-attachments/assets/af10429b-6b5a-4b35-a34d-379ef07cc097"/>
<br/> Now there is an invoke url in the stage details we can use to invoke the Lambda Functions. Put that url in the API scripts.js so that when we use get student data in the app it will invoke data from the DynamoDB table. For example: <br/>
<img src="https://github.com/user-attachments/assets/ed3a7309-de5b-40bb-8606-8a89a652cca3"/>
<br/> Next enable CORS GET, POST, and save  <br/>
<img src="https://github.com/user-attachments/assets/beeac4ef-1d5c-4657-80d4-b314ba3e2cd1"/>

<br/> Now go to S3 Bucket and create an S3 bucket to host the application (leave all settings as default) <br/> 
<img src="https://github.com/user-attachments/assets/2f1d7058-2769-44d4-b8f5-d88027bcacb4"/>

<br/> Next add and upload index.html and API scripts.js <br/>

<img src="https://github.com/user-attachments/assets/b32cddb9-4caf-4e5a-9557-1cb55c376e25"/>

<br/> Now to configure the S3 Bucket, navigate to properties and enable static web hosting. Put index.html for the index document value <br/>
<img src="https://github.com/user-attachments/assets/031725bd-5494-42dd-8b75-e0cf450e165b"/>
<br/> We are now given an endpoint for the website however it is not accessable <br/>
<img src="https://github.com/user-attachments/assets/d589b3ca-1b72-4f9d-85ad-63bc5eafb48c"/>
<br/> How come? This is for 2 reasons: 1 Permissions block all public access and 2 an S3 Bucket policy must be created to grant public access. In the permissions tab enable the public access so it is no longer blocked  <br/>
<img src="https://github.com/user-attachments/assets/9a26d282-81b9-4aee-9931-076e7873346f"/>
<br/> Next enter an S3 Bucket Policy (A dev policy granting all access can be found under worker scripts)  <br/>

<img src="https://github.com/user-attachments/assets/a50f57b5-d63e-4c4f-bec6-8549956809c0"/>

<br/> Now refresh the tab to view the website <br/> 
<img src="https://github.com/user-attachments/assets/f542943b-4635-4cc8-9ba6-b14cc7c8cdcb"/>
<br/> Now click view all students to get the data in the DB table <br/>
<img src="https://github.com/user-attachments/assets/1a1b93b8-6526-4dfe-a9dd-8c67589aaba1"/>
<br/> Try to click save without entering any values and see what happens <br/>
<img src="https://github.com/user-attachments/assets/d2618123-5633-41b1-ab78-25bfb69c919d"/>
<br/> Enter values and save them, then go to the DB table to confirm everything is functional in the backend. <br/>
<img src="https://github.com/user-attachments/assets/55801d9b-8856-407f-bd9f-a2eb723dfd0e"/>
<br/> We get a message student data saved successfully and can view it by pressing the View All Student button <br/>
<img src="https://github.com/user-attachments/assets/ef385c99-3521-493b-8282-8fa257b1b46b"/>
<br/> Yes now we have deployed a fully functional serverless webapp from within AWS! <br/>

## Step 3: Place Cloudfront in front of the S3 Bucket
<img src="https://github.com/user-attachments/assets/bc98870c-b87a-41e2-8383-1b59952d3d77"/>
<br/> The web app is fully functionl however it is not secure and uses HTTP instead of HTTPS. This means that users interact directly with our S3 which is not good practice. <br/> 
<br/> Navigate to CloudFront --> create distribution --> pick the S3 bucket Domain --> Origin access control --> create new OAC --> Default root object = index.html <br/>
<img src="https://github.com/user-attachments/assets/249a2950-f3db-444d-812a-3977cc7e4efc"/>
<img src="https://github.com/user-attachments/assets/982d53e4-9c9c-43a8-9b1c-1d18ac80e790"/>
<br/> Note: Choose Do not enable security protections if in dev for WAF <br/>
<br/> Next click copy policy and go to the S3 bucket permissions. Click the button to block all public access. Then click edit bucket policy and paste the one auto-generated by CloudFront.  <br/>
<img src="https://github.com/user-attachments/assets/8ce9cf5e-efd1-4616-af0b-67b094b0cf14"/>
<br/> This policy gives CloudFront access to our S3 Bucket. Now enter the disribution domain name in a browser and the web app will be accessable <br/>
<img src="https://github.com/user-attachments/assets/e8b6a56a-56cf-46a4-90a1-940480c400fd"/>
<br/> Note: It is optional but you could use Route 53 for DNS management to map your custom domain to CloudFront (Not necessary if CloudFront domain is enough). <br/>
<br/>  <br/>


## Step 4: Create a Cognito User Pool to secure the API Gateway 



<img src="https://github.com/user-attachments/assets/a0a4f65b-e1cc-42b8-811c-7bd860e40574"/>

<br/> Creating a Cognito User Pool to secure the API Gateway adds an authentication layer, ensuring that only authorized users can access the apps backend services. It helps manage user identities and integrates seamlessly with other AWS services, allowing for secure API access. This enhances security by preventing unauthorized access while providing easy user management. <br/>

<br/> Go to Cognito and create a pool for the web app  <br/>
<img src="https://github.com/user-attachments/assets/4ae0b07d-44c0-4d64-8a96-e9f9ef25ff18"/>
<br/> Create a user then navigate to API Gateway and click Authorizers to add the user pool <br/>
<img src="https://github.com/user-attachments/assets/8ebd4706-30f1-4614-a28e-e6b7770f84f5"/>
<br/> Next we will need an auth token to access test. Enter the following in the AWS CLI <br/>

```Bash
aws cognito-idp initiate-auth \
  --auth-flow USER_PASSWORD_AUTH \
  --client-id <App_Client_ID> \
  --auth-parameters USERNAME=<username>,PASSWORD=<password>
```
<br/> The encrypted token will be returned in the output. Lastly copy and paste the auth token and your users credentials should be shown in an output similar to this one. <br/>
<img src="https://github.com/user-attachments/assets/b8cfe103-d3a4-4a88-bb80-3c02e1330e92"/>

 
<br/> Congratulations! This project successfully delivered a fully functional, serverless web application leveraging AWS services like API Gateway, Lambda, DynamoDB, S3, and CloudFront. With Cognito integration, we secured the API Gateway, ensuring authentication and user management. The system was designed to efficiently handle student data, demonstrating the power and scalability of modern serverless architectures. This marks the completion of a significant achievement in creating a secure, scalable, and production-ready application. Great work! 🎉


 <br/> 
