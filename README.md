TupleJS
===

### Getting Started
```bash
$ npm i --save touplejs
```

### Usage
```javascript
// ResponseStatus('ok', {data: {someData: 3}})
const ResponseStatus = Tuple(String, Object)

const apiResponse = ResponseStatus('ok', {data: 'asdf'})
const serverResp = ResponseStatus('error', {error: 'there was an error'})

serverResp.equals(apiResponse) // false

const [, error] = serverResp
const [status, data] = apiResponse
```

## Methods

#### Tuple - Used to create a tuple
`(types) -> Function`
Allows creation of tuples with type saftey


***For demo's I will be using a `Name` tuple (`Tuple(String, String)`)***

#### map
```javascript
const myName = Name('first', 'last')

myName.map((item) => item.toUpperCase())
```

#### reduce
```javascript
const myName = Name('Steve', 'Jobs')

myName.reduce('', R.concat) // 'SteveJobs'
```

#### equals
```javascript
Name('Steve', 'Jobs').equals(Name('Steve', 'Wozniak')) // false
```

### length
```javascript
Name('Steve', 'Jobs').length // 2
```
