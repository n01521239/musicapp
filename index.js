// const AWS = require('aws-sdk');
// const dynamodb = new AWS.DynamoDB.DocumentClient();

// exports.handler = async (event) => {
//     let response = {};
    
//     try {
//         const { httpMethod, path, body } = event;
        
//         if (httpMethod === 'POST' && path === '/albums') {
//             const album = JSON.parse(body);
//             // if (!album.id) {
//             //     album.id = new Date().getTime().toString();
//             //     }
            
//             const params = {
//                 TableName: 'MusicAlbums',
//                 Item: album,
//             };
            
//             await dynamodb.put(params).promise();
            
//             response = {
//                 statusCode: 201,
//                 body: JSON.stringify(album),
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Access-Control-Allow-Origin': '*',
//                     'Access-Control-Allow-Headers': 'Content-Type',
//                     'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
//                 }
//             };
//         } else if (httpMethod === 'GET' && path === '/albums') {
//             const params = {
//                 TableName: 'MusicAlbums'
//             };
            
//             const result = await dynamodb.scan(params).promise();
            
//             response = {
//                 statusCode: 200,
//                 body: JSON.stringify(result.Items),
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Access-Control-Allow-Origin': '*',
//                     'Access-Control-Allow-Headers': 'Content-Type',
//                     'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
//                 }
//             };
//         } else {
//             response = {
//                 statusCode: 404,
//                 body: 'Not found'
//             };
//         }
//     } catch (error) {
//         console.error(error);
        
//         response = {
//             statusCode: 500,
//             body: 'Internal server error'
//         };
//     }
//     // response.headers['Access-Control-Allow-Origin'] = '*';
//     // response.headers['Access-Control-Allow-Headers'] = 'Content-Type';
//     // response.headers['Access-Control-Allow-Methods'] = 'OPTIONS,POST,GET';

//     return response;
// };
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    let response = {};
    
    try {
        const { httpMethod, path, body } = event;
        
        if (httpMethod === 'POST' && path === '/albums') {
            const album = JSON.parse(body);
            
            if (!album.id) {
                album.id = new Date().getTime().toString();
            }
            
            const params = {
                TableName: 'MusicAlbums',
                Item: album,
            };
            
            await dynamodb.put(params).promise();
            
            response = {
                statusCode: 201,
                body: JSON.stringify(album),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE'
                }
            };
        } else if (httpMethod === 'GET' && path === '/albums') {
            const params = {
                TableName: 'MusicAlbums'
            };
            
            const result = await dynamodb.scan(params).promise();
            
            response = {
                statusCode: 200,
                body: JSON.stringify(result.Items),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE'
                }
            };
        } else if (httpMethod === 'PUT' && path === '/albums') {
            const album = JSON.parse(body);
            
            if (!album.id || !album.artist) {
                response = {
                    statusCode: 400,
                    body: 'Bad request: Album ID or Artist missing'
                    
                };
            } else {
                const params = {
                    TableName: 'MusicAlbums',
                    Key: { id: album.id, artist: album.artist },
                    UpdateExpression: 'SET #title = :title, #year = :year',
                    ExpressionAttributeNames: {
                        '#title': 'title',
                        '#year': 'year'
                    },
                    ExpressionAttributeValues: {
                        ':title': album.title,
                        ':year': album.year
                    }
                };
                
                await dynamodb.update(params).promise();
                
                response = {
                    statusCode: 200,
                    body: JSON.stringify({ message: 'Album updated successfully' }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Methods': 'OPTIONS,PUT,GET,POST,DELETE'
                    }
                };
            }
        } else if (httpMethod === 'DELETE' && path === '/albums') {
            const album = JSON.parse(body);
            
            if (!album.id || !album.artist) {
                response = {
                    statusCode: 400,
                    body: 'Bad request: Album ID or Artist missing'
                };
            } else {
                const params = {
                    TableName: 'MusicAlbums',
                    Key: { id: album.id, artist: album.artist }
                };
                
                await dynamodb.delete(params).promise();
                
                response = {
                    statusCode: 200,
                    body: JSON.stringify({ message: 'Album deleted successfully' }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Allow-Methods': 'OPTIONS,DELETE,GET,PUT,POST'
                    }
                };
            }
        } else {
            response = {
                statusCode: 404,
                body:
'Not Found',
headers: {
'Content-Type': 'text/plain',
'Access-Control-Allow-Origin': '*',
'Access-Control-Allow-Headers': 'Content-Type',
'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE'
}
};
}
} catch (err) {
console.error(err);
    response = {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal Server Error' }),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE'
        }
    };
}

return response;
};
