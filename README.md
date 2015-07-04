#Mule CE Agent

##How to run Server

To run the server you must to set MULE_HOME variable.

    # groovy mule-agent.groovy



##REST API

###List of Apps

Returns a comma separated list of APPS deployed in Mule server

    Request

     GET host:port/getListApps

    Response

    test-anchor.txt, test2-anchor.txt

### List of Domains

Returns a comma separated list of DOMAINS deployed in Mule server

    Request

    GET host:port/getListDomains

    Response

    testDomain-anchor.txt, test2Domain-anchor.txt

###Undeploy an App

Returns SUCCESS/NOT SUCCESS

    Request

     DELETE host:port/app/<name>

    Response

    SUCCESS/NOT SUCCESS

###Undeploy a Domain

Returns SUCCESS/NOT SUCCESS

    Request

     DELETE host:port/domain/<name>

    Response

    SUCCESS/NOT SUCCESS

NOTE: When a Domain is undeployed, also all the application under the Domain will be undeployed.

###Deploy an Application

Returns File name of deployed app

    Request

     POST host:port/app

    Body: multipart/form-data with the file to be deployed

    Response (Json)

    {"media type" : "application/zip" ,  "file name" : "<file name of deployed app"}

###Deploy a Domain

Returns File name of deployed app

    Request

     POST host:port/domain

    Body: multipart/form-data with the file to be deployed

    Response (Json)

    {"media type" : "application/zip" ,  "file name" : "<file name of deployed app"}
