## How to run

There is a docker file which can be used to start the api server which internally call k6 to load test (you need to pass scenario as query param as to what scenario of load test you want to run)
1. docker build -t {} . 
2. docker run {}
3. curl host:port?scenario="anything that is present  in config.js file"
