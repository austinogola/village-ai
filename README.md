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
openApiKey= <<yourApiKey>>
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
1.`query/single`--For requests with a single profile in the body:
2.`query/multi`--For requests with multiple profiles in the body:
| Route         | Body          | Value type  |
| --------------|:-------------:| -----:|
| `query/single`| profile       |json {}  |
|               | question      |string ''|
|               | queryType     |string '' |
| `query/multi` | profiles      |array [] |
|               | question      |string ''|
|               | queryType     |string ''|





