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
<br/>  <br/>

<img src=""/>
<img src=""/>
<img src=""/>
<img src=""/>

<br/> <br/>

 
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
<img src=""/>
<img src=""/>
<img src=""/>
