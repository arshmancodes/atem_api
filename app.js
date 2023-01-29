const express = require('express');
const app = express();
const parser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerExpress = require('swagger-ui-express');

app.use(parser.json());

const option = {
    definition : {
        openapi : '3.0.0',
        info : {
            title: "Atem API for Atem Wallet Application",
            description: "This is the complete API for the Atem Wallet application",
            version : '1.0.0',
        },
        servers : [
            {
                url : "dev\.noozle\.nl:3000" 
            }
        ]
    },
    apis: [
        'routes/authRoutes.js'
    ]
}

const swaggerSpec = swaggerJsDoc(option);

//app.use('/api/docs', swaggerExpress.serve, swaggerExpress.setup(swaggerSpec))


app.use('/auth', authRoutes);



app.listen(3000, () => {
    console.log("The server is running at 3000");
})
