# village-ai

## How to install locally

To clone the repository,:
1. Run the following command in the terminal:

```
git clone https://github.com/austinoP/village-ai.git
```

2. Navigate to the project folder:
```
cd village-ai
```

3. Run this command to install the required dependencies:

```
npm install
```
## Adding openai api key
1. create a `.env` file in the root directory:
2. add the openai API key in the .env file as follows:
```bash
openApiKey= {{yourApiKey}}
```

## How to start the server

After installation ,start the server by running the following command in the terminal:

```
nodemon index.js
```
Once running, the following should be logged in the terminal:
```
Village server running on port 3000
```

You can change the port by adding a 'PORT' value in the .env file.:
```bash
openApiKey= <<yourApiKey>>
PORT=5000
```

## Using the server
### Available routes
The following routes are available on the server respectively. All routes are `POST` routes:

1.`/query/single`--For requests with a single profile in the body:

2.`/query/multi`--For requests with multiple profiles in the body:
| Route         | Body          | Value type  |
| --------------|:-------------:| -----:|
| `/query/single`| profile       |json {}  |
|               | question      |string ''|
|               | queryType     |string '' |
| `/query/multi` | profiles      |array [] |
|               | question      |string ''|
|               | queryType     |string ''|

### Request bodies
1. "profile" (`/query/single` only) only - json containing data of the scraped linked profile (MANDATORY)

2. "profiles" (`/query/multi` only)  - array of json objects containing data of the scraped linked (MANDATORY)

3. "question" (`BOTH`) - question about the profile/profiles to be answered (OPTIONAL)

4. "queryType" (`BOTH`) - simplified string describing what to answer from the profile/profiles provided(OPTIONAL)

Both "queryType" and "question" keys are optional but AT LEAST ONE MUST BE PROVIDED.

For answering, priority is given to "queryType"

If "queryType" value is missing or invalid, the "question" string value is answered

#### Valid queryType values
1. `/query/single` - 'salary' , 'age' , 'personality' , 'summary' , ' career accomplishments ' , ' savings ' , ' draft email '

2. `/query/multi` - 'compare' ,  ' icebreakers ', 'approach'






